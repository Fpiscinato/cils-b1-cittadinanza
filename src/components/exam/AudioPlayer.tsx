import { useEffect, useRef, useState } from 'react'
import { Play, Square } from 'lucide-react'
import { Button } from '../ui'
import { isTtsSupported, speak, stopSpeaking } from '../../lib/tts'

/**
 * Leitor de áudio da prova de ascolto.
 *
 * Na prova real cada texto é ouvido DUAS vezes ("Sentirai i testi due volte").
 * Aqui o áudio é sintetizado pelo browser (TTS) a partir da transcrição
 * oficial, e o contador de reproduções é o mesmo: 1ª e 2ª, e depois bloqueia.
 */
export function AudioPlayer({
  transcript,
  taskLabel,
  passesUsed,
  onPassUsed,
  locked,
}: {
  transcript: string
  taskLabel: string
  passesUsed: number
  onPassUsed: () => void
  /** Quando true, o áudio não pode ser mais reproduzido (protocolo cumprido). */
  locked: boolean
}) {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supported] = useState(isTtsSupported)
  const mounted = useRef(true)

  useEffect(() => {
    return () => {
      mounted.current = false
      stopSpeaking()
    }
  }, [])

  const exhausted = passesUsed >= 2

  function handlePlay(): void {
    if (exhausted || locked || playing) return
    setError(null)
    const ok = speak(transcript, {
      rate: 1,
      onEnd: () => {
        if (mounted.current) {
          setPlaying(false)
          onPassUsed()
        }
      },
      onError: (message) => {
        if (mounted.current) {
          setPlaying(false)
          setError(message)
        }
      },
    })
    if (ok) {
      setPlaying(true)
      onPassUsed()
    }
  }

  function handleStop(): void {
    stopSpeaking()
    setPlaying(false)
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-950/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-teal-800 dark:text-teal-200">
            {taskLabel}
          </p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {exhausted
              ? 'Já ouviste as 2 reproduções (como na prova real).'
              : `Reprodução ${passesUsed + 1} de 2`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {playing ? (
            <Button variant="secondary" onClick={handleStop}>
              <Square size={16} /> Parar
            </Button>
          ) : (
            <Button onClick={handlePlay} disabled={exhausted || locked}>
              <Play size={16} /> Ouvir
            </Button>
          )}
        </div>
      </div>
      {!supported ? (
        <p className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
          Este navegador não tem síntese de voz. Lê a transcrição abaixo como alternativa.
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-xs font-semibold text-rose-700 dark:text-rose-300">{error}</p>
      ) : null}
      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
          Ver transcrição
        </summary>
        <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-line text-xs leading-relaxed text-slate-700 dark:text-slate-200">
          {transcript}
        </p>
      </details>
    </div>
  )
}
