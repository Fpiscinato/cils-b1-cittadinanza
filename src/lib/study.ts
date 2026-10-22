import type { Skill } from '../db/schemas'

/** Tipo de habilidade que o estudo (nível) vai treinar. */
export function studySkill(kind: 'exercises' | 'ascolto' | 'lettura'): Skill {
  return kind === 'ascolto' ? 'ascolto' : 'lettura'
}
