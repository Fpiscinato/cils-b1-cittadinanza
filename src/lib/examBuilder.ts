/**
 * Monta as provas (stages) a partir do banco de conteúdo.
 *
 * A prova de ascolto é a única com áudio: as transcrições oficiais servem de
 * fonte para o TTS. O resto é lido diretamente do banco.
 *
 * BANCOS:
 * - `official`: só a prova oficial de exemplo do CILS. É o que o **simulado
 *   completo** usa — o gabarito oficial tem de ficar intacto.
 * - `all` (prática e estudo): banco oficial + banco extra da app, para
 *   treinar com material novo e sempre **aleatório**.
 *
 * OPÇÕES:
 * - `phase`: só o material de uma fase do plano de estudos;
 * - `level`: só o material de um nível (A1 / A2 / B1);
 * - `shuffle` + `limit`: baralha os itens e fica só com N — é o que faz cada
 *   dia de estudo ser diferente (e o que permite repetir sem repetir sempre
 *   as mesmas perguntas).
 */

import { db } from '../db/database'
import type { ExamMode, Level, Passage, Phase, Question, Skill } from '../db/schemas'
import type { Stage } from '../components/exam/ExamRunner'
import { EXAM_CONFIGS } from './exam'
import { scoreOrale, scoreScrittura } from './scoring'
import { OFFICIAL_ORAL_TOPICS, OFFICIAL_WRITING_PROMPTS } from '../data/officialSample'
import { EXTRA_ORAL_TOPICS, EXTRA_WRITING_PROMPTS } from '../data/extraPractice'
import { shuffle } from '../data/studyBank'

export type ContentBank = 'official' | 'all'

export interface BuildOptions {
  bank?: ContentBank
  phase?: Phase
  level?: Level
  /** Só uma habilidade (usado pelo modo `studio`). */
  skill?: Skill
  /** Baralha os itens (a prática e o estudo são sempre aleatórios). */
  shuffle?: boolean
  /** Número máximo de itens por prova (o simulado completo não tem limite). */
  limit?: number
  /** Gerador de aleatoriedade injectável (para os testes). */
  random?: () => number
}

export interface BuiltExam {
  stages: Stage[]
  passages: Map<string, Passage>
}

function filterQuestions(
  questions: Question[],
  options: BuildOptions,
): Question[] {
  const random = options.random ?? Math.random
  const bank: ContentBank = options.bank ?? 'official'
  let filtered = questions

  if (bank === 'official') {
    filtered = filtered.filter((question) => (question.bank ?? 'official') === 'official')
  }
  if (options.phase) {
    filtered = filtered.filter((question) => question.phase === options.phase)
  }
  if (options.level) {
    filtered = filtered.filter((question) => question.level === options.level)
  }
  if (options.skill) {
    filtered = filtered.filter((question) => question.skill === options.skill)
  }

  if (options.shuffle) {
    filtered = shuffle(filtered, random)
  } else {
    filtered = [...filtered].sort((a, b) => {
      if (a.taskId !== b.taskId) return a.taskId.localeCompare(b.taskId)
      return a.order - b.order
    })
  }

  if (options.limit !== undefined && options.limit > 0) {
    filtered = filtered.slice(0, options.limit)
  }
  return filtered
}

async function loadQuestions(
  skill: string,
  options: BuildOptions,
): Promise<Question[]> {
  const questions = await db.questions.where('skill').equals(skill as never).toArray()
  return filterQuestions(questions, options)
}

/**
 * As transcrições são indexadas pelo id da task do ascolto.
 * O id da passagem é `passage-<taskId>` (ex.: `passage-ascolto-p1-x`).
 * Só entram as tasks que existem na prova — o áudio de uma prova que não está
 * a ser feita não aparece no player.
 */
