import { useRef, useState } from 'react'
import {
  ArrowLeft,
  Cloud,
  Download,
  Monitor,
  Moon,
  RefreshCw,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react'
import { Alert, BackButton, Button, Card } from '../components/ui'
import { APP_VERSION } from '../config/version'
import {
  BACKUP_EXPORTED_KEY,
  buildBackup,
  backupFilename,
  parseBackup,
  restoreBackup,
  serializeBackup,
  triggerDownload,
} from '../lib/backup'
import { resetAbandonedMocks, resetAllProgress, updateProfile } from '../lib/admin'
import { THRESHOLD_DISCLAIMER } from '../lib/scoring'
import type { Profile } from '../db/schemas'
import type { Route } from '../lib/routes'
import type { Theme } from '../lib/theme'
import {
  getAutoSync,
  getToken,
  maskToken,
  setAutoSync,
  setToken,
  testToken,
  type SyncStatus,
} from '../services/gistSync'
import { createSnapshotNow, restoreSnapshot } from '../services/snapshots'
import { wipeEverything } from '../services/wipe'
import { deleteSnapshot, listSnapshots, type SnapshotMeta } from '../lib/snapshot'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function SettingsPage({
  profile,
  onChanged,
  onNavigate,
  theme,
  onThemeChange,
  syncStatus,
  onSyncNow,
}: {
  profile: Profile | null
  onChanged: () => void
  onNavigate: (route: Route) => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
  syncStatus: SyncStatus
  onSyncNow: () => Promise<void>
}) {
  const [name, setName] = useState(profile?.name ?? '')
  const [examDate, setExamDate] = useState(profile?.examDate ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [token, setTokenState] = useState(getToken())
  const [autoSync, setAutoSyncState] = useState(getAutoSync())
  const [snapshots, setSnapshots] = useState<SnapshotMeta[]>([])
  const [busy, setBusy] = useState(false)
  const [resetText, setResetText] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  function refreshSnapshots(): void {
    setSnapshots(listSnapshots())
  }

  async function handleExport(): Promise<void> {
    setError(null)
    setMessage(null)
    try {
      const backup = await buildBackup()
      triggerDownload(backupFilename(), serializeBackup(backup))
      try {
        window.localStorage.setItem(BACKUP_EXPORTED_KEY, String(Date.now()))
      } catch {
        /* modo privado */
      }
      setMessage('Backup baixado. Guardá-lo num lugar seguro.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao exportar.')
    }
  }

  async function handleImport(file: File): Promise<void> {
    setError(null)
    setMessage(null)
    try {
      const text = await file.text()
      const backup = parseBackup(text)
      await restoreBackup(backup)
      setMessage('Backup restaurado.')
      onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao importar.')
    }
  }

  async function handleSave(): Promise<void> {
    if (!profile) return
    setError(null)
    setMessage(null)
    try {
      await updateProfile(profile.id, {
        name,
        avatar: profile.avatar,
        examDate,
      })
      setMessage('Perfil salvo.')
      onChanged()
    } catch {
      setError('Não foi possível salvar o perfil.')
    }
  }

  async function handleReset(): Promise<void> {
    if (!profile) return
    const confirmed = window.confirm(
      'Isto remove as sessões em andamento. As provas CONCLUÍDAS são preservadas — são o seu histórico real.\n\nContinuar?',
    )
    if (!confirmed) return
    const result = await resetAbandonedMocks(profile.id)
    setMessage(
      `Removidas ${result.sessionsRemoved} sessões em andamento. Preservadas ${result.sessionsKept} provas concluídas.`,
    )
    onChanged()
  }

  async function handleTestToken(): Promise<void> {
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      setToken(token)
      const result = await testToken()
      if (result.ok) setMessage(result.message)
      else setError(result.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleSync(): Promise<void> {
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      setToken(token)
      await onSyncNow()
    } finally {
      setBusy(false)
    }
  }

  /** Apague TUDO neste dispositivo (progresso, conteúdo, snapshots, sync). */
  async function handleFullReset(): Promise<void> {
    if (resetText.trim().toUpperCase() !== 'APAGAR') return
    const confirmed = window.confirm(
      'Isto apaga TUDO neste dispositivo: todas as provas (inclusive as concluídas), os textos escritos, o banco de conteúdo, os snapshots e o token do GitHub.\n\nNão há como recuperar. Continue?',
    )
    if (!confirmed) return
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      await wipeEverything()
      setResetText('')
      setMessage('Tudo apagado. A app vai recarregar com o conteúdo original.')
      window.setTimeout(() => window.location.reload(), 1200)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao apagar os dados.')
    } finally {
      setBusy(false)
    }
  }

  async function handleResetPractice(): Promise<void> {
    if (!profile) return
    const confirmed = window.confirm(
      'Isto apaga as práticas que ainda estão em andamento e as tentativas órfãs. As provas CONCLUÍDAS ficam intactas.\n\nContinuar?',
    )
    if (!confirmed) return
    const result = await resetAllProgress(profile.id)
    setMessage(
      `Removidas ${result.sessionsRemoved} sessões e ${result.attemptsRemoved} tentativas. Preservadas ${result.sessionsKept} provas concluídas.`,
    )
    onChanged()
  }

  async function handleSnapshot(): Promise<void> {
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      const meta = await createSnapshotNow()
      refreshSnapshots()
      setMessage(`Snapshot criado (${formatBytes(meta.bytes)}).`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao criar o snapshot.')
    } finally {
      setBusy(false)
    }
  }

  async function handleRestoreSnapshot(id: string): Promise<void> {
    const confirmed = window.confirm(
      'Restaurar este snapshot? Os registros mais recentes são preservados — nada é apagado.',
    )
    if (!confirmed) return
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      const outcome = await restoreSnapshot(id)
      setMessage(
        `Snapshot restaurado: ${outcome.added} registro(s) novo(s), ${outcome.updated} atualizado(s).`,
      )
      onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao restaurar o snapshot.')
    } finally {
      setBusy(false)
    }
  }

  const syncGreen = syncStatus.state === 'ok'

  return (
    <div className="flex flex-col gap-3">
      <div>
        <BackButton onBack={() => onNavigate('dashboard')} />
      </div>

      {/* Perfil */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Perfil</p>
        <label className="mt-2 block text-xs font-bold text-slate-600 dark:text-slate-300" htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <label
          className="mt-3 block text-xs font-bold text-slate-600 dark:text-slate-300"
          htmlFor="exam-date"
        >
          Data da prova
        </label>
        <input
          id="exam-date"
          type="date"
          value={examDate}
          onChange={(event) => setExamDate(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <p className="mt-1 text-[11px] font-semibold text-slate-500">
          As 3 fases de preparação são calculadas a partir desta data.
        </p>
        <div className="mt-3">
          <Button onClick={() => void handleSave()}>Salvar</Button>
        </div>
      </Card>

      {/* Aparência */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Aparência</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          O tema fica salvo neste dispositivo.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(
            [
              { id: 'light', label: 'Claro', icon: <Sun size={16} /> },
              { id: 'dark', label: 'Escuro', icon: <Moon size={16} /> },
              { id: 'system', label: 'Sistema', icon: <Monitor size={16} /> },
            ] as const
          ).map((option) => {
            const active = theme === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onThemeChange(option.id)}
                aria-pressed={active}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-black transition ${
                  active
                    ? 'border-teal-600 bg-teal-700 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/60'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Sync por Gist */}
      <Card>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Salvar em outro dispositivo (GitHub Gist)
          </p>
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
              syncGreen
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            <Cloud size={12} /> {syncGreen ? 'SYNC OK' : 'SEM SYNC'}
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          O progresso é enviado para um Gist <strong>privado</strong> do seu GitHub. O token fica só
          neste dispositivo e é usado apenas para a permissão <code>gist</code>. Nada é enviado para
          servidores da app.
        </p>
        <label
          className="mt-3 block text-xs font-bold text-slate-600 dark:text-slate-300"
          htmlFor="gist-token"
        >
          Token pessoal do GitHub {token ? `(${maskToken(token)})` : ''}
        </label>
        <input
          id="gist-token"
          type="password"
          inputMode="text"
          autoComplete="off"
          value={token}
          onChange={(event) => setTokenState(event.target.value)}
          placeholder="ghp_… (personal access token, scope: gist)"
          className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void handleTestToken()} disabled={busy}>
            Testar token
          </Button>
          <Button onClick={() => void handleSync()} disabled={busy}>
            <RefreshCw size={16} /> Sincronizar agora
          </Button>
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(event) => {
              setAutoSyncState(event.target.checked)
              setAutoSync(event.target.checked)
            }}
            className="h-4 w-4 accent-teal-700"
          />
          Sincronizar automaticamente ao abrir a app e depois de cada prova
        </label>
        <p className="mt-2 text-[11px] font-semibold text-slate-500">
          {syncStatus.lastSyncAt
            ? `Último sync: ${new Date(syncStatus.lastSyncAt).toLocaleString('pt-PT')}`
            : 'Ainda não houve sync.'}
          {syncStatus.lastError ? ` Erro: ${syncStatus.lastError}` : ''}
        </p>
      </Card>

      {/* Cópia de segurança */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Cópia de segurança</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Os dados vivem só neste dispositivo (IndexedDB). Se você limpar os dados do browser, perde o
          histórico — exporte um JSON com regularidade. Os snapshots abaixo são cópias automáticas
          salvas no próprio browser.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void handleExport()}>
            <Download size={16} /> Exportar JSON
          </Button>
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            <Upload size={16} /> Importar JSON
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void handleImport(file)
              event.target.value = ''
            }}
          />
        </div>

        <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              Snapshots locais
            </p>
            <Button variant="secondary" onClick={() => void handleSnapshot()} disabled={busy}>
              Criar agora
            </Button>
          </div>
          {snapshots.length === 0 ? (
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Ainda não há snapshots. É criado automaticamente quando o progresso muda.
            </p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1.5">
              {snapshots.map((snapshot) => (
                <li
                  key={snapshot.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-700/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-slate-800 dark:text-slate-100">
                      {new Date(snapshot.createdAt).toLocaleString('pt-PT')}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      {snapshot.counts.sessions} provas · {snapshot.counts.attempts} respostas ·{' '}
                      {formatBytes(snapshot.bytes)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => void handleRestoreSnapshot(snapshot.id)}
                      className="rounded-lg bg-white px-2 py-1 text-[11px] font-black text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Restaurar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteSnapshot(snapshot.id)
                        refreshSnapshots()
                      }}
                      aria-label="Apagar snapshot"
                      className="rounded-lg bg-white p-1.5 text-slate-500 shadow-sm hover:text-rose-600 dark:bg-slate-800"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      {/* Restaurar */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Restaurar o app</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Escolha o que quer apagar. As provas <strong>concluídas</strong> só se perdem no reset
          total (e só com confirmação escrita).
        </p>

        <div className="mt-3 flex flex-col gap-3">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
            <p className="text-xs font-black text-slate-900 dark:text-slate-100">
              Só as sessões em andamento
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Remove práticas e simulados a meio. O histórico fica intacto.
            </p>
            <div className="mt-2">
              <Button variant="secondary" onClick={() => void handleReset()} disabled={busy}>
                Limpar sessões em andamento
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
            <p className="text-xs font-black text-slate-900 dark:text-slate-100">
              Só o progresso de prática
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Apague as práticas e as tentativas órfãs. As provas concluídas ficam.
            </p>
            <div className="mt-2">
              <Button variant="secondary" onClick={() => void handleResetPractice()} disabled={busy}>
                Restaurar só a prática
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 dark:border-rose-800 dark:bg-rose-950/30">
            <p className="text-xs font-black text-rose-900 dark:text-rose-200">
              Apagar tudo (este dispositivo)
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-rose-800 dark:text-rose-300">
              Provas concluídas, textos escritos, banco de conteúdo, snapshots e token do GitHub.
              Não há como recuperar.
            </p>
            <label
              className="mt-2 block text-[11px] font-black uppercase tracking-wide text-rose-900 dark:text-rose-200"
              htmlFor="reset-confirm"
            >
              Escreva APAGAR para confirmar
            </label>
            <input
              id="reset-confirm"
              value={resetText}
              onChange={(event) => setResetText(event.target.value)}
              placeholder="APAGAR"
              autoComplete="off"
              className="mt-1 w-full rounded-xl border border-rose-300 bg-white p-2.5 text-sm font-black uppercase tracking-wide text-slate-900 outline-none focus:border-rose-500 dark:border-rose-800 dark:bg-slate-800 dark:text-slate-100"
            />
            <div className="mt-2">
              <Button
                variant="danger"
                onClick={() => void handleFullReset()}
                disabled={busy || resetText.trim().toUpperCase() !== 'APAGAR'}
              >
                Apagar tudo e recomeçar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Sobre a prova */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Sobre a prova</p>
        <div className="mt-2">
          <Alert tone="teal" title="Limiar de aprovação em uso">
            {THRESHOLD_DISCLAIMER}
          </Alert>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Versão</p>
        <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">v{APP_VERSION}</p>
        <button
          type="button"
          onClick={() => onNavigate('guide')}
          className="mt-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <ArrowLeft size={14} className="rotate-180" /> Ver o guia de uso
        </button>
      </Card>

      {message ? (
        <Alert tone="teal">
          <p>{message}</p>
        </Alert>
      ) : null}
      {error ? (
        <Alert tone="rose">
          <p>{error}</p>
        </Alert>
      ) : null}
    </div>
  )
}
