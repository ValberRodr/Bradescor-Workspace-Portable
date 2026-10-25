# Backlog de execução — Bradescor Workspace Portable

**Atualizado:** 22/10/2026  |  **Status:** planejamento — implementação não iniciada.
**Arquitetura:** React/TypeScript + Tauri 2/Rust + SQLite local + rede SMB, sem servidor HTTP.
**Decisão funcional:** zero reuniões (Microsoft Teams permanece responsável). Calendar exibe prazos e marcos.
**Identidade:** login `DOMINIO\usuario` não editável, obtido do token Windows e validado pelo SID. Senha própria alterável; Admin separado.
**Credenciais:** arquivos protegidos em rede, verificador Argon2id+salt; criptografia autenticada, gestão de chaves e ACL por usuário sujeitas à homologação da TI.
> **Limite de segurança:** vincular SID na interface não protege arquivos abertos a todos. Somente ACLs NTFS/SMB realmente aplicadas e segregação de gravação podem restringir acesso em um sistema sem servidor.

## Entregas
- **M0:** estrutura React/Tauri, EXE de prova, design system, detecção nativa da identidade Windows.
- **M1:** protocolo de sincronização e cache, app Admin, cadastro, arquivos criptografados, login Windows/SID.
- **M2:** projetos, tarefas, calendário de prazos, Pomodoro, dashboards, times e troca de senha.
- **M3:** testes, concorrência, autenticação, ACLs, hardening, builds dos dois EXEs e homologação.
- **M4:** melhorias pós-MVP.

**Gates:** G0 abre EXE sem servidor; G1 sincroniza duas máquinas sem perda; G2 login + projetos/tarefas funcionam; G3 comprova ACL, criptografia, resistência a troca de identidade e distribuição Admin/Workspace.

## Índice de tarefas

| ID | Tarefa | Marco | Prioridade | Porte | Dependências |
|---|---|---|---|---|---|
| BWP-001 | Fixar ADR Portable sem servidor | M0 | P0 | S | — |
| BWP-002 | Criar monorepo React + Vite + Tauri 2 | M0 | P0 | M | BWP-001 |
| BWP-003 | Provar EXE portátil em Windows corporativo | M0 | P0 | M | BWP-002 |
| BWP-004 | Implementar tokens Bradescor Glass | M0 | P0 | M | BWP-002 |
| BWP-005 | Criar AppShell e biblioteca de componentes | M0 | P0 | L | BWP-004 |
| BWP-006 | Garantir responsividade e identidade visual | M0 | P1 | M | BWP-005 |
| BWP-007 | Definir esquema de dados e protocolo de operações | M1 | P0 | L | BWP-001 |
| BWP-008 | Criar seletor e validador de pasta de rede UNC | M1 | P0 | M | BWP-007 |
| BWP-009 | Implementar SQLite local e migrações | M1 | P0 | L | BWP-007, BWP-002 |
| BWP-010 | Implementar gravação segura no compartilhamento | M1 | P0 | L | BWP-008, BWP-007 |
| BWP-011 | Construir sincronizador incremental e idempotente | M1 | P0 | XL | BWP-009, BWP-010 |
| BWP-012 | Criar fila offline e reconexão automática | M1 | P0 | L | BWP-009, BWP-011 |
| BWP-013 | Detectar e resolver conflitos concorrentes | M1 | P0 | XL | BWP-011, BWP-012 |
| BWP-014 | Criar indicador de status da sincronização | M1 | P1 | M | BWP-011, BWP-012 |
| BWP-015 | Versionar esquema e compatibilidade de clientes | M1 | P0 | M | BWP-007, BWP-011 |
| BWP-016 | Validar identidade Windows e ACLs NTFS/SMB | M1 | P0 | L | BWP-008, BWP-040 |
| BWP-017 | Registrar auditoria e falhas de operação | M1 | P0 | M | BWP-011 |
| BWP-018 | Implementar backup, restauração e reparo | M1 | P0 | L | BWP-010, BWP-011, BWP-015 |
| BWP-019 | Implementar cadastro e gestão de projetos | M2 | P0 | L | BWP-005, BWP-013 |
| BWP-020 | Implementar tarefas e prioridades | M2 | P0 | XL | BWP-005, BWP-013, BWP-019 |
| BWP-021 | Implementar responsáveis e visão por equipe | M2 | P1 | L | BWP-020, BWP-016, BWP-041, BWP-043 |
| BWP-022 | Calendário de prazos e marcos (sem reuniões) | M2 | P0 | L | BWP-005, BWP-013 |
| BWP-023 | Implementar Pomodoro e sessões de foco | M2 | P1 | M | BWP-005, BWP-009 |
| BWP-024 | Conectar dashboard Home a dados reais | M2 | P0 | L | BWP-020, BWP-022, BWP-023 |
| BWP-025 | Criar Insights inicial com indicadores auditáveis | M2 | P1 | L | BWP-024 |
| BWP-026 | Implementar Settings e preferências persistentes | M2 | P1 | M | BWP-004, BWP-009, BWP-014, BWP-044 |
| BWP-027 | Implementar busca global e exportação local | M2 | P1 | M | BWP-020, BWP-019, BWP-022 |
| BWP-028 | Criar testes unitários Rust do protocolo e Sync | M3 | P0 | L | BWP-013, BWP-015 |
| BWP-029 | Testar multiusuário e falhas de rede | M3 | P0 | XL | BWP-020, BWP-028 |
| BWP-030 | Automatizar testes de UI e acessibilidade | M3 | P1 | L | BWP-024, BWP-025, BWP-026, BWP-043, BWP-044 |
| BWP-031 | Aplicar hardening local e de arquivos | M3 | P0 | L | BWP-029, BWP-016, BWP-042, BWP-043 |
| BWP-032 | Validar desempenho com volume e histórico | M3 | P1 | L | BWP-029 |
| BWP-033 | Gerar EXEs portáteis Workspace e Admin | M3 | P0 | M | BWP-003, BWP-031, BWP-041 |
| BWP-034 | Criar runbook, suporte e homologação | M3 | P0 | M | BWP-029, BWP-033, BWP-046 |
| BWP-035 | Adicionar anexos compartilhados com validação | M4 | P2 | L | BWP-034 |
| BWP-036 | Notificações locais de prazos e tarefas | M4 | P2 | M | BWP-034 |
| BWP-037 | Otimizar compactação segura e histórico de rede | M4 | P2 | XL | BWP-029 |
| BWP-038 | Planejar distribuição com atualização controlada | M4 | P2 | M | BWP-033 |
| BWP-039 | Avaliar evolução para backend centralizado | M4 | P2 | M | BWP-034 |
| BWP-040 | Capturar SID da sessão Windows no Rust | M0 | P0 | M | BWP-002 |
| BWP-041 | Criar aplicativo exclusivo BradescorWorkspaceAdmin | M1 | P0 | L | BWP-040, BWP-016 |
| BWP-042 | Proteger arquivos de credenciais e chaves | M1 | P0 | XL | BWP-041, BWP-010, BWP-016 |
| BWP-043 | Implementar login vinculado ao SID Windows | M1 | P0 | L | BWP-040, BWP-041, BWP-042 |
| BWP-044 | Permitir troca de senha e reset administrativo | M2 | P0 | M | BWP-043 |
| BWP-045 | Testar personificação, isolamento e políticas Windows | M3 | P0 | L | BWP-043, BWP-044, BWP-031 |
| BWP-046 | Homologar distribuição separada dos dois aplicativos | M3 | P0 | M | BWP-033, BWP-045 |

