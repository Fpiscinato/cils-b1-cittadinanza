/**
 * As 3 fases de preparação e a "tarefa do dia".
 *
 * Diferente do ElevenSpark (onde a janela das fases vem do calendário do exame,
 * Out–Jul), aqui a janela é RELATIVA à data da prova que a aluna escolheu.
 */

export type RoadmapPhaseId = 'fondazione' | 'struttura' | 'cittadinanza'

export interface PhaseGoal {
  label: string
  /** Quantidade já alcancada. */
  achieved: number
  /** Quantidade necessária. */
  target: number
  met: boolean
  unit: 'questions' | 'sessions' | 'percent'
}

export interface PhaseProgress {
  id: RoadmapPhaseId
  title: string
  window: string
  headline: string
  percent: number
  goals: PhaseGoal[]
}

export interface RoadmapSnapshot {
  currentPhaseId: RoadmapPhaseId
  phases: PhaseProgress[]
  totalAnswered: number
  accuracy: number
  openMistakes: number
  mocksDone: number
  /** Todas as 4 habilidades com pelo menos uma amostra? */
  hasFullCoverage: boolean
  perSkillAnswered: Record<string, number>
}

export interface RoadmapInput {
  attempts: ReadonlyArray<{ skill: string; isCorrect: boolean; questionId: string; timestamp: number }>
  sessions: ReadonlyArray<{ status: string; mode: string; startedAt: number }>
  /** Data da prova em ISO (YYYY-MM-DD). Vazio = ainda não definida. */
  examDate?: string
  /** Data de hoje (ms). */
  now?: number
}

/** Duração de cada fase, em semanas. */
export const PHASE_LENGTH_WEEKS = 8

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

function phasePercent(goals: PhaseGoal[]): number {
  if (goals.length === 0) return 0
  const sum = goals.reduce((total, goal) => total + Math.min(goal.achieved / goal.target, 1), 0)
  return clampPercent((sum / goals.length) * 100)
}

function weeksUntil(examDate: string, now: number): number | null {
  if (!examDate) return null
  const target = new Date(`${examDate}T00:00:00`).getTime()
  if (!Number.isFinite(target)) return null
  return (target - now) / (7 * 24 * 60 * 60 * 1000)
}

/**
 * A fase atual depende de quantas semanas faltam para a prova.
 * Sem data de prova definida, assume-se a fase 1 (a aluna ainda está a construir
 * a base) — e a UI pede-lhe para marcar a data.
 */
export function currentPhaseForDate(examDate: string | undefined, now: number = Date.now()): RoadmapPhaseId {
  const weeks = weeksUntil(examDate ?? '', now)
  if (weeks === null) return 'fondazione'
  if (weeks > PHASE_LENGTH_WEEKS * 2) return 'fondazione'
  if (weeks > PHASE_LENGTH_WEEKS) return 'struttura'
  return 'cittadinanza'
}

