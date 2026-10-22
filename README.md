# CILS B1 Cittadinanza Prep

PWA de estudo e simulação para preparar a prova **CILS B1 Cittadinanza**
(Università per Stranieri di Siena) — o certificado de italiano B1 exigido para o pedido de
cidadania italiana.

> 📄 **A especificação oficial completa da prova** (com os links dos PDFs do CILS de onde tudo
> foi extraído) está em [`docs/exam-spec.md`](docs/exam-spec.md).
> 📋 **As instruções operacionais para quem mexe no projeto** estão em [`AGENTS.md`](AGENTS.md).

## O que o app faz

- **Simula a prova real** — as 4 habilidades (ascolto, lettura, scrittura, orale) com os tempos,
  os pesos de ponto e o protocolo exatos do exame oficial (o áudio é ouvido **duas vezes**,
  2 min para ler, 2 min para conferir, 3 min para escrever no foglio delle risposte).
- **Testa o conhecimento** — a prova oficial de exemplo do CILS entra como conteúdo inicial:
  **36 perguntas com o gabarito oficial** (6 MCQ + 12 V/F de escuta, 12 V/F + 6 cloze de
  leitura), os 2 temas de escrita e os 4 temas da oral.
- **Diz se ela está pronta** — dashboard de prontidão com a nota de cada habilidade, a margem
  sobre o limiar e a habilidade de maior risco. Sem capitalização: ou passa nas quatro, ou
  refaz a prova inteira.
- **Guia de uso** — um ecrã "Guia" com o passo-a-passo para começar, o protocolo de cada prova,
  as regras de aprovação e o que levar para o exame (mais a aba "Conteúdo por fase").
- **Estudo por nível** — um quiz curto e **aleatório** de A1/A2/B1 (exercícios de gramática e
  vocabulário, ascolto ou lettura) para treinar todos os dias sem repetir as perguntas.
- **Banco grande** — 629 itens (meta: 800): a prova oficial do CILS + material original da app
  por nível e por fase, com explicação depois de cada resposta.
- **Acompanha a evolução** — gráfico do score total e de cada abilità ao longo do tempo, com a
  linha da sufficienza.
- **Rever e enviar à professora** — no fim de cada prova podes abrir o relatório completo
  (enunciado, gabarito, a tua resposta e a explicação) e imprimi-lo ou guardá-lo em PDF.
- **Clínica de erros** — todas as perguntas que erraste, com a resposta certa e a explicação,
  e um botão para treinar só esses erros.
- **Foglio delle risposte** — a folha de respostas A4, igual ao original, para escrever à mão.
- **Claro ou escuro** — tema claro/escuro/sistema, guardado no aparelho (sem "flash" ao abrir).
- **Guarda o trabalho em dois sítios** — snapshots locais automáticos (até 8) + sync opcional por
  GitHub Gist (nuvem verde = sync OK, laranja = sem sync) para continuar noutro aparelho.
- **É 100% offline** — IndexedDB (Dexie), backup em JSON e PWA instalável.

## Como está montado

| Camada | Onde |
| --- | --- |
| Scoring e limiares (fonte única da verdade) | `src/lib/scoring.ts` |
| Configuração das provas + protocolo do ascolto | `src/lib/exam.ts` |
| Veredito de prontidão | `src/lib/readiness.ts` |
| As 3 fases e a tarefa do dia | `src/lib/roadmapCalculator.ts` |
| Conteúdo oficial + gabarito do CILS | `src/data/officialSample.ts` |
| Banco (Dexie) e schemas (Zod) | `src/db/` |
| Runner único de sessão | `src/components/exam/ExamRunner.tsx` |
| Áudio por síntese de voz do browser | `src/lib/tts.ts` |
| Rotas (hash) e menu (sidebar no portátil, barra no telemóvel) | `src/lib/routes.ts`, `src/components/AppShell.tsx` |
| Tema claro/escuro | `src/lib/theme.ts` |
| Gráfico de evolução (SVG) | `src/lib/chart.ts`, `src/components/ProgressChart.tsx` |
| Banco de conteúdo (oficial + extra + estudo) | `src/data/officialSample.ts`, `src/data/extraPractice.ts`, `src/data/studyBank.ts` |
| Relatório da prova (rever / PDF) | `src/components/exam/ReportPage.tsx` |
| Sync por Gist / snapshots locais | `src/services/gistSync.ts`, `src/lib/snapshot.ts` |

## Comandos

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run test       # 80 testes (scoring, readiness, roadmap, wordCount, timing, admin,
                   # examBuilder, theme, chart, merge, snapshot, onboarding)
npm run audit      # audit:exam + audit:content + test  <- gate do CI
npm run build      # type-check + build
npm run lint       # oxlint
```

O `audit:content` recalcula as respostas do banco e compara com as **chaves oficiais do
CILS** — se uma resposta divergir, o deploy não sai.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Dexie 4 · Zod 4 · Vite PWA · Vitest · oxlint ·
Cloudflare Workers (wrangler) · GitHub Actions

## Deploy

O deploy é feito pela **integração Git da Cloudflare** (Workers Builds): cada push para `main`
publica sozinho. Detalhes em [`AGENTS.md` §12](AGENTS.md#12-estado-do-deploy).

## Fonte do conteúdo

As provas de exemplo vêm da **Università per Stranieri di Siena – CILS** (Quaderno,
Trascrizioni, Produzione Scritta/Orale e Chiavi di soluzione). `scripts/fetch-official-samples.sh`
descarrega os originais para uso local. Qualquer conteúdo derivado da app tem de citar a fonte.
