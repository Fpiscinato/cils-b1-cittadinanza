/**
 * Regras de administração dos dados.
 *
 * REGRA DURA: uma prova (mock) concluída é o registro real da aluna e é
 * IMUTÁVEL. Nenhum reset pode apagá-la — nem a "limpeza de progresso", nem o
 * re-seed do banco de conteúdo. O padrão vem do ElevenSpark
 * (`src/lib/admin.ts`), onde a mesma regra já está em produção.
 */

import { db } from '../db/database'
import { DEFAULT_PROFILE_ID, type Profile, type Session } from '../db/schemas'

export const ACTIVE_PROFILE_KEY = 'cils.active_profile_id'
export const BANK_VERSION_KEY = 'cils.bank_version'

export function getActiveProfileId(): string {
  try {
    return window.localStorage.getItem(ACTIVE_PROFILE_KEY) ?? DEFAULT_PROFILE_ID
  } catch {
    return DEFAULT_PROFILE_ID
  }
}

export function setActiveProfileId(profileId: string): void {
  try {
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId)
  } catch {
    /* modo privado: seguimos sem persistir */
  }
}

/**
 * Uma sessão concluída de prova é o registro oficial da aluna.
 * Ela nunca pode ser removida por um reset.
 */
export function isCompletedMock(session: Session): boolean {
  return session.status === 'completed'
}

export interface ResetResult {
  sessionsRemoved: number
  attemptsRemoved: number
  sessionsKept: number
}

/**
 * Limpa o progresso de prática, preservando TODAS as provas concluídas
 * e as tentativas que pertencem a elas.
 */
export async function resetAllProgress(profileId: string): Promise<ResetResult> {
  const sessions = await db.sessions.where('profileId').equals(profileId).toArray()
  const kept = sessions.filter(isCompletedMock)
  const removable = sessions.filter((session) => !isCompletedMock(session))
  const keptIds = new Set(kept.map((session) => session.id))

  const attempts = await db.attempts.where('profileId').equals(profileId).toArray()
  const removableAttempts = attempts.filter((attempt) => !keptIds.has(attempt.sessionId))

  await db.attempts.bulkDelete(removableAttempts.map((attempt) => attempt.id))
  await db.sessions.bulkDelete(removable.map((session) => session.id))

  return {
    sessionsRemoved: removable.length,
    attemptsRemoved: removableAttempts.length,
    sessionsKept: kept.length,
  }
}

/**
 * Limpa apenas as provas NÃO concluídas (sessões abandonadas ou em andamento).
 * As provas concluídas permanecem — são o histórico de progresso real.
 */
export async function resetAbandonedMocks(profileId: string): Promise<ResetResult> {
  const sessions = await db.sessions.where('profileId').equals(profileId).toArray()
  const kept = sessions.filter(isCompletedMock)
  const removable = sessions.filter((session) => !isCompletedMock(session))
  const keptIds = new Set(kept.map((session) => session.id))

  const attempts = await db.attempts.where('profileId').equals(profileId).toArray()
  const removableAttempts = attempts.filter((attempt) => !keptIds.has(attempt.sessionId))

  await db.attempts.bulkDelete(removableAttempts.map((attempt) => attempt.id))
  await db.sessions.bulkDelete(removable.map((session) => session.id))

  return {
    sessionsRemoved: removable.length,
    attemptsRemoved: removableAttempts.length,
    sessionsKept: kept.length,
  }
}

/* -------------------------------------------------------------------------- */
/* Perfis                                                                     */
/* -------------------------------------------------------------------------- */

export interface ProfileInput {
  name: string
  avatar: string
  examDate: string
}

export function validateProfileInput(input: ProfileInput): string | null {
  const name = input.name.trim()
  if (name.length === 0 || name.length > 40) return 'O nome deve ter entre 1 e 40 caracteres.'
  if (input.avatar.trim().length === 0 || input.avatar.trim().length > 8) return 'Escolhe um emoji.'
  if (input.examDate !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(input.examDate)) {
    return 'A data da prova deve estar no formato AAAA-MM-DD.'
  }
  return null
}

export async function createProfile(input: ProfileInput): Promise<Profile> {
  const now = Date.now()
  const profile: Profile = {
    id: `profile-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    avatar: input.avatar.trim(),
    examDate: input.examDate,
    createdAt: now,
    updatedAt: now,
  }
  await db.profiles.put(profile)
  return profile
}

export async function updateProfile(profileId: string, input: ProfileInput): Promise<void> {
  await db.profiles.update(profileId, {
    name: input.name.trim(),
    avatar: input.avatar.trim(),
    examDate: input.examDate,
    updatedAt: Date.now(),
  })
}

export async function ensureDefaultProfile(): Promise<Profile> {
  const existing = await db.profiles.get(DEFAULT_PROFILE_ID)
  if (existing) return existing
  const now = Date.now()
  const profile: Profile = {
    id: DEFAULT_PROFILE_ID,
    name: 'Eu',
    avatar: '🇮🇹',
    examDate: '',
    createdAt: now,
    updatedAt: now,
  }
  await db.profiles.put(profile)
  return profile
}
