import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import { Alert, Button, Card } from '../ui'
import {
  answerOf,
  loadSessionReport,
  skillLabel,
  type SessionReport,
} from '../../services/reports'
import { evaluateExam, PASS_THRESHOLD_PER_SKILL, TOTAL_POINTS } from '../../lib/scoring'
import { formatDuration } from '../../lib/timing'
import { APP_VERSION } from '../../config/version'

/**
 * Relatório de uma prova: rever tudo e poder enviar à professora.
 *
 * O relatório é imprimível (`window.print()` → "Guardar em PDF"), por isso o
 * ecrã é limpo, sem botões na impressão.
 */
export function ReportPage({
  sessionId,
  onNavigate,
}: {
  sessionId: string
  onNavigate: (route: 'dashboard' | 'progress') => void
}) {
  const [report, setReport] = useState<SessionReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const data = await loadSessionReport(sessionId)
      if (cancelled) return
      setReport(data)
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const answers = useMemo(() => (report ? answerOf(report) : new Map()), [report])
  const evaluation = useMemo(() => {
    if (!report?.session.perSkill) return null
    return evaluateExam(report.session.perSkill)
  }, [report])

  // TODOS os hooks têm de correr ANTES de qualquer return antecipado — caso
  // contrário o React reclama (erro #310) e o ecrã fica em branco.
  const oralAudio = report?.oralAudio ?? null
  const audioUrl = useMemo(
    () => (oralAudio ? URL.createObjectURL(oralAudio) : null),
    [oralAudio],
  )

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  if (loading) {
    return <p className="text-sm font-bold text-slate-500">A carregar o relatório…</p>
  }

  if (!report) {
    return (
      <Card>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          Não encontrei esta prova. Pode ter sido removida.
        </p>
        <div className="mt-3">
          <Button variant="secondary" onClick={() => onNavigate('progress')}>
            <ArrowLeft size={16} /> Voltar ao progresso
          </Button>
        </div>
      </Card>
    )
  }

  const { session, questions, writing, oral, passages } = report
  const date = new Date(session.startedAt).toLocaleDateString('pt-PT')

  return (
    <div className="flex flex-col gap-3">
      <div className="no-print flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => onNavigate('progress')}>
          <ArrowLeft size={16} /> Voltar
        </Button>
        <Button onClick={() => window.print()}>
          <Printer size={16} /> Imprimir / Guardar em PDF
        </Button>
        <span className="text-[11px] font-bold text-slate-500">
          Imprime ou guarda em PDF e envia por email à professora.
        </span>
      </div>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Relatório da prova
        </p>
        <h1 className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">
          {session.title || session.mode}
        </h1>
        <p className="text-xs font-bold text-slate-500">
          {date} · duração {formatDuration(session.totalTimeSeconds)} · CILS B1 Cittadinanza Prep v
          {APP_VERSION}
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(Object.entries(session.perSkill ?? {}) as Array<[string, number]>).map(([skill, score]) => (
            <div key={skill} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                {skillLabel(skill)}
              </p>
              <p className="text-sm font-black tabular-nums text-slate-700 dark:text-slate-200">
                {score}/12 {score >= PASS_THRESHOLD_PER_SKILL ? '✅' : '❌'}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-sm font-black text-slate-900 dark:text-slate-100">
          Total: {session.score ?? 0}/{TOTAL_POINTS}
        </p>
        {evaluation ? (
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {evaluation.passed
              ? 'Todas as habilidades acima da sufficienza.'
              : `Abaixo da sufficienza: ${evaluation.failedSkills.map(skillLabel).join(', ')}.`}
          </p>
        ) : null}
      </Card>

      {questions.length > 0 ? (
        <Card>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Respostas detalhadas
          </p>
          <ol className="mt-2 flex flex-col gap-3">
            {questions.map((question, index) => {
              const attempt = answers.get(question.id)
              const correct = question.options[question.correctIndex]
              const passageText = question.passageId ? passages.get(question.passageId) : undefined
              return (
                <li
                  key={question.id}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    {index + 1}. {question.taskId} · {question.pointsPerItem} pt
                  </p>
                  <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-slate-100">
                    {question.stem}
                  </p>
                  {passageText ? (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-[11px] font-bold text-slate-500">
                        Ver o texto
                      </summary>
                      <p className="mt-1 whitespace-pre-line text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        {passageText}
                      </p>
                    </details>
                  ) : null}
                  <ul className="mt-2 flex flex-col gap-1">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === question.correctIndex
                      const isGiven = attempt?.selectedIndex === optionIndex
                      return (
                        <li
                          key={`${question.id}-${optionIndex}`}
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
                          {isGiven ? ' (a tua resposta)' : ''}
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">
                    {attempt ? 'Acertaste' : 'Não respondeste'}: <strong>{correct}</strong>
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                    {question.explanation}
                  </p>
                </li>
              )
            })}
          </ol>
        </Card>
      ) : null}

      {writing ? (
        <Card>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Produzione scritta
          </p>
          <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
            {writing.wordCount} palavras · {writing.score}/12
          </p>
          <p className="mt-2 whitespace-pre-line text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
            {writing.text}
          </p>
          <div className="mt-3">
            <Alert tone="teal" title="Auto-avaliação (grelha oficial)">
              {Object.entries(writing.rubric)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' · ')}
            </Alert>
          </div>
        </Card>
      ) : null}

      {oral ? (
        <Card>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Produzione orale
          </p>
          <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
            {oral.topicId} · {oral.score}/12 · {formatDuration(oral.durationSeconds)}
          </p>
          {audioUrl ? (
            <div className="mt-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                Gravação
              </p>
              <audio controls src={audioUrl} className="mt-1 w-full" />
            </div>
          ) : null}
          {oral.notes ? (
            <p className="mt-2 whitespace-pre-line text-xs font-semibold text-slate-700 dark:text-slate-200">
              {oral.notes}
            </p>
          ) : null}
          <div className="mt-3">
            <Alert tone="teal" title="Auto-avaliação (grelha oficial)">
              {Object.entries(oral.rubric)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' · ')}
            </Alert>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
