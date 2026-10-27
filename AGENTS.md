# CILS B1 Cittadinanza Prep — AGENTS.md

> Este arquivo é a fonte de verdade operacional do projeto. Qualquer agente que mexe neste
> repositório **deve** lê-lo antes de escrever código.
> Especificazione oficial completa (com links para os PDFs do CILS): `docs/exam-spec.md`.

## 1. Contexto e objetivo

PWA de estudo e simulação para uma aluna portuguesa que vive no Reino Unido e precisa do
certificado **CILS B1 Cittadinanza** (Università per Stranieri di Siena) para a requerimento de
cidadania italiana.

O objetivo do app **não é ser um curso de italiano**. É responder a uma pergunta precisa:
> *"Se eu fizesse a prova do CILS B1 Cittadinanza amanhã, eu passaria? Qual é a minha
> abilità mais fraca? Quanto tempo de estudo me falta?"*

Tudo no app é subordinado a essa pergunta. Conteúdo genérico de italiano é escopo de outro app.

### Público e idioma

- Usuária: adulta, fala português, vive no Reino Unido, estuda sozinha, usa tablet/laptop.
- **Toda a interface do app é em português do Brasil (pt-BR).** A língua avaliada (italiano) é o
  conteúdo das provas; a língua da interface é o pt-BR. Trecho de italiano em outro idioma é bug.
  Vocabulário pt-PT é bug de interface: celular (não telemóvel), tela (não ecrã), arquivo (não
  ficheiro), salvo (não guardado), trem (não comboio), ônibus (não autocarro), você/pode (não
  tu/podes).
- Terminologia da prova em italiano (ascolto, lettura, scrittura, orale) **preservada** — é assim
  que o examinador e o materiale oficial chamam, e é o que a aluna vai encontrar na prova.

## 2. Stack e decisões de infraestrutura

Padrão copiado e validado de `/root/projetos/ElevenSpark` (mesmo dono, mesma convenção de repo):

- **React 19 + TypeScript + Vite 8** (a spec original dizia React 18 — alinhado com o
  ElevenSpark, que já usa React 19).
- **Tailwind CSS 4** (`@tailwindcss/vite`, sem `tailwind.config.js`).
- **Dexie.js 4** (IndexedDB) — persistência 100% offline. Sem servidor, sem backend.
- **Zod 4** — validação de schema de todo dado que entra no banco (backup/import são Zod-validati).
- **vite-plugin-pwa** com `registerType: 'prompt'` e `injectRegister: null` — o registo do
  service worker é feito pela app (`src/App.tsx`, `registerSW` de `virtual:pwa-register`) e o
  banner de "nova versão" é o `src/components/UpdateBanner.tsx`. `'prompt'` e não
  `'autoUpdate'`: recarregar a app a meio de uma prova é pior do que pedir "Actualizar".
  **Sem este registo a app não funciona offline** — é o requisito nº 1 do projeto.
- **Vitest** para a lógica de negócio: `scoring.ts`, `readiness.ts`, `roadmapCalculator.ts`,
  `timing.ts`, `wordCount.ts`. Regras de prova são testadas, não "testadas à mão".
- **oxlint** para lint (mesmo tool do ElevenSpark).
- **Lucide React** para ícones.

Sem backend. Sem autenticação. Sem tracking. O token do GitHub (para sync por Gist) é **do
usuário**, guardado só no `localStorage` do dispositivo dela.

## 3. Regras oficiais da prova — CRÍTICO, não negociar

A spec original enviada estava **errada em 4 pontos** e omitia o resto. A tabela abaixo é a
versão correta, extraída dos PDFs oficiais (ver `docs/exam-spec.md` para a citação de cada
fonte). **Esta tabela é a lei do app.**

### 3.1 Ascolto — 2 prove, 30 min, 12 pontos

| Prova | Tipo | Item | Punti | Max |
| --- | --- | --- | --- | --- |
| 1 | Scelta multipla, **3 opções** | **6** | 1,0 | 6 |
| 2 | Vero / Falso | **12** | 0,5 | 6 |

Protocolo temporale (replicar exatamente no mock):

`ascolto P1 (1ª vez) → 2 min leitura → ascolto P1 (2ª vez) → 2 min revisão →
 ascolto P2 (1ª vez) → 2 min leitura → ascolto P2 (2ª vez) → 2 min revisão →
 3 min per scrivere le risposte → fine`

- Os testi si ascoltano **due volte per prova**. Il contatore "1ª / 2ª riproduzione" è
  obbligatorio e il terzo play è bloccato. **Non** esiste replay illimitato.
- Errore **o omissione** = 0 punti. Nessun penalty negativo.

### 3.2 Lettura e riflessione grammaticale — 2 prove, 40 min, 12 punti

| Prova | Tipo | Item | Punti | Max |
| --- | --- | --- | --- | --- |
| 1 | Vero / Falso | **12** | 0,5 | 6 |
| 2 | Cloze (completamento) con scelta multipla, 3 opzioni | **6** | 1,0 | 6 |

