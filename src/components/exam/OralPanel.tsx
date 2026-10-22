import { useEffect, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { Button } from '../ui'
import { ORAL_RUBRIC } from '../../lib/scoring'
import { formatDuration } from '../../lib/timing'

export interface OralTopic {
  id: string
  text: string
}

const PRESENTATION_QUESTIONS = [
  'Come ti chiami?',
  'Quanti anni hai?',
  'Di dove sei?',
  'Dove vivi? Se vivi in Italia, da quanto tempo?',
  'Che cosa fai nella vita, studi o lavori?',
]

/** Durações oficiais: 1 minuto de apresentação + 2 a 3 minutos de conversa. */
const PRESENTATION_SECONDS = 60
const DIALOGUE_SECONDS = 180

/**
 * Painel da prova oral.
 *
 * A prova real é INDIVIDUAL e registada: 1 minuto de apresentação pessoal
 * (com as perguntas fixas do examiner) + 2 a 3 minutos de CONVERSA (não monólogo)
 * sobre um tema que a candidata escolhe. Aqui simulamos com timers e a grelha
 * oficial de 4 critérios.
 */
export function OralPanel({
  topics,
  onSubmit,
}: {
  topics: OralTopic[]
  onSubmit: (topicId: string, rubric: Record<string, number>, durationSeconds: number) => void
}) {
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '')
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [rubric, setRubric] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const rubricComplete = ORAL_RUBRIC.every((criterion) => rubric[criterion.key] !== undefined)
  const totalTarget = PRESENTATION_SECONDS + DIALOGUE_SECONDS

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950/40">
        <p className="text-base font-black text-slate-900 dark:text-slate-100">Prova oral registada ✅</p>
        <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
          Na prova real o examiner ouve-te e preenche a grelha oficial. Confere a tua auto-avaliação
          e repete com outro tema.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Parte 1 — Breve presentazione personale (~1 minuto)
        </p>
        <ul className="mt-2 grid gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 sm:grid-cols-2">
          {PRESENTATION_QUESTIONS.map((question) => (
            <li key={question}>• {question}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Parte 2 — Conversa de 2 a 3 minutos: escolhe o tema
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setTopicId(topic.id)}
              className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${
                topicId === topic.id
                  ? 'border-teal-600 bg-teal-50 text-teal-950 dark:bg-teal-950/50 dark:text-teal-100'
                  : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              {topic.text}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-black tabular-nums text-slate-900 dark:text-slate-100">
            {formatDuration(elapsed)} / {formatDuration(totalTarget)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant={recording ? 'danger' : 'secondary'}
              onClick={() => setRecording((value) => !value)}
            >
              {recording ? <Square size={16} /> : <Mic size={16} />}
              {recording ? 'Parar gravação' : 'Gravar (opcional)'}
            </Button>
            <Button onClick={() => setRunning((value) => !value)} disabled={recording}>
              {running ? 'Pausar' : 'Começar'}
            </Button>
          </div>
        </div>
        <p className="mt-2 text-[11px] font-semibold text-slate-500">
          A gravação é opcional e fica só neste dispositivo — na prova real o examiner regista a tua
          voz.
        </p>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Grelha oficial de avaliação (12 pontos)
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {ORAL_RUBRIC.map((criterion) => (
            <div
              key={criterion.key}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-2 dark:bg-slate-700/50"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {criterion.labelPt}{' '}
                <span className="font-black text-slate-500">({criterion.label})</span>
              </span>
              <span className="flex items-center gap-1">
                {Array.from({ length: criterion.max + 1 }, (_, value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRubric((current) => ({ ...current, [criterion.key]: value }))}
                    className={`h-8 w-8 rounded-lg text-xs font-black ${
                      rubric[criterion.key] === value
                        ? 'bg-teal-700 text-white'
                        : 'bg-white text-slate-600 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">
          {rubricComplete
            ? `Auto-avaliação: ${
                ORAL_RUBRIC.reduce((sum, criterion) => sum + (rubric[criterion.key] ?? 0), 0)
              }/12 pontos`
            : 'Avalia todos os critérios para entregar.'}
        </span>
        <Button
          disabled={!topicId || !rubricComplete}
          onClick={() => {
            onSubmit(topicId, rubric, elapsed)
            setSubmitted(true)
          }}
        >
          Entregar a prova oral
        </Button>
      </div>
    </div>
  )
}
