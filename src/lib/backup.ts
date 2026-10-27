/**
 * Backup em JSON: exportar, importar e restaurar.
 *
 * Mesma forma do ElevenSpark (`src/lib/backup.ts`) — todo o arquivo é validado
 * com Zod antes de tocar no banco, e a restauração acontece numa transação
 * Dexie para nunca deixar o banco pela metade.
 */

import { db } from '../db/database'
import { backupSchema, type Backup } from '../db/schemas'

/** Marque local de "já exportaste um backup" (usada nos primeiros passos). */
export const BACKUP_EXPORTED_KEY = 'cils.backup.exported'

export async function buildBackup(): Promise<Backup> {
  const [profiles, passages, questions, sessions, attempts, writings, orals] = await Promise.all([
    db.profiles.toArray(),
    db.passages.toArray(),
    db.questions.toArray(),
    db.sessions.toArray(),
    db.attempts.toArray(),
    db.writings.toArray(),
    db.orals.toArray(),
  ])
  return backupSchema.parse({
    app: 'CILS B1 Cittadinanza',
    version: 1,
    exportedAt: Date.now(),
    profiles,
    passages,
    questions,
    sessions,
    attempts,
    writings,
    orals,
  })
}

export function serializeBackup(backup: Backup): string {
  return JSON.stringify(backup, null, 2)
}

export function triggerDownload(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function backupFilename(): string {
  const d = new Date()
  const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return `cils-b1-backup-${ymd}.json`
}

export function parseBackup(text: string): Backup {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('Esse arquivo não é um JSON válido. Escolha um arquivo de backup do CILS B1.')
  }
  const result = backupSchema.safeParse(raw)
  if (!result.success) {
    const first = result.error.issues[0]
    const path = first.path.join('.') || 'arquivo'
    throw new Error(`Este backup não é válido (${path}: ${first.message}).`)
  }
  return result.data
}

/**
 * Restaura um backup. Substitui TODO o conteúdo — por isso o backup tem de
 * estar completo antes de chamar isto.
 */
export async function restoreBackup(backup: Backup): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.profiles,
      db.passages,
      db.questions,
      db.sessions,
      db.attempts,
      db.writings,
      db.orals,
    ],
    async () => {
      await db.profiles.clear()
      await db.passages.clear()
      await db.questions.clear()
      await db.sessions.clear()
      await db.attempts.clear()
      await db.writings.clear()
      await db.orals.clear()
      await db.profiles.bulkPut(backup.profiles)
      await db.passages.bulkPut(backup.passages)
      await db.questions.bulkPut(backup.questions)
      await db.sessions.bulkPut(backup.sessions)
      await db.attempts.bulkPut(backup.attempts)
      await db.writings.bulkPut(backup.writings)
      await db.orals.bulkPut(backup.orals)
    },
  )
}
