import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Passage, Question, Skill } from '../../db/schemas'
import { Button } from '../ui'
import { AnswerHelp } from './AnswerHelp'
import { AudioPlayer } from './AudioPlayer'
import { QuestionView } from './QuestionView'
import { OralPanel, type OralTopic } from './OralPanel'
import { WritingPanel, type WritingPrompt } from './WritingPanel'
import { formatDuration } from '../../lib/timing'
import { scoreStageFromCounts } from '../../lib/scoring'

export type Stage =
  | {
      kind: 'objective'
      id: string
      skill: Skill
      title: string
      subtitle: string
      timeSeconds: number
      questions: Question[]
      /** Transcrições do áudio, por task (ascolto). */
      audioByTask?: Record<string, string>
    }
  | {
      kind: 'writing'
      id: string
      skill: Skill
      title: string
      subtitle: string
      timeSeconds: number
      prompts: WritingPrompt[]
      /** Converte a auto-avaliação em pontos (usa a grelha oficial). */
      rubricScore: (rubric: Record<string, number>) => number
    }
  | {
      kind: 'oral'
      id: string
      skill: Skill
      title: string
      subtitle: string
      timeSeconds: number
      topics: OralTopic[]
      /** Converte a auto-avaliação em pontos (usa a grelha oficial). */
      rubricScore: (rubric: Record<string, number>) => number
    }

export interface RunnerCallbacks {
  onFinish: (perSkill: Record<string, number>, totalTimeSeconds: number) => void
  onAttempt: (
    question: Question,
    isCorrect: boolean,
    skipped: boolean,
    seconds: number,
    selectedIndex: number,
  ) => void
  /** A produção escrita (texto + auto-avaliação) — para guardar no histórico. */
  onWriting?: (
    promptId: string,
    text: string,
    rubric: Record<string, number>,
    score: number,
  ) => void
  /** A prova oral (tema + auto-avaliação + duração). */
  onOral?: (
    topicId: string,
    rubric: Record<string, number>,
    durationSeconds: number,
    score: number,
  ) => void
  onAbort: () => void
}

/**
 * O ÚNICO runner de sessão do app.
 *
 * Prática, clínica de erros e simulados usam todos este componente — assim o
 * tamanho do ecrã, o footer fixo, o timer e o espaçamento são idênticos por
 * construção (regra herdada e validada do ElevenSpark).
 *
 * Regras do exame implementadas aqui:
 * - Section lock: depois de fechar uma prova não se volta atrás.
 * - O relógio para quando a última pergunta é respondida.
 * - O áudio do ascolto só pode ser ouvido duas vezes por prova.
 */
