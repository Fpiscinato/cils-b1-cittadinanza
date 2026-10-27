import { describe, expect, it } from 'vitest'
import type { Attempt, Session } from '../db/schemas'
import {
  buildSessionSummaries,
  groupSummariesByDay,
  sessionKind,
} from './sessionSummary'

const NOW = new Date('2026-10-27T18:00:00').getTime()
const DAY = 24 * 60 * 60 * 1000

function session(id: string, mode: Session['mode'], startedAt: number): Session {
  return {
    id,
    profileId: 'p1',
    mode,
    status: 'completed',
    title: id,
    startedAt,
    completedAt: startedAt + 60_000,
    totalTimeSeconds: 60,
    score: 8,
  }
}

function attempt(sessionId: string, isCorrect: boolean, index: number): Attempt {
  return {
    id: `a-${sessionId}-${index}`,
    profileId: 'p1',
    sessionId,
    questionId: `q-${sessionId}-${index}`,
    skill: 'lettura',
    taskId: 'lettura-p1',
    isCorrect,
    skipped: false,
    selectedIndex: isCorrect ? 0 : 1,
    timeSpentSeconds: 5,
    timestamp: NOW,
  }
}

describe('resumo das sessões', () => {
  it('classifica estudo, prática e simulado', () => {
    expect(sessionKind('studio')).toBe('study')
    expect(sessionKind('mock_cittadinanza')).toBe('mock')
    expect(sessionKind('ascolto')).toBe('practice')
    expect(sessionKind('lettura')).toBe('practice')
  })

  it('conta acertos e erros por sessão', () => {
    const summaries = buildSessionSummaries(
      [session('s1', 'studio', NOW), session('s2', 'lettura', NOW - 1000)],
      [
        attempt('s1', true, 1),
        attempt('s1', true, 2),
        attempt('s1', false, 3),
        attempt('s2', false, 1),
      ],
    )
    const s1 = summaries.find((entry) => entry.session.id === 's1')
    const s2 = summaries.find((entry) => entry.session.id === 's2')
    expect(s1).toMatchObject({ kind: 'study', correct: 2, wrong: 1, answered: 3 })
    expect(s2).toMatchObject({ kind: 'practice', correct: 0, wrong: 1, answered: 1 })
  })

  it('ignora sessões não concluídas', () => {
    const open = { ...session('open', 'lettura', NOW), status: 'in_progress' as const }
    expect(buildSessionSummaries([open], [])).toEqual([])
  })

  it('agrupa por dia, mais recente primeiro, com Hoje e Ontem', () => {
    const groups = groupSummariesByDay(
      buildSessionSummaries(
        [
          session('hoje-1', 'studio', NOW - 60_000),
          session('hoje-2', 'lettura', NOW - 120_000),
          session('ontem', 'mock_cittadinanza', NOW - DAY),
          session('antigo', 'studio', NOW - 5 * DAY),
        ],
        [],
      ),
      NOW,
    )
    expect(groups.map((group) => group.label)).toEqual(['Hoje', 'Ontem', '22/10/2026'])
    expect(groups[0]?.summaries.map((entry) => entry.session.id)).toEqual(['hoje-1', 'hoje-2'])
    expect(groups[1]?.summaries[0]?.kind).toBe('mock')
  })
})