function audioByTask(passages: Passage[], questions: Question[]): Record<string, string> {
  const map: Record<string, string> = {}
  const used = new Set(questions.map((question) => question.taskId))
  for (const passage of passages) {
    if (passage.kind !== 'audio_transcript') continue
    if (!passage.id.startsWith('passage-')) continue
    const taskId = passage.id.replace('passage-', '')
    if (!used.has(taskId)) continue
    map[taskId] = passage.content
  }
  return map
}

export async function buildExam(
  mode: ExamMode,
  options: BuildOptions = {},
): Promise<BuiltExam | null> {
  const bank: ContentBank = options.bank ?? 'official'
  const resolved: BuildOptions = { ...options, bank }
  const passages = await db.passages.toArray()
  const passageMap = new Map(passages.map((passage) => [passage.id, passage]))
  const config = EXAM_CONFIGS[mode]
  const stages: Stage[] = []

  if (mode === 'ascolto' || mode === 'mock_cittadinanza') {
    const questions = await loadQuestions('ascolto', resolved)
    if (questions.length > 0) {
      stages.push({
        kind: 'objective',
        id: 'ascolto',
        skill: 'ascolto',
        title: 'Test di ascolto',
        subtitle: '2 provas · 30 minutos · 12 pontos',
        timeSeconds: config.timeSeconds,
        questions,
        audioByTask: audioByTask(passages, questions),
      })
    }
  }

  if (mode === 'lettura' || mode === 'mock_cittadinanza') {
    const questions = await loadQuestions('lettura', resolved)
    if (questions.length > 0) {
      stages.push({
        kind: 'objective',
        id: 'lettura',
        skill: 'lettura',
        title: 'Test di comprensione della lettura e riflessione grammaticale',
        subtitle: '2 provas · 40 minutos · 12 pontos',
        timeSeconds: EXAM_CONFIGS.lettura.timeSeconds,
        questions,
      })
    }
  }

  // ESTUDO: uma única habilidade, itens aleatórios do nível escolhido.
  if (mode === 'studio') {
    const skill = options.skill ?? 'lettura'
    const questions = await loadQuestions(skill, resolved)
    if (questions.length > 0) {
      stages.push({
        kind: 'objective',
        id: 'studio',
        skill,
        title: skill === 'ascolto' ? 'Studio — ascolto' : 'Studio — lettura e grammatica',
        subtitle: '10-15 itens aleatorios · livello selezionato',
        timeSeconds: config.timeSeconds,
        questions,
        audioByTask: skill === 'ascolto' ? audioByTask(passages, questions) : undefined,
      })
    }
  }

  if (mode === 'scrittura' || mode === 'mock_cittadinanza') {
    stages.push({
      kind: 'writing',
      id: 'scrittura',
      skill: 'scrittura',
      title: 'Test di produzione scritta',
      subtitle: '1 prova · 40 minutos · 12 pontos',
      timeSeconds: EXAM_CONFIGS.scrittura.timeSeconds,
      // O simulado completo usa só os 2 temas oficiais (o foglio oficial tem
      // exatamente 2); a prática oferece também temas extras.
      prompts:
        bank === 'official'
          ? OFFICIAL_WRITING_PROMPTS
          : [...OFFICIAL_WRITING_PROMPTS, ...EXTRA_WRITING_PROMPTS],
      rubricScore: scoreScrittura,
    })
  }

  if (mode === 'orale') {
    stages.push({
      kind: 'oral',
      id: 'orale',
      skill: 'orale',
      title: 'Test di produzione orale',
      subtitle: '~10 minutos · 12 pontos',
      timeSeconds: EXAM_CONFIGS.orale.timeSeconds,
      topics:
        bank === 'official'
          ? OFFICIAL_ORAL_TOPICS
          : [...OFFICIAL_ORAL_TOPICS, ...EXTRA_ORAL_TOPICS],
      rubricScore: scoreOrale,
    })
  }

  if (stages.length === 0) return null
  return { stages, passages: passageMap }
}
