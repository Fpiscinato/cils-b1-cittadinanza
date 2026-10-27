import { useMemo } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button, Card } from '../components/ui'
import { OFFICIAL_QUESTIONS } from '../data/officialSample'
import type { Question } from '../db/schemas'
import type { Route } from '../lib/routes'

/**
 * FOGLIO DELLE RISPOSTE — a folha de respostas em A4, como o original.
 *
 * Na prova real as respostas são escritas na folha oficial com caneta azul ou
 * preta. Esta folha é para a aluna treinar em casa (ou levar impressa).
 * É imprimível: "Imprimir / Salvar em PDF" + o CSS de impressão em
 * `src/index.css`.
 */
export function AnswerSheetPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const questions = useMemo(() => {
    const byTask = new Map<string, Question[]>()
    for (const question of OFFICIAL_QUESTIONS) {
      const list = byTask.get(question.taskId) ?? []
      list.push(question)
      byTask.set(question.taskId, list)
    }
    for (const list of byTask.values()) list.sort((a, b) => a.order - b.order)
    return byTask
  }, [])

  const ascoltoP1 = questions.get('ascolto-p1') ?? []
  const ascoltoP2 = questions.get('ascolto-p2') ?? []
  const letturaP1 = questions.get('lettura-p1') ?? []
  const letturaP2 = questions.get('lettura-p2') ?? []

  return (
    <div className="flex flex-col gap-3">
      <div className="no-print flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => onNavigate('mock')}>
          <ArrowLeft size={16} /> Voltar
        </Button>
        <Button onClick={() => window.print()}>
          <Printer size={16} /> Imprimir / Salvar em PDF
        </Button>
        <span className="text-[11px] font-bold text-slate-500">
          Folha em A4, com o mesmo layout do foglio oficial.
        </span>
      </div>

      <Card className="print-sheet">
        <div className="flex items-start justify-between gap-4 border-b border-slate-300 pb-3 dark:border-slate-600">
          <div>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">
              CILS B1 Cittadinanza — Foglio delle risposte
            </p>
            <p className="text-[11px] font-bold text-slate-500">
              Università per Stranieri di Siena · prova scritta · 48 punti
            </p>
          </div>
          <div className="w-48 shrink-0">
            <p className="text-[10px] font-black uppercase text-slate-500">Nome e cognome</p>
            <div className="mt-4 border-b border-slate-400 dark:border-slate-500" />
            <p className="mt-3 text-[10px] font-black uppercase text-slate-500">Data</p>
            <div className="mt-4 border-b border-slate-400 dark:border-slate-500" />
          </div>
        </div>

        <p className="mt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          Scrivi le risposte con penna blu o nera. Per le scelte multiple scrivi la lettera
          (A, B, C); per il vero/falso scrivi V (vero) o F (falso).
        </p>

        <SheetBlock
          title="Test di ascolto — Prova n. 1 (6 scelte multiple)"
          items={ascoltoP1}
          options={['A', 'B', 'C']}
        />
        <SheetBlock
          title="Test di ascolto — Prova n. 2 (12 vero/falso)"
          items={ascoltoP2}
          options={['V', 'F']}
        />
        <SheetBlock
          title="Test di lettura — Prova n. 1 (12 vero/falso)"
          items={letturaP1}
          options={['V', 'F']}
        />
        <SheetBlock
          title="Test di lettura — Prova n. 2 (6 scelte multiple)"
          items={letturaP2}
          options={['A', 'B', 'C']}
        />

        <div className="mt-4 border-t border-slate-300 pt-3 dark:border-slate-600">
          <p className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Produzione scritta — 80/120 parole
          </p>
          <div className="mt-2 h-64 rounded-lg border border-slate-300 dark:border-slate-600" />
        </div>

        <div className="mt-4 border-t border-slate-300 pt-3 dark:border-slate-600">
          <p className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Produzione orale — note del candidato
          </p>
          <div className="mt-2 h-32 rounded-lg border border-slate-300 dark:border-slate-600" />
        </div>

        <p className="mt-4 text-center text-[10px] font-bold text-slate-400">
          CILS B1 Prep — foglio di pratica (non ufficiale)
        </p>
      </Card>
    </div>
  )
}

function SheetBlock({
  title,
  items,
  options,
}: {
  title: string
  items: Question[]
  options: string[]
}) {
  return (
    <section className="mt-4 print-break">
      <p className="text-xs font-black uppercase tracking-wide text-slate-700 dark:text-slate-200">
        {title}
      </p>
      <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            <span className="w-6 shrink-0 tabular-nums font-black">{item.order}.</span>
            <span className="flex items-center gap-1.5">
              {options.map((option) => (
                <span key={option} className="flex items-center gap-1">
                  <span className="inline-block h-3.5 w-3.5 rounded-full border border-slate-400 dark:border-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500">{option}</span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
