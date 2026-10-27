import { Volume2 } from 'lucide-react'
import { isTtsSupported, speak } from '../../lib/tts'

/**
 * Botão de pronúncia (TTS do sistema, voz italiana).
 *
 * O estudo e a prática têm ajuda de pronúncia; o simulado NÃO (na prova real
 * não há esse apoio). O botão fica fora do fluxo de resposta, por isso não
 * interfere com o "clique na opção".
 */
export function PronounceButton({
  text,
  label = 'Ouvir a pronúncia',
  size = 16,
  className = '',
}: {
  text: string
  label?: string
  size?: number
  className?: string
}) {
  if (!isTtsSupported() || !text.trim()) return null
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        speak(text)
      }}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 ${className}`}
    >
      <Volume2 size={size} />
    </button>
  )
}
