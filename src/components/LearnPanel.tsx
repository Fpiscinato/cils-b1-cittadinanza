import { useEffect, useMemo, useState } from 'react'
import { BookOpenCheck, ChevronRight, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { db } from '../db/database'
import type { Level, VocabItem } from '../db/schemas'
import { LEVEL_LABELS } from '../lib/studyPlan'
import { shuffle } from '../data/studyBank'
import { PronounceButton } from './exam/PronounceButton'

/**
 * APRENDER — cartões de vocabulário do nível.
 *
 * A aluna vê a palavra/frase em italiano, pode ouvir a pronúncia, tenta
 * lembrar-se do significado e só depois mostra o português (e a frase de
 * exemplo traduzida). É aprendizagem, não prova: não grava sessão nem entra
 * no veredito de prontidão.
 */
export function LearnPanel({ level }: { level: Level }) {
  const [items, setItems] = useState<VocabItem[] | null>(null)
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [round, setRound] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const rows = await db.vocabItems.where('level').equals(level).toArray()
      if (cancelled) return
      setItems(shuffle(rows))
      setIndex(0)
      setRevealed(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [level])

  const item = useMemo(() => items?.[index] ?? null, [items, index])
  const total = items?.length ?? 0

  if (items === null) {
    return <p className="text-xs font-bold text-slate-500">Carregando as palavras…</p>
  }

  if (total === 0 || !item) {
    return (
      <p className="text-xs font-semibold text-slate-500">
        Ainda não há palavras para o nível {level}. Escolha outro nível.
      </p>
    )
  }

  function next(): void {
    setRevealed(false)
    if (index + 1 < total) {
      setIndex(index + 1)
      return
    }
    // Fim da volta: baralha outra vez, para não decorar a ordem.
    setItems((current) => (current ? shuffle(current) : current))
    setRound((value) => value + 1)
    setIndex(0)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-500">
          <BookOpenCheck size={14} /> Aprender · {LEVEL_LABELS[level]}
        </p>
        <span className="text-[11px] font-bold tabular-nums text-slate-500">
          {index + 1} de {total}
          {round > 0 ? ` · volta ${round + 1}` : ''}
        </span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 text-lg font-black leading-snug text-slate-900 dark:text-slate-100">
            {item.it}
          </p>
          <PronounceButton text={item.it} label="Ouvir a palavra em italiano" />
        </div>

        {revealed ? (
          <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">{item.pt}</p>
            <p className="mt-1 flex items-start gap-1.5 text-[11px] font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
              <span>{item.example}</span>
              <PronounceButton text={item.example} label="Ouvir a frase de exemplo" size={13} />
            </p>
            <p className="text-[11px] font-semibold italic leading-relaxed text-slate-500">
              {item.examplePt}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-[11px] font-semibold text-slate-500">
            Tente lembrar o significado antes de ver a tradução.
          </p>
        )}

        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          {revealed ? 'Esconder o português' : 'Ver o significado em português'}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={next}
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-teal-700 px-3 py-2.5 text-xs font-black text-white hover:bg-teal-800"
        >
          Próxima palavra <ChevronRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => {
            setItems((current) => (current ? shuffle(current) : current))
            setIndex(0)
            setRevealed(false)
          }}
          aria-label="Baralhar as palavras outra vez"
          title="Baralhar as palavras outra vez"
          className="rounded-xl border border-slate-200 px-3 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  )
}