export function computeRoadmap(input: RoadmapInput): RoadmapSnapshot {
  const now = input.now ?? Date.now()
  const attempts = input.attempts
  const sessions = input.sessions

  const totalAnswered = attempts.length
  const correct = attempts.filter((attempt) => attempt.isCorrect).length
  const accuracy = totalAnswered === 0 ? 0 : Math.round((correct / totalAnswered) * 100)

  const perSkillAnswered: Record<string, number> = {}
  for (const attempt of attempts) {
    perSkillAnswered[attempt.skill] = (perSkillAnswered[attempt.skill] ?? 0) + 1
  }

  // Banco de erros: cada questão errada e ainda não corrigida conta 1.
  const seen = new Map<string, boolean>()
  for (const attempt of [...attempts].sort((a, b) => a.timestamp - b.timestamp)) {
    seen.set(attempt.questionId, attempt.isCorrect)
  }
  const openMistakes = [...seen.values()].filter((value) => !value).length

  // "Simulados completos" conta só o simulado completo — uma prática de
  // estudo não é um simulado.
  const mocksDone = sessions.filter(
    (session) => session.status === 'completed' && session.mode === 'mock_cittadinanza',
  ).length

  const foundationGoals: PhaseGoal[] = [
    { label: 'Perguntas respondidas', achieved: totalAnswered, target: 200, met: totalAnswered >= 200, unit: 'questions' },
    { label: 'Habilidades com prática', achieved: Object.keys(perSkillAnswered).length, target: 4, met: Object.keys(perSkillAnswered).length >= 4, unit: 'questions' },
    { label: 'Precisão', achieved: accuracy, target: 60, met: accuracy >= 60, unit: 'percent' },
  ]

  const structureGoals: PhaseGoal[] = [
    { label: 'Perguntas respondidas', achieved: totalAnswered, target: 600, met: totalAnswered >= 600, unit: 'questions' },
    { label: 'Simulados completos', achieved: mocksDone, target: 4, met: mocksDone >= 4, unit: 'sessions' },
    { label: 'Precisão', achieved: accuracy, target: 70, met: accuracy >= 70, unit: 'percent' },
  ]

  const cittadinanzaGoals: PhaseGoal[] = [
    { label: 'Perguntas respondidas', achieved: totalAnswered, target: 1200, met: totalAnswered >= 1200, unit: 'questions' },
    { label: 'Simulados completos', achieved: mocksDone, target: 10, met: mocksDone >= 10, unit: 'sessions' },
    { label: 'Precisão', achieved: accuracy, target: 78, met: accuracy >= 78, unit: 'percent' },
  ]

  const phases: PhaseProgress[] = [
    {
      id: 'fondazione',
      title: 'Fase 1 — Fondazione (A1)',
      window: 'Primeiras 16 semanas',
      headline: 'Verbi essere/avere, artigos, apresentação pessoal, vida cotidiana.',
      percent: phasePercent(foundationGoals),
      goals: foundationGoals,
    },
    {
      id: 'struttura',
      title: 'Fase 2 — Struttura (A2)',
      window: '16 a 8 semanas antes da prova',
      headline: 'Passato prossimo vs imperfetto, preposições articuladas, futuro, pronomes.',
      percent: phasePercent(structureGoals),
      goals: structureGoals,
    },
    {
      id: 'cittadinanza',
      title: 'Fase 3 — Cittadinanza (B1)',
      window: 'Últimas 8 semanas',
      headline: 'Burocracia, condicional presente, conectores, simulados cronometrados.',
      percent: phasePercent(cittadinanzaGoals),
      goals: cittadinanzaGoals,
    },
  ]

  return {
    currentPhaseId: currentPhaseForDate(input.examDate, now),
    phases,
    totalAnswered,
    accuracy,
    openMistakes,
    mocksDone,
    hasFullCoverage: Object.keys(perSkillAnswered).length >= 4,
    perSkillAnswered,
  }
}

export interface DailyTask {
  id: 'mistakes' | 'mock' | 'coverage' | 'practice'
  title: string
  detail: string
  minutes: number
  questions: number
}

/** "Tarefa do dia": o que vale mais a fazer agora. */
export function computeDailyTask(snapshot: RoadmapSnapshot): DailyTask {
  if (snapshot.openMistakes >= 5) {
    return {
      id: 'mistakes',
      title: 'Limpar o banco de erros',
      detail: `Refazer ${Math.min(snapshot.openMistakes, 10)} perguntas que erraste — é o que mais sobe a nota.`,
      minutes: 10,
      questions: Math.min(snapshot.openMistakes, 10),
    }
  }
  if (snapshot.mocksDone < 2) {
    return {
      id: 'mock',
      title: 'Fazer um simulado',
      detail: 'Um simulado cronometrado vale por dez práticas: mostra o que falha sob pressão.',
      minutes: 30,
      questions: 0,
    }
  }
  if (!snapshot.hasFullCoverage) {
    return {
      id: 'coverage',
      title: 'Cobrir uma habilidade nova',
      detail: 'Ainda não praticaste todas as 4 habilidades. Escolha a que falta.',
      minutes: 15,
      questions: 10,
    }
  }
  return {
    id: 'practice',
    title: 'Prática cronometrada',
    detail: 'Mantém o ritmo: 10 perguntas com o relógio a contar.',
    minutes: 12,
    questions: 10,
  }
}
