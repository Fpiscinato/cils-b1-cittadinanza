import { useEffect, useRef, useState } from 'react'
import { Button, Card } from '../ui'
import { ExamRunner, type Stage } from './ExamRunner'
import type { StageCounts } from '../../lib/stageCounts'
import { buildExam, type BuildOptions, type ContentBank } from '../../lib/examBuilder'
import { EXAM_CONFIGS } from '../../lib/exam'
import type { ExamMode, Passage, Phase, Question, Skill } from '../../db/schemas'
import { PHASE_LABELS } from '../../lib/phases'
import {
  abandonSession,
  completeSession,
  saveAttempt,
  startSession,
} from '../../services/sessions'
import { saveOral, saveWriting } from '../../services/productions'
import { evaluateExam, SKILL_LABELS } from '../../lib/scoring'
import { SESSION_KIND_THEME } from '../../lib/sessionSummary'

/**
 * Título legível de uma sessão de estudo (aparece no histórico e no relatório).
 * O modo `studio` é genérico; o nível e o tipo vêm das opções de montagem.
 */
function sessionTitle(
  mode: ExamMode,
  phase: Phase | undefined,
  buildOptions: BuildOptions | undefined,
): string {
  if (mode === 'studio') {
    const level = buildOptions?.level ?? 'A1'
    const kind =
      buildOptions?.origin === 'study'
        ? 'exercícios'
        : buildOptions?.skill === 'ascolto'
          ? 'ascolto'
          : 'lettura'
    return `Estudo ${level} — ${kind}`
  }
  return phase ? `${EXAM_CONFIGS[mode].titlePt} — ${PHASE_LABELS[phase]}` : EXAM_CONFIGS[mode].titlePt
}

/**
 * Uma sessão de prova: cria o registro, corre o runner e grava o resultado.
 *
 * Quando a prova termina, a sessão passa a `completed` e fica IMUTÁVEL
 * (ver `src/lib/admin.ts`).
 */
