import { useRef, useState } from 'react'
import { Alert, Button, Card } from '../components/ui'
import { APP_VERSION } from '../config/version'
import {
  buildBackup,
  backupFilename,
  parseBackup,
  restoreBackup,
  serializeBackup,
  triggerDownload,
} from '../lib/backup'
import { resetAbandonedMocks, updateProfile } from '../lib/admin'
import { PASS_THRESHOLD_PER_SKILL, THRESHOLD_DISCLAIMER } from '../lib/scoring'
import type { Profile } from '../db/schemas'

export function SettingsPage({
  profile,
  onChanged,
}: {
  profile: Profile | null
  onChanged: () => void
}) {
  const [name, setName] = useState(profile?.name ?? '')
  const [examDate, setExamDate] = useState(profile?.examDate ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  async function handleExport(): Promise<void> {
    setError(null)
    setMessage(null)
    try {
      const backup = await buildBackup()
      triggerDownload(backupFilename(), serializeBackup(backup))
      setMessage('Backup descarregado. Guardá-lo num sítio seguro.')
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
      setMessage('Perfil guardado.')
      onChanged()
    } catch {
      setError('Não foi possível guardar o perfil.')
    }
  }

  async function handleReset(): Promise<void> {
    if (!profile) return
    const confirmed = window.confirm(
      'Isto remove as sessões por terminar. As provas CONCLUÍDAS são preservadas — são o teu histórico real.\n\nContinuar?',
    )
    if (!confirmed) return
    const result = await resetAbandonedMocks(profile.id)
    setMessage(
      `Removidas ${result.sessionsRemoved} sessões por terminar. Preservadas ${result.sessionsKept} provas concluídas.`,
    )
    onChanged()
  }

  return (
    <div className="flex flex-col gap-3">
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
          <Button onClick={() => void handleSave()}>Guardar</Button>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Cópia de segurança</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Os dados vivem só neste dispositivo (IndexedDB). Se limpares os dados do browser, perdes o
          histórico — exporta um JSON com regularidade.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void handleExport()}>
            ⬇️ Exportar JSON
          </Button>
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            ⬆️ Importar JSON
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
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Limpar</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Remove apenas as sessões por terminar. As provas concluídas são o teu histórico e nunca
          são apagadas.
        </p>
        <div className="mt-3">
          <Button variant="danger" onClick={() => void handleReset()}>
            Limpar sessões por terminar
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Sobre a prova</p>
        <div className="mt-2">
          <Alert tone="teal" title="Limiar de aprovação em uso">
            {PASS_THRESHOLD_PER_SKILL}/12 por habilidade ({PASS_THRESHOLD_PER_SKILL * 4}/48 no
            total). {THRESHOLD_DISCLAIMER}
          </Alert>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Versão</p>
        <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">v{APP_VERSION}</p>
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
