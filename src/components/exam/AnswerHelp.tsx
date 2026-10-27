import { Lightbulb } from 'lucide-react'
import { PronounceButton } from './PronounceButton'

/**
 * Explicação depois de confirmar a resposta.
 *
 * Não existe "tentar de novo": a resposta fica fechada (é assim na prova e é
 * assim que a explicação serve para alguma coisa). Mostra-se a resposta certa
 * e o porquê.
 */
export function AnswerHelp({
  correct,
  correctAnswer,
  explanation,
}: {
  correct: boolean
  /** Texto da opção correta (para quem errou ver logo a resposta). */
  correctAnswer: string
  explanation: string
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        correct
          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40'
          : 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40'
      }`}
    >
      <p className="text-sm font-black text-slate-900 dark:text-slate-100">
        {correct ? '✅ Correto!' : '❌ Não é essa.'}
      </p>
      {!correct ? (
        <p className="mt-1 flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-100">
          <span>
            Resposta certa:{' '}
            <span className="text-emerald-700 dark:text-emerald-300">{correctAnswer}</span>
          </span>
          <PronounceButton text={correctAnswer} label="Ouvir a resposta certa" />
        </p>
      ) : null}
      <p className="mt-1 flex items-start gap-2 text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
        <Lightbulb size={16} className="mt-0.5 shrink-0" />
        <span>
          <strong className="font-black">Por que:</strong> {explanation}
        </span>
      </p>
    </div>
  )
}
