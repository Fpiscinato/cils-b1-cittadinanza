/**
 * Resumo das sessões para o histórico do Progresso.
 *
 * O histórico mostra UMA linha por sessão encerrada (estudo, prática ou
 * simulado) com o que interessa à aluna: quando foi, quanto durou, quantas
 * acertou/errou e de que tipo era. Cada tipo tem uma cor fixa, usada no
 * gráfico, nos menus e nas telas — é a mesma linguagem visual em todo o app.
 *
 * As sessões INTERROMPIDAS também aparecem (marcadas como tal): o gráfico de
 * atividade conta as respostas dadas, por isso o histórico tem de as mostrar,
 * senão parece que "apareceu laranja do nada".
 */

import type { Attempt, ExamMode, Session } from '../db/schemas'

export type SessionKind = 'study' | 'practice' | 'mock'

/** Ordem fixa para legendas e filtros (a mesma do gráfico). */
export const SESSION_KIND_ORDER: readonly SessionKind[] = ['study', 'practice', 'mock'] as const

export interface SessionKindTheme {
  label: string
  /** Bolinha/legenda. */
  dot: string
  /** Etiqueta pequena (chip). */
  chip: string
  /** Texto de destaque. */
  text: string
  /** Borda de destaque (barra lateral do cartão/linha). */
  border: string
  /** Fundo suave. */
  soft: string
  /** Barra do gráfico e do runner. */
  bar: string
  /** Versão clara da barra (etapa em curso). */
  barSoft: string
  /** Botão principal do tipo de atividade. */
  button: string
}

/**
 * A cor de cada tipo de sessão.
 *
 * Verde = estudo (apostila, vocabulário), azul-índigo = prática (prova de uma
 * habilidade e mix rápido), âmbar = simulado (a prova completa). São três
 * matizes bem separados — verde e azul deixam de se confundir como antes.
 */
export const SESSION_KIND_THEME: Record<SessionKind, SessionKindTheme> = {
  study: {
    label: 'Estudo',
    dot: 'bg-emerald-600',
    chip: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-400 dark:border-emerald-700',
    soft: 'bg-emerald-50 dark:bg-emerald-950/30',
    bar: 'bg-emerald-600',
    barSoft: 'bg-emerald-400',
    button: 'bg-emerald-700 text-white hover:bg-emerald-800',
  },
  practice: {
    label: 'Prática',
    dot: 'bg-indigo-500',
    chip: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-400 dark:border-indigo-700',
    soft: 'bg-indigo-50 dark:bg-indigo-950/30',
    bar: 'bg-indigo-500',
    barSoft: 'bg-indigo-400',
    button: 'bg-indigo-700 text-white hover:bg-indigo-800',
  },
  mock: {
    label: 'Simulado',
    dot: 'bg-amber-500',
    chip: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-400 dark:border-amber-700',
    soft: 'bg-amber-50 dark:bg-amber-950/30',
    bar: 'bg-amber-500',
    barSoft: 'bg-amber-400',
    button: 'bg-amber-600 text-white hover:bg-amber-700',
  },
}

export const SESSION_KIND_LABELS: Record<SessionKind, string> = {
  study: SESSION_KIND_THEME.study.label,
  practice: SESSION_KIND_THEME.practice.label,
  mock: SESSION_KIND_THEME.mock.label,
}

/** A mesma cor das barras do gráfico de atividade (study / practice / mock). */
export const SESSION_KIND_DOT: Record<SessionKind, string> = {
  study: SESSION_KIND_THEME.study.dot,
  practice: SESSION_KIND_THEME.practice.dot,
  mock: SESSION_KIND_THEME.mock.dot,
}

export function sessionKind(mode: ExamMode): SessionKind {
  if (mode === 'studio') return 'study'
  if (mode === 'mock_cittadinanza') return 'mock'
  return 'practice'
}

export interface SessionSummary {
  session: Session
  kind: SessionKind
  /** `false` = sessão interrompida (treino, não conta como prova). */
  completed: boolean
  correct: number
  wrong: number
  answered: number
}

type SummaryAttempt = Pick<Attempt, 'sessionId' | 'isCorrect'>

/**
 * Uma linha por sessão encerrada (concluída ou interrompida), com
 * acertos/erros derivados das tentativas.
 */
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
    .filter((session) => session.status === 'completed' || session.status === 'abandoned')
    .map((session) => {
      const entry = counts.get(session.id) ?? { correct: 0, wrong: 0 }
      return {
        session,
        kind: sessionKind(session.mode),
        completed: session.status === 'completed',
        correct: entry.correct,
        wrong: entry.wrong,
        answered: entry.correct + entry.wrong,
      }
    })
    .sort((a, b) => b.session.startedAt - a.session.startedAt)
}

/** Conta as sessões por tipo (para as legendas/filtros do histórico). */
export function countSessionsByKind(
  summaries: ReadonlyArray<SessionSummary>,
): Record<SessionKind, number> {
  const counts: Record<SessionKind, number> = { study: 0, practice: 0, mock: 0 }
  for (const summary of summaries) counts[summary.kind] += 1
  return counts
}

/** Tipos presentes num grupo de sessões (para as bolinhas do cabeçalho do dia). */
export function kindsInGroup(summaries: ReadonlyArray<SessionSummary>): SessionKind[] {
  const present = new Set(summaries.map((summary) => summary.kind))
  return SESSION_KIND_ORDER.filter((kind) => present.has(kind))
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
