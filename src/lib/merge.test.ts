import { describe, expect, it } from 'vitest'
import { mergeRecords, sessionTimestamp } from './merge'

interface Row {
  id: string
  at: number
  value: string
}

describe('merge entre aparelhos', () => {
  it('o registo mais novo vence', () => {
    const local: Row[] = [{ id: 'a', at: 100, value: 'local' }]
    const remote: Row[] = [{ id: 'a', at: 200, value: 'remoto' }]
    const result = mergeRecords(local, remote, (row) => row.at)
    expect(result.merged).toHaveLength(1)
    expect(result.merged[0]?.value).toBe('remoto')
    expect(result.updated).toBe(1)
    expect(result.kept).toBe(0)
  })

  it('um registo local mais recente é preservado', () => {
    const local: Row[] = [{ id: 'a', at: 300, value: 'local' }]
    const remote: Row[] = [{ id: 'a', at: 200, value: 'remoto' }]
    const result = mergeRecords(local, remote, (row) => row.at)
    expect(result.merged[0]?.value).toBe('local')
    expect(result.kept).toBe(1)
  })

  it('nada local é apagado', () => {
    const local: Row[] = [
      { id: 'a', at: 100, value: 'a' },
      { id: 'b', at: 100, value: 'b' },
    ]
    const remote: Row[] = [{ id: 'c', at: 100, value: 'c' }]
    const result = mergeRecords(local, remote, (row) => row.at)
    expect(result.merged).toHaveLength(3)
    expect(result.added).toBe(1)
  })

  it('a data de referência de uma prova é a data de conclusão', () => {
    expect(sessionTimestamp({ completedAt: 500, startedAt: 100 })).toBe(500)
    expect(sessionTimestamp({ completedAt: null, startedAt: 100 })).toBe(100)
  })
})
