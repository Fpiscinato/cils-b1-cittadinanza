import { describe, expect, it } from 'vitest'
import { buildOnboardingSteps, pendingSteps } from './onboarding'

describe('primeiros passos', () => {
  it('marca a data da prova como o primeiro passo', () => {
    const steps = buildOnboardingSteps({
      examDate: '',
      completedSessions: 0,
      hasBackup: false,
      hasSync: false,
    })
    expect(steps[0]?.id).toBe('exam-date')
    expect(steps[0]?.done).toBe(false)
  })

  it('conta como feitos os passos já cumpridos', () => {
    const steps = buildOnboardingSteps({
      examDate: '2026-05-10',
      completedSessions: 3,
      hasBackup: true,
      hasSync: true,
    })
    expect(steps.every((step) => step.done)).toBe(true)
    expect(pendingSteps(steps)).toHaveLength(0)
  })

  it('a primeira prática é um passo distinto do simulado', () => {
    const steps = buildOnboardingSteps({
      examDate: '2026-05-10',
      completedSessions: 1,
      hasBackup: false,
      hasSync: false,
    })
    expect(steps.find((step) => step.id === 'first-practice')?.done).toBe(true)
    expect(steps.find((step) => step.id === 'first-mock')?.done).toBe(false)
    expect(pendingSteps(steps)).toHaveLength(3)
  })

  it('cada passo aponta para um ecrã da app', () => {
    const steps = buildOnboardingSteps({
      examDate: '',
      completedSessions: 0,
      hasBackup: false,
      hasSync: false,
    })
    const routes = new Set(steps.map((step) => step.route))
    expect(routes.has('settings')).toBe(true)
    expect(routes.has('practice')).toBe(true)
    expect(routes.has('mock')).toBe(true)
  })
})
