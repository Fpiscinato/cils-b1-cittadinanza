import { Monitor, Moon, Sun } from 'lucide-react'
import type { Theme } from '../lib/theme'

/**
 * Botão de tema: claro → escuro → sistema.
 * O estado effective (light/dark) decide o ícone; o ciclo é explícito para
 * que a aluna nunca fique presa num modo que não escolheu.
 */
export function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Theme
  onChange: (theme: Theme) => void
}) {
  const next: Record<Theme, Theme> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  }

  const icon =
    theme === 'light' ? (
      <Sun size={18} />
    ) : theme === 'dark' ? (
      <Moon size={18} />
    ) : (
      <Monitor size={18} />
    )

  const label =
    theme === 'light'
      ? 'Tema claro — clica para o escuro'
      : theme === 'dark'
        ? 'Tema escuro — clica para o do sistema'
        : 'Tema do sistema — clica para o claro'

  return (
    <button
      type="button"
      onClick={() => onChange(next[theme])}
      title={label}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {icon}
    </button>
  )
}
