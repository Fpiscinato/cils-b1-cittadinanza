import { useEffect, useState } from 'react'
import { Button, Card } from '../ui'
import { ExamRunner, type Stage } from './ExamRunner'
import { buildExam } from '../../lib/examBuilder'
import { EXAM_CONFIGS } from '../../lib/exam'
import type { ExamMode, Passage, Question } from '../../db/schemas'
import {
  abandonSession,
  completeSession,
  saveAttempt,
  startSession,
} from '../../services/sessions'
import { evaluateExam, SKILL_LABELS } from '../../lib/scoring'

/**
 * Uma sessão de prova: cria o registo, corre o runner e grava o resultado.
 *
 * Quando a prova termina, a sessão passa a `completed` e fica IMUTÁVEL
 * (ver `src/lib/admin.ts`).
 */
export function ExamSession({
  mode,
  profileId,
  onExit,
  onCompleted,
}: {
  mode: ExamMode
  profileId: string
  onExit: () => void
  onCompleted: () => void
}) {
  const [stages, setStages] = useState<Stage[] | null>(null)
  const [passages, setPassages] = useState<Map<string, Passage> | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof evaluateExam> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function prepare() {
      const built = await buildExam(mode)
      if (cancelled) return
      if (!built) {
        setLoading(false)
        return
      }
      const session = await startSession(profileId, mode, EXAM_CONFIGS[mode].titlePt)
      if (cancelled) return
      setStages(built.stages)
      setPassages(built.passages)
      setSessionId(session.id)
      setLoading(false)
    }
    void prepare()
    return () => {
      cancelled = true
    }
  }, [mode, profileId])

  if (loading) {
    return <p className="text-sm font-bold text-slate-500">A preparar a prova…</p>
  }

  if (!stages || !sessionId || !passages) {
    return (
      <Card>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Ainda não há conteúdo suficiente para esta prova. Faz primeiro a sincronização do banco
          de conteúdo.
        </p>
      </Card>
    )
  }

  if (result) {
    return (
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
          Resultado — {result.total}/{result.maxTotal} pontos
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.values(result.perSkill).map((entry) => (
            <div key={entry.skill} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
              <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                {SKILL_LABELS[entry.skill].it}
              </p>
              <p className="text-sm font-black tabular-nums text-slate-700 dark:text-slate-200">
                {entry.score}/12 {entry.passed ? '✅' : '❌'}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
          {result.passed
            ? 'Todas as habilidades acima da sufficienza — nesta simulação estarias a passar.'
            : `Ficaram abaixo da sufficienza: ${result.failedSkills
                .map((skill) => SKILL_LABELS[skill].it)
                .join(', ')}. Na prova real isto obriga a refazer o exame inteiro (sem capitalização).`}
        </p>
        <Button onClick={onCompleted}>Voltar ao painel</Button>
      </Card>
    )
  }

  return (
    <div className="md:h-[calc(100dvh-140px)] md:overflow-hidden">
      <ExamRunner
        stages={stages}
        passages={passages}
        callbacks={{
          onFinish: async (perSkill, totalTimeSeconds) => {
            await completeSession(sessionId, perSkill, totalTimeSeconds)
            setResult(evaluateExam(perSkill))
          },
          onAttempt: (question: Question, isCorrect, skipped, seconds) => {
            void saveAttempt({
              profileId,
              sessionId,
              questionId: question.id,
              skill: question.skill,
              taskId: question.taskId,
              isCorrect,
              skipped,
              timeSpentSeconds: seconds,
            })
          },
          onAbort: () => {
            void abandonSession(sessionId, 0)
            onExit()
          },
        }}
      />
    </div>
  )
}
