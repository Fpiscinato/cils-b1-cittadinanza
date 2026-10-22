import type { PhaseProgress } from '../lib/roadmapCalculator'
import { Card, ProgressBar } from './ui'

export function PhaseCards({
  phases,
  currentPhaseId,
  examDate,
}: {
  phases: PhaseProgress[]
  currentPhaseId: string
  examDate: string
}) {
  return (
    <section>
      <h2 className="mb-1 text-lg font-black text-slate-900 dark:text-slate-100">
        As 3 fases de preparação
      </h2>
      {examDate ? (
        <p className="mb-3 text-xs font-bold text-slate-500">
          Prova marcada para {examDate}. As fases são calculadas a partir dessa data.
        </p>
      ) : (
        <p className="mb-3 text-xs font-bold text-slate-500">
          Marca a data da prova nos Ajustes para as fases se ajustarem ao teu prazo.
        </p>
      )}
      <div className="grid gap-3 lg:grid-cols-3">
        {phases.map((phase) => {
          const current = phase.id === currentPhaseId
          return (
            <Card
              key={phase.id}
              className={current ? 'border-2 border-teal-500 bg-teal-50 dark:bg-teal-950/30' : ''}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">{phase.title}</p>
                  <p className="text-[11px] font-bold text-slate-500">{phase.window}</p>
                </div>
                {current ? (
                  <span className="rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                    Agora
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {phase.headline}
              </p>
              <div className="mt-3">
                <ProgressBar percent={phase.percent} tone={current ? 'teal' : 'emerald'} />
              </div>
              <p className="mt-1 text-xs font-black text-teal-700 dark:text-teal-300">
                {phase.percent}% completo
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {phase.goals.map((goal) => (
                  <li
                    key={goal.label}
                    className="flex items-center justify-between gap-2 text-[11px] font-bold"
                  >
                    <span className={goal.met ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}>
                      {goal.met ? '✓' : '○'} {goal.label}
                    </span>
                    <span className="tabular-nums text-slate-500">
                      {goal.unit === 'percent'
                        ? `${goal.achieved}% / ${goal.target}%`
                        : `${goal.achieved} / ${goal.target}`}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
