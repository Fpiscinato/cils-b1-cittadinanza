/**
 * Regras de tempo.
 *
 * O relógio de uma prova é o relógio do exame: quando a última pergunta é
 * respondida, o cronômetro para — o tempo exibido e o tempo gravado têm de ser
 * idênticos, senão o histórico de tempo não serve para nada.
 */

/**
 * Tempo máximo que conta como "tempo real de raciocínio". Acima disso é anomalia
 * (aba deixada aberta) e não pode distorcer a média de tempo.
 */
export const MAX_TRACKED_SECONDS = 300

export function nowSeconds(): number {
  return Math.round(Date.now() / 1000)
}

export function elapsedSeconds(startedAtMs: number, endedAtMs: number = Date.now()): number {
  return Math.max(0, Math.round((endedAtMs - startedAtMs) / 1000))
}

/** 65 -> "1:05", 3661 -> "1:01:01". */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const mm = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes)
  const ss = String(seconds).padStart(2, '0')
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`
}

/** Tempo de uma pergunta que entra nas médias (anomalias são ignoradas). */
export function isTrackedTime(seconds: number): boolean {
  return Number.isFinite(seconds) && seconds > 0 && seconds <= MAX_TRACKED_SECONDS
}

/** Média de tempo real, ignorando anomalias. */
export function averageTrackedTime(secondsList: readonly number[]): number {
  const tracked = secondsList.filter(isTrackedTime)
  if (tracked.length === 0) return 0
  const sum = tracked.reduce((total, value) => total + value, 0)
  return Math.round(sum / tracked.length)
}