## Fichas com critérios de aceite

### BWP-001 — Fixar ADR Portable sem servidor
**M0 · P0 · Porte S · Status: A fazer**  
**Épico:** Fundação e distribuição  
**Dependências:** Nenhuma

**Escopo:** Formalizar a arquitetura Windows Portable sem servidor, duas aplicações (Workspace e Admin), autenticação vinculada ao SID da sessão Windows, armazenamento criptografado por usuário e exclusão integral da infraestrutura de reuniões.

**Critérios de aceite:**
- [ ] ADR aprovada: React/Tauri/Rust/SQLite local/SMB, sem FastAPI, PostgreSQL ou servidor HTTP.
- [ ] Dois executáveis separados documentados e sem campo de usuário editável para login.
- [ ] Reuniões e infraestrutura de Teams fora de escopo; Calendar somente prazos e marcos.

### BWP-002 — Criar monorepo React + Vite + Tauri 2
**M0 · P0 · Porte M · Status: A fazer**  
**Épico:** Fundação e distribuição  
**Dependências:** BWP-001

**Escopo:** Iniciar frontend tipado e backend Rust no desktop com comandos mínimos de comunicação; reter HTML de referência isolado.

**Critérios de aceite:**
- [ ] npm run dev abre interface durante desenvolvimento.
- [ ] cargo tauri dev inicia janela nativa e chama comando Rust de diagnóstico.
- [ ] Pastas app, src-tauri, docs, tests e reference separadas.

### BWP-003 — Provar EXE portátil em Windows corporativo
**M0 · P0 · Porte M · Status: A fazer**  
**Épico:** Fundação e distribuição  
**Dependências:** BWP-002

**Escopo:** Gerar prova de conceito de EXE portátil sem servidor e validar identidade nativa da sessão Windows via token de acesso, além de pré-requisito WebView2.

