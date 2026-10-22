import { useMemo } from 'react'
import type { Session, Attempt, Profile } from '../db/schemas'
import { ReadinessCard } from '../components/ReadinessCard'
import { PhaseCards } from '../components/PhaseCards'
import { OnboardingChecklist } from '../components/OnboardingChecklist'
import { Bug } from 'lucide-react'
import { Card, CollapsibleCard, Stat } from '../components/ui'
import { computeReadiness } from '../lib/readiness'
import { computeDailyTask, computeRoadmap } from '../lib/roadmapCalculator'
import { buildSkillHistory } from '../services/sessions'
import { formatDuration } from '../lib/timing'
import { buildOnboardingSteps, pendingSteps } from '../lib/onboarding'
import type { Route } from '../lib/routes'

/**
 * Painel — o ecrã que responde a "se eu fizesse a prova amanhã, passaria?".
 *
 * A ordem é intencional e simples:
 * 1. Primeiros passos (só enquanto houver coisas por fazer);
 * 2. Começar agora (o botão principal está no PRIMEIRO card);
 * 3. Tarefa de hoje;
 * 4. Prontidão (o veredito);
 * 5. Fases e histórico — em cards colapsáveis, para o painel não virar um
 *    muro de informação.
 */
export function DashboardPage({
  profile,
  sessions,
  attempts,
  onStart,
  onNavigate,
  hasBackup,
  hasSync,
}: {
  profile: Profile | null
  sessions: Session[]
  attempts: Attempt[]
  onStart: (mode: 'mock_cittadinanza' | 'ascolto' | 'lettura' | 'scrittura' | 'orale') => void
  onNavigate: (route: Route) => void
  hasBackup: boolean
  hasSync: boolean
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
  const best = completed.reduce((top, session) => Math.max(top, session.score ?? 0), 0)

  const onboarding = useMemo(
    () =>
      buildOnboardingSteps({
        examDate: profile?.examDate ?? '',
        completedSessions: completed.length,
        hasBackup,
        hasSync,
      }),
    [profile, completed.length, hasBackup, hasSync],
  )
  const pending = pendingSteps(onboarding)

  // Erros por rever (última tentativa errada, por pergunta).
  const wrongQuestions = useMemo(() => {
    const lastByQuestion = new Map<string, Attempt>()
    for (const attempt of attempts) {
      const current = lastByQuestion.get(attempt.questionId)
      if (!current || attempt.timestamp >= current.timestamp) {
        lastByQuestion.set(attempt.questionId, attempt)
      }
    }
    return [...lastByQuestion.values()].filter((attempt) => !attempt.isCorrect).length
  }, [attempts])

  return (
    <div className="flex flex-col gap-4">
      {pending.length > 0 ? (
        <OnboardingChecklist steps={onboarding} onNavigate={onNavigate} />
      ) : null}

      {/* 1. Action-first: começar está no primeiro card */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Começar</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
          O que queres treinar agora?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onStart('mock_cittadinanza')}
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-black text-white hover:bg-teal-800"
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
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Stat label="Provas feitas" value={String(completed.length)} />
          <Stat label="Melhor resultado" value={best > 0 ? `${best}/48` : '—'} />
          <Stat label="Perguntas respondidas" value={String(attempts.length)} />
        </div>
      </Card>

      {/* 2. Tarefa de hoje */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Tarefa de hoje</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">{task.title}</p>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{task.detail}</p>
      </Card>

      {/* 3. O veredito */}
      <ReadinessCard report={readiness} />

      {/* 3-bis. Clínica de erros */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bug size={18} className="text-rose-600 dark:text-rose-300" />
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                Clínica de erros
              </p>
              <p className="text-[11px] font-semibold text-slate-500">
                {wrongQuestions > 0
                  ? `${wrongQuestions} pergunta(s) por rever`
                  : 'Sem erros por rever — bom sinal!'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('mistakes')}
            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
          >
            Rever e treinar
          </button>
        </div>
      </Card>

      {/* 4. Fases (colapsável) */}
      <CollapsibleCard title="As 3 fases de preparação">
        <PhaseCards
          phases={roadmap.phases}
          currentPhaseId={roadmap.currentPhaseId}
          examDate={profile?.examDate ?? ''}
        />
      </CollapsibleCard>

      {/* 5. Histórico (colapsável) */}
      <CollapsibleCard title="Últimas provas">
        {completed.length === 0 ? (
          <p className="text-xs font-semibold text-slate-500">
            Ainda não há provas concluídas. Faz o simulado oficial de exemplo para teres a primeira
            leitura da tua pontuação.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
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
      </CollapsibleCard>
    </div>
  )
}
