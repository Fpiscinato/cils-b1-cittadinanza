import { useMemo } from 'react'
import type { Attempt, Session } from '../db/schemas'
import { BackButton, Card, ProgressBar, Stat } from '../components/ui'
import { ProgressChart } from '../components/ProgressChart'
import { buildSkillHistory } from '../services/sessions'
import { computeReadiness, skillPercent } from '../lib/readiness'
import { PASS_THRESHOLD_PER_SKILL, PASS_THRESHOLD_TOTAL, SKILL_LABELS, TOTAL_POINTS } from '../lib/scoring'
import { averageTrackedTime, formatDuration } from '../lib/timing'
import { buildScoreSeries, buildSkillSeries, summarizeSeries } from '../lib/chart'
import type { Route } from '../lib/routes'

export function ProgressPage({
  sessions,
  attempts,
  onNavigate,
}: {
  sessions: Session[]
  attempts: Attempt[]
  onNavigate: (route: Route) => void
}) {
  const history = useMemo(() => buildSkillHistory(sessions), [sessions])
  const readiness = useMemo(() => computeReadiness({ history }), [history])

  const completed = useMemo(
    () =>
      sessions
        .filter((session) => session.status === 'completed')
        .sort((a, b) => b.startedAt - a.startedAt),
    [sessions],
  )

  const accuracy = useMemo(() => {
    if (attempts.length === 0) return 0
    return Math.round((attempts.filter((attempt) => attempt.isCorrect).length / attempts.length) * 100)
  }, [attempts])

  const avgTime = averageTrackedTime(attempts.map((attempt) => attempt.timeSpentSeconds))

  const scoreSeries = useMemo(() => buildScoreSeries(sessions), [sessions])
  const scoreSummary = useMemo(() => summarizeSeries(scoreSeries), [scoreSeries])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton onBack={() => onNavigate('dashboard')} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Provas concluídas" value={String(completed.length)} />
        <Stat label="Precisão global" value={`${accuracy}%`} />
        <Stat label="Tempo médio por pergunta" value={formatDuration(avgTime)} />
      </div>

      {/* Gráfico da evolução do score total */}
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Evolução do score total
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            {scoreSummary.count > 0
              ? `Último ${scoreSummary.last}/${TOTAL_POINTS} · melhor ${scoreSummary.best}/${TOTAL_POINTS} · média ${scoreSummary.average}`
              : 'sem provas ainda'}
          </p>
        </div>

        <div className="mt-3">
          <ProgressChart
            points={scoreSeries}
            max={TOTAL_POINTS}
            threshold={PASS_THRESHOLD_TOTAL}
            thresholdLabel={`sufficienza total ${PASS_THRESHOLD_TOTAL}`}
          />
        </div>

        {scoreSummary.count > 1 ? (
          <p className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            {scoreSummary.delta > 0
              ? `📈 Subiste ${scoreSummary.delta} ponto(s) desde a primeira prova.`
              : scoreSummary.delta < 0
                ? `📉 Desces ${Math.abs(scoreSummary.delta)} ponto(s) desde a primeira prova.`
                : '➡️ Estás estável em relação à primeira prova.'}
          </p>
        ) : null}
      </Card>

      {/* Evolução por habilidade */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Evolução por habilidade
        </p>
        <div className="mt-3 flex flex-col gap-4">
          {readiness.skills.map((entry) => {
            const series = buildSkillSeries(sessions, entry.skill)
            return (
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
                <div className="mt-2">
                  <ProgressChart
                    points={series}
                    max={12}
                    threshold={PASS_THRESHOLD_PER_SKILL}
                    thresholdLabel={`sufficienza ${PASS_THRESHOLD_PER_SKILL}`}
                    height={130}
                    emptyText="Sem provas desta habilidade ainda."
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Histórico */}
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