**Critérios de aceite:**
- [ ] Binário abre sem Node ou servidor de desenvolvimento.
- [ ] Token de acesso Windows identifica SID e conta, independentemente de variável de ambiente.
- [ ] WebView2 e política corporativa de execução são documentados.

### BWP-004 — Implementar tokens Bradescor Glass
**M0 · P0 · Porte M · Status: A fazer**  
**Épico:** Identidade visual e interface  
**Dependências:** BWP-002

**Escopo:** Criar temas Light, Dark Glass e Auto, tokens semânticos, contraste e redução de transparência. Não incluir fontes/logos proprietários não licenciados.

**Critérios de aceite:**
- [ ] Tema claro usa #CC092F para ação principal, sem excesso de vermelho.
- [ ] Bradesco Sans só é ativada com licença/arquivos autorizados; fallback Inter/system-ui sem quebrar layout.
- [ ] Tokens centralizados, sem cores hardcoded em componentes.

### BWP-005 — Criar AppShell e biblioteca de componentes
**M0 · P0 · Porte L · Status: A fazer**  
**Épico:** Identidade visual e interface  
**Dependências:** BWP-004

**Escopo:** AppShell com navegação Home, Tasks, Calendar, Projects, Insights, Team, Settings; Login read-only vindo do Windows; cards, estados, busca e modais.

**Critérios de aceite:**
- [ ] Sete rotas navegáveis com dados demonstrativos separados.
- [ ] Tela de login nunca permite digitar ou selecionar identidade do Windows.
- [ ] Componentes acessíveis com navegação por teclado.

### BWP-006 — Garantir responsividade e identidade visual
**M0 · P1 · Porte M · Status: A fazer**  
**Épico:** Identidade visual e interface  
**Dependências:** BWP-005

**Escopo:** Conferir telas em 1440, 1280, 768 e 390px; registrar capturas comparativas com a referência.

**Critérios de aceite:**
- [ ] Não há overflow horizontal e menu não obstrui conteúdo.
- [ ] Light, Dark e baixa transparência têm contraste adequado.
- [ ] Capturas Playwright por tema e largura ficam em docs/testes.

### BWP-007 — Definir esquema de dados e protocolo de operações
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-001

**Escopo:** Modelar projects, tasks, milestones, teams, users, focus, preferences, identidades Windows SID e autorização; protocolo de operações imutáveis, versão de esquema, sem entidades de reuniões ou eventos independentes.

**Critérios de aceite:**
- [ ] Operação contém UUID, entity_id, actor_sid, occurred_at_utc, expected_revision, schema_version, kind e payload.
- [ ] Nenhuma entidade meeting/meeting_invite/meeting_notification/meeting_calendar será criada.
- [ ] Mudanças semânticas usam validação Rust, tombstones e migrações versionadas.

### BWP-008 — Criar seletor e validador de pasta de rede UNC
**M1 · P0 · Porte M · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-007

**Escopo:** Oferecer configuração inicial de \servidor\compartilhamento, com teste de leitura/gravação, latência e diagnóstico.

**Critérios de aceite:**
- [ ] Suporta caminho UNC e caminhos com acentos/espaços e caracteres válidos de pasta Windows.
- [ ] Distingue offline, acesso negado, somente leitura, inexistente e latência alta.
- [ ] Não grava na rede sem confirmação da pasta escolhida.

### BWP-009 — Implementar SQLite local e migrações
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-007, BWP-002

**Escopo:** Criar banco por usuário em pasta local de dados de aplicação; índices, schema_version e migrações idempotentes.

**Critérios de aceite:**
- [ ] O banco nunca é criado nem aberto em caminho UNC.
- [ ] Após reiniciar aplicativo, registros locais e fila pendente persistem.
- [ ] Migração de schema tem teste de upgrade e rollback operacional com backup.

### BWP-010 — Implementar gravação segura no compartilhamento
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-008, BWP-007

**Escopo:** Publicar cada operação em arquivo único; escrever .tmp na mesma pasta, fechar/sincronizar arquivo, renomear para .json e nunca sobrescrever operação de outro cliente.

**Critérios de aceite:**
- [ ] Cada writer usa operation_id único e não modifica arquivos publicados.
- [ ] Leitores ignoram temporários e arquivos parcialmente preparados.
- [ ] Falha ou interrupção durante a gravação não produz operação publicada incompleta.

### BWP-011 — Construir sincronizador incremental e idempotente
**M1 · P0 · Porte XL · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-009, BWP-010

**Escopo:** Ler novas operações válidas, reconciliar índices locais e aplicar cada operação uma única vez; incluir varredura periódica de reconciliação completa.

**Critérios de aceite:**
- [ ] Duas leituras do mesmo arquivo não duplicam operações.
- [ ] Eventos publicados atrasados não são perdidos por diferença de relógio entre PCs.
- [ ] Novas alterações aparecem em outro cliente sem recarregar manualmente, dentro da cadência definida.

