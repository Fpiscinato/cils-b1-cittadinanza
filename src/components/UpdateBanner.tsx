/**
 * Banner de estado do PWA.
 *
 * A app regista o service worker ela própria (`virtual:pwa-register`), por isso
 * o banner é também o botão de "actualizar já" quando há uma versão nova.
 *
 * Regra de UX: o banner nunca bloqueia a app. Fica acima do menu inferior no
 * telemóvel e no canto inferior direito no portátil.
 */

import { CloudDownload, RefreshCw } from 'lucide-react'

export type PwaBannerState = 'none' | 'offline-ready' | 'update-available'

export function UpdateBanner({
  state,
  onApply,
  onDismiss,
}: {
  state: PwaBannerState
  onApply: () => void
  onDismiss: () => void
}) {
  if (state === 'none') return null

  const isUpdate = state === 'update-available'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-[4.75rem] z-40 md:inset-x-auto md:bottom-4 md:right-4 md:w-96"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-teal-300 bg-white p-3 shadow-lg dark:border-teal-700 dark:bg-slate-800">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
          {isUpdate ? <RefreshCw size={18} /> : <CloudDownload size={18} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
            {isUpdate ? 'Nova versão disponível' : 'App pronto para usar offline'}
          </p>
          <p className="text-[11px] font-semibold leading-snug text-slate-500">
            {isUpdate
              ? 'Toca em actualizar para usar a versão mais recente.'
              : 'Já podes estudar sem internet.'}
          </p>
        </div>
        {isUpdate ? (
          <button
            type="button"
            onClick={onApply}
            className="shrink-0 rounded-xl bg-teal-700 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-800"
          >
            Actualizar
          </button>
        ) : null}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-black text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
