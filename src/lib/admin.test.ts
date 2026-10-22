// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/database'
import { isCompletedMock, resetAbandonedMocks, resetAllProgress } from './admin'
import type { Session } from '../db/schemas'

const PROFILE = 'profile-test'

function session(overrides: Partial<Session>): Session {
  return {
    id: overrides.id ?? `s-${Math.random().toString(36).slice(2)}`,
    profileId: PROFILE,
    mode: 'mock_cittadinanza',
    status: 'in_progress',
    title: 'Simulado',
    startedAt: Date.now(),
    completedAt: null,
    totalTimeSeconds: 0,
    score: null,
    ...overrides,
  }
}

describe('imutabilidade das provas concluídas', () => {
  beforeEach(async () => {
    await db.open()
    await db.sessions.clear()
    await db.attempts.clear()
  })

  it('uma prova concluída é reconhecida como registo imutável', () => {
    expect(isCompletedMock(session({ status: 'completed' }))).toBe(true)
    expect(isCompletedMock(session({ status: 'abandoned' }))).toBe(false)
    expect(isCompletedMock(session({ status: 'in_progress' }))).toBe(false)
  })

  it('resetAllProgress preserva as provas concluídas e as suas tentativas', async () => {
    const done = session({ id: 'done-1', status: 'completed', score: 34 })
    const running = session({ id: 'running-1', status: 'in_progress' })
    await db.sessions.bulkPut([done, running])
    await db.attempts.bulkPut([
      {
        id: 'a-done',
        profileId: PROFILE,
        sessionId: 'done-1',
        questionId: 'q1',
        skill: 'ascolto',
        taskId: 'ascolto-p1',
        isCorrect: true,
        skipped: false,
        selectedIndex: 0,
        timeSpentSeconds: 10,
        timestamp: 1,
      },
      {
        id: 'a-running',
        profileId: PROFILE,
        sessionId: 'running-1',
        questionId: 'q2',
        skill: 'lettura',
        taskId: 'lettura-p1',
        isCorrect: false,
        skipped: false,
        selectedIndex: 1,
        timeSpentSeconds: 10,
        timestamp: 2,
      },
    ])

    const result = await resetAllProgress(PROFILE)

    expect(result.sessionsRemoved).toBe(1)
    expect(result.sessionsKept).toBe(1)
    expect(result.attemptsRemoved).toBe(1)

    const sessions = await db.sessions.toArray()
    expect(sessions).toHaveLength(1)
    expect(sessions[0]?.id).toBe('done-1')
    expect(sessions[0]?.status).toBe('completed')
    expect(sessions[0]?.score).toBe(34)

    const attempts = await db.attempts.toArray()
    expect(attempts).toHaveLength(1)
    expect(attempts[0]?.id).toBe('a-done')
  })

  it('resetAbandonedMocks só remove o que não foi concluído', async () => {
    await db.sessions.bulkPut([
      session({ id: 'done-2', status: 'completed' }),
      session({ id: 'abandoned-1', status: 'abandoned' }),
    ])

    const result = await resetAbandonedMocks(PROFILE)

    expect(result.sessionsRemoved).toBe(1)
    expect(result.sessionsKept).toBe(1)
    const ids = (await db.sessions.toArray()).map((item) => item.id)
    expect(ids).toEqual(['done-2'])
  })
})