### BWP-012 — Criar fila offline e reconexão automática
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-009, BWP-011

**Escopo:** Registrar mutações locais pendentes, reprocessar com retry exponencial + jitter e estado explícito para o usuário.

**Critérios de aceite:**
- [ ] Sem acesso à rede o usuário consegue criar/editar localmente, vendo estado Pendente.
- [ ] Após reconectar operações são publicadas sem duplicar.
- [ ] Desligamento inesperado preserva fila pendente.

### BWP-013 — Detectar e resolver conflitos concorrentes
**M1 · P0 · Porte XL · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-011, BWP-012

**Escopo:** Criar detecção por expected_revision; quando duas mudanças partem da mesma revisão, preservar ambas e expor comparação para resolução, sem sobrescrita silenciosa.

**Critérios de aceite:**
- [ ] Dois PCs que editam o mesmo campo offline geram conflito auditável.
- [ ] O usuário consegue escolher uma versão ou conciliar campos antes de publicar resolução.
- [ ] Excluir/editar simultaneamente não apaga dados silenciosamente.

### BWP-014 — Criar indicador de status da sincronização
**M1 · P1 · Porte M · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-011, BWP-012

**Escopo:** Exibir Online, Sincronizando, Offline, Pendente, Erro e Conflitos no header com logs simplificados.

**Critérios de aceite:**
- [ ] Estados correspondem à condição real de conectividade e fila.
- [ ] Usuário pode ver quantas operações aguardam, falhas e última sincronização.
- [ ] Botão Reprocessar não provoca duplicidade.

### BWP-015 — Versionar esquema e compatibilidade de clientes
**M1 · P0 · Porte M · Status: A fazer**  
**Épico:** Persistência, rede e sincronização  
**Dependências:** BWP-007, BWP-011

**Escopo:** Negociar schema_version pelo manifesto estável na pasta de rede, bloquear escritas incompatíveis e manter leitura quando possível.

**Critérios de aceite:**
- [ ] Executável antigo não grava operação incompatível com dados novos.
- [ ] Atualização de versão não perde operações pendentes.
- [ ] Tela de versão incompatível apresenta instruções objetivas.

### BWP-016 — Validar identidade Windows e ACLs NTFS/SMB
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Segurança, auditoria e recuperação  
**Dependências:** BWP-008, BWP-040

**Escopo:** Analisar e aplicar ACLs reais de pastas de credenciais e dados; obter SID do token Windows e impedir acesso cruzado por nomes coincidentes, sem supor proteção apenas pelo frontend.

**Critérios de aceite:**
- [ ] Conta é identificada por SID retirado do token do processo (não USERNAME/env/Javascript).
- [ ] Pasta credenciais tem ACLs por usuário, administrador e política de TI comprovadas, inclusive compartilhamento SMB.
- [ ] Usuários distintos com mesmo nome local em duas máquinas não são confundidos.
- [ ] Sem ACL suficiente a aplicação bloqueia a operação e exibe erro seguro.

### BWP-017 — Registrar auditoria e falhas de operação
**M1 · P0 · Porte M · Status: A fazer**  
**Épico:** Segurança, auditoria e recuperação  
**Dependências:** BWP-011

**Escopo:** Associar autoria, host, hora, tipo e resultado às operações, mantendo rastreabilidade sem dados sensíveis nos logs de diagnóstico.

**Critérios de aceite:**
- [ ] Criar, editar, concluir, excluir e resolver conflitos gera operação rastreável.
- [ ] Erros incluem código, contexto seguro e correlation_id.
- [ ] Registros não expõem segredos ou conteúdo de dados protegidos desnecessariamente.

### BWP-018 — Implementar backup, restauração e reparo
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Segurança, auditoria e recuperação  
**Dependências:** BWP-010, BWP-011, BWP-015

**Escopo:** Rotina operacional de backup da pasta compartilhada e reconstrução do SQLite a partir do log de operações.

**Critérios de aceite:**
- [ ] Recuperação do cache local funciona após exclusão controlada do banco local.
- [ ] Restauração é testada com snapshot/backup coerente.
- [ ] Falhas de leitura de arquivos invalidos são isoladas sem derrubar o app.

### BWP-019 — Implementar cadastro e gestão de projetos
**M2 · P0 · Porte L · Status: A fazer**  
**Épico:** Produtividade e colaboração  
**Dependências:** BWP-005, BWP-013

**Escopo:** Gerir projetos autorizados com marcos e prazos, vinculando alterações ao SID de autoria e aplicando separação de dados permitida pelas ACLs da rede.

**Critérios de aceite:**
- [ ] Projeto criado em um PC aparece em outro após sincronização.
- [ ] Marcos, progresso e status refletem dados consistentes.
- [ ] Excluir usa tombstone para evitar ressurreição após reconexão.

