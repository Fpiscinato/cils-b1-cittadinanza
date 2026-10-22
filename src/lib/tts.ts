/**
 * Síntese de voz do browser (Web Speech API).
 *
 * O app é 100% offline e não pode depender de ficheiros de áudio: o áudio do
 * ascolto é sintetizado com a voz italiana do sistema. Na prova real o áudio é
 * uma gravação de estúdio com dois falantes — aqui o TTS é a aproximação
 * honesta e escalável (ver `docs/exam-spec.md` para o protocolo de 2 passagens).
 */

export interface TtsOptions {
  /** Velocidade. A prova real usa velocidade média. */
  rate?: number
  /** Pitch da voz. */
  pitch?: number
  onEnd?: () => void
  onError?: (message: string) => void
}

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickItalianVoice(): SpeechSynthesisVoice | null {
  if (!isTtsSupported()) return null
  const voices = window.speechSynthesis.getVoices()
  const italian = voices.filter((voice) => voice.lang.toLowerCase().startsWith('it'))
  if (italian.length === 0) return null
  // Preferimos uma voz italiana "natural"/"enhanced" quando o browser oferece.
  return italian.find((voice) => /natural|enhanced|premium/i.test(voice.name)) ?? italian[0]
}

/**
 * Lê um texto em italiano. Se não houver voz italiana instalada, devolve false
 * (a UI mostra a transcrição como alternativa).
 */
export function speak(text: string, options: TtsOptions = {}): boolean {
  if (!isTtsSupported() || !text.trim()) {
    options.onError?.('Este navegador não tem síntese de voz disponível.')
    return false
  }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'it-IT'
  utterance.rate = options.rate ?? 1
  utterance.pitch = options.pitch ?? 1
  const voice = pickItalianVoice()
  if (voice) utterance.voice = voice
  if (options.onEnd) utterance.onend = () => options.onEnd?.()
  if (options.onError) utterance.onerror = () => options.onError?.('Não foi possível reproduzir o áudio.')
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
  return true
}

export function stopSpeaking(): void {
  if (!isTtsSupported()) return
  window.speechSynthesis.cancel()
}

/**
 * As vozes carregam de forma assíncrona em alguns browsers: sem este aviso,
 * a primeira leitura sai com a voz errada.
 */
export function onVoicesChanged(callback: () => void): () => void {
  if (!isTtsSupported()) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', callback)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', callback)
}
