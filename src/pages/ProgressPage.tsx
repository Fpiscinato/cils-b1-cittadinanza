import { useEffect, useMemo, useState } from 'react'
import { BookOpen } from 'lucide-react'
import type { Attempt, Level, Session } from '../db/schemas'
import { BackButton, Card, CollapsibleCard, ProgressBar, Stat } from '../components/ui'
import { ProgressChart } from '../components/ProgressChart'
import { StudyActivityChart } from '../components/StudyActivityChart'
import { db } from '../db/database'
import { buildSkillHistory } from '../services/sessions'
import { computeReadiness, skillPercent } from '../lib/readiness'
import { PASS_THRESHOLD_PER_SKILL, PASS_THRESHOLD_TOTAL, SKILL_LABELS, TOTAL_POINTS } from '../lib/scoring'
import { averageTrackedTime, formatDuration } from '../lib/timing'
import { buildScoreSeries, buildSkillSeries, summarizeSeries } from '../lib/chart'
import {
  LEVEL_FOCUS,
  LEVEL_LABELS,
  MASTERY_ACCURACY,
  MIN_ANSWERS_FOR_MASTERY,
  buildLevelProgress,
  buildStudyActivity,
  studyStreak,
} from '../lib/studyPlan'
import { LEVELS } from '../db/schemas'
import type { Route } from '../lib/routes'

export function ProgressPage({
  sessions,
  attempts,
  onNavigate,
  onReview,
}: {
  sessions: Session[]
  attempts: Attempt[]
  onNavigate: (route: Route) => void
  /** Abre o relatório da prova (rever e enviar à professora). */
  onReview: (sessionId: string) => void
}) {
  const [levelByQuestionId, setLevelByQuestionId] = useState<Record<string, Level>>({})

  // O nível de cada pergunta vem do banco de conteúdo (as tentativas não o
  // guardam). Carregar ~800 pares id→nível é barato e fica 100% offline.
  useEffect(() => {
    let cancelled = false
    async function load() {
      const questions = await db.questions.toArray()
      if (cancelled) return
      const map: Record<string, Level> = {}
      for (const question of questions) {
        if (question.level) map[question.id] = question.level
      }
      setLevelByQuestionId(map)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const history = useMemo(() => buildSkillHistory(sessions), [sessions])
  const readiness = useMemo(() => computeReadiness({ history }), [history])

  const completedExams = useMemo(
    () =>
      sessions
        .filter((session) => session.status === 'completed' && session.mode !== 'studio')
        .sort((a, b) => b.startedAt - a.startedAt),
    [sessions],
  )

  const studySessions = useMemo(
    () =>
      sessions
        .filter((session) => session.status === 'completed' && session.mode === 'studio')
        .sort((a, b) => b.startedAt - a.startedAt),
    [sessions],
  )

  const modeBySession = useMemo(
    () => new Map(sessions.map((session) => [session.id, session.mode])),
    [sessions],
  )

  const studyAttempts = useMemo(
    () => attempts.filter((attempt) => modeBySession.get(attempt.sessionId) === 'studio'),
    [attempts, modeBySession],
  )

  const studyAccuracy = useMemo(() => {
    if (studyAttempts.length === 0) return 0
    return Math.round(
      (studyAttempts.filter((attempt) => attempt.isCorrect).length / studyAttempts.length) * 100,
    )
  }, [studyAttempts])

  const levelProgress = useMemo(
    () => buildLevelProgress({ attempts, levelByQuestionId }),
    [attempts, levelByQuestionId],
  )

  const activity = useMemo(() => buildStudyActivity(attempts, sessions), [attempts, sessions])
  const activityTotal = activity.reduce((sum, day) => sum + day.total, 0)
  const activityStudy = activity.reduce((sum, day) => sum + day.study, 0)
  const streak = studyStreak(activity)

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

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Progresso</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
          Como estás a evoluir?
        </p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Em cima vês o estudo (exercícios, escuta e leitura). Mais abaixo ficam as notas das
          provas e simulados, que dizem se passarias hoje.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Sessões de estudo" value={String(studySessions.length)} />
        <Stat label="Exercícios respondidos" value={String(studyAttempts.length)} />
        <Stat label="Precisão nos exercícios" value={`${studyAccuracy}%`} />
        <Stat
          label="Dias seguidos"
          value={String(streak)}
          hint={streak > 0 ? 'com atividade' : 'começa hoje'}
        />
      </div>

      {/* Evolução do estudo (exercícios, escuta e leitura por nível) */}
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Evolução do estudo · últimos 14 dias
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            {activityTotal} resposta(s) · {activityStudy} de estudo
          </p>
        </div>
        <div className="mt-3">
          <StudyActivityChart days={activity} />
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Percurso por nível
        </p>
        <p className="mt-1 text-[11px] font-semibold text-slate-500">
          Um nível fica dominado com {MIN_ANSWERS_FOR_MASTERY} respostas e {MASTERY_ACCURACY}% de
          acerto. A barra junta o volume e a precisão.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {LEVELS.map((level) => {
            const entry = levelProgress[level]
            return (
              <div key={level}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    {LEVEL_LABELS[level]}
                    {entry.mastered ? (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                        dominado
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs font-black tabular-nums text-slate-600 dark:text-slate-300">
                    {entry.answered > 0
                      ? `${entry.accuracy}% · ${entry.answered} resposta(s)`
                      : 'sem dados'}
                  </span>
                </div>
                <ProgressBar percent={entry.percent} tone={entry.mastered ? 'emerald' : 'teal'} />
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{LEVEL_FOCUS[level]}</p>
              </div>
            )
          })}
        </div>
      </Card>

      <CollapsibleCard title="Últimos estudos" icon={<BookOpen size={16} />}>
        {studySessions.length === 0 ? (
          <p className="text-xs font-semibold text-slate-500">
            Ainda não há sessões de estudo. Usa o botão "Estudar" na Prática.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {studySessions.slice(0, 8).map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                <span className="truncate">{session.title || 'Estudo'}</span>
                <span className="shrink-0 tabular-nums text-slate-500">
                  {new Date(session.startedAt).toLocaleDateString('pt-PT')} ·{' '}
                  {formatDuration(session.totalTimeSeconds)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CollapsibleCard>

      {/* Provas e simulados */}
      <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">
        Provas e simulados
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Provas concluídas" value={String(completedExams.length)} />
        <Stat label="Precisão global" value={`${accuracy}%`} />
        <Stat label="Tempo médio por pergunta" value={formatDuration(avgTime)} />
      </div>

      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Evolução das provas · score total
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

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Histórico de provas</p>
        {completedExams.length === 0 ? (
          <p className="mt-2 text-xs font-semibold text-slate-500">Ainda não há provas concluídas.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {completedExams.map((session) => (
              <li key={session.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-black text-slate-900 dark:text-slate-100">
                    {session.title || session.mode}
                  </span>
                  <span className="text-sm font-black tabular-nums text-slate-700 dark:text-slate-200">
                    {session.score ?? 0}/{TOTAL_POINTS}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-500">
                  {new Date(session.startedAt).toLocaleDateString('pt-PT')} ·{' '}
                  {formatDuration(session.totalTimeSeconds)}
                </p>
                <button
                  type="button"
                  onClick={() => onReview(session.id)}
                  className="mt-2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-black text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                >
                  Rever e exportar
                </button>
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
