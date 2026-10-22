import { useMemo } from 'react'
import type { Attempt, Session } from '../db/schemas'
import { Card, ProgressBar, Stat } from '../components/ui'
import { buildSkillHistory } from '../services/sessions'
import { computeReadiness, skillPercent } from '../lib/readiness'
import { SKILL_LABELS } from '../lib/scoring'
import { averageTrackedTime, formatDuration } from '../lib/timing'

export function ProgressPage({
  sessions,
  attempts,
}: {
  sessions: Session[]
  attempts: Attempt[]
}) {
  const history = useMemo(() => buildSkillHistory(sessions), [sessions])
  const readiness = useMemo(() => computeReadiness({ history }), [history])

  const completed = sessions
    .filter((session) => session.status === 'completed')
    .sort((a, b) => b.startedAt - a.startedAt)

  const accuracy = useMemo(() => {
    if (attempts.length === 0) return 0
    return Math.round((attempts.filter((attempt) => attempt.isCorrect).length / attempts.length) * 100)
  }, [attempts])

  const avgTime = averageTrackedTime(attempts.map((attempt) => attempt.timeSpentSeconds))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Provas concluídas" value={String(completed.length)} />
        <Stat label="Precisão global" value={`${accuracy}%`} />
        <Stat label="Tempo médio por pergunta" value={formatDuration(avgTime)} />
      </div>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Evolução por habilidade
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {readiness.skills.map((entry) => (
            <div key={entry.skill}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {SKILL_LABELS[entry.skill].it}
                </span>
                <span className="text-xs font-black tabular-nums text-slate-600 dark:text-slate-300">
                  {entry.samples > 0 ? `${entry.average}/12` : 'sem dados'}
                </span>
              </div>
              <ProgressBar
                percent={skillPercent(entry.average)}
                tone={entry.passed ? 'emerald' : 'rose'}
              />
              <div className="mt-1 flex gap-1">
                {history[entry.skill].slice(-8).map((sample, index) => (
                  <span
                    key={`${entry.skill}-${sample.at}-${index}`}
                    title={`${sample.score}/12`}
                    className={`h-2 flex-1 rounded-full ${
                      sample.score >= 7 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Histórico de provas</p>
        {completed.length === 0 ? (
          <p className="mt-2 text-xs font-semibold text-slate-500">Ainda não há provas concluídas.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {completed.map((session) => (
              <li
                key={session.id}
                className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-black text-slate-900 dark:text-slate-100">
                    {session.title || session.mode}
                  </span>
                  <span className="text-sm font-black tabular-nums text-slate-700 dark:text-slate-200">
                    {session.score ?? 0}/48
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-500">
                  {new Date(session.startedAt).toLocaleDateString('pt-PT')} ·{' '}
                  {formatDuration(session.totalTimeSeconds)}
                </p>
                {session.perSkill ? (
                  <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {Object.entries(session.perSkill)
                      .map(
                        ([skill, score]) =>
                          `${SKILL_LABELS[skill as keyof typeof SKILL_LABELS]?.pt ?? skill}: ${score}/12`,
                      )
                      .join(' · ')}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
