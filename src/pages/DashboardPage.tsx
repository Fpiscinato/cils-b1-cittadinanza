import { useMemo, useState } from 'react'
import type { Session, Attempt, Profile, Level } from '../db/schemas'
import { ReadinessCard } from '../components/ReadinessCard'
import { PhaseCards } from '../components/PhaseCards'
import { OnboardingChecklist } from '../components/OnboardingChecklist'
import { Bug } from 'lucide-react'
import { Card, CollapsibleCard, Stat } from '../components/ui'
import { computeReadiness } from '../lib/readiness'
import { computeRoadmap } from '../lib/roadmapCalculator'
import { buildSkillHistory } from '../services/sessions'
import { formatDuration } from '../lib/timing'
import { TOTAL_POINTS } from '../lib/scoring'
import { buildOnboardingSteps, pendingSteps } from '../lib/onboarding'
import { buildLevelProgress, buildTodayPlan, countOpenMistakes } from '../lib/studyPlan'
import { readStudyLevel } from '../lib/studyLevel'
import type { StudyRequest } from '../lib/study'
import type { Route } from '../lib/routes'

/**
 * Painel — a tela que responde a "o que faço hoje?".
 *
 * A ordem é intencional:
 * 1. **Tarefa de hoje** (o estudo + a revisão) — o botão principal começa a
 *    sessão directamente, sem passar por outra tela;
 * 2. **Provas e simulados** — o treino no formato do exame;
 * 3. **Primeiros passos** — recolhido, só para quem está a configurar;
 * 4. Prontidão, clínica de erros, fases e histórico.
 */
export function DashboardPage({
  profile,
  sessions,
  attempts,
  onStart,
  onStartStudy,
  onNavigate,
  hasBackup,
  hasSync,
}: {
  profile: Profile | null
  sessions: Session[]
  attempts: Attempt[]
  onStart: (mode: 'mock_cittadinanza' | 'ascolto' | 'lettura' | 'scrittura' | 'orale') => void
  onStartStudy: (request: StudyRequest) => void
  onNavigate: (route: Route) => void
  hasBackup: boolean
  hasSync: boolean
}) {
  const [level] = useState<Level>(() => readStudyLevel())

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

  // Só as provas contam para as estatísticas de exame; o estudo tem o seu
  // próprio percurso (nível, precisão e evolução no Progresso).
  const completedExams = sessions.filter(
    (session) => session.status === 'completed' && session.mode !== 'studio',
  )
  const best = completedExams.reduce((top, session) => Math.max(top, session.score ?? 0), 0)

  const levelProgress = useMemo(() => buildLevelProgress({ attempts }), [attempts])
  const plan = useMemo(
    () => buildTodayPlan({ attempts, sessions, level }),
    [attempts, sessions, level],
  )

  const onboarding = useMemo(
    () =>
      buildOnboardingSteps({
        examDate: profile?.examDate ?? '',
        completedSessions: completedExams.length,
        hasBackup,
        hasSync,
      }),
    [profile, completedExams.length, hasBackup, hasSync],
  )
  const pending = pendingSteps(onboarding)
  const wrongQuestions = useMemo(() => countOpenMistakes(attempts), [attempts])

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Tarefa de hoje — o primeiro cartão e o botão principal */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Hoje</p>
            <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
              {plan.items[0]?.title}
            </p>
            <p className="mt-0.5 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
              {plan.items[0]?.detail}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-black text-teal-900 dark:bg-teal-950/60 dark:text-teal-200">
            {plan.items[0]?.minutes} min
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onStartStudy({ level, kind: 'exercises' })}
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-black text-white hover:bg-teal-800"
          >
            ▶️ {plan.items[0]?.cta}
          </button>
          {plan.items.slice(1).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'mistakes') onNavigate('mistakes')
                else onStart('mock_cittadinanza')
              }}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
            >
              {item.cta}
            </button>
          ))}
        </div>

        <p className="mt-2 text-[11px] font-semibold text-slate-500">
          {`Nível ${level} · ${
            levelProgress[level].answered > 0
              ? `${levelProgress[level].accuracy}% de acerto em ${levelProgress[level].answered} respostas`
              : 'ainda sem respostas — comece pelo básico'
          }. O progresso do estudo aparece em Progresso.`}
        </p>
        {plan.recommendAdvance && plan.next ? (
          <p className="mt-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300">
            Já dominas o {level} — pode subir para {plan.next} na Prática.
          </p>
        ) : null}
      </Card>

      {/* 2. Provas e simulados */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Provas e simulados
        </p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
          O que quer começar?
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
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stat label="Provas feitas" value={String(completedExams.length)} />
          <Stat label="Melhor resultado" value={best > 0 ? `${best}/${TOTAL_POINTS}` : '—'} />
          <Stat label="Perguntas respondidas" value={String(attempts.length)} />
        </div>
      </Card>

      {/* 3. Primeiros passos — recolhido por omissão */}
      {pending.length > 0 ? (
        <OnboardingChecklist steps={onboarding} onNavigate={onNavigate} />
      ) : null}

      {/* 4. O veredito */}
      <ReadinessCard report={readiness} />

      {/* 5. Clínica de erros */}
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

      {/* 6. Fases (colapsável) */}
      <CollapsibleCard title="As 3 fases de preparação">
        <PhaseCards
          phases={roadmap.phases}
          currentPhaseId={roadmap.currentPhaseId}
          examDate={profile?.examDate ?? ''}
        />
      </CollapsibleCard>

      {/* 7. Histórico (colapsável) */}
      <CollapsibleCard title="Últimas provas">
        {completedExams.length === 0 ? (
          <p className="text-xs font-semibold text-slate-500">
            Ainda não há provas concluídas. Faça o simulado oficial de exemplo para teres a primeira
            leitura da sua pontuação.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {[...completedExams]
              .sort((a, b) => b.startedAt - a.startedAt)
              .slice(0, 5)
              .map((session) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  <span className="truncate">{session.title || session.mode}</span>
                  <span className="tabular-nums text-slate-500">
                    {session.score ?? 0}/{TOTAL_POINTS} · {formatDuration(session.totalTimeSeconds)}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </CollapsibleCard>
    </div>
  )
}
