/**
 * Relatório de uma prova — para rever e enviar à professora.
 *
 * Junta tudo o que é preciso para rever a prova e para a entregar:
 * - o enunciado e o gabarito de cada item;
 * - a resposta que a aluna deu;
 * - a explicação (o "porque");
 * - a pontuação por abilità e o veredito.
 *
 * É gerado 100% no browser (sem servidor): a aluna imprime ou guarda em PDF
 * ou envia o ficheiro como está.
 */

import { db } from '../db/database'
import type { Attempt, Oral, Question, Session, Writing } from '../db/schemas'
import { SKILL_LABELS } from '../lib/scoring'

export interface SessionReport {
  session: Session
  attempts: Attempt[]
  questions: Question[]
  writing: Writing | null
  oral: Oral | null
  /** Passagens usadas (transcrições e textos), por id. */
  passages: Map<string, string>
}

/** Carrega tudo o que é preciso para o relatório de uma sessão. */
export async function loadSessionReport(sessionId: string): Promise<SessionReport | null> {
  const session = await db.sessions.get(sessionId)
  if (!session) return null

  const attempts = await db.attempts.where('sessionId').equals(sessionId).toArray()
  const questionIds = [...new Set(attempts.map((attempt) => attempt.questionId))]
  const questions = (
    await Promise.all(questionIds.map((id) => db.questions.get(id)))
  ).filter((question): question is Question => question !== undefined)

  const writings = await db.writings.where('profileId').equals(session.profileId).toArray()
  const orals = await db.orals.where('profileId').equals(session.profileId).toArray()

  const writing =
    writings.find((item) => item.createdAt >= session.startedAt) ?? writings[0] ?? null
  const oral = orals.find((item) => item.createdAt >= session.startedAt) ?? orals[0] ?? null

  const passages = new Map<string, string>()
  for (const question of questions) {
    if (!question.passageId || passages.has(question.passageId)) continue
    const passage = await db.passages.get(question.passageId)
    if (passage) passages.set(question.passageId, passage.content)
  }

  return { session, attempts, questions, writing, oral, passages }
}

/** O texto que a aluna respondeu a cada item (ou undefined se não respondeu). */
export function answerOf(report: SessionReport): Map<string, Attempt> {
  const map = new Map<string, Attempt>()
  for (const attempt of report.attempts) {
    const current = map.get(attempt.questionId)
    // O último tentativa conta (permite repetir um item).
    if (!current || attempt.timestamp >= current.timestamp) {
      map.set(attempt.questionId, attempt)
    }
  }
  return map
}

/** Rótulos das habilidades, por ordem. */
export const REPORT_SKILL_ORDER = ['ascolto', 'lettura', 'scrittura', 'orale'] as const

export function skillLabel(skill: string): string {
  const labels = SKILL_LABELS as Record<string, { it: string; pt: string }>
  return labels[skill]?.it ?? skill
}
