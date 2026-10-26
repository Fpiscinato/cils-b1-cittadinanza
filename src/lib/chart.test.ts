import { describe, expect, it } from 'vitest'
import { buildScoreSeries, buildSkillSeries, summarizeSeries } from './chart'
import type { Session } from '../db/schemas'

function session(overrides: Partial<Session>): Session {
  return {
    id: overrides.id ?? `s-${Math.random().toString(36).slice(2)}`,
    profileId: 'profile-test',
    mode: 'mock_cittadinanza',
    status: 'completed',
    title: 'Prova',
    startedAt: 1000,
    completedAt: 2000,
    totalTimeSeconds: 600,
    score: 30,
    perSkill: { ascolto: 8, lettura: 7, scrittura: 8, orale: 7 },
    ...overrides,
  }
}

describe('séries para o gráfico', () => {
  it('ignora as provas não concluídas', () => {
    const series = buildScoreSeries([
      session({ id: 'a' }),
      session({ id: 'b', status: 'abandoned', score: 10 }),
      session({ id: 'c', status: 'in_progress', score: 5 }),
    ])
    expect(series).toHaveLength(1)
    expect(series[0]?.id).toBe('a')
  })

  it('ignora as sessões de estudo (o gráfico é das provas)', () => {
    const series = buildScoreSeries([
      session({ id: 'prova' }),
      session({ id: 'estudo', mode: 'studio', score: 9, perSkill: { lettura: 9 } }),
    ])
    expect(series.map((point) => point.id)).toEqual(['prova'])
  })

  it('ordena da mais antiga para a mais recente', () => {
    const series = buildScoreSeries([
      session({ id: 'novo', startedAt: 5000, completedAt: 6000, score: 40 }),
      session({ id: 'velho', startedAt: 1000, completedAt: 2000, score: 20 }),
    ])
    expect(series.map((point) => point.id)).toEqual(['velho', 'novo'])
    expect(series[0]?.value).toBe(20)
    expect(series[1]?.value).toBe(40)
  })

  it('a série por habilidade só inclui as provas que a têm', () => {
    const series = buildSkillSeries(
      [
        session({ id: 'a', perSkill: { ascolto: 9 } }),
        session({ id: 'b', perSkill: { lettura: 5 } }),
      ],
      'ascolto',
    )
    expect(series).toHaveLength(1)
    expect(series[0]?.value).toBe(9)
  })

  it('summarizeSeries dá o resumo da evolução', () => {
    const summary = summarizeSeries(buildScoreSeries([
      session({ id: 'a', startedAt: 1000, completedAt: 1000, score: 20 }),
      session({ id: 'b', startedAt: 2000, completedAt: 2000, score: 30 }),
      session({ id: 'c', startedAt: 3000, completedAt: 3000, score: 25 }),
    ]))
    expect(summary.count).toBe(3)
    expect(summary.best).toBe(30)
    expect(summary.average).toBe(25)
    expect(summary.last).toBe(25)
    expect(summary.delta).toBe(5)
  })

  it('summarizeSeries de uma série vazia não rebenta', () => {
    const summary = summarizeSeries([])
    expect(summary.count).toBe(0)
    expect(summary.last).toBeNull()
    expect(summary.delta).toBe(0)
  })
})
