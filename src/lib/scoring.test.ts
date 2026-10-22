import { describe, expect, it } from 'vitest'
import {
  evaluateExam,
  PASS_THRESHOLD_PER_SKILL,
  PASS_THRESHOLD_TOTAL,
  POINTS_PER_SKILL,
  scoreAscolto,
  scoreLettura,
  scoreObjective,
  scoreOrale,
  scoreRubric,
  scoreScrittura,
  scoreSkillFromCounts,
  TOTAL_POINTS,
  WRITING_RUBRIC,
  ORAL_RUBRIC,
} from './scoring'

describe('pontos das provas objetivas', () => {
  it('ascolto: 6 MCQ a 1 ponto + 12 V/F a 0,5 = 12', () => {
    expect(scoreAscolto(6, 12)).toBe(12)
    expect(scoreAscolto(0, 0)).toBe(0)
    expect(scoreAscolto(3, 6)).toBe(6)
  })

  it('lettura: 12 V/F a 0,5 + 6 cloze a 1 ponto = 12', () => {
    expect(scoreLettura(12, 6)).toBe(12)
    expect(scoreLettura(0, 0)).toBe(0)
    expect(scoreLettura(6, 3)).toBe(6)
  })

  it('uma resposta errada ou omissa vale zero (sem penalização negativa)', () => {
    expect(scoreObjective(0, 12, 0.5)).toBe(0)
    expect(scoreObjective(-5, 12, 0.5)).toBe(0)
  })

  it('nunca dá mais pontos do que o máximo', () => {
    expect(scoreAscolto(99, 99)).toBe(12)
    expect(scoreLettura(99, 99)).toBe(12)
  })

  it('não deixa ruído de ponto flutuante', () => {
    expect(scoreObjective(3, 12, 0.5)).toBe(1.5)
    expect(scoreSkillFromCounts('ascolto', { 'ascolto-p2': 3 })).toBe(1.5)
  })

  it('ignora tasks desconhecidas', () => {
    expect(scoreSkillFromCounts('ascolto', { 'inventada': 6 })).toBe(0)
  })
})

describe('grelhas oficiais', () => {
  it('a grelha da escrita soma 12 pontos', () => {
    const full = Object.fromEntries(WRITING_RUBRIC.map((c) => [c.key, c.max]))
    expect(scoreScrittura(full)).toBe(12)
  })

  it('a grelha da oral soma 12 pontos', () => {
    const full = Object.fromEntries(ORAL_RUBRIC.map((c) => [c.key, c.max]))
    expect(scoreOrale(full)).toBe(12)
  })

  it('uma auto-avaliação generosa não passa do máximo', () => {
    const greedy = Object.fromEntries(WRITING_RUBRIC.map((c) => [c.key, 99]))
    expect(scoreScrittura(greedy)).toBe(12)
  })

  it('uma rubrica incompleta dá 0 nos critérios em falta', () => {
    expect(scoreRubric({ communicativeEffectiveness: 3 }, WRITING_RUBRIC)).toBe(3)
  })
})

describe('regra de aprovação', () => {
  it('passa só quando as 4 habilidades estão acima do limiar', () => {
    const result = evaluateExam({
      ascolto: 8,
      lettura: 8,
      scrittura: 8,
      orale: 8,
    })
    expect(result.passed).toBe(true)
    expect(result.total).toBe(32)
    expect(result.failedSkills).toEqual([])
  })

  it('REPROVA mesmo com um total alto se uma habilidade estiver abaixo do limiar', () => {
    // 39/48 no total, mas a oral fica a 6.
    const result = evaluateExam({
      ascolto: 11,
      lettura: 11,
      scrittura: 11,
      orale: 6,
    })
    expect(result.total).toBe(39)
    expect(result.passed).toBe(false)
    expect(result.failedSkills).toEqual(['orale'])
    expect(result.mustRetakeWholeExam).toBe(true)
  })

  it('exatamente no limiar conta como suficiente', () => {
    const result = evaluateExam({
      ascolto: 7,
      lettura: 7,
      scrittura: 7,
      orale: 7,
    })
    expect(result.passed).toBe(true)
    expect(result.total).toBe(28)
  })

  it('uma abaixo do limiar conta como zero', () => {
    const result = evaluateExam({
      ascolto: 6,
      lettura: 12,
      scrittura: 12,
      orale: 12,
    })
    expect(result.passed).toBe(false)
    expect(result.perSkill.ascolto.missing).toBe(1)
  })

  it('uma habilidade sem tentativa reprova (como na prova real)', () => {
    const result = evaluateExam({
      ascolto: 12,
      lettura: 12,
      scrittura: 12,
    })
    expect(result.passed).toBe(false)
    expect(result.failedSkills).toEqual(['orale'])
  })

  it('os limiares são coerentes entre si', () => {
    expect(PASS_THRESHOLD_PER_SKILL).toBe(7)
    expect(PASS_THRESHOLD_TOTAL).toBe(28)
    expect(POINTS_PER_SKILL * 4).toBe(TOTAL_POINTS)
  })
})
