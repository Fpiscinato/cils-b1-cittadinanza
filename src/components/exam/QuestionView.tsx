import { Check, X } from 'lucide-react'
import type { Question } from '../../db/schemas'

/**
 * Mostra uma pergunta objetiva (mcq3 / truefalse / cloze).
 *
 * Depois de confirmar a resposta, a pergunta fica FECHADA: a opção certa
 * aparece a verde, a escolha errada a vermelho, e não é possível trocar a
 * resposta (regra do projeto: aprende-se com a explicação, não com retry).
 */
export function QuestionView({
  question,
  selected,
  onSelect,
  index,
  total,
  revealed = false,
}: {
  question: Question
  selected: number | null
  onSelect: (index: number) => void
  index: number
  total: number
  /** true = resposta confirmada; as opções ficam bloqueadas. */
  revealed?: boolean
}) {
  const letters = ['A', 'B', 'C']
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        Pergunta {index} de {total}
      </p>
      <p className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
        {question.stem}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex
          const isCorrectOption = revealed && optionIndex === question.correctIndex
          const isWrongPick = revealed && isSelected && !isCorrectOption

          const tone = isCorrectOption
            ? 'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100'
            : isWrongPick
              ? 'border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-100'
              : isSelected
                ? 'border-teal-600 bg-teal-50 text-teal-950 dark:bg-teal-950/50 dark:text-teal-100'
                : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500'

          return (
            <button
              key={`${question.id}-${optionIndex}`}
              type="button"
              onClick={() => {
                if (!revealed) onSelect(optionIndex)
              }}
              disabled={revealed}
              aria-pressed={isSelected}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm font-semibold transition disabled:cursor-default ${tone}`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  isCorrectOption
                    ? 'bg-emerald-600 text-white'
                    : isWrongPick
                      ? 'bg-rose-600 text-white'
                      : isSelected
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                }`}
              >
                {isCorrectOption ? (
                  <Check size={14} strokeWidth={3} />
                ) : isWrongPick ? (
                  <X size={14} strokeWidth={3} />
                ) : (
                  letters[optionIndex]
                )}
              </span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