export function ExamSession({
  mode,
  profileId,
  phase,
  buildOptions,
  title,
  onExit,
  onCompleted,
  onSaved,
  onReview,
}: {
  mode: ExamMode
  profileId: string
  /** Quando definido, a sessão só usa o material desta fase do plano. */
  phase?: Phase
  /** Opções de montagem (nível, baralhar, limite) — usado no modo `studio`. */
  buildOptions?: BuildOptions
  /** Título legível (a clínica de erros usa "Treino de erros"). */
  title?: string
  onExit: () => void
  onCompleted: () => void
  /** Chamado assim que a sessão fica gravada — antes de mostrar o resultado. */
  onSaved?: () => void
  /** Abra o relatório da prova (para rever e enviar à professora). */
  onReview?: (sessionId: string) => void
}) {
  const [stages, setStages] = useState<Stage[] | null>(null)
  const [passages, setPassages] = useState<Map<string, Passage> | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [result, setResult] = useState<ReturnType<typeof evaluateExam> | null>(null)
  const [counts, setCounts] = useState<Record<string, StageCounts>>({})
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
      const sessionTitleValue = title ?? sessionTitle(mode, phase, buildOptions)
      const session = await startSession(profileId, mode, sessionTitleValue)
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
  }, [mode, profileId, bank, phase, buildOptions, title])

  if (loading) {
    return <p className="text-sm font-bold text-slate-500">Preparando a prova…</p>
  }

  if (!stages || !sessionId || !passages) {
    return (
      <Card>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Ainda não há conteúdo suficiente para esta prova. Faça primeiro a sincronização do banco
          de conteúdo.
        </p>
      </Card>
    )
  }

  if (result) {
    const isStudy = mode === 'studio'
    const isMock = mode === 'mock_cittadinanza'
    const theme = SESSION_KIND_THEME[isStudy ? 'study' : isMock ? 'mock' : 'practice']
    const studyRows = Object.entries(counts)
    const studyCorrect = studyRows.reduce((sum, [, entry]) => sum + entry.correct, 0)
    const studyTotal = studyRows.reduce((sum, [, entry]) => sum + entry.total, 0)
    const studyAccuracy = studyTotal > 0 ? Math.round((studyCorrect / studyTotal) * 100) : 0
    // Numa prática de uma só abilità não faz sentido mostrar as outras a 0/12
    // (nem dizer que "reprovavam"): o veredito completo só existe no simulado.
    const practicedSkills = Object.keys(counts) as Skill[]
    /** No estudo de apostila o rótulo é o do caderno, não o da abilità da prova. */
    const studyLabel = (skill: Skill): string =>
      buildOptions?.origin === 'study'
        ? 'Exercícios — gramática e vocabulário'
        : SKILL_LABELS[skill].it
    const skillRows = Object.values(result.perSkill).filter(
      (entry) => isMock || practicedSkills.includes(entry.skill),
    )
    return (
      <Card className={`flex flex-col gap-3 border-l-4 ${theme.border}`}>
        <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-slate-500">
          <span className={`h-2 w-2 rounded-full ${theme.dot}`} /> {theme.label}
        </p>
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
          {isStudy
            ? 'Sessão de estudo terminada ✅'
            : isMock
              ? `Resultado — ${result.total}/${result.maxTotal} pontos`
              : 'Prática terminada ✅'}
        </h2>
        {isStudy ? (
          <>
            <p className={`text-3xl font-black tabular-nums ${theme.text}`}>
              {studyCorrect} de {studyTotal}
            </p>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              respostas certas ({studyAccuracy}% de acerto) — o estudo é treino, não conta para o
              veredito da prova.
            </p>
            <ul className="flex flex-col gap-1">
              {studyRows.map(([skill, entry]) => (
                <li
                  key={skill}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-700/40"
                >
                  <span className="font-black text-slate-900 dark:text-slate-100">
                    {studyLabel(skill as Skill)}
                  </span>
                  <span className="font-black tabular-nums text-slate-700 dark:text-slate-200">
                    {entry.correct}/{entry.total}{' '}
                    <span className="font-bold text-slate-500">
                      ({entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0}%)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              O percurso do seu nível e a evolução do estudo estão em Progresso.
            </p>
          </>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2">
              {skillRows.map((entry) => {
                const stageCount = counts[entry.skill]
                return (
                  <div
                    key={entry.skill}
                    className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40"
                  >
                    <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {SKILL_LABELS[entry.skill].it}
                    </p>
                    <p className="text-sm font-black tabular-nums text-slate-700 dark:text-slate-200">
                      {isMock
                        ? `${entry.score}/12 ${entry.passed ? '✅' : '❌'}`
                        : stageCount && stageCount.total > 0
                          ? `${stageCount.correct} de ${stageCount.total} certas (${Math.round(
                              (stageCount.correct / stageCount.total) * 100,
                            )}%)`
                          : `${entry.score}/12`}
                    </p>
                  </div>
                )
              })}
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {isMock
                ? result.passed
                  ? 'Todas as habilidades acima da sufficienza — nesta simulação estarias a passar.'
                  : `Ficaram abaixo da sufficienza: ${result.failedSkills
                      .map((skill) => SKILL_LABELS[skill].it)
                      .join(', ')}. Na prova real isto obriga a refazer o exame inteiro (sem capitalização).`
                : 'Este foi só um treino de uma abilità — o veredito completo (e a regra de capitalização) só aparece no simulado completo.'}
            </p>
          </>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={onCompleted}>Voltar ao painel</Button>
          {isStudy ? (
            <Button variant="secondary" onClick={onExit}>
              Continuar a estudar
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => onReview?.(sessionId)}>
              Rever a prova / enviar à professora
            </Button>
          )}
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
        tone={mode === 'studio' ? 'study' : mode === 'mock_cittadinanza' ? 'exam' : 'practice'}
        timed={mode !== 'studio'}
        callbacks={{
          onFinish: async (perSkill, totalTimeSeconds, stageCounts) => {
            await completeSession(sessionId, perSkill, totalTimeSeconds)
            setCounts(stageCounts)
            setResult(evaluateExam(perSkill))
            // O progresso partilhado (Painel/Progresso) fica já atualizado, mesmo
            // que a aluna navegue pelo menu sem clicar em "Voltar ao painel".
            onSaved?.()
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
          onAbort: (totalTimeSeconds) => {
            // Só sai depois de gravar: se saísse antes, o App recarregava o
            // histórico antes de a sessão ficar "abandonada" no banco e o
            // Progresso aparecia vazio até recarregar a página.
            void abandonSession(sessionId, totalTimeSeconds).then(() => onExit())
          },
        }}
      />
    </div>
  )
}
