import type { StudyDay } from '../lib/studyPlan'

/**
 * Gráfico de atividade dos últimos dias (barras empilhadas, SVG/div puro).
 *
 * Mostra de onde vem o esforço: estudo por nível, prática no formato do exame
 * e simulados completos. É a "evolução do estudo" que faltava ao Progresso.
 */
export function StudyActivityChart({ days }: { days: StudyDay[] }) {
  const max = Math.max(1, ...days.map((day) => day.total))

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

      <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-teal-600" /> Estudo
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-sky-500" /> Prática
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Simulado
        </span>
      </div>
    </div>
  )
}
