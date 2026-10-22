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
- **Toda a interface do app é em português.** A língua avaliada (italiano) é o conteúdo das
  provas; a língua da interface é o português. Trecho de italiano em nenhum idioma é bug.
- Terminologia da prova em italiano (ascolto, lettura, scrittura, orale) **preservada** — é assim
  que o examinador e o materiale oficial chamam, e é o que a aluna vai encontrar na prova.

## 2. Stack e decisões de infraestrutura

Padrão copiado e validado de `/root/projetos/ElevenSpark` (mesmo dono, mesma convenção de repo):

- **React 19 + TypeScript + Vite 8** (a spec original dizia React 18 — alinhado com o
  ElevenSpark, que já usa React 19).
- **Tailwind CSS 4** (`@tailwindcss/vite`, sem `tailwind.config.js`).
- **Dexie.js 4** (IndexedDB) — persistência 100% offline. Sem servidor, sem backend.
- **Zod 4** — validação de schema de todo dado que entra no banco (backup/import são Zod-validati).
- **vite-plugin-pwa** com `registerType: 'autoUpdate'` e `injectRegister: null` (o próprio app
  controla o banner de nova versão).
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

Deve exportar:

- `SKILLS` — as 4 abilità, com id, rótulo italiano, rótulo PT, `maxPoints: 12`.
- `PASS_THRESHOLD_PER_SKILL = 7` e `PASS_THRESHOLD_TOTAL = 28` (derivado, não digitado à mão).
- `scoreAscolto(correctP1, correctP2)` → pontos com os pesos 1.0 e 0.5 (e `0` por errore/omissa).
- `scoreLettura(correctP1, correctP2)` → idem.
- `scoreScrittura(rubric)` → somatório dos 5 criteri (3+1+4+3+1 = 12).
- `scoreOrale(rubric)` → somatório dos 4 criteri (4+4+3+1 = 12).
- `evaluateAttempt(...)` / `evaluateMock(...)` → `{ total, perSkill, passed, failedSkills[] }`.

**Regra de ouro:** `passed === true` **implica** `perSkill[s] >= PASS_THRESHOLD_PER_SKILL`
para **todas** as 4 abilità. Um total alto (ex. 39/48) com uma abilità a 6 **retorna
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

Tabelas (espelhar `src/db/database.ts` do ElevenSpark, com `version(n).stores(...).upgrade(...)`
para migrações):

- `profiles` — quem estuda (a aluna + guest).
- `skills` / `grammarItems` / `vocabItems` — banco de conteúdo.
- `questions` — item de prova, com `skill`, `taskId`, `type` (`mcq3` | `truefalse` | `cloze` |
  `writing` | `oral`), `options`, `correctIndex`, `explanation`, `passageId`, `audioId`.
- `passages` — testi di lettura (350-500 parole) e trascrizioni.
- `audio` — metadati degli audio (`public/audio/*.mp3`, path, durata, transcript).
- `sessions` — uma sessão = uma prova/missao (`mode`, `status`, `startedAt`, `completedAt`,
  `totalTimeSeconds`, `score`, `perSkill`).
- `attempts` — resposta a item (`questionId`, `sessionId`, `skill`, `isCorrect`, `timeSpentSeconds`).
- `writing` / `oral` — composições + self-assessment rubric.
- `mistakes` — banco de erros (derivado de `attempts` + flag `cleared`, como no ElevenSpark).

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
- **Snapshot local automático** (por dia/semana) em `localStorage` + download manual, para
  nunca perder trabalho se o cache do browser for limpo.

### 5.4 Sync por GitHub Gist (opcional, ativado pela aluna)

Padrão do ElevenSpark `src/services/gistSync.ts` / do Memoriza `src/lib/github-sync.ts`:

- Token do GitHub guardado em `localStorage`, **scope `gist` apenas**, enviado direto do browser
  para `api.github.com` (sem backend).
- Gist privado `cils-b1-progress-sync.json` com `profiles`, `sessions`, `attempts`, `writing`.
- Merge: **registro mais novo vence**, nada local é apagado (mesma regra do `db/merge.ts` do
  Memoriza).
- Badge de estado na UI (nuvem = GitHub, banco = snapshot local) — replicar o header-status do
  Memoriza.

## 6. GitHub + Cloudflare (deploy)

- Repo: `git@github.com:Fpiscinato/cils-b1-cittadinanza.git`, branch `main`.
- CI/CD: `.github/workflows/deploy.yml` — **espelhar exatamente** o do ElevenSpark:
  `actions/checkout@v4` → `actions/setup-node@v4` (node 22, cache npm) → `npm ci` →
  **`npm run audit`** (gate: um banco de questões quebrado nunca chega à aluna) →
  `npm run build` → checagem de credenciais com mensagem acionável → `cloudflare/wrangler-action@v3`
  → `deploy` → resumo no `$GITHUB_STEP_SUMMARY`.
- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- `wrangler.jsonc` (formato do ElevenSpark, non-CLI): `assets.directory: "./dist"`,
  `not_found_handling: "single-page-application"`, `observability.enabled: true`.
- `npm run deploy` local = `npm run build && wrangler deploy` (precisa de `wrangler login`).
- Ícones: `public/app-icons/v<APP_VERSION>/`, gerados por `node scripts/generate-icons.mjs`
  (mesmo script do ElevenSpark). Bump de `APP_VERSION` regenera os ícones.

## 7. UX — as regras que vêm do ElevenSpark (validadas em produção)

1. **Um único runner.** `src/components/exam/PracticeRunner.tsx` é o **único** runner de sessão
   (prática, clínica de erros, banco de erros e mock). Nunca criar um segundo runner — a
   consistência de layout, timer e footer fixo passa a ser **por construção**.
