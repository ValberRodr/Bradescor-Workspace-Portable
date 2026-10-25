# ADR-001 — Bradescor Workspace Portable

**Situação:** proposta de implementação definida em 22/10/2026; a prova de conceito e homologação corporativa ainda não ocorreram.

## Decisão

- Aplicativo desktop Windows via **Tauri 2 (Rust) + React/TypeScript**; sem servidor HTTP obrigatório e sem FastAPI/PostgreSQL no MVP.
- Binário Windows + assets locais distribuídos como ZIP portátil; requisitos de WebView2 precisam de teste prévio no parque corporativo. Ser portátil não garante independência de runtimes Windows.
- Banco **SQLite por usuário** sob `%LOCALAPPDATA%`, contendo índices, projeções, configurações locais e fila de mudanças.
- Pasta SMB/UNC guarda **operações imutáveis individuais** versionadas, publicadas por escrita temporária e rename validado no ambiente de destino. Leitores jamais tratam arquivo temporário como commit.
- **Idempotência por operation_id**, replay de operações, reconciliação periódica integral/por diretório, detecção de conflito por revisão esperada; se existem duas alterações concorrentes, preservar ambas e exigir resolução, não aplicar last-write-wins silencioso.
- Mudanças offline entram primeiro em armazenamento local confiável; o status publicado só muda após confirmação da operação no compartilhamento. Em caso de falha, retry progressivo e aviso ao usuário.
- Vinculação ao SID do token Windows limita a seleção de conta pela UI, mas não é serviço de autenticação confiável. Assinatura de autoria é meramente informativa sem serviço confiável; **permissão efetiva deve vir das ACLs SMB/NTFS e de políticas da empresa**. Não armazenar segredos junto a arquivos compartilhados.
- Identidade visual **Bradescor Glass**; marca/logos/fontes proprietárias somente após aprovação e licença.

## DEC-002 — Identidade Windows, contas e exclusão de reuniões (22/10/2026)

- **Não desenvolver infraestrutura de reuniões.** Microsoft Teams é a ferramenta responsável. Calendar mostra exclusivamente prazos e marcos existentes em Tasks/Projects.
- **Dois executáveis:** `BradescorWorkspace.exe` e `BradescorWorkspaceAdmin.exe`, com provisionamento restrito no segundo.
- **Login imutável:** identificar sessão via token Windows no Rust (SID + DOMÍNIO\usuário), nunca por `USERNAME`/frontend. O campo de usuário é somente leitura e não existe troca de conta.
- **Cadastro Admin:** SID de domínio resolvido e validado, email, status ativo/bloqueado, função, senha inicial temporária, reset. Primeiro Admin precisa bootstrap controlado pela TI.
- **Senha do Workspace:** independente da senha Windows. Usuário troca após autenticar com senha atual; senha inicial/reset exigem troca obrigatória.
- **Arquivos de credenciais:** criptografia autenticada com chaves protegidas, verificação da senha com Argon2id+salt, segregação de cadastro/credenciais com NTFS/SMB ACL. Não guardar chave mestra em EXE nem em arquivo ao lado dos dados.
- **Controle de acesso:** sincronização e dados corporativos com ACLs efetivas; campo de login bloqueado e SID do token, por si só, não impedem acesso a arquivos legíveis na rede.
- **Offline:** primeiro login sem conectividade/cadastro atualizado deve falhar fechado; não assumir revogação imediata de sessão já desconectada.
- **Gate antes do MVP:** demonstração em SMB real de duas contas Windows com SID diferente, mesma string de nome e tentativa de leitura/escrita indevida.

Detalhamento em `FLUXO_AUTENTICACAO_WINDOWS.md`.

## Riscos explícitos

1. **Concorrência e consistência:** dois computadores alteram a mesma tarefa enquanto desconectados. Exige modelo de conflito e teste em SMB real.
2. **Falha parcial de I/O:** perda de conexão durante gravação/rename; validar durabilidade e recuperação no servidor de arquivos específico.
3. **Permissões:** app sem servidor não consegue impor RBAC forte contra usuários que já têm acesso direto ao compartilhamento. Requisitos de segregação estrita implicam redesenho com serviço central ou ACLs segmentadas realmente aplicadas.
4. **Desempenho e retenção:** centenas de milhares de arquivos diminuem velocidade de listagem e sincronização; arquivamento/compactação precisam de coordenação e testes, fora do MVP.
5. **Atualizações:** clientes com esquemas incompatíveis podem gerar dados inválidos; versionamento bloqueia escrita incompatível.
6. **Endpoint corporativo:** WebView2, regras de execução do Windows, SmartScreen, antivírus/EDR, permissão de escrita SMB e políticas de apps não assinados podem impedir o uso; piloto em máquinas gerenciadas.
7. **Auditoria:** logs no compartilhamento editável por todos não substituem trilha de auditoria imutável certificada. Não apresentar como evidência antifraude.

## Gatilhos para migrar a um backend

Alta concorrência, necessidade de notificações instantâneas, auditoria resistente a adulteração, integração de SSO/autorizações granulares, dezenas de usuários ativos simultâneos ou necessidade de sync com SLAs rígidos.

## Referências técnicas

- https://www.sqlite.org/whentouse.html (limitações de bancos compartilhados em rede)
- https://v2.tauri.app/distribute/windows-installer/ (build e WebView2 no Windows)
- https://v2.tauri.app/reference/webview-versions/ (runtime WebView2)