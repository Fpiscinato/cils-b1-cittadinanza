/**
 * Tema claro / escuro / sistema.
 *
 * A app tem de funcionar offline e sem flicker no arranque: o `index.html`
 * aplica o tema salvo ANTES de o React montar (ver o script inline em
 * `index.html`), e este módulo é a fonte de verdade do comportamento.
 *
 * A classe `dark` é posta no `<html>`; o Tailwind usa a variante
 * `@custom-variant dark (&:where(.dark, .dark *))` (ver `src/index.css`).
 */

export const THEMES = ['light', 'dark', 'system'] as const
export type Theme = (typeof THEMES)[number]

export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'cils.theme'

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

export function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* modo privado: seguimos sem persistir */
  }
}

export function prefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Converte a preferência em tema efetivo. */
export function resolveTheme(theme: Theme, systemPrefersDark: boolean): ResolvedTheme {
  if (theme === 'system') return systemPrefersDark ? 'dark' : 'light'
  return theme
}

/**
 * Aplica o tema ao documento e devolve o tema efetivo.
 * `documentElement` recebe a classe `dark` e o `color-scheme`, para que os
 * controlos nativos do browser (inputs, barras de scroll) acompanhem.
 */
export function applyTheme(theme: Theme, systemPrefersDark = prefersDark()): ResolvedTheme {
  const resolved = resolveTheme(theme, systemPrefersDark)
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    root.style.colorScheme = resolved
    root.dataset.theme = resolved
  }
  return resolved
}
