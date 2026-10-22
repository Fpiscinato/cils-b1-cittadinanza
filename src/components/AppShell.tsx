import type { ReactNode } from 'react'
import { BarChart3, ClipboardCheck, GraduationCap, Settings, Target } from 'lucide-react'

export type Route = 'dashboard' | 'practice' | 'mock' | 'progress' | 'settings'

const NAV: Array<{ id: Route; label: string; icon: ReactNode }> = [
  { id: 'dashboard', label: 'Painel', icon: <Target size={20} /> },
  { id: 'practice', label: 'Prática', icon: <GraduationCap size={20} /> },
  { id: 'mock', label: 'Simulado', icon: <ClipboardCheck size={20} /> },
  { id: 'progress', label: 'Progresso', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'Ajustes', icon: <Settings size={20} /> },
]

/**
 * Shell da app. No telemóvel o menu inferior mostra sempre onde se está
 * (tab ativa com barra colorida, tile preenchido e label em negrito).
 */
export function AppShell({
  route,
  onNavigate,
  children,
}: {
  route: Route
  onNavigate: (route: Route) => void
  children: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-base font-black text-slate-900 dark:text-slate-100">
              CILS B1 Cittadinanza
            </p>
            <p className="text-[11px] font-bold text-slate-500">
              Prep · Università per Stranieri di Siena
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-4 md:pb-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-700 dark:bg-slate-800 md:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = item.id === route
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full flex-col items-center gap-0.5 border-t-2 py-2 text-[10px] ${
                    active
                      ? 'border-teal-600 font-black text-teal-700 dark:text-teal-300'
                      : 'border-transparent font-bold text-slate-500'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      active ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
