/**
 * O plano de estudo diário e a evolução por nível.
 *
 * A app tem dois caminhos, e este módulo é o que os distingue:
 * - **estudo** (`mode: 'studio'`): exercícios de apostila, vocabulário e
 *   escuta/leitura do nível em que a aluna está (A1 → A2 → B1);
 * - **provas** (`ascolto`, `lettura`, `scrittura`, `orale`, `mock`): o treino
 *   no formato do exame.
 *
 * Tudo aqui é função pura para poder ser testado — o veredito de prontidão
 * continua a olhar só para as provas (`buildSkillHistory` exclui o estudo).
 */

import { LEVELS, type Attempt, type Level, type Session } from '../db/schemas'

export const LEVEL_LABELS: Record<Level, string> = {
  A1: 'A1 · Básico',
  A2: 'A2 · Estruturas',
  B1: 'B1 · Exame',
}

/** O que se treina em cada nível (texto curto, em português). */
export const LEVEL_FOCUS: Record<Level, string> = {
  A1: 'Comece pelo essencial: ser e ter, artigos, apresentação pessoal e vida cotidiana.',
  A2: 'Passado, futuro, pronomes e preposições — com exercícios de completar frases.',
  B1: 'O nível do exame: condicional, conectores, burocracia e cidadania.',
}

/** Respostas mínimas para considerar um nível dominado. */
export const MIN_ANSWERS_FOR_MASTERY = 20
/** Precisão mínima (%) para considerar um nível dominado. */
export const MASTERY_ACCURACY = 80

/** O nível está codificado no fim do taskId do banco de estudo. */
export function levelFromTaskId(taskId: string): Level | null {
  for (const level of LEVELS) {
    if (taskId === level || taskId.endsWith(`-${level}`)) return level
  }
  return null
}

export type LevelProgressAttempt = Pick<
  Attempt,
  'questionId' | 'taskId' | 'sessionId' | 'isCorrect' | 'timestamp'
>

export interface LevelProgress {
  level: Level
  answered: number
  correct: number
  accuracy: number
  /** Sessões distintas em que respondeu a este nível. */
  sessions: number
  lastAt: number | null
  /** Volume + precisão suficientes para avançar de nível. */
  mastered: boolean
  /** Barra de progresso (0-100) até ao domínio do nível. */
  percent: number
}

export interface LevelProgressInput {
  attempts: ReadonlyArray<LevelProgressAttempt>
  /** Nível de cada pergunta (para tentativas cujo taskId não traz o nível). */
  levelByQuestionId?: Record<string, Level | undefined>
}

/** Nível de uma tentativa: primeiro o banco de perguntas, depois o taskId. */
function attemptLevel(
  attempt: LevelProgressAttempt,
  levelByQuestionId?: Record<string, Level | undefined>,
): Level | null {
  return levelByQuestionId?.[attempt.questionId] ?? levelFromTaskId(attempt.taskId)
}

export function buildLevelProgress(
  input: LevelProgressInput,
): Record<Level, LevelProgress> {
  const base: Record<Level, LevelProgress> = {
    A1: emptyProgress('A1'),
    A2: emptyProgress('A2'),
    B1: emptyProgress('B1'),
  }
  const sessionIds: Record<Level, Set<string>> = {
    A1: new Set(),
    A2: new Set(),
    B1: new Set(),
  }

  for (const attempt of input.attempts) {
    const level = attemptLevel(attempt, input.levelByQuestionId)
    if (!level) continue
    const entry = base[level]
    entry.answered += 1
    if (attempt.isCorrect) entry.correct += 1
    if (entry.lastAt === null || attempt.timestamp > entry.lastAt) {
      entry.lastAt = attempt.timestamp
    }
    sessionIds[level].add(attempt.sessionId)
  }

  for (const level of LEVELS) {
    const entry = base[level]
    entry.sessions = sessionIds[level].size
    entry.accuracy =
      entry.answered === 0 ? 0 : Math.round((entry.correct / entry.answered) * 100)
    const volume = Math.min(entry.answered / MIN_ANSWERS_FOR_MASTERY, 1)
    const quality = Math.min(entry.accuracy / MASTERY_ACCURACY, 1)
    entry.percent = Math.round(volume * quality * 100)
    entry.mastered =
      entry.answered >= MIN_ANSWERS_FOR_MASTERY && entry.accuracy >= MASTERY_ACCURACY
  }

  return base
}

function emptyProgress(level: Level): LevelProgress {
  return {
    level,
    answered: 0,
    correct: 0,
    accuracy: 0,
    sessions: 0,
    lastAt: null,
    mastered: false,
    percent: 0,
  }
}

/** O próximo nível a estudar: o primeiro que ainda não está dominado. */
export function recommendLevel(progress: Record<Level, LevelProgress>): Level {
  for (const level of LEVELS) {
    if (!progress[level].mastered) return level
  }
  return 'B1'
}

export function nextLevel(level: Level): Level | null {
  const index = LEVELS.indexOf(level)
  if (index < 0 || index >= LEVELS.length - 1) return null
  return LEVELS[index + 1] ?? null
}

export type MistakeAttempt = Pick<Attempt, 'questionId' | 'isCorrect' | 'timestamp'>

