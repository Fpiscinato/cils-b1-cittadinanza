import { describe, expect, it } from 'vitest'
import { computeReadiness, isReady, skillPercent } from './readiness'
import type { SkillSample } from './readiness'

function sample(score: number, at = 1): SkillSample {
  return { at, score }
}

describe('veredito de prontidão', () => {
  it('pronta só quando as 4 habilidades estão acima do limiar', () => {
    const report = computeReadiness({
      history: {
        ascolto: [sample(9), sample(10)],
        lettura: [sample(8), sample(9)],
        scrittura: [sample(7), sample(8)],
        orale: [sample(8), sample(8)],
      },
    })
    expect(report.verdict).toBe('ready')
    expect(isReady(report)).toBe(true)
    expect(report.mustRetakeWholeExam).toBe(false)
  })

  it('não pronta quando uma habilidade está abaixo do limiar, mesmo com as outras no máximo', () => {
    const report = computeReadiness({
      history: {
        ascolto: [sample(12), sample(12)],
        lettura: [sample(12), sample(12)],
        scrittura: [sample(12), sample(12)],
        orale: [sample(6)],
      },
    })
    expect(report.verdict).not.toBe('ready')
    expect(report.mustRetakeWholeExam).toBe(true)
    expect(report.riskSkill).toBe('orale')
  })

  it('sem histórico suficiente, não dá para dizer que está pronta', () => {
    const report = computeReadiness({
      history: {
        ascolto: [sample(12)],
        lettura: [sample(12)],
      },
    })
    expect(report.insufficientData).toBe(true)
    expect(report.verdict).toBe('not_ready')
    expect(isReady(report)).toBe(false)
  })

  it('usa a média das últimas amostras dentro da janela', () => {
    const report = computeReadiness({
      history: {
        ascolto: [sample(12), sample(12), sample(12), sample(2)],
        lettura: [sample(9)],
        scrittura: [sample(9)],
        orale: [sample(9)],
      },
      windowSize: 3,
    })
    // Janela = últimas 3 amostras: 12, 12, 2 -> média 8.67
    expect(report.skills[0]?.average).toBeCloseTo(8.67, 1)
    expect(report.skills[0]?.passed).toBe(true)
  })

  it('conta as amostras consecutivas abaixo do limiar', () => {
    const report = computeReadiness({
      history: {
        ascolto: [sample(12), sample(5), sample(4), sample(3)],
        lettura: [sample(9)],
        scrittura: [sample(9)],
        orale: [sample(9)],
      },
    })
    const ascolto = report.skills.find((entry) => entry.skill === 'ascolto')
    expect(ascolto?.consecutiveBelow).toBe(3)
  })

  it('a margem mede a distância ao limiar', () => {
    const report = computeReadiness({
      history: {
        ascolto: [sample(10)],
        lettura: [sample(10)],
        scrittura: [sample(10)],
        orale: [sample(5)],
      },
    })
    const orale = report.skills.find((entry) => entry.skill === 'orale')
    expect(orale?.margin).toBe(-2)
    const ascolto = report.skills.find((entry) => entry.skill === 'ascolto')
    expect(ascolto?.margin).toBe(3)
  })

  it('converte a pontuação em percentagem', () => {
    expect(skillPercent(12)).toBe(100)
    expect(skillPercent(6)).toBe(50)
    expect(skillPercent(0)).toBe(0)
    expect(skillPercent(99)).toBe(100)
  })
})
