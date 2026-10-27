/**
 * Snapshots locais de segurança (o "undo" do dia a dia).
 *
 * A app é offline-first: o histórico vive no IndexedDB deste dispositivo. Se o
 * browser limpar os dados, perde-se tudo. Por isso, de tempos em tempos, o
 * progresso é copiado para `localStorage` (que sobrevive ao "limpar dados do
 * site" na maioria dos browsers) e pode ser restaurado a partir dos Ajustes.
 */

import { db } from '../db/database'
import {
  dataFingerprint,
  listSnapshots,
  readSnapshot,
  saveSnapshot,
  shouldCreateSnapshot,
  snapshotPayloadSchema,
  type SnapshotMeta,
  type SnapshotPayload,
} from '../lib/snapshot'
import { mergeRecords, sessionTimestamp } from '../lib/merge'
import type { GistPayload } from '../db/schemas'

async function collectPayload(): Promise<SnapshotPayload> {
  const [profiles, sessions, attempts, writings, orals] = await Promise.all([
    db.profiles.toArray(),
    db.sessions.toArray(),
    db.attempts.toArray(),
    db.writings.toArray(),
    db.orals.toArray(),
  ])
  const latest = sessions.reduce(
    (top, session) => Math.max(top, sessionTimestamp(session)),
    0,
  )
  return {
    app: 'CILS B1 Cittadinanza',
    kind: 'snapshot',
    version: 1,
    createdAt: Date.now(),
    fingerprint: dataFingerprint({
      sessions: sessions.length,
      attempts: attempts.length,
      writings: writings.length,
      orals: orals.length,
      latest,
    }),
    profiles,
    sessions,
    attempts,
    writings,
    orals,
  }
}

/**
 * Cria um snapshot se o dado mudou desde o último (e já passou uma hora).
 * Devolve null quando não foi necessário criar.
 */
export async function createSnapshotIfChanged(now = Date.now()): Promise<SnapshotMeta | null> {
  const existing = listSnapshots()
  const payload = await collectPayload()
  if (!shouldCreateSnapshot(existing, payload.fingerprint, now)) return null
  return saveSnapshot(payload)
}

/** Snapshot manual (botão "Criar snapshot agora"). */
export async function createSnapshotNow(): Promise<SnapshotMeta> {
  const payload = await collectPayload()
  return saveSnapshot(payload)
}

/**
 * Restaura um snapshot.
 * O merge é "o registro mais novo vence" — restaurar um snapshot antigo nunca
 * apaga trabalho mais recente.
 */
export async function restoreSnapshot(id: string): Promise<{ added: number; updated: number }> {
  const stored = readSnapshot(id)
  if (!stored) throw new Error('Snapshot não encontrado.')

  const [localProfiles, localSessions, localAttempts, localWritings, localOrals] =
    await Promise.all([
      db.profiles.toArray(),
      db.sessions.toArray(),
      db.attempts.toArray(),
      db.writings.toArray(),
      db.orals.toArray(),
    ])

  const profiles = mergeRecords(localProfiles, stored.profiles, (p) => p.updatedAt)
  const sessions = mergeRecords(localSessions, stored.sessions, sessionTimestamp)
  const attempts = mergeRecords(localAttempts, stored.attempts, (a) => a.timestamp)
  const writings = mergeRecords(localWritings, stored.writings, (w) => w.createdAt)
  const orals = mergeRecords(localOrals, stored.orals, (o) => o.createdAt)

  await db.transaction(
    'rw',
    [db.profiles, db.sessions, db.attempts, db.writings, db.orals],
    async () => {
      await db.profiles.bulkPut(profiles.merged)
      await db.sessions.bulkPut(sessions.merged)
      await db.attempts.bulkPut(attempts.merged)
      await db.writings.bulkPut(writings.merged)
      await db.orals.bulkPut(orals.merged)
    },
  )

  return {
    added: profiles.added + sessions.added + attempts.added + writings.added + orals.added,
    updated:
      profiles.updated + sessions.updated + attempts.updated + writings.updated + orals.updated,
  }
}

/** Valida um texto de snapshot (usado quando se importa um arquivo à mão). */
export function parseSnapshotPayload(text: string): SnapshotPayload {
  const parsed = snapshotPayloadSchema.safeParse(JSON.parse(text))
  if (!parsed.success) {
    throw new Error('Esse arquivo não é um snapshot válido do CILS B1.')
  }
  return parsed.data
}

/** Converte um snapshot no payload de sync (mesma forma de dado). */
export function snapshotToSyncPayload(snapshot: SnapshotPayload): GistPayload {
  return {
    app: 'CILS B1 Cittadinanza',
    kind: 'gist-sync',
    version: 1,
    createdAt: snapshot.createdAt,
    profiles: snapshot.profiles,
    sessions: snapshot.sessions,
    attempts: snapshot.attempts,
    writings: snapshot.writings,
    orals: snapshot.orals,
  }
}