2. **Tela de prática "action-first"**: o botão ▶️ Iniciar e o ⚡ Mix Rápido ficam no **primeiro
   card**, com o resumo da seleção logo abaixo ("Italiano • Temas mistos • 10 questões").
   O resto vive em cards **colapsáveis, fechados por padrão**.
3. **Prática sem scroll**: coluna flex de altura fixa, header compacto (progresso / timer /
   abilità), área da pergunta com scroll, e **footer sempre visível** com o botão de confirmar.
   A página **nunca** rola em tablet ou laptop.
4. **Timer congela na última resposta**: responder a última questão finaliza o relógio, para o
   tempo exibido e o tempo gravado serem idênticos.
5. **Dois níveis de ajuda após erro**: "💡 Explicação rápida" (por que esta resposta está certa)
   e "🧠 Aprenda a resolver" (o conceito, um método de 3 passos, a armadilha comum).
6. **Uma única confirmação para parar**: um alertdialog com exatamente dois botões —
   "Continuar estudando" e "Encerrar sessão" — e a mensagem "As respostas já foram salvas".
7. **No celular, o menu inferior sempre mostra onde você está**.
8. **Erros de conteúdo**: `childSafetyGuard` não se aplica (app adulto), mas vale o equivalente
   de **integridade de conteúdo**: nenhuma questão pode ter duas opções corretas, nenhum texto
   pode ficar invisível (mesma cor de fundo e de letra, em light **e** dark mode).

### Extras específicos deste app

9. **Audio player de prova** com: botão play, contador "1ª/2ª reprodução", botão desabilitado
   após a 2ª, barra de progresso, velocidade 1.0x, e a **trascrizione** disponível só depois
   de responder (como no papel — na prova real você não tem a trascrizione).
10. **Foglio delle risposte (OMR)**: a aluna precisa escrever as risposte no papel na prova real.
    O app deve oferecer um **foglio delle risposte stampabile** (A4, come l'originale) e um
    **riempimento guidato** che espelha o layout oficial.
11. **Contador de palavras** na scrittura (80-120) com indicator live e aviso, e uma
    **checklist** di consegna (5 criteri) antes del submit.
12. **Orale**: pannello con timer de 1 min (presentazione) + 2-3 min (dialogo), la griglia
    ufficiale a 4 criteri, e l'elenco dei **temi ufficiali** (città/campagna, cultura, assistenza
    sanitaria, **documenti per la cittadinanza**). Registrazione audio del browser (MediaRecorder)
    opzionale, con avviso "viene valutata da griglia".
13. **Readiness dashboard**: 4 barre di punteggio per abilità, media mobile, margine sul limiar,
    "abilità a rischio #1" e la regola di capitalizzazione in evidenza.

## 8. Standard di codice

- TypeScript **strict**, **zero `any`**.
- Niente `TODO` / funzioni incomplete / placeholder: ogni deliverable è finito o non entra.
- Zod per ogni dato che entra nel DB o da fuori (backup, import, config).
- Testi Vitest per **tutta** la logica di business: `scoring`, `readiness`, `roadmap`,
  `timing`, `wordCount`, `rubric`. Un bug no scoring reprova a aluna na prova real.
- Italiano nei **dati**, português nos **textos de interface**. Nomes de código em inglês.
- Sem dependência de CDN em runtime. O app tem que funcionar **100% offline** depois do
  primeiro load (é uma PWA para studying em casa,UK, com internet instável).

## 9. Comandos locais (gate de qualidade)

```
npm run dev            # vite dev
npm run build          # tsc -b && vite build   <- único type-check confiável
npm run lint           # oxlint
npm run test           # vitest run
npm run audit          # a porta de qualidade (ver abaixo)
npm run audit:content  # integridade del banco de questions (opzioni corrette uniche, stem non vuoto, punteggi conformi)
npm run audit:exam     # la configurazione delle prove corrisponde alla specifica ufficiale (6+12+12+6 item, pesi 1/0.5, 12 punti per abilità)
npm run audit:visibility # nessun testo invisibile in light e dark mode
npm run icons          # rigenera gli icone dopo un bump di APP_VERSION
```

`npm run audit` é **gate no CI** — se os audit falliscono, il deploy non esce.

## 10. Versionamento (base-10, digit a digit)

- `major.minor.patch`, ogni parte è un singolo digit: `1.0.0 → 1.0.1 → … → 1.0.9 → 1.1.0`.
- `npm run version:bump` esegue il bump (stesso script del ElevenSpark).
- La versione appare **solo** nas Settings.
- Bump di `APP_VERSION` → `npm run icons`.
- Bump di `BANK_VERSION` quando i generatori cambiano, così il banco viene re-seeded.

## 11. Decisioni aperte (da confermare con la studentessa prima di implementarle)

1. **Audio**: usare gli audio ufficiali campione (38 MB, ~1 prova) + audio generati/sintetizzati,
   oppure solo sintesi vocale (TTS) per coprire tutti i 36 item di ogni mock? → la seconda è
   l'unica scalabile, la prima è la più fedele. Serve capire la priorità.
2. **Orale**: il app simula solo, oppure c'è un "tutor" che fa domande a voce? (fuori scope PWA
   offline, ma un prompt-to-speech del browser + registrazione è fattibile).
3. **Data della prova**: senza la data reale dell'esame, le 3 fasi non hanno una finestra.
4. **Soglia 7/12**: confermare con la sede di esame (Siena, Londra, ecc.) prima di fissarla
   come default nell'app.
