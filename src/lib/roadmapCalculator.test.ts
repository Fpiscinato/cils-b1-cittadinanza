import { describe, expect, it } from 'vitest'
import { computeDailyTask, computeRoadmap, currentPhaseForDate } from './roadmapCalculator'

const DAY = 24 * 60 * 60 * 1000

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY).toISOString().slice(0, 10)
}

describe('fases de preparação', () => {
  it('sem data de prova, assume a fase 1', () => {
    expect(currentPhaseForDate('', Date.now())).toBe('fondazione')
  })

  it('com prova longe, está na fase 1', () => {
    expect(currentPhaseForDate(isoDaysFromNow(120), Date.now())).toBe('fondazione')
  })

  it('com prova a 10 semanas, está na fase 2', () => {
    expect(currentPhaseForDate(isoDaysFromNow(70), Date.now())).toBe('struttura')
  })

  it('com prova a 4 semanas, está na fase 3', () => {
    expect(currentPhaseForDate(isoDaysFromNow(28), Date.now())).toBe('cittadinanza')
  })

  it('calcula as 3 fases com percentagens', () => {
    const snapshot = computeRoadmap({
      attempts: Array.from({ length: 100 }, (_, index) => ({
        skill: index % 2 === 0 ? 'ascolto' : 'lettura',
        isCorrect: index % 3 !== 0,
        questionId: `q-${index}`,
        timestamp: index,
      })),
      sessions: [{ status: 'completed', mode: 'mock_cittadinanza', startedAt: 1 }],
      examDate: isoDaysFromNow(30),
    })
    expect(snapshot.phases).toHaveLength(3)
    expect(snapshot.currentPhaseId).toBe('cittadinanza')
    expect(snapshot.mocksDone).toBe(1)
    expect(snapshot.totalAnswered).toBe(100)
    expect(snapshot.accuracy).toBeGreaterThan(0)
    expect(snapshot.openMistakes).toBeGreaterThan(0)
  })

  it('conta só as habilidades tocadas', () => {
    const snapshot = computeRoadmap({
      attempts: [
        { skill: 'ascolto', isCorrect: true, questionId: 'a', timestamp: 1 },
        { skill: 'lettura', isCorrect: true, questionId: 'b', timestamp: 2 },
      ],
      sessions: [],
      examDate: '',
    })
    expect(Object.keys(snapshot.perSkillAnswered)).toEqual(['ascolto', 'lettura'])
    expect(snapshot.hasFullCoverage).toBe(false)
  })
})

describe('tarefa do dia', () => {
  it('prioriza limpar o banco de erros quando há muitos', () => {
    const snapshot = computeRoadmap({
      attempts: [
        { skill: 'ascolto', isCorrect: false, questionId: 'a', timestamp: 1 },
        { skill: 'lettura', isCorrect: false, questionId: 'b', timestamp: 2 },
        { skill: 'scrittura', isCorrect: false, questionId: 'c', timestamp: 3 },
        { skill: 'orale', isCorrect: false, questionId: 'd', timestamp: 4 },
        { skill: 'orale', isCorrect: false, questionId: 'e', timestamp: 5 },
      ],
      sessions: [],
      examDate: '',
    })
    expect(computeDailyTask(snapshot).id).toBe('mistakes')
  })

  it('propõe um simulado quando ainda não há provas', () => {
    const snapshot = computeRoadmap({
      attempts: [{ skill: 'ascolto', isCorrect: true, questionId: 'a', timestamp: 1 }],
      sessions: [],
      examDate: '',
    })
    expect(computeDailyTask(snapshot).id).toBe('mock')
  })

  it('propõe cobrir uma habilidade em falta', () => {
    const snapshot = computeRoadmap({
      attempts: [
        { skill: 'ascolto', isCorrect: true, questionId: 'a', timestamp: 1 },
        { skill: 'lettura', isCorrect: true, questionId: 'b', timestamp: 2 },
      ],
      sessions: [
        { status: 'completed', mode: 'mock_cittadinanza', startedAt: 1 },
        { status: 'completed', mode: 'mock_cittadinanza', startedAt: 2 },
      ],
      examDate: '',
    })
    expect(computeDailyTask(snapshot).id).toBe('coverage')
  })
})