### BWP-020 — Implementar tarefas e prioridades
**M2 · P0 · Porte XL · Status: A fazer**  
**Épico:** Produtividade e colaboração  
**Dependências:** BWP-005, BWP-013, BWP-019

**Escopo:** CRUD tarefas, prioridade, status, prazo, projeto e busca/filtro; atualização otimista e sincronização.

**Critérios de aceite:**
- [ ] Criar, alterar, concluir e reabrir tarefa persiste e propaga entre PCs.
- [ ] Filtros atrasadas/hoje/sem prazo/próximas estão corretos.
- [ ] Contagens da sidebar e listas são derivadas dos dados reais.

### BWP-021 — Implementar responsáveis e visão por equipe
**M2 · P1 · Porte L · Status: A fazer**  
**Épico:** Produtividade e colaboração  
**Dependências:** BWP-020, BWP-016, BWP-041, BWP-043

**Escopo:** Equipe derivada do cadastro administrativo; responsáveis selecionados dentre contas ativas vinculadas ao SID Windows. Não disponibilizar convite nem cadastro por usuário final.

**Critérios de aceite:**
- [ ] Somente contas ativas provisionadas no Admin podem receber tarefas.
- [ ] Perfil e email são provenientes do registro administrativo validado.
- [ ] Ações não autorizadas não dependem apenas de ocultação de botões na UI.

### BWP-022 — Calendário de prazos e marcos (sem reuniões)
**M2 · P0 · Porte L · Status: A fazer**  
**Épico:** Produtividade e colaboração  
**Dependências:** BWP-005, BWP-013

**Escopo:** Visualizações mensal e semanal derivadas de datas de vencimento de tarefas e marcos dos projetos. Não criar agenda própria, convites, integração Teams, reuniões, nem eventos independentes.

**Critérios de aceite:**
- [ ] Tarefas e marcos aparecem nas respectivas datas sem duplicidade.
- [ ] Alterar prazo no módulo de origem atualiza Calendar após sincronização.
- [ ] Nenhuma tela cria reuniões ou eventos; ausência de reuniões não causa card de erro.

### BWP-023 — Implementar Pomodoro e sessões de foco
**M2 · P1 · Porte M · Status: A fazer**  
**Épico:** Produtividade e colaboração  
**Dependências:** BWP-005, BWP-009

**Escopo:** Cronômetro local com start/pause/resume/+5 min/stop; armazenar timestamps e associar tarefa opcional.

**Critérios de aceite:**
- [ ] Timer permanece correto ao trocar de tela, bloquear o Windows e reabrir aplicativo.
- [ ] Histórico local registra sessões sem depender de servidor.
- [ ] Preferências de duração são respeitadas.

### BWP-024 — Conectar dashboard Home a dados reais
**M2 · P0 · Porte L · Status: A fazer**  
**Épico:** Indicadores e configurações  
**Dependências:** BWP-020, BWP-022, BWP-023

**Escopo:** Dashboard Today com tarefas, metas de foco, entregas e marcos; substituir área de reuniões da demo por prazos e entregas, sem contadores de reuniões.

**Critérios de aceite:**
- [ ] Indicadores são calculados com dados persistidos, sem valores inventados.
- [ ] Home não possui métricas de reunião ou agenda de Teams.
- [ ] Sidebar, cards e gráficos refletem alterações sincronizadas; empty states funcionam.

### BWP-025 — Criar Insights inicial com indicadores auditáveis
**M2 · P1 · Porte L · Status: A fazer**  
**Épico:** Indicadores e configurações  
**Dependências:** BWP-024

**Escopo:** Gráficos por projeto/período, concluídas, atrasadas, backlog e foco, com definição documentada de cada métrica.

**Critérios de aceite:**
- [ ] Filtros alteram séries corretamente sem chamar servidor.
- [ ] Totais reconciliam com dados do banco local.
- [ ] Não atribui percentuais individuais de produtividade sem regra explicada.

### BWP-026 — Implementar Settings e preferências persistentes
**M2 · P1 · Porte M · Status: A fazer**  
**Épico:** Indicadores e configurações  
**Dependências:** BWP-004, BWP-009, BWP-014, BWP-044

**Escopo:** Settings com aparência, notificações locais pertinentes, cache, perfil informativo e ação de troca de senha do Workspace; não permitir editar nome Windows/SID.

**Critérios de aceite:**
- [ ] Identidade Windows e SID não são editáveis no Workspace.
- [ ] Trocar senha chama rotina Rust com validação de senha atual e atualização protegida por ACL.
- [ ] Temas e acessibilidade persistem no cache local.

