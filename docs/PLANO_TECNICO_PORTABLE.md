# Plano técnico vigente — Bradescor Workspace Portable

**Data:** 22/10/2026  
**Estado:** planejamento, aguardando desenvolvimento e testes de viabilidade no parque corporativo.  
**Substitui, para o MVP, a arquitetura web com FastAPI/PostgreSQL presente no plano histórico.**

## 1. Objetivo

Criar um workspace colaborativo Windows semelhante na experiência ao Pane, com as sete telas Home, Tasks, Calendar, Projects, Insights, Team e Settings, cronômetro Focus e visual Bradescor Glass. Reuniões e infraestrutura associada ficam fora do produto (Teams). O sistema executará como aplicativo Windows portátil, sem servidor HTTP ou banco compartilhado na rede.

## 2. Stack vigente

| Camada | Tecnologia | Regra |
|---|---|---|
| UI | React + TypeScript + Vite | build estático embutido |
| Estilos | Tailwind CSS + componentes acessíveis | Bradescor Glass, sem assets externos |
| Estado | Zustand / TanStack Query (quando útil) | chamadas Tauri IPC, não REST |
| Desktop | Tauri 2 | executar sem Node/dev server |
| Lógica nativa | Rust | validações, arquivos SMB, sync, modelos |
| Dados locais | SQLite | um banco local por usuário, nunca SQLite UNC |
| Compartilhamento | SMB/UNC com operações JSON imutáveis | escrita atômica testada, idempotência, retries |
| Distribuição | ZIP com EXE Windows + recursos | testar runtime WebView2 e políticas corporativas |
| Qualidade | Vitest, Playwright web, testes Rust, teste Windows e SMB real | gate de concorrência obrigatório |

## 2.1. Administração e autenticação (DEC-002)

- `BradescorWorkspace.exe`: identifica automaticamente a conta Windows via token/SID no motor Rust; exibe `DOMÍNIO\usuário` somente leitura e solicita apenas senha do Workspace.
- `BradescorWorkspaceAdmin.exe`: cadastro de email/SID, senha inicial, bloqueio/reativação, reset e papéis, restrito a contas administrativas pela ACL/Windows.
- Credenciais em arquivos criptografados/autenticados de rede; senhas verificadas por Argon2id com salt e jamais armazenadas reversivelmente. Chaves protegidas e homologadas; não usar segredo hardcoded em EXE.
- Metadados administrativos separadamente protegidos; usuário só altera a própria senha após confirmar a atual. Em primeiro acesso/reset, troca obrigatória.
- Sem conectividade com registro de autenticação/autorizações, novo login falha fechado no MVP. Sem garantia de controle central forte sem ACLs da rede.
- A estrutura detalhada e os riscos constam em `FLUXO_AUTENTICACAO_WINDOWS.md`.

## 2.2. Calendário sem reuniões

- Exibe tarefas com data e marcos de projetos. Sem CRUD de reuniões/eventos independentes, convites, integração ou notificações Teams.
- Home mostra tarefas, foco, prazos e entregas — nenhum KPI de reuniões.

## 3. Modelo de sincronização e segurança

Veja `DECISOES_ARQUITETURA.md` e tarefas BWP-007 a BWP-018. Não escrever vários PCs no mesmo arquivo de dados. Gravar operação individual imutável, detectar conflitos de revisão, armazenar pendências offline em SQLite local e reconciliar após reconexão. ACLs SMB/NTFS são a barreira efetiva; um painel com cargo/role não substitui controle de acesso no servidor de arquivos.

## 4. Diretriz visual mantida

### Identidade visual Bradescor Glass e design system

**Decisão de produto:** identidade corporativa **Bradescor Glass** (nome de conceito, não marca oficial aprovada), preservando a estrutura e a experiência *liquid glass* do Pane, mas substituindo sua paleta azul/roxa por um sistema visual alinhado ao ecossistema Bradesco. **Tema padrão:** claro corporativo; **tema opcional:** Dark Glass. O tema `auto` segue o sistema operacional.