/** Erros ainda por rever: a última tentativa de cada pergunta conta. */
export function countOpenMistakes(attempts: ReadonlyArray<MistakeAttempt>): number {
  const last = new Map<string, { isCorrect: boolean; timestamp: number }>()
  for (const attempt of attempts) {
    const current = last.get(attempt.questionId)
    if (!current || attempt.timestamp >= current.timestamp) {
      last.set(attempt.questionId, {
        isCorrect: attempt.isCorrect,
        timestamp: attempt.timestamp,
      })
    }
  }
  return [...last.values()].filter((entry) => !entry.isCorrect).length
}

export interface TodayPlanItem {
  id: 'study' | 'mistakes' | 'mock'
  title: string
  detail: string
  minutes: number
  cta: string
}

export interface TodayPlan {
  level: Level
  headline: string
  items: TodayPlanItem[]
  /** O nível atual já está dominado: vale a pena subir. */
  recommendAdvance: boolean
  next: Level | null
}

export interface TodayPlanInput extends LevelProgressInput {
  sessions: ReadonlyArray<Pick<Session, 'mode' | 'status'>>
  /** Nível escolhido pela aluna (o que está salvo nas preferências). */
  level: Level
}

/**
 * As atividades de hoje: sempre um bloco de estudo do nível atual e, logo a
 * seguir, a revisão dos erros (ou o primeiro simulado, se ainda não houver).
 */
export function buildTodayPlan(input: TodayPlanInput): TodayPlan {
  const progress = buildLevelProgress(input)
  const openMistakes = countOpenMistakes(input.attempts)
  const mocksDone = input.sessions.filter(
    (session) => session.status === 'completed' && session.mode === 'mock_cittadinanza',
  ).length

  const items: TodayPlanItem[] = [
    {
      id: 'study',
      title: `Estudo de hoje — ${input.level}`,
      detail: `${LEVEL_FOCUS[input.level]} 12 exercícios, ~10 minutos.`,
      minutes: 10,
      cta: 'Começar o estudo',
    },
  ]

  if (openMistakes > 0) {
    items.push({
      id: 'mistakes',
      title: `Revisar ${openMistakes} pergunta(s) errada(s)`,
      detail: 'Rever a resposta certa e a explicação, e treinar outra vez só esses erros.',
      minutes: 8,
      cta: 'Rever erros',
    })
  } else if (mocksDone === 0) {
    items.push({
      id: 'mock',
      title: 'Primeiro simulado',
      detail: 'A prova oficial de exemplo, cronometrada — o primeiro veredito a sério.',
      minutes: 110,
      cta: 'Abrir simulado',
    })
  }

  const next = nextLevel(input.level)
  return {
    level: input.level,
    headline:
      items.length > 1
        ? `Hoje: ${items[0]?.title ?? 'estudo'} e ${items[1]?.title.toLowerCase() ?? 'revisão'}`
        : `Hoje: ${items[0]?.title ?? 'estudo'}`,
    items,
    recommendAdvance: progress[input.level].mastered && next !== null,
    next,
  }
}

export interface StudyDay {
  dateKey: string
  label: string
  total: number
  /** Respostas em sessões de estudo (`mode: 'studio'`). */
  study: number
  /** Respostas em prática no formato do exame. */
  practice: number
  /** Respostas dentro de um simulado completo. */
  exam: number
}

function dayKey(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

function dayStart(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

/** Atividade dos últimos `days` dias, do mais antigo para hoje. */
export function buildStudyActivity(
  attempts: ReadonlyArray<Pick<Attempt, 'sessionId' | 'timestamp'>>,
  sessions: ReadonlyArray<Pick<Session, 'id' | 'mode'>>,
  options: { days?: number; now?: number } = {},
): StudyDay[] {
  const days = options.days ?? 14
  const now = options.now ?? Date.now()
  const modeBySession = new Map(sessions.map((session) => [session.id, session.mode]))
  const todayStart = dayStart(now)

  const daysList: StudyDay[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const at = todayStart - offset * 24 * 60 * 60 * 1000
    const date = new Date(at)
    daysList.push({
      dateKey: dayKey(at),
      label: `${String(date.getDate()).padStart(2, '0')}/${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`,
      total: 0,
      study: 0,
      practice: 0,
      exam: 0,
    })
  }

  const byKey = new Map(daysList.map((day) => [day.dateKey, day]))
  for (const attempt of attempts) {
    if (attempt.timestamp < todayStart - (days - 1) * 24 * 60 * 60 * 1000) continue
    const day = byKey.get(dayKey(attempt.timestamp))
    if (!day) continue
    const mode = modeBySession.get(attempt.sessionId)
    day.total += 1
    if (mode === 'studio') day.study += 1
    else if (mode === 'mock_cittadinanza') day.exam += 1
    else day.practice += 1
  }

  return daysList
}

/**
 * Dias seguidos com atividade. Se hoje ainda não houver respostas, conta a
 * sequência até ontem (o dia ainda não acabou).
 */
export function studyStreak(days: ReadonlyArray<StudyDay>): number {
  if (days.length === 0) return 0
  let index = days.length - 1
  if ((days[index]?.total ?? 0) === 0) index -= 1
  let streak = 0
  while (index >= 0 && (days[index]?.total ?? 0) > 0) {
    streak += 1
    index -= 1
  }
  return streak
}
