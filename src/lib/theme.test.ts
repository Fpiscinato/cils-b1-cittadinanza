// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest'
import {
  applyTheme,
  isTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  THEME_STORAGE_KEY,
} from './theme'

describe('tema claro/escuro', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
  })

  it('resolveTheme aplica a preferência explícita', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('resolveTheme segue o sistema quando o tema é "system"', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('o tema é guardado e lido do localStorage', () => {
    storeTheme('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('um valor inválido no localStorage cai no tema do sistema', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'roxo')
    expect(readStoredTheme()).toBe('system')
    expect(isTheme('roxo')).toBe(false)
    expect(isTheme('light')).toBe(true)
  })

  it('applyTheme põe a classe "dark" no documento', () => {
    expect(applyTheme('dark', false)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')

    expect(applyTheme('light', true)).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('applyTheme com "system" segue a preferência do sistema', () => {
    expect(applyTheme('system', true)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
