/**
 * Merge de registros entre dispositivos.
 *
 * Regra única (a mesma do `db/merge.ts` do Memoriza): **o registro mais novo
 * vence** e **nada local é apagado**. Um sync nunca pode destruir trabalho
 * feito offline — no máximo, o registro local mais antigo é substituído por uma
 * versão mais recente vinda do outro dispositivo.
 */

export interface MergeResult<T> {
  merged: T[]
  /** Registros que só existiam no lado remoto. */
  added: number
  /** Registros locais substituídos por uma versão mais recente. */
  updated: number
  /** Registros locais mantidos porque eram mais novos. */
  kept: number
}

export function mergeRecords<T extends { id: string }>(
  local: T[],
  remote: T[],
  timestamp: (record: T) => number,
): MergeResult<T> {
  const byId = new Map<string, T>()
  for (const record of local) byId.set(record.id, record)

  let added = 0
  let updated = 0
  let kept = 0

  for (const record of remote) {
    const current = byId.get(record.id)
    if (!current) {
      byId.set(record.id, record)
      added += 1
      continue
    }
    if (timestamp(record) > timestamp(current)) {
      byId.set(record.id, record)
      updated += 1
    } else {
      kept += 1
    }
  }

  return { merged: [...byId.values()], added, updated, kept }
}

/** Timestamp de referência de uma prova (quando acabou, ou quando começou). */
export function sessionTimestamp(session: {
  completedAt: number | null
  startedAt: number
}): number {
  return session.completedAt ?? session.startedAt
}
