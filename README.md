# CILS B1 Cittadinanza Prep

PWA de estudo e simulação para preparar a prova **CILS B1 Cittadinanza**
(Università per Stranieri di Siena) — o certificado de italiano B1 exigido para o pedido de
cidadania italiana.

> 📄 **A especificação oficial completa da prova** (com os links dos PDFs do CILS de onde tudo
> foi extraído) está em [`docs/exam-spec.md`](docs/exam-spec.md).
> 📋 **As instruções operacionais para quem mexe no projeto** estão em [`AGENTS.md`](AGENTS.md).

## O que o app faz

- **Simula a prova real** — as 4 habilidades (ascolto, lettura, scrittura, orale) com os tempos,
  os pesos de ponto e o protocolo exatos do exame oficial (inclusive "os textos são ouvido duas
  vezes" e a folha de respostas OMR).
- **Testa o conhecimento** — banco de questões por habilidade, com clinic de erros e banco de erros.
- **Diz se ela está pronta** — dashboard de prontidão com a nota de cada habilidade, a margem
  sobre o limiar de aprovação e a habilidade de maior risco.
- **É 100% offline** — IndexedDB (Dexie), backup em JSON e sync opcional por GitHub Gist.

## Estado

Planejamento. O código ainda não foi escrito — o `AGENTS.md` já está revisado e validado contra
os documentos oficiais do CILS.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Dexie 4 · Zod 4 · Vite PWA · Vitest · oxlint ·
Cloudflare Workers (wrangler) · GitHub Actions
