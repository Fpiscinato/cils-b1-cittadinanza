import type { Question } from '../../db/schemas'

/**
 * Mostra uma pergunta objetiva (mcq3 / truefalse / cloze).
 * Não mostra a resposta certa — essa vem depois de "Confirmar resposta".
 */
export function QuestionView({
  question,
  selected,
  onSelect,
  index,
  total,
}: {
  question: Question
  selected: number | null
  onSelect: (index: number) => void
  index: number
  total: number
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
          return (
            <button
              key={`${question.id}-${optionIndex}`}
              type="button"
              onClick={() => onSelect(optionIndex)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? 'border-teal-600 bg-teal-50 text-teal-950 dark:bg-teal-950/50 dark:text-teal-100'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500'
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  isSelected
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                }`}
              >
                {letters[optionIndex]}
              </span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
