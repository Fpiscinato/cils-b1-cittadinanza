/**
 * Nível de estudo escolhido pela aluna.
 *
 * Vive no `localStorage` (como o tema): é uma preferência deste aparelho, não
 * um dado de progresso. O histórico de respostas é que diz se o nível já está
 * dominado — ver `src/lib/studyPlan.ts`.
 */

import { LEVELS, type Level } from '../db/schemas'

export const STUDY_LEVEL_STORAGE_KEY = 'cils.studyLevel'
export const DEFAULT_STUDY_LEVEL: Level = 'A1'

export function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && (LEVELS as readonly string[]).includes(value)
}

export function readStudyLevel(): Level {
  try {
    const stored = window.localStorage.getItem(STUDY_LEVEL_STORAGE_KEY)
    return isLevel(stored) ? stored : DEFAULT_STUDY_LEVEL
  } catch {
    return DEFAULT_STUDY_LEVEL
  }
}

export function storeStudyLevel(level: Level): void {
  try {
    window.localStorage.setItem(STUDY_LEVEL_STORAGE_KEY, level)
  } catch {
    /* modo privado: seguimos sem persistir */
  }
}
