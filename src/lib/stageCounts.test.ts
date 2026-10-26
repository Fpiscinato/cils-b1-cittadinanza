import { describe, expect, it } from 'vitest'
import { buildStageCounts } from './stageCounts'

const stage = (
  skill: 'ascolto' | 'lettura' | 'scrittura' | 'orale',
  ids: string[],
  kind: 'objective' | 'writing' | 'oral' = 'objective',
) =>
  kind === 'objective'
    ? { kind, skill, questions: ids.map((id) => ({ id })) }
    : { kind, skill }

describe('buildStageCounts', () => {
  it('conta certas e total por habilidade', () => {
    const counts = buildStageCounts(
      [stage('lettura', ['a', 'b', 'c', 'd'])],
      { a: true, b: false, c: true },
    )
    expect(counts.lettura).toEqual({ correct: 2, total: 4 })
  })

  it('um item não respondido conta como errado (omissão = 0)', () => {
    const counts = buildStageCounts([stage('ascolto', ['a', 'b'])], {})
    expect(counts.ascolto).toEqual({ correct: 0, total: 2 })
  })

  it('soma etapas da mesma habilidade', () => {
    const counts = buildStageCounts(
      [stage('ascolto', ['a', 'b']), stage('ascolto', ['c', 'd'])],
      { a: true, c: true, d: true },
    )
    expect(counts.ascolto).toEqual({ correct: 3, total: 4 })
  })

  it('ignora escrita e oral (têm grelha própria, não itens)', () => {
    const counts = buildStageCounts(
      [stage('lettura', ['a']), stage('scrittura', [], 'writing'), stage('orale', [], 'oral')],
      { a: true },
    )
    expect(counts).toEqual({ lettura: { correct: 1, total: 1 } })
  })

  it('sem etapas objetivas devolve vazio', () => {
    expect(buildStageCounts([], {})).toEqual({})
  })
})