### 4.1 Diretrizes de marca e aprovação
- **Cor institucional Bradesco:** vermelho `#CC092F` — referência oficial de marca.
- **Vermelho escuro Bradesco:** `#900F15` — cor oficial existente, porém o Brandbook restringe sua **aplicação à logomarca** a determinados públicos (Wealth/Atacado). No nosso protótipo é **apenas candidato** a token de interface secundário; uso e contexto precisam de validação de Marketing/Design System Bradescor.
- **Fonte institucional:** `Bradesco Sans`, tipografia proprietária conforme Brandbook. Aplicar somente com arquivos e licenças corporativas autorizados. **Não distribuir arquivos de fonte neste repositório de referência.**
- **Fallback temporário de desenvolvimento:** `Inter` (com licença conferida) → `system-ui` → `sans-serif`, até receber Bradesco Sans. O Brandbook orienta **avaliação prévia do Marketing institucional para outras famílias**: fallback é provisório, não equivalência oficial.
- Usar apenas logos Bradescor/Bradesco oficiais fornecidos internamente, respeitando proporções e área de proteção. Na ausência, usar nome tipográfico textual neutro, **sem desenhar/simular a logomarca**.
- A identidade do **Banco Bradesco** serve como referência inicial; validar a eventual identidade específica da **Bradescor** com seus responsáveis antes da publicação/uso corporativo.

**Fontes consultadas:**
- Brandbook Bradesco (fev./2026): https://assets.bradesco/content/dam/portal-bradesco/marca/assets/downloads/guia_de_comunicacao_visual_bradesco.pdf
- Portal da marca: https://banco.bradesco/marca/index.shtm

### 4.2 Paleta e hierarquia cromática

| Token | Claro | Escuro | Função | Situação |
|---|---|---|---|---|
| `--brand-primary` | `#CC092F` | `#CC092F` | botões primários, ações, seleção e destaques | oficial Bradesco |
| `--brand-deep` | `#900F15` | `#900F15` | ênfase secundária **sob aprovação** | oficial como cor, aplicação proposta |
| `--brand-soft` | `#F9E5E9` | `#48242D` | fundos selecionados, hover, chips | proposto |
| `--app-bg` | `#F7F7F9` | `#171316` | fundo principal | proposto |
| `--surface` | `#FFFFFF` | `#292125` | painéis/cards e glass overlay | proposto |
| `--text-primary` | `#252127` | `#F9F5F6` | textos principais | proposto |
| `--text-secondary` | `#716870` | `#C4B4BB` | textos auxiliares | proposto |
| `--border` | `#EDE5E7` | `#4A343B` | bordas/divisores | proposto |
| `--success` | `#16826B` | `#44BAA0` | concluído/sucesso | semântico proposto |
| `--warning` | `#A15D00` | `#F3B35A` | prazo/atenção | semântico proposto |
| `--info` | `#2A689C` | `#79B9E9` | informação/séries auxiliares | semântico proposto |
| `--danger` | `#B4233A` | `#FB738B` | erro/destrutivo, com ícone/rótulo | semântico proposto |

**Regras:**
1. Vermelho institucional como protagonista, **não** como cor de todas as séries e cartões; preservar leitura e hierarquia.
2. Estados `sucesso/alerta/erro/informação` têm tokens semânticos próprios; não comunicar significado só pela cor.
3. Com o tema claro predominam branco e cinzas muito suaves; o vermelho fica para ação e foco.
4. Dark Glass em grafite com fundo vinho sutil, sem saturação excessiva; testar contraste após aplicar transparência.
5. Gradientes promocionais oficiais **não** devem ser improvisados no produto: os gradientes de marca obedecem regras específicas do Brandbook.
6. As cores de suporte são uma proposta de interface; a aprovação institucional abrange a aplicação final.

### 4.3 Tipografia

| Elemento | Família | Peso proposto | Tamanho inicial |
|---|---|---|---|
| Título da página | Bradesco Sans | SemiBold 600 | 24–28px |
| Título de cartões | Bradesco Sans | Medium 500 | 14–16px |
| Navegação e corpo | Bradesco Sans | Regular 400 | 14–16px |
| KPI / métrica principal | Bradesco Sans | Bold 700 | 28–36px |
| Legenda, metadado | Bradesco Sans | Regular 400 | 12–13px (mínimo sujeito à acessibilidade) |
| Botão primário | Bradesco Sans | SemiBold 600 | 14px |

- Tokens `--font-sans: 'Bradesco Sans', 'Inter', system-ui, sans-serif;` e `font-variant-numeric: tabular-nums` para tabelas e KPIs.
- `@font-face` somente após recebimento de arquivos corporativos **autorizados**, com hospedagem interna e verificação da licença webfont.
- Evitar depender de Bradesco Sans para funcionalidade: com fallback todos os layouts devem continuar responsivos e sem cortes.

