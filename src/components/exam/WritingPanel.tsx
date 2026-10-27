import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '../ui'
import { WRITING_RUBRIC } from '../../lib/scoring'
import { checkWordCount } from '../../lib/wordCount'

export interface WritingPrompt {
  id: string
  text: string
}

/**
 * Checklist de consegna (5 critérios) — o que se revê ANTES de entregar.
 * É o equivalente a rever o texto na prova: escrever, contar, reler.
 */
const DELIVERY_CHECKLIST: Array<{ id: string; label: string }> = [
  { id: 'tema', label: 'Escolhi um tema e respondi a tudo o que ele pedia' },
  { id: 'paragrafi', label: 'Dividi o texto em parágrafos (introdução,_argumento, fecho)' },
  { id: 'palavras', label: 'A contagem está entre 80 e 120 palavras' },
  { id: 'releitura', label: 'Reli o texto e corrigi os erros mais comuns' },
  { id: 'final', label: 'Acabei com uma frase de fecho (saudações / pergunta final)' },
]

/**
 * Painel da prova de escrita.
 *
 * A aluna escolhe 1 dos 2 temas (como no foglio oficial), escreve 80-120
 * palavras e autoavalia com a GRIGLIA OFICIAL de 5 critérios. A pontuação
 * sai da rubrica — nunca de um número escrito à mão.
 */
export function WritingPanel({
  prompts,
  onSubmit,
}: {
  prompts: WritingPrompt[]
  onSubmit: (promptId: string, text: string, rubric: Record<string, number>) => void
}) {
  const [promptId, setPromptId] = useState(prompts[0]?.id ?? '')
  const [text, setText] = useState('')
  const [rubric, setRubric] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const count = useMemo(() => checkWordCount(text, 80, 120), [text])
  const rubricComplete = WRITING_RUBRIC.every((criterion) => rubric[criterion.key] !== undefined)
  const checklistComplete = DELIVERY_CHECKLIST.every((item) => checked[item.id])

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950/40">
        <p className="text-base font-black text-slate-900 dark:text-slate-100">
          Texto entregue ✅ — {count.words} palavras
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
          Na prova oficial a sua produção é corrigida com esta mesma grilha. Releia o texto e pensa no
          que pode melhorar: verbos no presente, pontuação e uma frase final de despedida.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Escolha 1 tema (como no foglio oficial)
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {prompts.map((prompt, index) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => setPromptId(prompt.id)}
              className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${
                promptId === prompt.id
                  ? 'border-teal-600 bg-teal-50 text-teal-950 dark:bg-teal-950/50 dark:text-teal-100'
                  : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              <span className="font-black">Tema {index + 1}.</span> {prompt.text}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="writing-text" className="text-xs font-black uppercase tracking-wide text-slate-500">
            A sua produção
          </label>
          <span
            className={`text-xs font-black ${count.inRange ? 'text-emerald-700' : 'text-amber-600'}`}
          >
            {count.words} / 80-120 palavras
          </span>
        </div>
        <textarea
          id="writing-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          placeholder="Scrivi in italiano…"
          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        {!count.inRange && count.words > 0 ? (
          <p className="mt-1 text-xs font-bold text-amber-700 dark:text-amber-300">
            {count.words < count.min
              ? `Faltam ${count.delta} palavras (mínimo 80).`
              : `Excedeste em ${count.delta} palavras (máximo 120).`}
          </p>
        ) : null}
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Auto-avaliação com a grelha oficial (12 pontos)
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {WRITING_RUBRIC.map((criterion) => (
            <div
              key={criterion.key}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-700/50"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {criterion.labelPt}{' '}
                <span className="font-black text-slate-500">({criterion.label})</span>
              </span>
              <span className="flex items-center gap-1">
                {Array.from({ length: criterion.max + 1 }, (_, value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRubric((current) => ({ ...current, [criterion.key]: value }))}
                    className={`h-8 w-8 rounded-lg text-xs font-black ${
                      rubric[criterion.key] === value
                        ? 'bg-teal-700 text-white'
                        : 'bg-white text-slate-600 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Checklist de consegna (antes de entregar)
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {DELIVERY_CHECKLIST.map((item) => {
            const isChecked = checked[item.id] === true
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    setChecked((current) => ({ ...current, [item.id]: !current[item.id] }))
                  }
                  aria-pressed={isChecked}
                  className="flex w-full items-start gap-2 rounded-xl bg-slate-50 p-2 text-left transition hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      isChecked
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isChecked ? <Check size={12} strokeWidth={3} /> : null}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {item.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        {!checklistComplete ? (
          <p className="mt-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
            Reveja a lista antes de entregar — é o que a examinadora vai ver.
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">
          {rubricComplete
            ? `Auto-avaliação: ${
                WRITING_RUBRIC.reduce((sum, criterion) => sum + (rubric[criterion.key] ?? 0), 0)
              }/12 pontos`
            : 'Avalia todos os critérios para entregar.'}
        </span>
        <Button
          disabled={!promptId || text.trim().length === 0 || !rubricComplete}
          onClick={() => {
            onSubmit(promptId, text, rubric)
            setSubmitted(true)
          }}
        >
          {checklistComplete ? 'Entregar a produção' : 'Entregar mesmo assim'}
        </Button>
      </div>
    </div>
  )
}
