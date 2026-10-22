import type { ReactNode } from 'react'
import {
  BarChart3,
  BookOpen,
  Bug,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Settings,
  Target,
} from 'lucide-react'
import type { Route } from '../lib/routes'
import type { SyncStatus } from '../services/gistSync'
import type { Theme } from '../lib/theme'
import { SyncBadge } from './SyncBadge'
import { ThemeToggle } from './ThemeToggle'
import { APP_VERSION } from '../config/version'

export type { Route } from '../lib/routes'

interface NavItem {
  id: Route
  label: string
  icon: ReactNode
}

/**
 * Menu da app.
 *
 * ORDEM FIXA (a mesma no telemóvel e no portátil) — é a sequência que a aluna
 * deve seguir: Painel → Prática → Simulado → Progresso → Guia → Ajustes.
 */
/**
 * Menu secundário: só aparece no menu lateral do portátil (no telemóvel
 * ficariam 9 itens na barra de baixo e nenhum seria legível).
 */
const EXTRA_NAV: NavItem[] = [
  { id: 'mistakes', label: 'Clínica de erros', icon: <Bug size={18} /> },
  { id: 'foglio', label: 'Foglio risposte', icon: <FileText size={18} /> },
]

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Painel', icon: <Target size={20} /> },
  { id: 'practice', label: 'Prática', icon: <GraduationCap size={20} /> },
  { id: 'mock', label: 'Simulado', icon: <ClipboardCheck size={20} /> },
  { id: 'progress', label: 'Progresso', icon: <BarChart3 size={20} /> },
  { id: 'guide', label: 'Guia', icon: <BookOpen size={20} /> },
  { id: 'settings', label: 'Ajustes', icon: <Settings size={20} /> },
]

/** App icon (SVG inline — funciona em web e em PWA, sem pedido extra). */
export function AppIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="CILS B1 Cittadinanza"
      className="shrink-0 rounded-xl shadow-sm"
    >
      <defs>
        <linearGradient id="cils-app-icon-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="1" stopColor="#0d4a4c" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#cils-app-icon-bg)" />
      <rect x="12.2" y="11.5" width="13.2" height="23" fill="#008c45" />
      <rect x="25.4" y="11.5" width="13.2" height="23" fill="#f4f5f4" />
      <rect x="38.6" y="11.5" width="13.2" height="23" fill="#cd212a" />
      <rect
        x="12.2"
        y="11.5"
        width="39.6"
        height="23"
        rx="3"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <text
        x="32"
        y="55"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="16"
        fontWeight="800"
        fill="#ffffff"
      >
        B1
      </text>
    </svg>
  )
}

/**
 * Shell da app.
 *
 * - Telemóvel: menu inferior fixo, sempre visível, com a aba ativa marcada.
 * - Portátil/tablet: menu lateral fixo, sempre visível (a app nunca fica
 *   "sem menus" em ecrã grande).
 * - Topo: ícone da app (canto superior esquerdo), tema e estado do sync.
 */
export function AppShell({
  route,
  onNavigate,
  children,
  theme,
  onThemeChange,
  syncStatus,
  onSyncClick,
}: {
  route: Route
  onNavigate: (route: Route) => void
  children: ReactNode
  theme: Theme
  onThemeChange: (theme: Theme) => void
  syncStatus: SyncStatus
  onSyncClick: () => void
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-3 py-2 sm:px-4">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            title="Ir para o Painel"
            className="flex min-w-0 items-center gap-2.5 text-left"
          >
            <AppIcon size={36} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-black leading-tight text-slate-900 dark:text-slate-100">
                CILS B1 Cittadinanza
              </span>
              <span className="block truncate text-[10px] font-bold leading-tight text-slate-500">
                Prep · Università per Stranieri di Siena
              </span>
            </span>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle theme={theme} onChange={onThemeChange} />
            <SyncBadge status={syncStatus} onClick={onSyncClick} />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-4 px-3 pb-24 sm:px-4 md:pb-8">
        {/* Menu lateral (portátil e tablet) */}
        <aside className="hidden md:block md:w-52 md:shrink-0 md:py-4">
          <nav aria-label="Menu principal" className="sticky top-[60px]">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => {
                const active = item.id === route
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-black transition ${
                        active
                          ? 'bg-teal-700 text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          active
                            ? 'bg-white/15 text-white'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
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

            <ul className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-3 dark:border-slate-700">
              {EXTRA_NAV.map((item) => {
                const active = item.id === route
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-black transition ${
                        active
                          ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>

            <p className="mt-4 px-3 text-[10px] font-bold text-slate-400">v{APP_VERSION}</p>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 py-4">{children}</main>
      </div>

      {/* Menu inferior (telemóvel) */}
      <nav
        aria-label="Menu principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-700 dark:bg-slate-800 md:hidden"
      >
        <ul className="grid grid-cols-6">
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
