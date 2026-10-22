import { useEffect, useRef, useState } from 'react'
import { Button, Card } from '../ui'
import { ExamRunner, type Stage } from './ExamRunner'
import { buildExam, type BuildOptions, type ContentBank } from '../../lib/examBuilder'
import { EXAM_CONFIGS } from '../../lib/exam'
import type { ExamMode, Passage, Phase, Question } from '../../db/schemas'
import { PHASE_LABELS } from '../../lib/phases'
import {
  abandonSession,
  completeSession,
  saveAttempt,
  startSession,
} from '../../services/sessions'
import { saveOral, saveWriting } from '../../services/productions'
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
  phase,
  buildOptions,
  onExit,
  onCompleted,
  onReview,
}: {
  mode: ExamMode
  profileId: string
  /** Quando definido, a sessão só usa o material desta fase do plano. */
  phase?: Phase
  /** Opções de montagem (nível, baralhar, limite) — usado no modo `studio`. */
  buildOptions?: BuildOptions
  onExit: () => void
  onCompleted: () => void
  /** Abre o relatório da prova (para rever e enviar à professora). */
  onReview?: (sessionId: string) => void
}) {
  const [stages, setStages] = useState<Stage[] | null>(null)
  const [passages, setPassages] = useState<Map<string, Passage> | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof evaluateExam> | null>(null)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<Blob | null>(null)

  /**
   * O simulado completo usa SÓ o banco oficial (o gabarito do CILS fica
   * intacto); a prática e o estudo usam o banco oficial + o banco extra.
   */
  const bank: ContentBank = mode === 'mock_cittadinanza' ? 'official' : 'all'

  useEffect(() => {
    let cancelled = false
    async function prepare() {
      const built = await buildExam(mode, {
        bank,
        phase,
        ...buildOptions,
      })
      if (cancelled) return
      if (!built) {
        setLoading(false)
        return
      }
      const title = phase
        ? `${EXAM_CONFIGS[mode].titlePt} — ${PHASE_LABELS[phase]}`
        : EXAM_CONFIGS[mode].titlePt
      const session = await startSession(profileId, mode, title)
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
  }, [mode, profileId, bank, phase, buildOptions])

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
        <div className="flex flex-wrap gap-2">
          <Button onClick={onCompleted}>Voltar ao painel</Button>
          <Button variant="secondary" onClick={() => onReview?.(sessionId)}>
            Rever a prova / enviar à professora
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="md:h-[calc(100dvh-140px)] md:overflow-hidden">
      <ExamRunner
        stages={stages}
        passages={passages}
        mode={mode === 'mock_cittadinanza' ? 'exam' : 'practice'}
        callbacks={{
          onFinish: async (perSkill, totalTimeSeconds) => {
            await completeSession(sessionId, perSkill, totalTimeSeconds)
            setResult(evaluateExam(perSkill))
          },
          onWriting: (promptId, text, rubric, score) => {
            void saveWriting({ profileId, promptId, text, rubric, score })
          },
          onOral: (topicId, rubric, durationSeconds, score) => {
            void saveOral({
              profileId,
              topicId,
              notes: '',
              rubric,
              score,
              durationSeconds,
              audio: audioRef.current,
            })
          },
          onOralAudio: (blob) => {
            audioRef.current = blob
          },
          onAttempt: (question: Question, isCorrect, skipped, seconds, selectedIndex) => {
            void saveAttempt({
              profileId,
              sessionId,
              questionId: question.id,
              skill: question.skill,
              taskId: question.taskId,
              isCorrect,
              skipped,
              selectedIndex,
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
