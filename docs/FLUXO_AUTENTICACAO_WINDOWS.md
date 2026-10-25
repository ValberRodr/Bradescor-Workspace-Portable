# Fluxo de autenticação — Bradescor Workspace Portable

**Status:** especificação do MVP, dependente de homologação TI/Segurança.

## Decisões

1. A identidade do login **sempre** corresponde à conta efetiva no token de acesso da sessão Windows: SID + DOMÍNIO\usuário (apresentação), obtidos via Win32 em comandos Rust/Tauri, não por `USERNAME`, input no React ou caminho da pasta de perfil.
2. O login mostra `DOMÍNIO\usuário` em campo **somente leitura** e recebe somente a senha **do Workspace**. Não há seleção de conta. A senha do Workspace **não é** a senha de acesso ao Windows.
3. O Admin tem EXE independente. O operador Admin deve pertencer a uma identidade Windows previamente autorizada e a permissões NTFS/SMB administrativas. Não há senha-mestre fixa no código.
4. Cadastro pelo Admin recebe nome, email, conta Windows verificada por SID e papel; atribui senha inicial temporária, bloqueio, reativação e reset. Primeiro admin é provisionado fora do fluxo normal, sob controle da TI.
5. No primeiro acesso a troca da senha inicial é obrigatória. No Workspace, a troca exige senha atual. Reset administrativo invalida senha anterior e obriga troca no próximo acesso.
6. Cadastro, email, papéis, vinculação de SID e autorização são metadados **administrativos**. Usuário final nunca pode alterá-los. Registro de senha tem segregação de gravação por SID/ACL.
7. Armazenamento das credenciais: **não salvar senhas em texto puro ou criptografia reversível**. Utilizar derivação/verificação por Argon2id e salt único; se o requisito for cifrar o arquivo, criptografia autenticada (e.g. AES-256-GCM), com chave protegida e mecanismo de recuperação aprovado pela TI. Segredo embutido no EXE invalida esse controle. Validar modelo seguro multiusuário/multimáquina antes de implementar.
8. Arquivos e diretórios de credenciais devem ter ACLs NTFS e SMB por usuário e administradores; operações da UI não garantem isolamento. Os dados de tarefas/projetos também precisam de ACLs compatíveis com as regras de visibilidade pretendidas.
9. Login só é concedido se SID cadastrado, registro íntegro, conta ativa, senha válida e acesso à rede autorizado. Para evitar revogação invisível, **não permitir primeiro login offline no MVP**; falha no compartilhamento recusa novo login com mensagem clara. Uma sessão já validada e desconectada segue política limitada definida pela TI, sem garantir revogação instantânea.
10. Cada comando Rust que lê ou grava dado sensível resolve novamente a identidade do processo e confere autorização; não aceitar `actor_sid` ou `user_id` vindo da UI como autoridade. Logs de segurança não incluem senha/hash/token.

## Fluxo

```text
1. Windows inicia sessão autenticada: DOMÍNIO\usuario + SID X
2. Workspace.exe lê o token Windows no motor Rust
3. UI apresenta DOMÍNIO\usuario (somente leitura)
4. Workspace procura cadastro administrativo vinculado ao SID X
5. Verifica conta ativa, integridade, ACL e senha informada
6. Se validação passa: sessão de aplicativo identificada por SID X
7. Se senha inicial: troca obrigatória antes de entrar
8. Se SID não cadastrado/bloqueado: login negado
```

## Exemplos de isolamento

- `EMPRESA\maria`, SID A, e `PC22\maria`, SID B, são **contas distintas**, mesmo com nome textual igual.
- Se Maria muda de estação mantendo a mesma conta de domínio e SID A, mantém a identidade. Uma conta local de outro PC não corresponde ao mesmo cadastro.
- Se João conhece a senha Workspace da Maria mas abre o aplicativo em sua sessão Windows (SID J), o programa verifica o cadastro de João, não o de Maria, e não há campo para alternar SID.
- Se João possui acesso NTFS direto aos arquivos de Maria, **a UI não resolve isso**. A segregação é definida nas ACLs e precisa de testes no compartilhamento.
- Um usuário com privilégios de administrador local pode manipular o ambiente. O requisito é proteção de operação normal e teste de abuso plausível, não promessa de resistência a administrador privilegiado que controla estação ou rede.

## Layout lógico proposto (sujeito a validação)

```text
\\servidor\Bradescor\Workspace\
  auth\admin\accounts.manifest  # Manifesto de associação SID/papel sob acesso só admin; assinado/autenticado
  auth\credentials\<SID>.enc    # Verificador protegido por usuário, chave com gestão definida/validada
  sync\operations\              # Somente mudanças de negócio autorizadas, sem segredos
  projects\                      # Projetos e marcos
  tasks\                         # Tarefas/prazos
```

> Nota: se todos os usuários puderem alterar `accounts.manifest`, `role` ou o registro de outros usuários, a solução **não** oferece o isolamento exigido. Não chamar isso de controle de segurança até validar as ACLs e a proteção da integridade do manifesto com TI.

## Fora do escopo

- Reuniões e convites (Microsoft Teams permanece responsável).
- Login com email, nome digitado, troca de usuário, autenticação como terceiros e senha Windows sincronizada.
- SSO/IdP central com revogação instantânea em sessão offline; exigiria arquitetura diferente.

## Cenários mínimos de teste

1. Mesmo username em duas máquinas, SIDs distintos.
2. Duas máquinas com mesma conta de domínio e SID.
3. Um usuário informa a senha correta de outro, mas não muda o SID da sessão.
4. Frontend envia SID forjado a comando Tauri.
5. Conta revogada, senha inicial, reset, troca de senha e quedas de SMB durante gravação.
6. Operador comum tenta abrir Admin e modificar arquivos de cadastro e de senha de terceiros.
7. Arquivo de credencial corrompido/adulterado, arquivos de manifesto modificados, backup/restauração e rotação de chaves.

**Referências:**
- Microsoft SID: https://learn.microsoft.com/pt-br/windows-server/identity/ad-ds/manage/understand-security-identifiers
- OWASP password storage: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html