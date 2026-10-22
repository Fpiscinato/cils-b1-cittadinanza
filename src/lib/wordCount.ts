/**
 * Contagem de palavras para a prova de escrita (80-120 parole).
 *
 * Regras praticadas pelo CILS: palavras separadas por espaço contam como uma
 * palavra cada; a pontuação não conta; "l'acqua" é uma palavra só; números
 * contam como palavra.
 */

export interface WordCountResult {
  words: number
  min: number
  max: number
  /** true quando a contagem está dentro da faixa exigida. */
  inRange: boolean
  /** Quantas palavras faltam (quando abaixo) ou quantas excedem (quando acima). */
  delta: number
}

export function countWords(text: string): number {
  if (!text) return 0
  const tokens = text
    .split(/\s+/)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter((token) => token.length > 0)
  return tokens.length
}

export function checkWordCount(text: string, min: number, max: number): WordCountResult {
  const words = countWords(text)
  const inRange = words >= min && words <= max
  return {
    words,
    min,
    max,
    inRange,
    delta: words < min ? min - words : words > max ? words - max : 0,
  }
}