### BWP-027 — Implementar busca global e exportação local
**M2 · P1 · Porte M · Status: A fazer**  
**Épico:** Indicadores e configurações  
**Dependências:** BWP-020, BWP-019, BWP-022

**Escopo:** Busca unificada apenas por tarefas, projetos e marcos; exportação local dos registros aos quais a conta tem acesso.

**Critérios de aceite:**
- [ ] Busca não lista eventos/reuniões removidos do escopo.
- [ ] Exportação respeita acesso real do usuário atual.
- [ ] CSV/JSON têm codificação consistente e sem execução de fórmulas inseguras.

### BWP-028 — Criar testes unitários Rust do protocolo e Sync
**M3 · P0 · Porte L · Status: A fazer**  
**Épico:** Testes e release  
**Dependências:** BWP-013, BWP-015

**Escopo:** Testar schema, parser, idempotência, falhas de gravação, reconciliação, conflitos e fila offline com testes automatizados.

**Critérios de aceite:**
- [ ] Cobertura dos cenários críticos de perda/duplicação/conflito existe e passa.
- [ ] Fixtures incluem acentos, caminhos UNC, JSON inválido e schema desconhecido.
- [ ] Teste de interrupção entre arquivo temporário e rename não publica operação incompleta.

### BWP-029 — Testar multiusuário e falhas de rede
**M3 · P0 · Porte XL · Status: A fazer**  
**Épico:** Testes e release  
**Dependências:** BWP-020, BWP-028

**Escopo:** Cenários concorrentes SMB, revogação, autenticação por SID, corrupção, conflitos e quedas de rede com duas contas e duas máquinas.

**Critérios de aceite:**
- [ ] Duas máquinas sincronizam projetos/tarefas sem sobrescrita silenciosa.
- [ ] Conta revogada não autentica no próximo login; modo desconectado não ignora revogação.
- [ ] A autenticação com mesmo nome, mas SID distinto é recusada.

### BWP-030 — Automatizar testes de UI e acessibilidade
**M3 · P1 · Porte L · Status: A fazer**  
**Épico:** Testes e release  
**Dependências:** BWP-024, BWP-025, BWP-026, BWP-043, BWP-044

**Escopo:** Testes de React e Tauri para navegação, acessibilidade, autenticação sem campo de usuário, troca de senha e inexistência de reuniões.

**Critérios de aceite:**
- [ ] Login mostra conta Windows read-only, sem opção de inserir outro nome.
- [ ] Troca de senha e erros de autenticação têm testes de interface.
- [ ] Não existem telas ou ações de reunião.

### BWP-031 — Aplicar hardening local e de arquivos
**M3 · P0 · Porte L · Status: A fazer**  
**Épico:** Testes e release  
**Dependências:** BWP-029, BWP-016, BWP-042, BWP-043

**Escopo:** Restringir IPC Tauri, paths UNC, symlink/path traversal, operações por SID do token e ACLs; proteger credenciais, política de conteúdo e separação Admin/Workspace.

**Critérios de aceite:**
- [ ] Cada comando nativo sensível verifica sessão Windows, status e permissões, não confia em user_id enviado pelo React.
- [ ] Segredos ou chaves mestras não são embutidos no executável nem armazenados ao lado de arquivos cifrados.
- [ ] Não existe elevação de privilégios por editar JSON, trocar nome Windows ou iniciar Admin como não administrador.

### BWP-032 — Validar desempenho com volume e histórico
**M3 · P1 · Porte L · Status: A fazer**  
**Épico:** Testes e release  
**Dependências:** BWP-029

**Escopo:** Carregar 10 mil tarefas / histórico representativo e mensurar abertura, reindexação, sync e travamentos com rede lenta.

**Critérios de aceite:**
- [ ] Interface permanece responsiva ao indexar em background.
- [ ] Existe progresso e cancelamento para reindexação longa.
- [ ] Limites operacionais e estratégia de arquivamento ficam documentados.

### BWP-033 — Gerar EXEs portáteis Workspace e Admin
**M3 · P0 · Porte M · Status: A fazer**  
**Épico:** Testes e release  
**Dependências:** BWP-003, BWP-031, BWP-041

**Escopo:** Criar builds Windows separados do Workspace e do Admin, com permissões distintas, assets locais, versionamento e assinatura corporativa quando disponível.

**Critérios de aceite:**
- [ ] ZIP contém BradescorWorkspace.exe e BradescorWorkspaceAdmin.exe claramente separados.
- [ ] Usuário sem grupo administrativo não consegue usar operações de provisionamento.
- [ ] WebView2 e checksums de ambos os binários são documentados.

### BWP-034 — Criar runbook, suporte e homologação
**M3 · P0 · Porte M · Status: A fazer**  
**Épico:** Testes e release  
**Dependências:** BWP-029, BWP-033, BWP-046

