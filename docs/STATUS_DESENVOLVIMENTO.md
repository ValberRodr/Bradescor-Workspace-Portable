# Desenvolvimento — checkpoint M0 (24/10/2026)

## Implementado no código

- Monorepositório inicial `apps/workspace` com React, TypeScript, Vite e configuração Tauri 2/Rust.
- Layout Bradescor Glass em claro/escuro, responsividade e transparência reduzida.
- Navegação Início, Tarefas, Calendário de prazos, Projetos, Indicadores, Equipe e Configurações.
- Protótipo funcional de tarefas e projetos fictícios, inclusive criação, conclusão, filtros e pesquisa.
- Timer de foco com pausa/retomada e continuidade durante navegação.
- Preferências e dados *somente de demonstração*: localStorage no navegador; SQLite `workspace_preview.db` no desktop.
- Comando Rust de leitura da identidade do **token nativo** da sessão Windows: SID e DOMÍNIO\\usuário.
- Testes offline de modelos e verificações estruturais.

## NÃO implementado / não homologado

- **Autenticação** de usuário (SID + senha), aplicativo Admin, registro criptografado, autorização e ACLs.
- **SMB** compartilhado, fila offline, sincronização, conflitos e operações entre estações.
- Build Windows/EXE, instalação ou execução corporativa; Rust e dependências npm indisponíveis no ambiente de autoria.
- Assinatura digital, integração com Teams, notificações, RBAC e proteções corporativas.

## Restrições de segurança

Não colocar dados reais no preview. O SID exibido é **identificação**, não autenticação nem autorização. A persistência atual é local, de teste, sem segregação corporativa, e o app não oferece tela de login falsa. Autenticação e permissões NTFS/SMB exigem homologação e serão entregues em etapas posteriores.

## Como validar em Windows de desenvolvimento

1. Instalar Node.js LTS, Rust estável compatível com o plugin SQL Tauri 2, WebView2, Visual Studio Build Tools com C++.
2. No diretório `apps/workspace`, executar `npm install` e depois `npm test` e `npm run build`.
3. Executar `npm run desktop:dev` para verificar leitura do SID e armazenamento SQLite local.
4. Registrar inconsistências do compilador e resolver antes de marcar `BWP-003` como concluída.

**Sem automação CI ou workflow GitHub Actions** nesta fase, conforme limitação de custos acordada.
