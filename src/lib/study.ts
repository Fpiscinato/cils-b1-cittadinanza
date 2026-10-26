import type { Level, Phase, Skill } from '../db/schemas'
import type { BuildOptions } from './examBuilder'

/** Tipo de material do estudo (o "caderno de exercícios" e as duas habilidades). */
export type StudyKind = 'exercises' | 'ascolto' | 'lettura'

export interface StudyRequest {
  level: Level
  kind: StudyKind
  /** Fase do plano (opcional; o nível já a determina por omissão). */
  phase?: Phase
}

export const STUDY_KIND_LABELS: Record<StudyKind, string> = {
  exercises: 'Exercícios',
  ascolto: 'Ascolto',
  lettura: 'Lettura',
}

/** Tipo de habilidade que o estudo (nível) vai treinar. */
export function studySkill(kind: StudyKind): Skill {
  return kind === 'ascolto' ? 'ascolto' : 'lettura'
}

/**
 * Opções de montagem de uma sessão de estudo.
 *
 * - `exercises`: só o banco de estudo (`taskId` começado por `studio-`) — são
 *   as lacunas, as frases para completar e o vocabulário, como numa apostila;
 * - `ascolto`/`lettura`: o material de prática do nível, no formato da prova.
 *
 * As sessões são sempre baralhadas e limitadas: cada dia é um dia novo.
 */
export function buildStudyOptions(request: StudyRequest): BuildOptions {
  return {
    bank: 'all',
    level: request.level,
    phase: request.phase,
    skill: studySkill(request.kind),
    origin: request.kind === 'exercises' ? 'study' : 'practice',
    shuffle: true,
    limit: request.kind === 'exercises' ? 12 : 10,
  }
}