**Escopo:** Runbook para uso e suporte, ACLs por usuário e admin, procedimento de provisionamento SID, troca e reset de senha, expiração da sessão, corrupção, contingência SMB e recuperação.

**Critérios de aceite:**
- [ ] Outro analista provisiona usuário pela ferramenta Admin sem edição manual de arquivos.
- [ ] Suporte demonstra revogação de conta e troca de senha vinculadas ao SID.
- [ ] Pessoas sem permissão Windows não conseguem ler ou escrever credenciais de terceiros.

### BWP-035 — Adicionar anexos compartilhados com validação
**M4 · P2 · Porte L · Status: A fazer**  
**Épico:** Evoluções futuras  
**Dependências:** BWP-034

**Escopo:** Anexos por tarefa/projeto com tamanho, extensões permitidas, hashing e cópia segura para a rede.

**Critérios de aceite:**
- [ ] Anexo incorreto ou perigoso é recusado.
- [ ] Referências quebradas têm diagnóstico e permitem reparo.
- [ ] Limites definidos conforme política corporativa.

### BWP-036 — Notificações locais de prazos e tarefas
**M4 · P2 · Porte M · Status: A fazer**  
**Épico:** Evoluções futuras  
**Dependências:** BWP-034

**Escopo:** Avisos locais de tarefas e entregas; não criar notificações de reuniões ou Teams.

**Critérios de aceite:**
- [ ] Alertas de prazo funcionam com app aberto ou conforme capacidade da instalação.
- [ ] Não se afirma entrega de aviso com app fechado sem mecanismo executante.
- [ ] Usuário pode desativar alertas.

### BWP-037 — Otimizar compactação segura e histórico de rede
**M4 · P2 · Porte XL · Status: A fazer**  
**Épico:** Evoluções futuras  
**Dependências:** BWP-029

**Escopo:** Planejar arquivamento de operações antigas e checkpoints usando coordenação/lock validado no SMB; nunca deletar eventos sem snapshot consistente.

**Critérios de aceite:**
- [ ] Cliente desatualizado consegue recuperar operações ou recebe alerta de versão.
- [ ] Restauração da pasta após backup reproduz os dados.
- [ ] Compactação não roda automaticamente sem homologação.

### BWP-038 — Planejar distribuição com atualização controlada
**M4 · P2 · Porte M · Status: A fazer**  
**Épico:** Evoluções futuras  
**Dependências:** BWP-033

**Escopo:** Criar estratégia de verificação de versão via arquivo de manifesto e download manual a partir de origem aprovada; assinatura corporativa quando disponível.

**Critérios de aceite:**
- [ ] Versão atual e disponível são exibidas sem executar binários remotos.
- [ ] Atualização não substitui EXE em execução.
- [ ] Assinatura/autorização Windows é tratada com TI.

### BWP-039 — Avaliar evolução para backend centralizado
**M4 · P2 · Porte M · Status: A fazer**  
**Épico:** Evoluções futuras  
**Dependências:** BWP-034

**Escopo:** Definir gatilhos objetivos (conflitos, quantidade de usuários, latência, RBAC rígido, auditoria confiável) para migração futura sem reescrever React.

**Critérios de aceite:**
- [ ] Critérios de decisão têm métricas observáveis.
- [ ] Repositório separa interfaces de persistência do React.
- [ ] Plano de migração de dados da rede para serviço central é desenhado.

### BWP-040 — Capturar SID da sessão Windows no Rust
**M0 · P0 · Porte M · Status: A fazer**  
**Épico:** Identidade Windows e administração  
**Dependências:** BWP-002

**Escopo:** Capturar o SID do token de acesso do processo, domínio e nome de conta por APIs nativas Windows, nunca por variáveis de ambiente/controlado no JS.

**Critérios de aceite:**
- [ ] SDK captura SID e DOMAIN\username da conta logada em Windows real.
- [ ] A UI só recebe identificador de exibição; SID fica sob controle do motor Rust.
- [ ] Contas locais homônimas em máquinas diferentes produzem identidades distintas.

### BWP-041 — Criar aplicativo exclusivo BradescorWorkspaceAdmin
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Identidade Windows e administração  
**Dependências:** BWP-040, BWP-016

**Escopo:** Provisionar SID Windows por conta de domínio, nome, email, função e estado; cadastrar com senha temporária, suspender, reativar e redefinir senha; aplicação separada.

**Critérios de aceite:**
- [ ] Somente identidade Windows incluída no grupo/lista de administradores e autorizada pelas ACLs abre ações do Admin.
- [ ] Não existe botão para usuário comum cadastrar outras pessoas ou trocar sua identidade vinculada.
- [ ] Cadastro exige SID válido; colisão nome/email é sinalizada, sem reaproveitar acesso.
- [ ] Primeiro administrador é provisionado via procedimento controlado pela TI, sem senha master embutida.

