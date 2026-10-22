import { useMemo } from 'react'
import type { Session, Attempt, Profile } from '../db/schemas'
import { ReadinessCard } from '../components/ReadinessCard'
import { PhaseCards } from '../components/PhaseCards'
import { Card, Stat } from '../components/ui'
import { computeReadiness } from '../lib/readiness'
import { computeDailyTask, computeRoadmap } from '../lib/roadmapCalculator'
import { buildSkillHistory } from '../services/sessions'
import { formatDuration } from '../lib/timing'

export function DashboardPage({
  profile,
  sessions,
  attempts,
  onStart,
}: {
  profile: Profile | null
  sessions: Session[]
  attempts: Attempt[]
  onStart: (mode: 'mock_cittadinanza' | 'ascolto' | 'lettura' | 'scrittura' | 'orale') => void
}) {
  const history = useMemo(() => buildSkillHistory(sessions), [sessions])
  const readiness = useMemo(() => computeReadiness({ history }), [history])
  const roadmap = useMemo(
    () =>
      computeRoadmap({
        attempts: attempts.map((attempt) => ({
          skill: attempt.skill,
          isCorrect: attempt.isCorrect,
          questionId: attempt.questionId,
          timestamp: attempt.timestamp,
        })),
        sessions: sessions.map((session) => ({
          status: session.status,
          mode: session.mode,
          startedAt: session.startedAt,
        })),
        examDate: profile?.examDate ?? '',
      }),
    [attempts, sessions, profile],
  )
  const task = computeDailyTask(roadmap)

  const completed = sessions.filter((session) => session.status === 'completed')
  const best = completed.reduce(
    (top, session) => Math.max(top, session.score ?? 0),
    0,
  )

  return (
    <div className="flex flex-col gap-4">
      <ReadinessCard report={readiness} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Provas feitas" value={String(completed.length)} />
        <Stat label="Melhor resultado" value={best > 0 ? `${best}/48` : '—'} />
        <Stat label="Perguntas respondidas" value={String(attempts.length)} />
      </div>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Tarefa de hoje</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">{task.title}</p>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{task.detail}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onStart('mock_cittadinanza')}
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
          >
            ▶️ Simular exame completo
          </button>
          <button
            type="button"
            onClick={() => onStart('ascolto')}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
          >
            ⚡ Ascolto
          </button>
          <button
            type="button"
            onClick={() => onStart('lettura')}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
          >
            📖 Lettura
          </button>
          <button
            type="button"
            onClick={() => onStart('scrittura')}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
          >
            ✍️ Scrittura
          </button>
          <button
            type="button"
            onClick={() => onStart('orale')}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
          >
            🎤 Orale
          </button>
        </div>
      </Card>

      <PhaseCards
        phases={roadmap.phases}
        currentPhaseId={roadmap.currentPhaseId}
        examDate={profile?.examDate ?? ''}
      />

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Últimas provas</p>
        {completed.length === 0 ? (
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Ainda não há provas concluídas. Faz o simulado oficial de exemplo para teres a primeira
            leitura da tua pontuação.
          </p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1">
            {[...completed]
              .sort((a, b) => b.startedAt - a.startedAt)
              .slice(0, 5)
              .map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  <span className="truncate">{session.title || session.mode}</span>
                  <span className="tabular-nums text-slate-500">
                    {session.score ?? 0}/48 · {formatDuration(session.totalTimeSeconds)}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
