/**
 * Resumo das sessões para o histórico do Progresso.
 *
 * O histórico mostra UMA linha por sessão (estudo, prática ou simulado) com o
 * que interessa à aluna: quando foi, quanto durou, quantas acertou/errou e de
 * que tipo era (bolinha da cor do gráfico). As sessões são agrupadas por dia e
 * os dias antigos ficam recolhidos, para a lista não crescer sem fim.
 */

import type { Attempt, ExamMode, Session } from '../db/schemas'

export type SessionKind = 'study' | 'practice' | 'mock'

export const SESSION_KIND_LABELS: Record<SessionKind, string> = {
  study: 'Estudo',
  practice: 'Prática',
  mock: 'Simulado',
}

/** A mesma cor das barras do gráfico de atividade (study / practice / exam). */
export const SESSION_KIND_DOT: Record<SessionKind, string> = {
  study: 'bg-teal-600',
  practice: 'bg-sky-500',
  mock: 'bg-amber-500',
}

export function sessionKind(mode: ExamMode): SessionKind {
  if (mode === 'studio') return 'study'
  if (mode === 'mock_cittadinanza') return 'mock'
  return 'practice'
}

export interface SessionSummary {
  session: Session
  kind: SessionKind
  correct: number
  wrong: number
  answered: number
}

type SummaryAttempt = Pick<Attempt, 'sessionId' | 'isCorrect'>

/** Uma linha por sessão concluída, com acertos/erros derivados das tentativas. */
export function buildSessionSummaries(
  sessions: ReadonlyArray<Session>,
  attempts: ReadonlyArray<SummaryAttempt>,
): SessionSummary[] {
  const counts = new Map<string, { correct: number; wrong: number }>()
  for (const attempt of attempts) {
    const entry = counts.get(attempt.sessionId) ?? { correct: 0, wrong: 0 }
    if (attempt.isCorrect) entry.correct += 1
    else entry.wrong += 1
    counts.set(attempt.sessionId, entry)
  }

  return sessions
    .filter((session) => session.status === 'completed')
    .map((session) => {
      const entry = counts.get(session.id) ?? { correct: 0, wrong: 0 }
      return {
        session,
        kind: sessionKind(session.mode),
        correct: entry.correct,
        wrong: entry.wrong,
        answered: entry.correct + entry.wrong,
      }
    })
    .sort((a, b) => b.session.startedAt - a.session.startedAt)
}

export interface SessionDayGroup {
  /** Chave estável `YYYY-MM-DD`. */
  key: string
  label: string
  summaries: SessionSummary[]
}

function dayKey(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

function dayLabel(timestamp: number, now: number): string {
  const today = dayKey(now)
  const yesterday = dayKey(now - 24 * 60 * 60 * 1000)
  const key = dayKey(timestamp)
  if (key === today) return 'Hoje'
  if (key === yesterday) return 'Ontem'
  return new Date(timestamp).toLocaleDateString('pt-BR')
}

/** Agrupa por dia (mais recente primeiro) e mantém a ordem dentro do dia. */
export function groupSummariesByDay(
  summaries: ReadonlyArray<SessionSummary>,
  now: number = Date.now(),
): SessionDayGroup[] {
  const groups = new Map<string, SessionDayGroup>()
  for (const summary of summaries) {
    const key = dayKey(summary.session.startedAt)
    const group = groups.get(key) ?? {
      key,
      label: dayLabel(summary.session.startedAt, now),
      summaries: [],
    }
    group.summaries.push(summary)
    groups.set(key, group)
  }
  return [...groups.values()].sort((a, b) => (a.key < b.key ? 1 : -1))
}