export function ExamRunner({
  stages,
  passages,
  callbacks,
  mode = 'practice',
}: {
  stages: Stage[]
  passages: Map<string, Passage>
  callbacks: RunnerCallbacks
  /**
   * `exam` = como na prova a sério (o simulado): sem "aprende a resolver",
   * sem voltar atrás (section lock), sem repetir a resposta.
   * `practice` = modo estudo, com explicação e retry.
   */
  mode?: 'exam' | 'practice'
}) {
  const isExam = mode === 'exam'
  const [stageIndex, setStageIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(stages[0]?.timeSeconds ?? 0)
  const [passesByTask, setPassesByTask] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)

  const correctByTask = useRef<Record<string, number>>({})
  const perSkill = useRef<Record<string, number>>({})
  const startedAt = useRef(Date.now())
  const questionStartedAt = useRef(Date.now())
  const answered = useRef<Set<string>>(new Set())

  const stage = stages[stageIndex] ?? null

  const questions = useMemo(
    () => (stage && stage.kind === 'objective' ? stage.questions : []),
    [stage],
  )
  const question = questions[questionIndex] ?? null

  useEffect(() => {
    if (finished) return
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [finished, stageIndex])

  // Tempo esgotado: avança para a próxima prova (como no exame, sem penalização).
  useEffect(() => {
    if (secondsLeft === 0 && !finished && stage) {
      advanceStage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

  const advanceStage = useCallback(() => {
    if (!stage) return
    if (stageIndex >= stages.length - 1) {
      setFinished(true)
      callbacks.onFinish(
        { ...perSkill.current },
        Math.round((Date.now() - startedAt.current) / 1000),
      )
      return
    }
    setStageIndex((index) => index + 1)
    setQuestionIndex(0)
    setSelected(null)
    setRevealed(false)
    setSecondsLeft(stages[stageIndex + 1]?.timeSeconds ?? 0)
    questionStartedAt.current = Date.now()
  }, [stage, stageIndex, stages, callbacks])

  /** Grava a resposta escolhida (uma vez por item). */
  function recordAnswer(): void {
    if (!question || selected === null) return
    if (answered.current.has(question.id)) return
    const isCorrect = selected === question.correctIndex
    const seconds = Math.round((Date.now() - questionStartedAt.current) / 1000)
    answered.current.add(question.id)
    correctByTask.current[question.taskId] =
      (correctByTask.current[question.taskId] ?? 0) + (isCorrect ? 1 : 0)
    callbacks.onAttempt(question, isCorrect, false, seconds, selected)
  }

  function handleConfirm(): void {
    if (!question || selected === null) return
    recordAnswer()
    // Na prática a resposta é revelada com a explicação ("aprende a resolver").
    // Na prova a sério NÃO: a resposta fica marcada e segue-se em frente.
    if (!isExam) setRevealed(true)
  }

  /** Na prova a sério: um só clique marca a resposta e avança. */
  function handleConfirmAndNext(): void {
    if (!question || selected === null) return
    recordAnswer()
    handleNext()
  }

  function handleNext(): void {
    if (!stage || stage.kind !== 'objective') return
    if (questionIndex >= questions.length - 1) {
      // Última pergunta: o relógio para (regra de UX do ElevenSpark).
      // A pontuação da etapa é normalizada na escala 0-12 — para o banco
      // oficial dá exatamente a pontuação oficial do CILS.
      perSkill.current[stage.skill] = scoreStageFromCounts(stage.questions, correctByTask.current)
      advanceStage()
      return
    }
    setQuestionIndex((index) => index + 1)
    setSelected(null)
    setRevealed(false)
    questionStartedAt.current = Date.now()
  }

  function handleRetry(): void {
    setSelected(null)
    setRevealed(false)
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center dark:border-teal-800 dark:bg-teal-950/40">
        <p className="text-lg font-black text-slate-900 dark:text-slate-100">Prova terminada ✅</p>
      </div>
    )
  }

  if (!stage) return null

  const passage = question?.passageId ? passages.get(question.passageId) : undefined
  const taskId = question?.taskId ?? ''
  const passesUsed = passesByTask[taskId] ?? 0

  return (
    <div className="flex h-full flex-col">
      {/* Header compacto: progresso, timer e habilidade */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-900 dark:text-slate-100">{stage.title}</p>
          <p className="text-[11px] font-bold text-slate-500">{stage.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {stage.kind === 'objective' ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black tabular-nums text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {questionIndex + 1}/{questions.length}
            </span>
          ) : null}
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-black tabular-nums ${
              secondsLeft <= 60
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
            }`}
          >
            {formatDuration(secondsLeft)}
          </span>
        </div>
      </header>

      {/* Barra de progresso das provas */}
      <div className="mt-2 flex gap-1">
        {stages.map((item, index) => (
          <div
            key={item.id}
            className={`h-1.5 flex-1 rounded-full ${
              index < stageIndex
                ? 'bg-teal-600'
                : index === stageIndex
                  ? 'bg-teal-400'
                  : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Área da pergunta (com scroll) */}
      <div className="mt-3 flex-1 overflow-y-auto pb-3">
        {stage.kind === 'objective' ? (
          <div className="flex flex-col gap-3">
            {stage.audioByTask && taskId ? (
              <AudioPlayer
                transcript={stage.audioByTask[taskId] ?? ''}
                taskLabel={taskId.includes('p1') ? 'Prova 1 — áudio' : 'Prova 2 — áudio'}
                passesUsed={passesUsed}
                onPassUsed={() =>
                  setPassesByTask((current) => ({ ...current, [taskId]: (current[taskId] ?? 0) + 1 }))
                }
                locked={passesUsed >= 2}
              />
            ) : null}

            {passage && passage.kind === 'reading' ? (
              <details open className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-700/40">
                <summary className="cursor-pointer text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  {passage.title}
                </summary>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                  {passage.content}
                </p>
              </details>
            ) : null}

            {question ? (
              <QuestionView
                question={question}
                selected={selected}
                onSelect={(index) => {
                  if (!revealed) setSelected(index)
                }}
                index={questionIndex + 1}
                total={questions.length}
              />
            ) : null}

            {revealed && !isExam && question ? (
              <AnswerHelp
                correct={selected === question.correctIndex}
                explanation={question.explanation}
                onRetry={handleRetry}
              />
            ) : null}
          </div>
        ) : null}

        {stage.kind === 'writing' ? (
          <WritingPanel
            prompts={stage.prompts}
            onSubmit={(promptId, text, rubric) => {
              const score = stage.rubricScore(rubric)
              perSkill.current[stage.skill] = score
              callbacks.onWriting?.(promptId, text, rubric, score)
              advanceStage()
            }}
          />
        ) : null}

        {stage.kind === 'oral' ? (
          <OralPanel
            topics={stage.topics}
            onSubmit={(topicId, rubric, duration) => {
              const score = stage.rubricScore(rubric)
              perSkill.current[stage.skill] = score
              callbacks.onOral?.(topicId, rubric, duration, score)
              advanceStage()
            }}
          />
        ) : null}
      </div>

      {/* Footer sempre visível */}
      <footer className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
        <Button variant="ghost" onClick={() => setConfirmStop(true)}>
          <AlertTriangle size={16} /> Parar
        </Button>
        {stage.kind === 'objective' ? (
          <div className="flex items-center gap-2">
            {isExam ? null : (
              <Button
                variant="secondary"
                onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))}
                disabled={questionIndex === 0}
              >
                <ChevronLeft size={16} />
              </Button>
            )}
            {revealed ? (
              <Button onClick={handleNext}>
                {questionIndex >= questions.length - 1 ? 'Terminar prova' : 'Próxima'}
                <ChevronRight size={16} />
              </Button>
            ) : isExam ? (
              <Button onClick={handleConfirmAndNext} disabled={selected === null}>
                {questionIndex >= questions.length - 1 ? 'Terminar prova' : 'Confirmar e seguir'}
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleConfirm} disabled={selected === null}>
                Confirmar resposta
              </Button>
            )}
          </div>
        ) : (
          <span className="text-[11px] font-bold text-slate-500">
            As respostas já foram salvas — podes sair e voltar.
          </span>
        )}
      </footer>

      {/* Confirmação ao parar (uma única, com duas saídas) */}
      {confirmStop ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Encerrar a sessão?"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <p className="text-base font-black text-slate-900 dark:text-slate-100">
              Encerrar a sessão?
            </p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
              As respostas já foram salvas. A sessão fica marcada como abandonada e podes
              voltar a treinar quando quiseres.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
              <Button variant="danger" onClick={() => callbacks.onAbort()}>
                Encerrar sessão
              </Button>
              <Button variant="secondary" onClick={() => setConfirmStop(false)}>
                Continuar estudando
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
