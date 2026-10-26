import { describe, expect, it } from 'vitest'
import type { Level } from '../db/schemas'
import {
  MASTERY_ACCURACY,
  MIN_ANSWERS_FOR_MASTERY,
  buildLevelProgress,
  buildStudyActivity,
  buildTodayPlan,
  countOpenMistakes,
  levelFromTaskId,
  recommendLevel,
  studyStreak,
} from './studyPlan'

function attempt(
  index: number,
  options: {
    taskId?: string
    questionId?: string
    sessionId?: string
    isCorrect?: boolean
    timestamp?: number
  } = {},
) {
  return {
    questionId: options.questionId ?? `q-${index}`,
    taskId: options.taskId ?? 'studio-fondazione-A1',
    sessionId: options.sessionId ?? 's-1',
    isCorrect: options.isCorrect ?? true,
    timestamp: options.timestamp ?? 1_000 + index,
  }
}

describe('percurso por nível', () => {
  it('lê o nível do taskId do banco de estudo', () => {
    expect(levelFromTaskId('studio-fondazione-A1')).toBe('A1')
    expect(levelFromTaskId('studio-cittadinanza-B1')).toBe('B1')
    expect(levelFromTaskId('ascolto-p1')).toBeNull()
  })

  it('marca um nível como dominado com volume e precisão suficientes', () => {
    const attempts = Array.from({ length: MIN_ANSWERS_FOR_MASTERY }, (_, index) =>
      attempt(index, { isCorrect: index < 18 }),
    )
    const progress = buildLevelProgress({ attempts })

    expect(progress.A1.answered).toBe(MIN_ANSWERS_FOR_MASTERY)
    expect(progress.A1.accuracy).toBe(90)
    expect(progress.A1.mastered).toBe(true)
    expect(progress.A1.percent).toBe(100)
    expect(progress.A2.answered).toBe(0)
  })

  it('não considera dominado um nível com poucas respostas', () => {
    const attempts = Array.from({ length: 10 }, (_, index) => attempt(index))
    const progress = buildLevelProgress({ attempts })
    expect(progress.A1.accuracy).toBe(100)
    expect(progress.A1.mastered).toBe(false)
    expect(progress.A1.percent).toBeLessThan(100)
  })

  it('usa o nível da pergunta quando o taskId não o traz', () => {
    const levelByQuestionId: Record<string, Level> = { 'q-a2': 'A2' }
    const progress = buildLevelProgress({
      attempts: [attempt(0, { questionId: 'q-a2', taskId: 'ascolto-p1' })],
      levelByQuestionId,
    })
    expect(progress.A2.answered).toBe(1)
    expect(progress.A1.answered).toBe(0)
  })

  it('recomenda o primeiro nível ainda não dominado', () => {
    const masteredA1 = buildLevelProgress({
      attempts: Array.from({ length: MIN_ANSWERS_FOR_MASTERY }, (_, index) => attempt(index)),
    })
    expect(recommendLevel(masteredA1)).toBe('A2')

    const everything = buildLevelProgress({
      attempts: [
        ...Array.from({ length: MIN_ANSWERS_FOR_MASTERY }, (_, index) => attempt(index)),
        ...Array.from({ length: MIN_ANSWERS_FOR_MASTERY }, (_, index) =>
          attempt(index, { taskId: 'studio-struttura-A2' }),
        ),
        ...Array.from({ length: MIN_ANSWERS_FOR_MASTERY }, (_, index) =>
          attempt(index, { taskId: 'studio-cittadinanza-B1' }),
        ),
      ],
    })
    expect(everything.A1.accuracy).toBeGreaterThanOrEqual(MASTERY_ACCURACY)
    expect(recommendLevel(everything)).toBe('B1')
  })
})

describe('plano de hoje', () => {
  it('começa sempre pelo estudo do nível escolhido', () => {
    const plan = buildTodayPlan({ attempts: [], sessions: [], level: 'A1' })
    expect(plan.items[0]?.id).toBe('study')
    expect(plan.items[0]?.title).toContain('A1')
  })

  it('junta a revisão dos erros quando há erros por rever', () => {
    const plan = buildTodayPlan({
      attempts: [
        attempt(0, { questionId: 'q-1', isCorrect: false }),
        attempt(1, { questionId: 'q-2', isCorrect: false }),
      ],
      sessions: [],
      level: 'A1',
    })
    expect(plan.items.map((item) => item.id)).toEqual(['study', 'mistakes'])
  })

  it('propõe o primeiro simulado quando não há erros nem simulados', () => {
    const plan = buildTodayPlan({ attempts: [], sessions: [], level: 'A2' })
    expect(plan.items.map((item) => item.id)).toEqual(['study', 'mock'])
  })

  it('avisa quando o nível atual já está dominado', () => {
    const plan = buildTodayPlan({
      attempts: Array.from({ length: MIN_ANSWERS_FOR_MASTERY }, (_, index) => attempt(index)),
      sessions: [],
      level: 'A1',
    })
    expect(plan.recommendAdvance).toBe(true)
    expect(plan.next).toBe('A2')
  })

  it('conta os erros pela última tentativa de cada pergunta', () => {
    const attempts = [
      attempt(0, { questionId: 'q-1', isCorrect: false, timestamp: 1 }),
      attempt(1, { questionId: 'q-1', isCorrect: true, timestamp: 2 }),
      attempt(2, { questionId: 'q-2', isCorrect: false, timestamp: 3 }),
    ]
    expect(countOpenMistakes(attempts)).toBe(1)
  })
})

describe('atividade de estudo', () => {
  const now = new Date(2026, 9, 26, 12, 0, 0).getTime()
  const yesterday = now - 24 * 60 * 60 * 1000

  const sessions = [
    { id: 's-study', mode: 'studio' as const },
    { id: 's-practice', mode: 'lettura' as const },
    { id: 's-mock', mode: 'mock_cittadinanza' as const },
  ]

  it('separa estudo, prática e simulado por dia', () => {
    const days = buildStudyActivity(
      [
        { sessionId: 's-study', timestamp: now },
        { sessionId: 's-practice', timestamp: now },
        { sessionId: 's-mock', timestamp: now },
        { sessionId: 's-study', timestamp: yesterday },
      ],
      sessions,
      { days: 14, now },
    )
    expect(days).toHaveLength(14)
    const today = days[days.length - 1]
    expect(today?.study).toBe(1)
    expect(today?.practice).toBe(1)
    expect(today?.exam).toBe(1)
    expect(today?.total).toBe(3)
    expect(days[days.length - 2]?.study).toBe(1)
  })

  it('ignora respostas fora da janela', () => {
    const days = buildStudyActivity(
      [{ sessionId: 's-study', timestamp: now - 30 * 24 * 60 * 60 * 1000 }],
      sessions,
      { days: 14, now },
    )
    expect(days.reduce((sum, day) => sum + day.total, 0)).toBe(0)
  })

  it('conta os dias seguidos até hoje (ou até ontem, se hoje ainda não houver atividade)', () => {
    const days = buildStudyActivity(
      [
        { sessionId: 's-study', timestamp: now },
        { sessionId: 's-study', timestamp: yesterday },
      ],
      sessions,
      { days: 14, now },
    )
    expect(studyStreak(days)).toBe(2)

    const withoutToday = buildStudyActivity(
      [{ sessionId: 's-study', timestamp: yesterday }],
      sessions,
      { days: 14, now },
    )
    expect(studyStreak(withoutToday)).toBe(1)
  })
})
