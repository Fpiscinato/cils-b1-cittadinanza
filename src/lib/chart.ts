/**
 * Dados para os gráficos de evolução.
 *
 * Funções puras (sem React) para o gráfico poder ser testado e para a mesma
 * série ser usada na tela de Progresso e no painel.
 */

import type { Session, Skill } from '../db/schemas'
import { sessionTimestamp } from './merge'

export interface SeriesPoint {
  /** Posição na série (0-based, do mais antigo para o mais recente). */
  index: number
  /** Timestamp da prova. */
  at: number
  /** Rótulo curto para o eixo (ex.: "12/03"). */
  label: string
  /** Pontuação (0-48 no total, 0-12 por habilidade). */
  value: number
  /** Identificador da prova (para chaves de React). */
  id: string
}

function formatLabel(at: number): string {
  const date = new Date(at)
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** Provas concluídas, da mais antiga para a mais recente. */
export function completedSessions(sessions: Session[]): Session[] {
  return sessions
    .filter((session) => session.status === 'completed' && session.mode !== 'studio')
    .sort((a, b) => sessionTimestamp(a) - sessionTimestamp(b))
}

/** Série do score total (0-48) ao longo do tempo. */
export function buildScoreSeries(sessions: Session[]): SeriesPoint[] {
  return completedSessions(sessions)
    .map((session, index) => ({
      index,
      at: sessionTimestamp(session),
      label: formatLabel(sessionTimestamp(session)),
      value: session.score ?? 0,
      id: session.id,
    }))
}

/** Série de uma habilidade (0-12) ao longo do tempo. */
export function buildSkillSeries(sessions: Session[], skill: Skill): SeriesPoint[] {
  return completedSessions(sessions)
    .filter((session) => session.perSkill && typeof session.perSkill[skill] === 'number')
    .map((session, index) => ({
      index,
      at: sessionTimestamp(session),
      label: formatLabel(sessionTimestamp(session)),
      value: session.perSkill?.[skill] ?? 0,
      id: session.id,
    }))
}

/** Estatísticas simples da série, para o texto à volta do gráfico. */
export interface SeriesSummary {
  count: number
  best: number
  average: number
  last: number | null
  /** Diferença entre a última e a primeira prova (positivo = evolução). */
  delta: number
}

export function summarizeSeries(series: SeriesPoint[]): SeriesSummary {
  if (series.length === 0) {
    return { count: 0, best: 0, average: 0, last: null, delta: 0 }
  }
  const values = series.map((point) => point.value)
  const sum = values.reduce((total, value) => total + value, 0)
  const average = Math.round((sum / values.length) * 100) / 100
  const first = series[0]?.value ?? 0
  const last = series[series.length - 1]?.value ?? 0
  return {
    count: series.length,
    best: Math.max(...values),
    average,
    last,
    delta: Math.round((last - first) * 100) / 100,
  }
}
