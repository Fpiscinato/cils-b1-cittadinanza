import { describe, expect, it } from 'vitest'
import { averageTrackedTime, elapsedSeconds, formatDuration, isTrackedTime, MAX_TRACKED_SECONDS } from './timing'

describe('tempo', () => {
  it('formata a duração', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(600)).toBe('10:00')
    expect(formatDuration(3661)).toBe('1:01:01')
    expect(formatDuration(0)).toBe('0:00')
  })

  it('calcula o tempo decorrido', () => {
    expect(elapsedSeconds(1000, 61000)).toBe(60)
    expect(elapsedSeconds(61000, 1000)).toBe(0)
  })

  it('ignora tempos anómalos (aba deixada aberta)', () => {
    expect(isTrackedTime(30)).toBe(true)
    expect(isTrackedTime(MAX_TRACKED_SECONDS)).toBe(true)
    expect(isTrackedTime(MAX_TRACKED_SECONDS + 1)).toBe(false)
    expect(isTrackedTime(0)).toBe(false)
  })

  it('a média só usa tempos reais', () => {
    expect(averageTrackedTime([10, 20, 30, 9999])).toBe(20)
    expect(averageTrackedTime([])).toBe(0)
  })
})