### BWP-042 — Proteger arquivos de credenciais e chaves
**M1 · P0 · Porte XL · Status: A fazer**  
**Épico:** Identidade Windows e administração  
**Dependências:** BWP-041, BWP-010, BWP-016

**Escopo:** Definir criptografia autenticada para arquivos por SID (ex. AES-256-GCM) com gerenciamento explícito de chaves aprovado pela TI, hash Argon2id com salt para senhas, ACLs NTFS/SMB e segregação de metadados administrativos.

**Critérios de aceite:**
- [ ] Nenhuma senha fica reversível nem em texto puro; verificação usa Argon2id com salt e parâmetros versionados.
- [ ] Arquivos confidenciais são criptografados/autenticados com chaves protegidas, nunca hardcoded no exe.
- [ ] Administrador pode provisionar e usuário modificar somente seu verificador de senha, sem editar SID, perfil ou privilégios.
- [ ] Prova de conceito valida acesso multi-PC e recuperação de chaves; sem prova, bloqueia release do módulo de login.

### BWP-043 — Implementar login vinculado ao SID Windows
**M1 · P0 · Porte L · Status: A fazer**  
**Épico:** Identidade Windows e administração  
**Dependências:** BWP-040, BWP-041, BWP-042

**Escopo:** Tela com Windows username somente leitura + campo senha; usar SID do token para buscar registro ativo e validar credencial, sem opção de alternar usuário.

**Critérios de aceite:**
- [ ] Não há campo editável de login; não é possível autenticar como outra conta apenas conhecendo a senha dela.
- [ ] SID ausente, bloqueado ou diferente impede login ainda que o nome textual e a senha coincidam.
- [ ] Cada IPC sensível revalida a identidade e autorização no Rust.
- [ ] Sem acesso ao cadastro na rede, a primeira autenticação falha fechada; política offline posterior exige decisão de segurança explícita.

### BWP-044 — Permitir troca de senha e reset administrativo
**M2 · P0 · Porte M · Status: A fazer**  
**Épico:** Identidade Windows e administração  
**Dependências:** BWP-043

**Escopo:** Senha temporária alterada no primeiro login; troca pela conta atual com senha antiga; reset apenas no app Admin, sem acesso ao cadastro de outros usuários.

**Critérios de aceite:**
- [ ] Troca exige senha atual, valida política de senha e atualiza somente arquivo associado ao SID corrente.
- [ ] Primeiro acesso com senha temporária exige alteração antes de usar projetos/tarefas.
- [ ] Reset feito por Admin obriga troca no próximo login, com auditoria e sem revelar senha anterior.
- [ ] Escrita SMB concorrente é protegida e versões antigas não podem sobrescrever nova senha silenciosamente.

### BWP-045 — Testar personificação, isolamento e políticas Windows
**M3 · P0 · Porte L · Status: A fazer**  
**Épico:** Identidade Windows e administração  
**Dependências:** BWP-043, BWP-044, BWP-031

**Escopo:** Testes adversariais com dois SIDs, mesma string de login, máquina diferente, conta desabilitada, armazenamento adulterado e sessão desconectada.

**Critérios de aceite:**
- [ ] Informar SID ou username falso à UI/IPC não permite assumir outra identidade.
- [ ] Nome repetido em PC distinto não recebe acesso da conta original.
- [ ] Conta bloqueada e sem ACL não acessa dados protegidos; resultado validado em SMB corporativo.
- [ ] Não é possível elevar-se a Admin alterando um arquivo de usuário.

### BWP-046 — Homologar distribuição separada dos dois aplicativos
**M3 · P0 · Porte M · Status: A fazer**  
**Épico:** Identidade Windows e administração  
**Dependências:** BWP-033, BWP-045

**Escopo:** Homologar Workspace e WorkspaceAdmin como EXEs distintos, com acesso restrito à área administrativa e atualização versionada, sem servidor HTTP.

**Critérios de aceite:**
- [ ] Dois EXEs em ZIP, com versões, checksums e guia de instalação/extração.
- [ ] Teste em máquina de usuário e de administrador demonstra menus e permissões corretas.
- [ ] Procedimento de revogação de direitos administrativos e recuperação de acesso validado pela TI.

## Fora do escopo / condições de segurança

- Reuniões, chamadas, convites, agenda de reuniões, presença de Teams, notificações de reuniões e infraestrutura correspondente.
- Usuário editável no login ou troca de perfil por escolha em combo.
- Chave simétrica fixa, senha de administrador embutida no EXE ou cadastro global regravável por usuários comuns.
- Isolamento garantido somente por UI; requer ACLs e revisão técnica corporativa.
- Login offline inicial sem validação de revogação: proibido no MVP.