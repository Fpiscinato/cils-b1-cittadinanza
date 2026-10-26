/**
 * Persistência das sessões de prova.
 *
 * Uma sessão = uma prova (ou um treino). Quando é concluída, ela passa a ser
 * o registo real da aluna e nunca mais é apagada (ver `src/lib/admin.ts`).
 */

import { db } from '../db/database'
import type { Attempt, ExamMode, Session, Skill } from '../db/schemas'
import type { SkillSample } from '../lib/readiness'

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export async function startSession(
  profileId: string,
  mode: ExamMode,
  title: string,
): Promise<Session> {
  const session: Session = {
    id: newId('session'),
    profileId,
    mode,
    status: 'in_progress',
    title,
    startedAt: Date.now(),
    completedAt: null,
    totalTimeSeconds: 0,
    score: null,
  }
  await db.sessions.put(session)
  return session
}

export interface AttemptInput {
  profileId: string
  sessionId: string
  questionId: string
  skill: Skill
  taskId: string
  isCorrect: boolean
  skipped: boolean
  /** Índice da opção escolhida (-1 se não respondeu). */
  selectedIndex: number
  timeSpentSeconds: number
}

export async function saveAttempt(input: AttemptInput): Promise<void> {
  const attempt: Attempt = {
    id: newId('attempt'),
    profileId: input.profileId,
    sessionId: input.sessionId,
    questionId: input.questionId,
    skill: input.skill,
    taskId: input.taskId,
    isCorrect: input.isCorrect,
    skipped: input.skipped,
    selectedIndex: input.selectedIndex,
    timeSpentSeconds: input.timeSpentSeconds,
    timestamp: Date.now(),
  }
  await db.attempts.put(attempt)
}

/**
 * Marca a sessão como concluída, gravando a pontuação por habilidade.
 * A partir deste ponto a sessão é IMUTÁVEL.
 */
export async function completeSession(
  sessionId: string,
  perSkill: Record<string, number>,
  totalTimeSeconds: number,
): Promise<void> {
  await db.sessions.update(sessionId, {
    status: 'completed',
    completedAt: Date.now(),
    totalTimeSeconds,
    score: Object.values(perSkill).reduce((sum, value) => sum + value, 0),
    perSkill,
  })
}

/** Marca a sessão como abandonada (mantém o histórico, sem contar como prova). */
export async function abandonSession(sessionId: string, totalTimeSeconds: number): Promise<void> {
  await db.sessions.update(sessionId, {
    status: 'abandoned',
    completedAt: Date.now(),
    totalTimeSeconds,
  })
}

export async function loadProfileHistory(profileId: string): Promise<{
  sessions: Session[]
  attempts: Attempt[]
}> {
  const [sessions, attempts] = await Promise.all([
    db.sessions.where('profileId').equals(profileId).toArray(),
    db.attempts.where('profileId').equals(profileId).toArray(),
  ])
  return { sessions, attempts }
}

/**
 * Histórico por habilidade, para o veredito de prontidão.
 * Cada amostra é o resultado de uma prova (ou treino) concluída.
 *
 * O estudo por nível (`mode: 'studio'`) fica DE FORA: são exercícios de
 * apostila, não uma prova no formato do exame, e misturá-los distorceria o
 * veredito. A evolução do estudo tem o seu próprio gráfico no Progresso.
 */
export function buildSkillHistory(sessions: Session[]): Record<Skill, SkillSample[]> {
  const history: Record<Skill, SkillSample[]> = {
    ascolto: [],
    lettura: [],
    scrittura: [],
    orale: [],
  }
  const completed = sessions
    .filter(
      (session) =>
        session.status === 'completed' && session.perSkill && session.mode !== 'studio',
    )
    .sort((a, b) => a.startedAt - b.startedAt)

  for (const session of completed) {
    const perSkill = session.perSkill ?? {}
    for (const [skill, score] of Object.entries(perSkill)) {
      if (skill in history) {
        history[skill as Skill].push({ at: session.startedAt, score })
      }
    }
  }
  return history
}
