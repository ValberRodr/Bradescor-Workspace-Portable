# Bradescor Workspace Portable

**Status:** Planejamento e referência visual. Desenvolvimento da aplicação principal ainda não iniciado.

Projeto para aplicativo Windows portátil, sem servidor de aplicação, composto futuramente por **BradescorWorkspace.exe** (usuários) e **BradescorWorkspaceAdmin.exe** (administração).

## Tecnologia prevista

- Interface: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Desktop: Tauri 2 e Rust (sem servidor HTTP para operação)
- Armazenamento: SQLite **local por máquina** e sincronização por arquivos em compartilhamento SMB
- Identidade visual: Bradescor Glass; Bradesco Sans somente com autorização/arquivos licenciados, com fallback Inter/system-ui
- Autenticação: captura nativa do **SID do usuário da sessão Windows**, login não editável, senha individual protegida por Argon2id, cadastro em aplicativo Admin

## Escopo funcional

Home, projetos, tarefas, calendário **somente de prazos e marcos** (não há infraestrutura de reuniões, que permanecem no Teams), foco/Pomodoro, Insights, equipe e configurações.

## Estrutura

- [`docs/`](docs/) — arquitetura, segurança, identidade visual, requisitos e critérios
- [`docs/BACKLOG_PORTABLE.md`](docs/BACKLOG_PORTABLE.md) — backlog de 46 tarefas, dependências e critérios de aceite
- [`backlog/issues/`](backlog/issues/) — 46 fichas numeradas `BWP-001` a `BWP-046` (não são GitHub Issues abertas)
- [`backlog/tarefas_portable.json`](backlog/tarefas_portable.json) — backlog estruturado
- [`reference/pane/`](reference/pane/) — **reconstrução independente e higienizada**, exclusivamente como referência HTML/CSS/JS, não é o código proprietário original do Pane e não é a aplicação final

## Segurança e distribuição

O arquivo criptografado de credenciais, por si só, **não substitui ACLs NTFS/SMB**. Sem servidor central, a identidade do Windows e as permissões reais de acesso aos arquivos devem ser validadas em homologação. Nunca versionar senhas, hashes reais, segredos ou chaves de criptografia.

**Publicação:** este repositório é público e contém somente planejamento conceitual e uma reconstrução independente de telas demonstrativas. Não é produto oficial da Bradescor/Bradesco e não deve receber arquivos, credenciais, dados, fontes proprietárias ou detalhes reais da infraestrutura corporativa. Marcas mencionadas pertencem aos respectivos titulares.

## Próximas entregas

1. BWP-001: ADR de arquitetura aprovada.
2. BWP-002: inicialização monorepo React/Vite/Tauri.
3. BWP-003 e BWP-040: executável de prova e SID Windows nativo.
4. BWP-004 e BWP-005: tokens Bradescor Glass e AppShell.
5. BWP-007 a BWP-018: protocolo de dados, sincronização SMB e testes críticos.


## Desenvolvimento em andamento — primeira entrega

O código-fonte inicial está em [`apps/workspace`](apps/workspace). É **somente uma prévia técnica local**: possui navegação React/Tauri, tarefas/projetos fictícios e base SQLite local do desktop. Não há sincronização SMB nem autenticação corporativa implementada.

- Iniciar visualização web em ambiente de desenvolvimento: `cd apps/workspace && npm install && npm run dev`
- Rodar testes após instalar dependências: `npm test`
- Iniciar aplicativo Tauri em Windows com Rust: `npm run desktop:dev`
- Consultar [estado de desenvolvimento](docs/STATUS_DESENVOLVIMENTO.md).

**Não utilizar com credenciais nem dados reais.** A leitura nativa do SID está presente como bloco de construção; não concede acesso por si só.
