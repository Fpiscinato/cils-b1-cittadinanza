import { useState } from 'react'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'
import type { OnboardingStep } from '../lib/onboarding'
import type { Route } from '../lib/routes'
import { Card } from './ui'

/**
 * "Primeiros passos" — a sequência simples para quem abre a app pela 1ª vez.
 *
 * Fica no topo do painel, mas só mostra o que FALTA fazer (no máximo 3
 * passos de relance) — o painel não pode virar um muro de informação.
 */
export function OnboardingChecklist({
  steps,
  onNavigate,
}: {
  steps: OnboardingStep[]
  onNavigate: (route: Route) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const done = steps.filter((step) => step.done).length
  const pending = steps.filter((step) => !step.done)
  const visible = expanded ? steps : pending.slice(0, 3)

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Primeiros passos</p>
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
            {done}/{steps.length} concluídos
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-teal-700 px-2.5 py-1 text-[11px] font-black text-white">
          {pending.length === 0 ? 'Tudo pronto' : `${pending.length} por fazer`}
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {visible.map((step) => (
          <li
            key={step.id}
            className={`rounded-xl border p-2.5 ${
              step.done
                ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  step.done
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 dark:border-slate-600'
                }`}
              >
                {step.done ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] font-black ${
                    step.done
                      ? 'text-emerald-800 line-through dark:text-emerald-300'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {step.title}
                </p>
                {!step.done ? (
                  <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.detail}
                  </p>
                ) : null}
              </div>
              {!step.done ? (
                <button
                  type="button"
                  onClick={() => onNavigate(step.route)}
                  className="flex shrink-0 items-center gap-0.5 rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] font-black text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                >
                  {step.cta}
                  <ChevronRight size={12} />
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {steps.length > 3 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <ChevronDown
            size={12}
            className={expanded ? 'rotate-180 transition' : 'transition'}
          />
          {expanded ? 'Mostrar menos' : `Ver os ${steps.length} passos`}
        </button>
      ) : null}
    </Card>
  )
}