> A spec original dizia "reading comprehension 6 questions + cloze 6 blanks". Errado na Prova 1:
> são **12 vero/falso**. A Prova 2 (6 item MCQ) estava certa.

### 3.3 Scrittura — 1 prova, 40 min, 12 punti

- Si sceglie **1 dei 2 temi** (entrambi presentati insieme, come nel foglio ufficiale).
- **80-120 parole**. Contatore di parole **live**, con warning fuori range, ma il submit è
  consentito (l'esaminatore non rifiuta un testo fuori range, penalizza la chiarezza).
- Griglia di valutazione **ufficiale** da usare nella self-assessment:
  efficacia comunicativa ≤3, adeguatezza stilistica ≤1, correttezza morfosintattica ≤4,
  adeguatezza e ricchezza lessicale ≤3, ortografia e punteggiatura ≤1.

### 3.4 Orale — 1 prova, ~10 min, 12 punti

- **Si registra individualmente.** L'app non può simulare l'esaminatore: si simula con
  self-assessment su griglia + timer.
- **Presentazione personale** ~1 minuto (domande fisse: nome, età, da dove sei, dove vivi, lavoro/studi).
- **Prova 1 = conversazione faccia a faccia** ~2-3 minuti su **1 argomento scelto dalla candidata**
  (l'esaminatore sceglie il tema e poi sollecita con altre domande).
- **Non è un monologo.** La spec original diceva "topic monologue" — sbagliato.
- Griglia: efficacia comunicativa ≤4, correttezza morfosintattica ≤4, adeguatezza e ricchezza
  lessicale ≤3, pronuncia e intonazione ≤1.

### 3.5 Totale e superamento

- **48 punti totali** (12 × 4 abilità). Oggettivo: **36 item** (6 + 12 + 12 + 6).
- **Regola ufficiale:** sufficienza **in ogni abilità**.
- **Capitalizzazione vietata**: se una abilità è sotto soglia, **si rifà l'esame intero**.
  Questo è il fatto che deve governare toda la UI di readiness: **non** mostrare
  "3 abilità ok, 1 para refazer" como se fosse recuperável. Mostrar o risco de reprovar tudo.
- Soglia numerica: o documento ufficiale **não publica** um número. A regra operativa
  universalmente usada (centri e preparadores) é **≥ 7/12 por abilidade ⇒ ≥ 28/48 total**.
  → `src/lib/scoring.ts` guarda isso em **constantes nomeadas e únicas**, com comentário citando
  a fonte, e a UI exibe "confirme o limiar com a sua sede de exame". **Nunca** escrever 7 ou 28
  hardcoded em outro arquivo.

## 4. Contrato dos módulos de domínio

### `src/lib/scoring.ts` — fonte única da verdade do scoring

Exporta (implementado):

- `SKILLS` — as 4 habilidades; `SKILL_LABELS` traz o rótulo italiano e o português;
  `POINTS_PER_SKILL = 12` e `TOTAL_POINTS = 48`.
- `PASS_THRESHOLD_PER_SKILL = 7` e `PASS_THRESHOLD_TOTAL = 28` (derivado, não digitado à mão).
- `scoreObjective(correct, itemCount, pointsPerItem)` → errore/omissão = 0, sem penalidade.
- `scoreAscolto(correctP1, correctP2)` → 6×1 + 12×0,5.
- `scoreLettura(correctP1, correctP2)` → 12×0,5 + 6×1.
- `scoreSkillFromCounts(skill, correctByTask)` → pontuação a partir das contagens por prova.
- `WRITING_RUBRIC` / `ORAL_RUBRIC` + `scoreScrittura()` / `scoreOrale()` / `scoreRubric()`.
- `evaluateExam(scores)` → `{ perSkill, total, passed, failedSkills, mustRetakeWholeExam }`.
- `CAPITALISATION_WARNING` e `THRESHOLD_DISCLAIMER` — os textos de aviso para a UI.

**Regra de ouro:** `passed === true` **implica** `perSkill[s] >= PASS_THRESHOLD_PER_SKILL`
para **todas** as 4 habilidades. Um total alto (ex. 39/48) com uma habilidade a 6 **retorna
`passed: false`**. Esse é o teste que não pode quebrar — está em `scoring.test.ts`.

> A spec original usava o nome de arquivo `src/lib/scoring.ts`, que **não existe** no ElevenSpark
> (lá a configuração de prova vive em `src/lib/exam.ts`). Aqui o nome fica `scoring.ts` mesmo,
> porque aqui o scoring é o domínio — mas a **configuração** das provas fica em
> `src/lib/exam.ts`, espelhando o padrão do ElevenSpark.

### `src/lib/exam.ts` — configuração das provas

Espelha `src/lib/exam.ts` do ElevenSpark: `EXAM_CONFIGS` com os **4 testi reais**
(`ascolto`, `lettura`, `scrittura`, `orale`) + `mock_cittadinanza` (a prova completa
cronometrada: 30 + 40 + 40 min de escrita, oral à parte), cada um com `timeSeconds`,
`questionCount`, `taskBreakdown` e `omrEligible`.

### `src/lib/readiness.ts` — o veredito

Dado o histórico da aluna, produz o veredito de prontidão:

- score médio recente por abilidade, com janela deslizante (últimos N mocks/últimos X dias);
- `verdict: 'not_ready' | 'close' | 'ready'`, com a regra explícita: **pronta só se todas as
  4 abilidades têm média ≥ limiar nos últimos mocks**;
- "risco #1" = a abilità que mais provavelmente reprova (menor margem sobre o limiar),
  com a contagem de mocks consecutivos abaixo do limiar;
- aviso explícito de **capitalização**: "se a oral reprovar, a prova inteira é refeita".

### `src/lib/roadmapCalculator.ts` — as 3 fases

Reaproveitar o padrão do ElevenSpark (`src/utils/roadmapCalculator.ts`): 3 fases com metas
numéricas, percentual por fase, fase atual por data e uma "tarefa do dia" (`computeTodaysSpark`).

| Fase | Janela sugerida | Foco |
| --- | --- | --- |
| 1 — Fondazione (A1) | 8 semanas | Verbi essere/avere, articoli, presentazione personale, vita quotidiana, ascolto "in chiaro" |
| 2 — Struttura (A2) | 8 semanas | Passato prossimo vs imperfetto, preposizioni articolate, futuro, pronomi |
| 3 — Cittadinanza (B1) | 8 semanas | Burecrazia/civico, condizionale presente, connettivi, **mock completos cronometrados** |

> A janela de fases no ElevenSpark éderivada do calendário do exame (Out–Jul). Aqui a janela é
> **relativa ao prazo que a aluna definir** (data da prova escolhida nas Settings), não a meses
> fixos do ano. `currentPhaseForDate(examDate, today)`.

O conteúdo gramatical de cada fase deve sair do **Sillabo B1 Cittadinanza** (lista oficial em
`docs/exam-spec.md` §3) — é a lista de estruturas que a examinadora pode cobrar, não um currículo
inventado.

## 5. Persistência e integridade dos dados

### 5.1 Dexie (IndexedDB)

Tabelas implementadas (`src/db/schemas.ts` + `src/db/database.ts`, com `version(n).stores(...)`
para migrações):

- `profiles` — quem estuda (a aluna + guest), com a data da prova.
- `passages` — textos de leitura, transcrições do áudio, temas de escrita e de oral.
- `questions` — item de prova, com `skill`, `taskId`, `itemType` (`mcq3` | `truefalse` |
  `cloze`), `options`, `correctIndex`, `explanation`, `passageId`, `pointsPerItem`, `order`.
- `sessions` — uma sessão = uma prova (`mode`, `status`, `startedAt`, `completedAt`,
  `totalTimeSeconds`, `score`, `perSkill`).
- `attempts` — resposta a item (`questionId`, `sessionId`, `skill`, `isCorrect`, `skipped`,
  `timeSpentSeconds`, `timestamp`).
- `writings` — a produção escrita + auto-avaliação na grelha oficial.
- `orals` — a prova oral (tema, notas, auto-avaliação, duração).

**Implementado na v1.1.0 (Dexie v2):** `grammarItems` (regras do Sillabo com exemplos) e
`vocabItems` (vocabulário civic/burocrático), ambos com `phase` e `level` — semeados por
`src/db/seed.ts` a partir de `src/data/phaseContent.ts`.

**Planeado (ainda não existe):** `mistakes` (hoje o banco de erros é derivado de `attempts`,
como no ElevenSpark) e ficheiros de áudio em `public/audio/` (hoje o áudio é sintetizado por
TTS — ver §7, ponto 9).

### 5.1-bis Os dois bancos de conteúdo (regra dura)

O banco tem **duas origens**, misturadas só onde é seguro:

| Banco | `Question.bank` | Onde entra |
| --- | --- | --- |
| **Oficial** | `official` (predefinição) | A prova oficial de exemplo do CILS. É a ÚNICA com gabarito garantido. |
| **Extra da app** | `practice` | Material original da app: 118 itens de ascolto/lettura (4 lotes) + 6 temas de escrita + 6 argumentos de oral + o banco de estudo (gramática e vocabulário). |

- O **simulado completo** (`mock_cittadinanza`) usa **SÓ o banco oficial** — é o que garante
  que o gabarito do CILS fica intacto (`buildExam(mode, 'official')`).
- A **prática** usa o banco `all` (oficial + extra) e, opcionalmente, filtra por fase
  (`buildExam(mode, 'all', phase)`).
- A pontuação de uma etapa é **normalizada na escala 0-12** (`scoreStageFromCounts`): para o
  banco oficial dá exatamente a pontuação oficial (há teste a provar), e para o banco misto
  nunca passa de 12.
- `BANK_VERSION` (v3) sobe quando o conteúdo muda; o re-seed **nunca** toca em sessões
  concluídas.
- `scripts/audit-content.ts` valida os dois bancos: opções, pesos, ordem, ids, fases, níveis, e que
  **cada fase tem material de ascolto E de lettura** (senão a prática por fase ficaria vazia).

### 5.1-ter O tamanho do banco (ideal: 800 itens)

O audit imprime o estado do banco e **falha** se o banco for menor do que o mínimo:

```
Banco: 801 itens (ideal 800) · A1 178/150 · A2 237/250 · B1 386/400 · ascolto 172/200 · lettura 629/600
```

- **IDEAL (alvo)**: 800 itens — 150 A1, 250 A2, 400 B1; 200 de ascolto, 600 de lettura.
  É o que dá ~20 "provas" completas por habilidade: a aluna pode estudar 3 meses
  (~15 min/dia) sem repetir as mesmas perguntas. **Atingido em 2026-10-23 (v1.3.0, BANK_VERSION 8).**
- **MÍNIMO (garantido pelo audit)**: 780 itens, com piso por nível e por habilidade.
- O menu **secundário** (Clínica de erros, Foglio risposte) só aparece no menu lateral
  do portátil — no telemóvel a barra de baixo fica com os 6 ecrãs principais.
- Cada item novo é barato: um texto de leitura dá 8 V/F + 6 cloze; uma transcrição
  dá 6 MCQ + 8 V/F; uma regra de gramática dá 3-4 exercícios; uma entrada de
  vocabulário dá 2 perguntas (geradas automaticamente, com as opções baralhadas).
- **O lado mais fraco continua a ser o ascolto** (172/200): exige transcrições novas.
  Dica: um texto de leitura pode virar "gémeo de áudio" (mesmo texto, lido pelo TTS)
  com perguntas diferentes — foi assim que se fizeram os lotes 4, 7 e 8.

### 5.2 Imutabilidade dos mocks concluídos — regra dura

`src/lib/admin.ts`:

- Uma sessão `status: 'completed'` de mock **é o registro de prova real da aluna**. Ela é
  **imutável**: nenhum reset, nenhuma "limpeza", nenhum re-seed pode apagar ou reescrever.
- `resetAllProgress(profileId)` e `resetMocks(profileId)` **preservam** mocks concluídos e
  removem apenas sessões `in_progress` / `abandoned` e as tentativas órfãs.
- Reaproveitar literalmente o padrão do ElevenSpark (`isCompletedMock()`, `resetAllProgress()`,
  `resetMocks()` em `src/lib/admin.ts`) — a lógica já foi testada em produção lá.
- Limpar o banco de conteúdo (`questions`/`passages`) e re-seedar **não** pode tocar em
  `sessions`/`attempts` concluídos. `BANK_VERSION` controla só o re-seed do conteúdo.

### 5.3 Backup / export / import

- JSON export com **Zod schema** (`backupSchema`) — mesmo padrão de `src/lib/backup.ts` do
  ElevenSpark: `buildBackup()` → `serializeBackup()` → `triggerDownload()` → `parseBackup()`
  (Zod `safeParse`, erro traduzido para PT com o path do campo) → `restoreBackup()` em
  transação Dexie.
- Nome do arquivo: `cils-b1-backup-YYYY-MM-DD.json`.
- **Snapshot local automático** — implementado em `src/lib/snapshot.ts` + `src/services/snapshots.ts`:
  cópia do **dado da aluna** (perfis, sessões, tentativas, textos, orais) em `localStorage`,
  no máximo 8 cópias (`MAX_SNAPSHOTS`), indexadas por data. O **conteúdo do banco**
  (passagens, perguntas) não entra no snapshot — é re-seedado localmente. Sobrevive a
  "limpar dados do site" no browser.

### 5.4 Sync por GitHub Gist (opcional, ativado pela aluna)

Implementado em `src/services/gistSync.ts` — padrão do ElevenSpark `src/services/gistSync.ts` /
do Memoriza `src/lib/github-sync.ts`:

- Token do GitHub guardado em `localStorage`, **scope `gist` apenas**, enviado direto do browser
  para `api.github.com` (sem backend).
- Gist privado `cils-b1-progress-sync.json` com `profiles`, `sessions`, `attempts`, `writing`.
- Merge: **registro mais novo vence**, nada local é apagado (mesma regra do `db/merge.ts` do
  Memoriza).
- Badge de estado na UI (nuvem = GitHub, banco = snapshot local) — replicar o header-status do
  Memoriza. Implementado em `src/components/SyncBadge.tsx`.
- O payload do Gist é validado por `gistPayloadSchema` (`src/db/schemas.ts`) e **não** inclui o
  conteúdo do banco — o que viaja entre aparelhos é o progresso, não as perguntas.
- O merge está em `src/lib/merge.ts` (regras testadas em `src/lib/merge.test.ts`).

## 5-bis. Módulos introduzidos na v1.0.1 / v1.0.2

| Módulo | Ficheiro | Papel |
| --- | --- | --- |
| Rotas | `src/lib/routes.ts` | Fonte única das rotas (`dashboard`, `practice`, `mock`, `progress`, `guide`, `settings`) lidas do hash — evita dependências circulares entre UI e lógica. |
| Onboarding | `src/lib/onboarding.ts` + `src/components/OnboardingChecklist.tsx` | "O que faço agora?" — 5 passos mínimos derivados do estado real (data da prova, 1ª prática, 1º simulado, backup, sync). No painel fica **recolhido** por omissão (com "Ver passos"). |
| Tema | `src/lib/theme.ts` + `src/components/ThemeToggle.tsx` | Tema claro/escuro, com a escolha persistida e aplicada sem flash. |
| Gráfico | `src/lib/chart.ts` + `src/components/ProgressChart.tsx` | Gráfico de evolução do score por abilità, desenhado em SVG (sem dependência nova). |
| Guia | `src/pages/GuidePage.tsx` | Página de ajuda: como usar a app, como se preparar, o que levar para a prova. |
| Sync | `src/services/gistSync.ts` + `src/components/SyncBadge.tsx` | Sync opcional por Gist (§5.4). |
| Snapshots | `src/lib/snapshot.ts` + `src/services/snapshots.ts` | Cópias de segurança locais (§5.3). |
| PWA | `src/App.tsx` + `src/components/UpdateBanner.tsx` | Registo do service worker e aviso de "nova versão" / "pronto para offline" (v1.0.2). |
| Estudo por nível | `src/components/StudyPicker.tsx` + `src/lib/studyPlan.ts` + `src/lib/studyLevel.ts` + `src/data/studyBank.ts` | Percurso A1 → A2 → B1: exercícios de apostila (completar frases e vocabulário), ascolto e lettura. O nível escolhido persiste em `localStorage`; o progresso usa respostas + precisão. Vive dentro do ecrã de Prática. |
| Evolução do estudo | `src/components/StudyActivityChart.tsx` + `src/pages/ProgressPage.tsx` | Atividade dos últimos 14 dias (estudo / prática / simulado), percurso por nível, precisão e dias seguidos. |
| Reset total | `src/services/wipe.ts` + Ajustes | Apagar TUDO do aparelho (com confirmação escrita "APAGAR"). |
| Padrões de gramática | `src/data/grammarPatterns.ts` | 60 lacunas de gramática no formato da Prova 2 do CILS. |
| Relatório da prova | `src/components/exam/ReportPage.tsx` + `src/services/reports.ts` | Rever a prova e imprimir/guardar em PDF para enviar à professora. |
| Clínica de erros | `src/pages/MistakesPage.tsx` | Banco de erros (derivado de `attempts`) com a resposta certa e a explicação; treina só esses erros (`buildExam` com `questionIds`). |
| Foglio delle risposte | `src/pages/AnswerSheetPage.tsx` | Folha de respostas A4 imprimível, com o layout do foglio oficial (4 provas + caixa de texto). |
| Checklist de consegna | `src/components/exam/WritingPanel.tsx` | 5 critérios a rever antes de entregar a produção escrita. |
| Fim da sessão de estudo | `src/lib/stageCounts.ts` + `src/components/exam/ExamSession.tsx` | O estudo termina com "acertaste X de Y" por habilidade (não com a nota /48 nem com as 4 habilidades da prova). O item não respondido conta como errado. |

## 6. GitHub + Cloudflare (deploy)

- Repo: `git@github.com:Fpiscinato/cils-b1-cittadinanza.git`, branch `main`.
- Deploy: **integração Git da Cloudflare (Workers Builds)** — o mesmo padrão dos outros
  projetos do dono (`memoriza`, `darts-tournament`, `quase-profissionais`). A Cloudflare
  observa o repositório e builda a cada push para `main`; **não há workflow do GitHub e não
  há secrets** (`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` não são necessários aqui —
  a Cloudflare autentica o build sozinha com o token que ela própria cria).
- Configuração no painel (Workers & Pages → Create → Workers → Connect to Git):
  - Build command: `npm run ci` (= `npm run audit` + `npm run build`)
  - Deploy command: `npx wrangler deploy`
  - Root directory: `/`; Node 22.
- O gate de qualidade **continua igual**: `npm run ci` roda `audit:exam`, `audit:content` e
  os testes antes do build. Banco de questões quebrado não é publicado.
- Não recriar `.github/workflows/deploy.yml`: com a integração Git isso causaria deploy duplicado.
- `wrangler.jsonc` (formato do ElevenSpark, non-CLI): `assets.directory: "./dist"`,
  `not_found_handling: "single-page-application"`, `observability.enabled: true`.
- `npm run deploy` local = `npm run build && wrangler deploy` (precisa de `wrangler login`).
- Ícones: `public/app-icons/v<APP_VERSION>/`, gerados por `node scripts/generate-icons.mjs`
  (mesmo script do ElevenSpark). Bump de `APP_VERSION` regenera os ícones.

## 6-bis. Segurança e segredos (não negociável)

- **Nunca** commitar `.env`, `.env.*`, `opencode.json`, `.dev.vars`, `*.key`, `*.pem` ou
  qualquer token. O `.gitignore` já bloqueia; **nunca** usar `git add -f` nesses ficheiros.
- `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` só existem em GitHub Actions secrets ou
  no painel da Cloudflare — **nunca** no código, no `wrangler.jsonc` ou na documentação.
  Este repo usa a integração Git da Cloudflare e **não** deve ter workflow com token.
- O token do Gist é digitado pela usuária em runtime e fica **só** no `localStorage`;
  nunca hardcodar, logar ou incluir em backup/Gist.
- Os dados de estudo (IndexedDB) e as exportações JSON são locais e **não** são
  criptografados: não os anexar a issues/PRs.
- Antes de cada push: `git status --short` + `git diff --cached`. Se um segredo vazar,
  **revogar primeiro** (Cloudflare/GitHub) e só depois limpar o histórico — apagar o
  commit sozinho não resolve.

## 7. UX — as regras que vêm do ElevenSpark (validadas em produção)

1. **Um único runner.** `src/components/exam/ExamSession.tsx` (que usa o `ExamRunner.tsx` por baixo) é o **único** caminho de sessão
   (prática, clínica de erros, banco de erros e mock). Nunca criar um segundo runner — a
   consistência de layout, timer e footer fixo passa a ser **por construção**.
2. **Tela de prática "action-first"**: o cartão **Estudar** abre por omissão com o nível atual,
   o tipo de material e o botão ▶️ Começar; as restantes opções (perguntas de prova, fases,
   como funciona) ficam em cartões **colapsáveis e fechados**. O percurso é por nível
   (A1 → A2 → B1): um nível fica dominado com 20 respostas e 80% de acerto.
3. **Prática sem scroll**: coluna flex de altura fixa, header compacto (progresso / timer /
   abilità), área da pergunta com scroll, e **footer sempre visível** com o botão de confirmar.
   A página **nunca** rola em tablet ou laptop.
4. **Timer congela na última resposta**: responder a última questão finaliza o relógio, para o
   tempo exibido e o tempo gravado serem idênticos.
5. **Resposta fechada após erro**: mostra-se a resposta certa e a explicação ("Porquê"), mas
   **não** há "tentar de novo" nem voltar à pergunta anterior. A resposta confirmada não muda
   (é assim na prova real; o treino é ler a explicação e seguir).
6. **Uma única confirmação para parar**: um alertdialog com exatamente dois botões —
   "Continuar estudando" e "Encerrar sessão" — e a mensagem "As respostas já foram salvas".
7. **O menu está SEMPRE visível**: no celular é o menu inferior fixo (6 itens, aba ativa
   marcada); no notebook/tablet (`md:`) é um **menu lateral fixo** no `AppShell`. Nenhuma tela
   pode ficar sem navegação. O ícone da app fica no **canto superior esquerdo** (link para o
   Painel), com o botão de tema e o badge de sync à direita.
8. **"Voltar ao painel" em todos os ecrãs secundários**: `BackButton` (`src/components/ui.tsx`)
   no topo de Prática, Simulado, Progresso, Guia e Ajustes. A navegação é por hash
   (`src/lib/routes.ts`) — o botão tem de mudar o hash, nunca só refrescar dados.
9. **Erros de conteúdo**: `childSafetyGuard` não se aplica (app adulto), mas vale o equivalente
   de **integridade de conteúdo**: nenhuma questão pode ter duas opções corretas, nenhum texto
   pode ficar invisível (mesma cor de fundo e de letra, em light **e** dark mode).
10. **Estado fresco ao gravar a sessão**: `ExamSession` chama `onSaved` logo que a sessão fica
    `completed` (antes de mostrar o resultado). Sem isso, quem termina a sessão e clica em
    "Progresso" no menu via números antigos — o Painel e o Progresso só eram recarregados no
    botão "Voltar ao painel".

### Extras específicos deste app

9. **Audio player de prova** com: botão play, contador "1ª/2ª reprodução", botão desabilitado
   após a 2ª, barra de progresso, velocidade 1.0x, e a **trascrizione** disponível só depois
   de responder (como no papel — na prova real você não tem a trascrizione).
10. **Foglio delle risposte (OMR)**: a aluna precisa escrever as risposte no papel na prova real.
    O app deve oferecer um **foglio delle risposte stampabile** (A4, come l'originale) e um
    **riempimento guidato** che espelha o layout oficial.
11. **Contador de palavras** na scrittura (80-120) com indicator live e aviso, e uma
    **checklist** di consegna (5 criteri) antes del submit.
12. **Orale**: pannello con timer di 1 min (presentazione) + 2-3 min (dialogo), la griglia
    ufficiale a 4 criteri, e l'elenco dei **temi ufficiali** (città/campagna, cultura, assistenza
    sanitaria, **documenti per la cittadinanza**). Registrazione audio del browser (MediaRecorder)
    **real** (pede o microfone, com playback e download), guardada na tabela `oralAudios`
    (Dexie v3) e reproduzível no relatório da prova.
13. **Readiness dashboard**: 4 barre di punteggio per abilità, media mobile, margine sul limiar,
    "abilità a rischio #1" e la regola di capitalizzazione in evidenza.
14. **Percurso de estudo por nível** (A1 → A2 → B1): cartão "Estudar" aberto na Prática, com
    exercícios de apostila (completar frases + vocabulário), ascolto e lettura. O estudo não
    entra no veredito de prontidão (é exercício, não prova); a evolução dele vive no Progresso.
15. **Uma prova é uma prova (18 itens), não o banco inteiro**: a prática de uma habilidade
    (`ascolto` / `lettura`) usa o limite da configuração oficial (6+12 e 12+6) e baralha
    **por task**, para o áudio de um texto não ser cortado a meio. O simulado continua a usar
    o banco oficial na ordem oficial. Sem este limite, "Lettura" abria 629 perguntas com 40
    minutos de cronómetro.
16. **Pronúncia (TTS) no estudo e na prática, nunca no simulado**: `PronounceButton`
    (`src/components/exam/PronounceButton.tsx`) lê a pergunta e a resposta certa em italiano.
    No simulado (`mode === 'exam'`) o botão não aparece (na prova real não há esse apoio). Em
    itens de apostila (`taskId` começado por `studio-`) o enunciado é português, por isso a
    pronúncia aparece só na resposta certa.
17. **Aprender (vocabulário)**: dentro do cartão "Estudar" há o botão "Aprender palavras de
    <nível>" (`src/components/LearnPanel.tsx`). Cartões com a palavra/frase em italiano, botão de
    pronúncia, "Ver o significado em português" e a frase de exemplo traduzida. É aprendizagem,
    não grava sessão nem entra no veredito.
18. **Sessão não morre ao mudar de aba**: `PracticePage`, `MockPage` e `MistakesPage` ficam
    **sempre montadas** no `App.tsx` (escondidas com `hidden`) e o pedido de prova chega por
    efeito. Enquanto há sessão a correr e a rota ativa é outra, aparece a barra fixa
    "⏱️ Sessão em curso — continuar", que volta ao ecrã da sessão sem a reiniciar.
19. **Histórico do Progresso** (`src/components/SessionHistory.tsx` + `src/lib/sessionSummary.ts`):
    uma linha por sessão concluída (Estudo, Prática ou Simulado) com a **bolinha da cor do
    gráfico**, hora, cronómetro, acertos/erros e, nos simulados, o score por habilidade.
    Agrupado **por dia** e recolhido: só os 2 dias mais recentes abrem; os antigos abrem num clique.
20. **Legenda do gráfico clicável**: no "Evolução do estudo · 14 dias", cada cor (Estudo, Prática,
    Simulado) tem tooltip e, ao clicar/tocar, mostra a descrição exata do que conta.
21. **Anti-repetição**: a prática e o estudo empurram para o fim (e por isso não escolhem enquanto
    houver alternativa) as perguntas respondidas nos últimos `RECENT_REPEAT_WINDOW_DAYS = 45`
    dias (`src/lib/examBuilder.ts`). O simulado **nunca** aplica esta regra: usa a prova oficial
    na ordem oficial. Se o banco fresco não chegar, a prova enche-se com as antigas (nunca fica
    vazia). "Mix rápido" é uma **sessão de prática** (barra azul), não de estudo.
22. **Áudio do ascolto na sequência certa**: o player aparece **antes** das opções, cada texto
    tem exatamente **2 reproduções** (o contador sobe no início da reprodução, não no fim), e a
    transcrição só é revelada **depois de confirmar a resposta**.

## 8. Standard di codice

- TypeScript **strict**, **zero `any`**.
- Niente `TODO` / funzioni incomplete / placeholder: ogni deliverable è finito o non entra.
- Zod per ogni dato che entra nel DB o da fuori (backup, import, config).
- Testi Vitest per **tutta** la logica di business: `scoring`, `readiness`, `roadmap`,
  `timing`, `wordCount`, `rubric`, `studyPlan`, `stageCounts`, `examBuilder`. Un bug no scoring reprova a aluna na prova real.
- Italiano nei **dati**, **português do Brasil** nos **textos de interface**. Nomes de código em inglês.
- Sem dependência de CDN em runtime. O app tem que funcionar **100% offline** depois do
  primeiro load (é uma PWA para studying em casa,UK, com internet instável).

## 9. Comandos locais (gate de qualidade)

```
npm run dev            # vite dev
npm run build          # tsc -b && vite build   <- único type-check confiável
npm run lint           # oxlint
npm run test           # vitest run  (122 testes em 15 ficheiros)
npm run audit          # a porta de qualidade: audit:exam + audit:content + test
npm run audit:exam     # a configuração das provas bate com a especificação oficial?
npm run audit:content  # integridade do banco (opções, pesos, ordem) E o gabarito oficial do CILS
npm run icons          # regenera os ícones depois de um bump de APP_VERSION
npm run version:bump   # sobe a versão (base-10, dígito a dígito)
```

`npm run ci` (= `npm run audit` + `npm run build`) é o **build command da Cloudflare**: se os
audits falharem, o deploy não sai.

O `audit:content` é o mais importante: ele **recalcula as respostas do banco e compara com as
chaves oficiais do CILS** ("Chiavi di soluzione delle prove"). As 36 perguntas da prova de
exemplo oficial (Quaderno + Trascrizioni) estão em `src/data/officialSample.ts` e têm de
continuar a bater certo com o gabarito publicado.

### Conteúdo de exemplo oficial (já implementado)

`src/data/officialSample.ts` traz a **prova oficial de exemplo completa**, com o gabarito do
CILS: 6 MCQ + 12 V/F de ascolto, 12 V/F + 6 cloze de lettura, os 2 temas de escrita e os 4
temas da oral, mais as transcrições (que alimentam o TTS do áudio). É a única prova com
gabarito oficial garantido, por isso é o primeiro conteúdo do banco.

## 10. Versionamento (base-10, digit a digit)

- `major.minor.patch`, ogni parte è un singolo digit: `1.0.0 → 1.0.1 → … → 1.0.9 → 1.1.0`.
- `npm run version:bump` esegue il bump (stesso script del ElevenSpark).
- La versione appare **solo** nas Settings.
- Bump di `APP_VERSION` → `npm run icons`.
- Bump di `BANK_VERSION` quando i generatori cambiano, così il banco viene re-seeded.

## 11. Decisões já tomadas e em aberto

**Já decididas:**

1. **Áudio → TTS do browser** (`src/lib/tts.ts`, voz italiana do sistema). Escalável para
   qualquer número de itens, zero MB, 100% offline. A transcrição oficial do CILS é a fonte
   do texto lido. O limite de 2 reproduções por prova é sempre respeitado.
2. **Oral → simulação com a grelha oficial** (timer de 1 min + 2-3 min, 4 critérios). Não há
   "tutor" que faça perguntas: o examinador é humano e o app prepara, não substitui.
3. **Limiar 7/12 por habilidade** → 28/48, marcado como "confirmar com a sua sede" na UI.

**Em aberto (precisam da aluna):**

4. **Data da prova** — sem ela, as 3 fases não têm janela (a aluna marca-a nos Ajustes).
5. **Sede de exame** — Siena, Londres ou outra? Muda a data limite de inscrição e o
   ficheiro oficial da prova (o `foglio delle risposte` é igual em todas as sedes).
6. **Conteúdo extra** — o banco tem hoje só a prova oficial de exemplo. Falta gerar conteúdo
   por fase (gramática do Sillabo, vocabulário, civic/burocracia) e provas adicionais.

## 12. Estado do deploy

- Repo criado e `main` publicado: `git@github.com:Fpiscinato/cils-b1-cittadinanza.git`.
- O workflow `.github/workflows/deploy.yml` foi **removido** de propósito: o deploy é feito
  pela integração Git da Cloudflare (ver §6), igual aos outros projetos do dono.
- Integração Git **já conectada** (2026-10-22): build command `npm run ci`, deploy command
  `npx wrangler deploy`, root `/`. Cada push para `main` publica sozinho.
- O build token da Cloudflare chama-se `workers build 2026-10-22` (nome automático). É só um
  rótulo: o Worker affectedo é o `cils-b1-cittadinanza` (nome vem do `wrangler.jsonc`).
- Deploy local alternativo: `npm run deploy` (precisa de `wrangler login`).

## 12-bis. Regras de arranque (o "ficar a carregar")

- O arranque tem **timeout de 15 s**: se a base de dados não abrir, aparece um ecrã de erro
  com "Tentar de novo" — nunca fica eternamente no "A carregar…".
- `db.on('versionchange', () => db.close())` (`src/db/database.ts`): sem isto, se um separador
  antigo da app ficar aberto, o **upgrade do IndexedDB fica bloqueado** e a app nova nunca
  arranca. É o bug mais provável de "atualizei o telemóvel e ficou a carregar".
- Todos os hooks de um componente têm de correr **antes** de qualquer `return` antecipado
  (erro do React #310 = ecrã em branco). Foi o que rebentou o "Rever e exportar".

## 13. Verificação visual (obrigatória antes de cada push)

A app é usada em telemóvel e portátil. Antes de dar push, auditar o layout em pelo menos
três tamanhos — **1440×900 (portátil), 834×1112 (tablet), 390×844 (telemóvel)** — e navegar
por todas as rotas (`#/dashboard`, `#/practice`, `#/mock`, `#/progress`, `#/guide`,
`#/settings`).

Ferramenta usada: Chromium headless + CDP (`Emulation.setDeviceMetricsOverride` +
`Page.captureScreenshot`). O `--virtual-time-budget` do Chromium **não** serve para isto: o
IndexedDB não avança com o tempo virtual e a app fica eternamente no ecrã "A carregar…".
