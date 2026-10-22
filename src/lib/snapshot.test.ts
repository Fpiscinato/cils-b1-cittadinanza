// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest'
import {
  dataFingerprint,
  deleteSnapshot,
  listSnapshots,
  pruneSnapshots,
  readSnapshot,
  saveSnapshot,
  shouldCreateSnapshot,
  SNAPSHOT_INDEX_KEY,
  snapshotPayloadSchema,
  type SnapshotPayload,
} from './snapshot'

function payload(createdAt: number, fingerprint: string): SnapshotPayload {
  return {
    app: 'CILS B1 Cittadinanza',
    kind: 'snapshot',
    version: 1,
    createdAt,
    fingerprint,
    profiles: [],
    sessions: [],
    attempts: [],
    writings: [],
    orals: [],
  }
}

describe('snapshots locais', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('guarda e lê um snapshot', () => {
    const meta = saveSnapshot(payload(1000, 'a'))
    expect(listSnapshots()).toHaveLength(1)
    expect(meta.bytes).toBeGreaterThan(0)
    expect(readSnapshot(meta.id)?.fingerprint).toBe('a')
  })

  it('apaga um snapshot', () => {
    const meta = saveSnapshot(payload(1000, 'a'))
    deleteSnapshot(meta.id)
    expect(listSnapshots()).toHaveLength(0)
    expect(readSnapshot(meta.id)).toBeNull()
  })

  it('mantém no máximo MAX_SNAPSHOTS (os mais recentes)', () => {
    for (let index = 0; index < 12; index += 1) {
      saveSnapshot(payload(1000 + index, `f${index}`))
    }
    const snapshots = listSnapshots()
    expect(snapshots.length).toBeLessThanOrEqual(8)
    expect(snapshots[0]?.fingerprint).toBe('f11')
  })

  it('pruneSnapshots remove as cópias mais antigas', () => {
    for (let index = 0; index < 5; index += 1) saveSnapshot(payload(1000 + index, `f${index}`))
    const removed = pruneSnapshots(3)
    expect(removed).toBe(2)
    expect(listSnapshots()).toHaveLength(3)
  })

  it('a impressão digital muda quando o progresso muda', () => {
    const a = dataFingerprint({ sessions: 1, attempts: 2, writings: 0, orals: 0, latest: 10 })
    const b = dataFingerprint({ sessions: 1, attempts: 3, writings: 0, orals: 0, latest: 10 })
    expect(a).not.toBe(b)
  })

  it('cria snapshot quando o dado mudou (e passou uma hora)', () => {
    const existing = listSnapshots()
    const now = 10 * 60 * 60 * 1000
    // Sem snapshots anteriores: cria.
    expect(shouldCreateSnapshot(existing, 'a', now)).toBe(true)

    saveSnapshot(payload(now - 30 * 60 * 1000, 'a'))
    const withOne = listSnapshots()
    // Dado igual: não cria.
    expect(shouldCreateSnapshot(withOne, 'a', now)).toBe(false)
    // Dado diferente, mas há menos de uma hora: não cria (para não spammar).
    expect(shouldCreateSnapshot(withOne, 'b', now)).toBe(false)
    // Dado diferente e passou mais de uma hora: cria.
    expect(shouldCreateSnapshot(withOne, 'b', now + 2 * 60 * 60 * 1000)).toBe(true)
  })

  it('o índice no localStorage é uma lista válida', () => {
    saveSnapshot(payload(1000, 'a'))
    const raw = window.localStorage.getItem(SNAPSHOT_INDEX_KEY)
    expect(raw).toBeTruthy()
    expect(Array.isArray(JSON.parse(raw as string))).toBe(true)
  })

  it('o payload tem o formato validado pelo schema', () => {
    const result = snapshotPayloadSchema.safeParse(payload(1000, 'a'))
    expect(result.success).toBe(true)
  })
})
