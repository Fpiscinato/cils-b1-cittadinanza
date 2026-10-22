import { Lightbulb } from 'lucide-react'

/**
 * Dois níveis de ajuda depois de uma resposta errada (regra herdada do
 * ElevenSpark): a explicação rápida E o "aprende a resolver".
 */
export function AnswerHelp({
  correct,
  explanation,
  onRetry,
}: {
  correct: boolean
  explanation: string
  onRetry: () => void
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
      <p className="mt-1 flex items-start gap-2 text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
        <Lightbulb size={16} className="mt-0.5 shrink-0" />
        <span>
          <strong className="font-black">Explicação rápida:</strong> {explanation}
        </span>
      </p>
      {!correct ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-xs font-black text-teal-800 underline dark:text-teal-300"
        >
          🧠 Aprende a resolver → tentar de novo
        </button>
      ) : null}
    </div>
  )
}
