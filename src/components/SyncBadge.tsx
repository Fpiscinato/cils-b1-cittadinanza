import { Cloud, CloudCheck, CloudOff, CloudSync } from 'lucide-react'
import type { SyncStatus } from '../services/gistSync'

/**
 * Estado do sync por Gist, no canto superior direito.
 *
 * Regra pedida pela aluna:
 * - nuvem VERDE quando o sync está OK (último sync sem erro);
 * - nuvem LARANJA quando não está (sem token, nunca sincronizado ou erro).
 */
export function SyncBadge({
  status,
  onClick,
}: {
  status: SyncStatus
  onClick: () => void
}) {
  const green = status.state === 'ok'
  const syncing = status.state === 'syncing'

  const icon = green ? (
    <CloudCheck size={20} />
  ) : syncing ? (
    <CloudSync size={20} className="animate-spin" />
  ) : status.state === 'error' ? (
    <CloudOff size={20} />
  ) : (
    <Cloud size={20} />
  )

  const label = green
    ? `Sync OK — último em ${status.lastSyncAt ? new Date(status.lastSyncAt).toLocaleString('pt-PT') : '—'}`
    : syncing
      ? 'A sincronizar…'
      : status.state === 'error'
        ? `Sync com erro: ${status.lastError ?? 'erro desconhecido'}`
        : status.state === 'disabled'
          ? 'Sync por Gist não ativado — clica para ativar'
          : 'Sync ainda não foi feito — clica para ativar'

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
        green
          ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
          : 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
      }`}
    >
      {icon}
    </button>
  )
}