### 4.4 Layout, superfícies e movimento
- Desktop: sidebar aproximadamente 240–260px; header compacto; conteúdo em grid flexível.
- Tablet: sidebar recolhível, grades de duas colunas; mobile: navegação compacta/inferior e cards de uma coluna.
- Cards: raio 20–24px, bordas finas, sombra leve, `backdrop-filter: blur(14px–22px)` onde suportado.
- Liquid Glass discreto: painéis translúcidos sem comprometer contraste e legibilidade; opção de **reduzir transparência** ativa fundo opaco.
- Estados `hover`, `focus-visible`, `active`, `selected`, `disabled` definidos por tokens, sem cores hardcoded por componente.
- Transições rápidas 120–180ms, padrões 180–260ms; respeitar `prefers-reduced-motion`.
- Ícones de traço leve (Lucide), mesmo peso óptico no menu lateral, toolbar e ações.

### 4.5 Mapeamento do Pane para a identidade Bradescor

| Componente da referência | Mudança planejada |
|---|---|
| Sidebar e item ativo azul | sidebar neutra; item ativo em vermelho institucional/vermelho suave |
| Botões principais azuis | `#CC092F` com texto branco e estados de hover acessíveis |
| Indicadores e gráficos azuis/roxos | vermelho como série principal; demais séries com cores semânticas e legendas |
| Cards e glass | superfícies gelo/brancas no tema claro; grafite-vinho no escuro |
| Títulos e KPIs | Bradesco Sans em pesos e tamanhos padronizados |
| Wallpapers | substituir opções originais por fundos corporativos discretos e aprovados |
| Accent color personalizado | bloquear troca irrestrita do vermelho institucional; preferências ficam restritas a variações aprovadas |
| Settings / Appearance | Light (padrão), Dark Glass, Auto, transparência reduzida e wallpaper corporativo |

### 4.6 Biblioteca de componentes e implementação
- Componentes: `AppShell`, `Sidebar`, `GlobalHeader`, `CommandPalette`, `GlassCard`, `MetricRing`, `TaskRow`, `PriorityBadge`, `ProjectCard`, `MilestoneRow`, `MemberCard`, `CalendarBoard`, `FocusIsland`, `FocusControls`, `ThemePicker`, `EmptyState`, `LoadingSkeleton`, `ConfirmationDialog`, `Toast`.
- Centralizar temas em `frontend/src/styles/tokens.css` e `theme.css`, com nomes semânticos; nada de valores hexadecimais repetidos dentro de JSX.
- Prévia da proposta de tokens em `docs/design-tokens-bradescor.css` (CSS de referência, **não** altera a reprodução visual do Pane).
- Manter os HTMLs higienizados originais como **baseline de referência**; executar o redesign somente em nova implementação/branch.

### 4.7 Critérios de aceite visuais
- Validar Home, Tasks, Calendar, Projects, Insights, Team e Settings nos temas Light, Dark Glass e Auto.
- Testar largura 1440px, 1280px, 768px e 390px; sem overflow, texto cortado ou barra lateral sobrepondo conteúdo.
- Garantir contraste WCAG AA em texto normal (alvo 4.5:1) e componentes relevantes (3:1), inclusive **sobre vidro**.
- Validar teclado, foco perceptível, navegação por leitores de tela e modo de alto contraste/transparência reduzida.
- Verificar que gráfico continua interpretável sem depender de vermelho/verde e que legenda distingue séries.
- Capturas Playwright por tela e tema, comparadas ao design aprovado; versão visual somente será congelada após validação institucional do uso da marca e da fonte.


## 5. Entregas e critérios de liberação

Consulte `BACKLOG_PORTABLE.md`: **46 tarefas** distribuídas em M0–M4. M0–M3 compõem o MVP. Os gates G0–G3 exigem, respectivamente, binário portátil validado, sincronização de duas máquinas sem perda, fluxo funcional ponta a ponta e testes de integridade/segurança/recuperação em rede real.

## 6. Fora do escopo inicial

API FastAPI, PostgreSQL, Redis, Docker na máquina do usuário, sincronização instantânea garantida, RBAC forte puramente client-side, notificações remotas e chat corporativo.