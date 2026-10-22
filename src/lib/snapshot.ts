/**
 * Snapshot local de segurança.
 *
 * A app vive 100% offline (IndexedDB). Se a aluna limpar os dados do browser,
 * perde o histórico — por isso guardamos cópias automáticas do **dado do
 * utilizador** (provas, tentativas, textos) em `localStorage`, que sobrevive ao
 * "limpar dados do site" em quase todos os browsers.
 *
 * O conteúdo do banco (passagens e perguntas) NÃO entra no snapshot: é
 * re-seedado automaticamente pelo `syncQuestionBank()`.
 */

import { z } from 'zod'
import {
  attemptSchema,
  oralSchema,
  profileSchema,
  sessionSchema,
  writingSchema,
} from '../db/schemas'

export const SNAPSHOT_INDEX_KEY = 'cils.snapshot.index'
export const SNAPSHOT_DATA_PREFIX = 'cils.snapshot.data.'
export const SNAPSHOT_KIND = 'snapshot'
export const MAX_SNAPSHOTS = 8

/** Payload do snapshot — apenas o dado da aluna. */
export const snapshotPayloadSchema = z.object({
  app: z.literal('CILS B1 Cittadinanza'),
  kind: z.literal(SNAPSHOT_KIND),
  version: z.number().int().positive(),
  createdAt: z.number().int(),
  fingerprint: z.string().min(1),
  profiles: z.array(profileSchema),
  sessions: z.array(sessionSchema),
  attempts: z.array(attemptSchema),
  writings: z.array(writingSchema),
  orals: z.array(oralSchema),
})
export type SnapshotPayload = z.infer<typeof snapshotPayloadSchema>

export interface SnapshotMeta {
  id: string
  createdAt: number
  fingerprint: string
  bytes: number
  counts: {
    sessions: number
    attempts: number
    writings: number
    orals: number
  }
}

function safeLocalStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function snapshotId(createdAt: number): string {
  return `snap-${createdAt.toString(36)}`
}

function readIndex(): SnapshotMeta[] {
  const storage = safeLocalStorage()
  if (!storage) return []
  try {
    const raw = storage.getItem(SNAPSHOT_INDEX_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is SnapshotMeta =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as SnapshotMeta).id === 'string' &&
        typeof (item as SnapshotMeta).createdAt === 'number',
    )
  } catch {
    return []
  }
}

function writeIndex(index: SnapshotMeta[]): void {
  const storage = safeLocalStorage()
  if (!storage) return
  try {
    storage.setItem(SNAPSHOT_INDEX_KEY, JSON.stringify(index))
  } catch {
    /* quota cheia: o snapshot anterior continua válido */
  }
}

export function listSnapshots(): SnapshotMeta[] {
  return readIndex().sort((a, b) => b.createdAt - a.createdAt)
}

export function readSnapshot(id: string): SnapshotPayload | null {
  const storage = safeLocalStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(`${SNAPSHOT_DATA_PREFIX}${id}`)
    if (!raw) return null
    const parsed = snapshotPayloadSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function deleteSnapshot(id: string): void {
  const storage = safeLocalStorage()
  if (!storage) return
  try {
    storage.removeItem(`${SNAPSHOT_DATA_PREFIX}${id}`)
  } catch {
    /* ignore */
  }
  writeIndex(readIndex().filter((item) => item.id !== id))
}

/** Mantém no máximo `MAX_SNAPSHOTS` cópias (as mais recentes). */
export function pruneSnapshots(max = MAX_SNAPSHOTS): number {
  const index = listSnapshots()
  if (index.length <= max) return 0
  const removed = index.slice(max)
  for (const item of removed) deleteSnapshot(item.id)
  return removed.length
}

/**
 * Impressão digital do dado: muda quando há trabalho novo. Usada para não
 * criar cópias idênticas uma vez por hora.
 */
export function dataFingerprint(input: {
  sessions: number
  attempts: number
  writings: number
  orals: number
  latest: number
}): string {
  return `${input.sessions}:${input.attempts}:${input.writings}:${input.orals}:${input.latest}`
}

const MIN_INTERVAL_MS = 60 * 60 * 1000 // 1 hora

/**
 * Decide se vale a pena criar um snapshot agora:
 * - o dado mudou desde o último snapshot; e
 * - o último snapshot tem mais de uma hora (ou não existe).
 */
export function shouldCreateSnapshot(
  existing: SnapshotMeta[],
  fingerprint: string,
  now: number,
): boolean {
  const last = existing[0]
  if (!last) return true
  if (last.fingerprint !== fingerprint) return now - last.createdAt >= MIN_INTERVAL_MS
  return false
}

export function saveSnapshot(payload: SnapshotPayload): SnapshotMeta {
  const storage = safeLocalStorage()
  const text = JSON.stringify(payload)
  const meta: SnapshotMeta = {
    id: snapshotId(payload.createdAt),
    createdAt: payload.createdAt,
    fingerprint: payload.fingerprint,
    bytes: text.length,
    counts: {
      sessions: payload.sessions.length,
      attempts: payload.attempts.length,
      writings: payload.writings.length,
      orals: payload.orals.length,
    },
  }
  if (storage) {
    try {
      storage.setItem(`${SNAPSHOT_DATA_PREFIX}${meta.id}`, text)
    } catch {
      /* quota cheia: seguimos, mas sem guardar */
    }
  }
  const index = listSnapshots().filter((item) => item.id !== meta.id)
  index.unshift(meta)
  writeIndex(index)
  pruneSnapshots(MAX_SNAPSHOTS)
  return meta
}
