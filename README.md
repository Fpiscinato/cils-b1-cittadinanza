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

## Comandos

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run test       # 53 testes (scoring, readiness, roadmap, wordCount, timing, admin, examBuilder)
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

Ver [`AGENTS.md` §12](AGENTS.md#12-estado-do-deploy) — a lista exacta dos dois passos manuais
(criar o repo e adicionar os secrets da Cloudflare).

## Fonte do conteúdo

As provas de exemplo vêm da **Università per Stranieri di Siena – CILS** (Quaderno,
Trascrizioni, Produzione Scritta/Orale e Chiavi di soluzione). `scripts/fetch-official-samples.sh`
descarrega os originais para uso local. Qualquer conteúdo derivado da app tem de citar a fonte.
