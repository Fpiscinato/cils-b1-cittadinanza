import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Bug, RefreshCw } from 'lucide-react'
import { db } from '../db/database'
import { ExamSession } from '../components/exam/ExamSession'
import { Card, CollapsibleCard, Stat } from '../components/ui'
import type { Attempt, Question } from '../db/schemas'
import type { Route } from '../lib/routes'
import type { SessionKind } from '../lib/sessionSummary'
import { SKILL_LABELS } from '../lib/scoring'
import { formatDuration } from '../lib/timing'

/**
 * CLÍNICA DE ERROS — o banco de erros da aluna.
 *
 * As tentativas erradas ficam salvas no histórico; aqui juntam-se por
 * pergunta (a última tentativa conta) e mostram a resposta certa com a
 * explicação. A aluna pode depois treinar SÓ esses erros.
 */

interface Mistake {
  question: Question
  attempt: Attempt
  times: number
}

export function MistakesPage({
  profileId,
  onNavigate,
  onCompleted,
  onSessionChange,
}: {
  profileId: string
  onNavigate: (route: Route) => void
  onCompleted: () => void
  /** Avisa o App do tipo de treino a correr (para a barra "Continuar" com a cor certa). */
  onSessionChange?: (kind: SessionKind | null) => void
}) {
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [loading, setLoading] = useState(true)
  const [training, setTraining] = useState(false)
  const [finished, setFinished] = useState(false)

  const inSession = training && mistakes.length > 0 && !finished
  useEffect(() => {
    onSessionChange?.(inSession ? 'practice' : null)
  }, [inSession, onSessionChange])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const attempts = await db.attempts.where('profileId').equals(profileId).toArray()
      const lastByQuestion = new Map<string, Attempt>()
      const timesByQuestion = new Map<string, number>()
      for (const attempt of attempts) {
        const current = lastByQuestion.get(attempt.questionId)
        if (!current || attempt.timestamp >= current.timestamp) {
          lastByQuestion.set(attempt.questionId, attempt)
        }
        if (!attempt.isCorrect) {
          timesByQuestion.set(attempt.questionId, (timesByQuestion.get(attempt.questionId) ?? 0) + 1)
        }
      }

      const wrong = [...lastByQuestion.values()].filter((attempt) => !attempt.isCorrect)
      const questions = (
        await Promise.all(wrong.map((attempt) => db.questions.get(attempt.questionId)))
      ).filter((question): question is Question => question !== undefined)

      const list: Mistake[] = questions
        .map((question) => {
          const attempt = lastByQuestion.get(question.id)
          if (!attempt) return null
          return { question, attempt, times: timesByQuestion.get(question.id) ?? 1 }
        })
        .filter((item): item is Mistake => item !== null)
        .sort((a, b) => b.attempt.timestamp - a.attempt.timestamp)

      if (cancelled) return
      setMistakes(list)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [profileId])

  const bySkill = useMemo(() => {
    const map: Record<string, number> = {}
    for (const mistake of mistakes) {
      map[mistake.question.skill] = (map[mistake.question.skill] ?? 0) + 1
    }
    return map
  }, [mistakes])

  if (training && mistakes.length > 0) {
    return (
      <ExamSession
        mode="studio"
        profileId={profileId}
        title="Treino de erros"
        buildOptions={{
          bank: 'all',
          questionIds: mistakes.map((mistake) => mistake.question.id),
          shuffle: true,
        }}
        onSaved={() => {
          setFinished(true)
          onCompleted()
        }}
        onExit={() => {
          setTraining(false)
          setFinished(false)
          onCompleted()
        }}
        onCompleted={() => {
          setTraining(false)
          onNavigate('dashboard')
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <ArrowLeft size={14} /> Voltar ao painel
        </button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Bug size={20} className="text-rose-600 dark:text-rose-300" />
          <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">Clínica de erros</h1>
        </div>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          As perguntas que erraste (com a última tentativa). Reveja a resposta certa e a explicação, e
          depois treine só esses erros.
        </p>
      </Card>

      {loading ? (
        <p className="text-sm font-bold text-slate-500">Carregando…</p>
      ) : mistakes.length === 0 ? (
        <Card>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Ainda não há erros registrados. Faça uma prática ou um simulado e os erros aparecem aqui.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Erros por rever" value={String(mistakes.length)} />
            <Stat
              label="Ascolto"
              value={String(bySkill.ascolto ?? 0)}
              hint={SKILL_LABELS.ascolto.pt}
            />
            <Stat
              label="Lettura"
              value={String(bySkill.lettura ?? 0)}
              hint={SKILL_LABELS.lettura.pt}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setFinished(false)
              setTraining(true)
            }}
            className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
          >
            <RefreshCw size={16} className="mr-1 inline" /> Treinar estes {mistakes.length} erros
          </button>

          <CollapsibleCard title="Ver todos os erros" badge={<span className="text-[11px] font-black">{mistakes.length}</span>}>
            <ul className="flex flex-col gap-2">
              {mistakes.map((mistake) => (
                <li
                  key={mistake.question.id}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    {SKILL_LABELS[mistake.question.skill].it} · {mistake.question.taskId} · errada{' '}
                    {mistake.times}×
                  </p>
                  <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-slate-100">
                    {mistake.question.stem}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {mistake.question.options.map((option, index) => {
                      const isCorrect = index === mistake.question.correctIndex
                      const isGiven = mistake.attempt.selectedIndex === index
                      return (
                        <li
                          key={`${mistake.question.id}-${index}`}
                          className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                            isCorrect
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                              : isGiven
                                ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
                                : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {isCorrect ? '✔ ' : isGiven ? '✘ ' : '· '}
                          {option}
                          {isGiven ? ' (a sua resposta)' : ''}
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                    {mistake.question.explanation}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">
                    respondida em {formatDuration(mistake.attempt.timeSpentSeconds)}
                  </p>
                </li>
              ))}
            </ul>
          </CollapsibleCard>
        </>
      )}
    </div>
  )
}
