import { useState } from 'react'
import type { StudyDay } from '../lib/studyPlan'

type Kind = 'study' | 'practice' | 'exam'

const LEGEND: Record<Kind, { label: string; color: string; description: string }> = {
  study: {
    label: 'Estudo',
    color: 'bg-teal-600',
    description:
      'Estudo por nível (A1 → A2 → B1): exercícios de completar frases e vocabulário, ascolto e lettura feitos no cartão "Estudar". Não entra no veredito da prova — é treino.',
  },
  practice: {
    label: 'Prática',
    color: 'bg-sky-500',
    description:
      'Prática no formato da prova: uma prova de 18 perguntas de uma habilidade (ascolto ou lettura) e o mix rápido. Conta como treino cronometrado.',
  },
  exam: {
    label: 'Simulado',
    color: 'bg-amber-500',
    description:
      'Simulado completo (ascolto + lettura + scrittura, 48 pontos). É o único que conta para o veredito de prontidão e para a regra de capitalização.',
  },
}

/**
 * Gráfico de atividade dos últimos dias (barras empilhadas, div puro).
 *
 * Mostra de onde vem o esforço: estudo por nível, prática no formato do exame
 * e simulados completos. A legenda é clicável (e tem tooltip): cada cor diz
 * exactamente o que conta — a aluna não tem de adivinhar.
 */
export function StudyActivityChart({ days }: { days: StudyDay[] }) {
  const max = Math.max(1, ...days.map((day) => day.total))
  const [open, setOpen] = useState<Kind | null>(null)

  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {days.map((day) => {
          const height = (value: number): string => `${(value / max) * 100}%`
          return (
            <div
              key={day.dateKey}
              className="flex h-full flex-1 flex-col justify-end overflow-hidden rounded-t-md bg-slate-100 dark:bg-slate-700/40"
              title={`${day.label}: ${day.total} resposta(s) — estudo ${day.study}, prática ${day.practice}, simulado ${day.exam}`}
            >
              {day.total === 0 ? null : (
                <>
                  {day.exam > 0 ? (
                    <div className="w-full bg-amber-500" style={{ height: height(day.exam) }} />
                  ) : null}
                  {day.practice > 0 ? (
                    <div className="w-full bg-sky-500" style={{ height: height(day.practice) }} />
                  ) : null}
                  {day.study > 0 ? (
                    <div className="w-full bg-teal-600" style={{ height: height(day.study) }} />
                  ) : null}
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-400">
        <span>{days[0]?.label}</span>
        <span>{days[days.length - 1]?.label}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(LEGEND) as Kind[]).map((kind) => {
          const item = LEGEND[kind]
          const expanded = open === kind
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setOpen((value) => (value === kind ? null : kind))}
              onMouseEnter={() => setOpen(kind)}
              onMouseLeave={() => setOpen((value) => (value === kind ? null : value))}
              aria-expanded={expanded}
              title={item.description}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold transition ${
                expanded
                  ? 'bg-slate-200 text-slate-900 dark:bg-slate-600 dark:text-slate-100'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${item.color}`} /> {item.label}
            </button>
          )
        })}
      </div>

      {open ? (
        <p className="mt-1 rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] font-semibold leading-relaxed text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
          <strong className="font-black text-slate-800 dark:text-slate-100">
            {LEGEND[open].label}:
          </strong>{' '}
          {LEGEND[open].description}
        </p>
      ) : (
        <p className="mt-1 text-[10px] font-semibold text-slate-400">
          Toque (ou passe o mouse) numa cor para ver o que conta.
        </p>
      )}
    </div>
  )
}
