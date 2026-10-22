/**
 * Veredito de prontidão: "se eu fizesse a prova amanhã, eu passaria?".
 *
 * Este é o coração do produto. A regra do CILS B1 Cittadinanza é dura:
 * a sufficienza tem de ser alcançada em CADA habilidade, e não há capitalização
 * (reprovar uma habilidade obriga a refazer a prova inteira). Por isso o readiness
 * nunca mostra "3 de 4 habilidades ok" como algo parcial: ou as quatro estão acima
 * do limiar, ou a aluna vai ter de repetir tudo.
 */

import {
  PASS_THRESHOLD_PER_SKILL,
  POINTS_PER_SKILL,
  SKILLS,
  type Skill,
} from './scoring'

/** Uma medição de habilidade: pontuação (0-12) e momento. */
export interface SkillSample {
  at: number
  score: number
}

export type Verdict = 'not_ready' | 'close' | 'ready'

export interface SkillReadiness {
  skill: Skill
  /** Média das últimas amostras dentro da janela. */
  average: number
  /** Pontuação da última amostra. */
  last: number | null
  /** Margem sobre o limiar: `average - PASS_THRESHOLD_PER_SKILL`. */
  margin: number
  passed: boolean
  samples: number
  /** Quantas amostras consecutivas (a partir da mais recente) ficaram abaixo do limiar. */
  consecutiveBelow: number
}

export interface ReadinessReport {
  verdict: Verdict
  verdictPt: string
  skills: SkillReadiness[]
  /** A habilidade com a menor margem — a que provavelmente reprova. */
  riskSkill: Skill | null
  /**true quando pelo menos uma habilidade está abaixo do limiar. */
  mustRetakeWholeExam: boolean
  /** true quando não há histórico suficiente para uma conclusão. */
  insufficientData: boolean
}

export interface ReadinessInput {
  /** Histórico por habilidade, do mais antigo ao mais recente. */
  history: Partial<Record<Skill, SkillSample[]>>
  /** Quantas amostras entram na média. Padrão: 3. */
  windowSize?: number
}

const DEFAULT_WINDOW = 3

function average(samples: SkillSample[]): number {
  if (samples.length === 0) return 0
  const sum = samples.reduce((total, sample) => total + sample.score, 0)
  return Math.round((sum / samples.length) * 100) / 100
}

/** Quantas amostras consecutivas, contando de trás para frente, ficaram abaixo do limiar. */
function consecutiveBelow(samples: SkillSample[]): number {
  let count = 0
  for (let i = samples.length - 1; i >= 0; i -= 1) {
    const sample = samples[i]
    if (!sample) break
    if (sample.score >= PASS_THRESHOLD_PER_SKILL) break
    count += 1
  }
  return count
}

export function computeReadiness(input: ReadinessInput): ReadinessReport {
  const windowSize = input.windowSize ?? DEFAULT_WINDOW

  const skills: SkillReadiness[] = SKILLS.map((skill) => {
    const all = [...(input.history[skill] ?? [])].sort((a, b) => a.at - b.at)
    const window = all.slice(-windowSize)
    const avg = average(window)
    const last = all.length > 0 ? all[all.length - 1] : null
    return {
      skill,
      average: avg,
      last: last ? last.score : null,
      margin: Math.round((avg - PASS_THRESHOLD_PER_SKILL) * 100) / 100,
      passed: window.length > 0 && avg >= PASS_THRESHOLD_PER_SKILL,
      samples: window.length,
      consecutiveBelow: consecutiveBelow(all),
    }
  })

  const withData = skills.filter((entry) => entry.samples > 0)
  const insufficientData = withData.length < SKILLS.length
  const passedCount = skills.filter((entry) => entry.passed).length

  // A habilidade de risco é a de menor margem entre as que têm dados.
  const riskCandidate = withData.length
    ? withData.reduce((worst, entry) => (entry.margin < worst.margin ? entry : worst))
    : null

  let verdict: Verdict
  if (insufficientData) {
    verdict = 'not_ready'
  } else if (passedCount === SKILLS.length) {
    verdict = 'ready'
  } else {
    // "close" = todas as habilidades têm dados, pelo menos duas passaram e nenhuma
    // está a mais de 3 pontos do limiar (ou seja, ainda é recuperável no prazo).
    const worstMargin = Math.min(...withData.map((entry) => entry.margin))
    verdict = passedCount >= 2 && worstMargin >= -3 ? 'close' : 'not_ready'
  }

  const verdictPt =
    verdict === 'ready'
      ? 'Pronta: as 4 habilidades estão acima da sufficienza.'
      : verdict === 'close'
        ? 'Quase lá: ainda falta acima da sufficienza em uma ou mais habilidades.'
        : 'Ainda não pronta: a sufficienza por habilidade ainda não foi alcançada.'

  return {
    verdict,
    verdictPt,
    skills,
    riskSkill: riskCandidate ? riskCandidate.skill : null,
    mustRetakeWholeExam: insufficientData || passedCount < SKILLS.length,
    insufficientData,
  }
}

/** Percentuale (0-100) de uma habilidade, para as barras do dashboard. */
export function skillPercent(score: number): number {
  if (!Number.isFinite(score)) return 0
  return Math.max(0, Math.min(100, Math.round((score / POINTS_PER_SKILL) * 100)))
}

/**
 * O veredito é "pronta" apenas com as 4 habilidades acima do limiar.
 * Esta função é a verificação explícita e testável dessa regra.
 */
export function isReady(report: ReadinessReport): boolean {
  return report.verdict === 'ready' && report.skills.every((entry) => entry.passed)
}
