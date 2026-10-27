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
 * - `origin`: `study` = só os exercícios de apostila/vocabulário (`taskId`
 *   começado por `studio-`); `practice` = só o material no formato da prova;
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
  /**
   * De onde vêm os itens:
   * - `study`: o banco de estudo (exercícios de completar frases e vocabulário);
   * - `practice`: o material de prática/prova (textos de escuta e leitura).
   */
  origin?: 'study' | 'practice'
  /** Só estes ids de pergunta (usado pela "clínica de erros"). */
  questionIds?: string[]
  /** Baralha os itens (a prática e o estudo são sempre aleatórios). */
  shuffle?: boolean
  /**
   * Mantém os itens da mesma task (o mesmo texto/áudio) juntos quando baralha.
   * É o que a prática de uma habilidade usa: assim ouve-se um texto inteiro de
   * seguida, em vez de saltar entre textos a cada pergunta.
   */
  groupByTask?: boolean
  /** Número máximo de itens por prova (o simulado completo não tem limite). */
  limit?: number
  /** Ids que devem ficar para o fim (perguntas já respondidas recentemente). */
  excludeQuestionIds?: string[]
  /**
   * Pede ao builder para evitar as perguntas respondidas nos últimos
   * `RECENT_REPEAT_WINDOW_DAYS` dias. Por omissão só se aplica à prática e ao
   * estudo (nunca ao simulado, que tem de usar a prova oficial na ordem).
   */
  excludeRecent?: boolean
  /** Gerador de aleatoriedade injectável (para os testes). */
  random?: () => number
}

/**
 * Janela (em dias) em que uma pergunta já respondida deixa de ser escolhida
 * enquanto houver perguntas novas no banco. Evita que a prática abra sempre
 * com as mesmas 18 perguntas.
 */
export const RECENT_REPEAT_WINDOW_DAYS = 45

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
  if (options.origin === 'study') {
    filtered = filtered.filter((question) => question.taskId.startsWith('studio-'))
  } else if (options.origin === 'practice') {
    filtered = filtered.filter((question) => !question.taskId.startsWith('studio-'))
  }
  if (options.questionIds && options.questionIds.length > 0) {
    const wanted = new Set(options.questionIds)
    filtered = filtered.filter((question) => wanted.has(question.id))
  }

  if (options.shuffle) {
    /**
     * As perguntas já respondidas recentemente vão para o FIM da lista: o
     * `limit` corta primeiro as novas. Quando o banco já não tem material
     * fresco suficiente, a prova enche-se com as antigas (nunca fica vazia).
     */
    if (options.groupByTask) {
      // O texto/áudio é a unidade: se uma pergunta da task já foi vista, a task
      // inteira vai para o fim (nunca se corta um texto a meio).
      const excluded = new Set(options.excludeQuestionIds ?? [])
      const seenTasks = new Set(
        excluded.size > 0
          ? filtered.filter((question) => excluded.has(question.id)).map((question) => question.taskId)
          : [],
      )
      const fresh = filtered.filter((question) => !seenTasks.has(question.taskId))
      const seen = filtered.filter((question) => seenTasks.has(question.taskId))
      filtered = [...shuffleTaskGroups(fresh, random), ...shuffleTaskGroups(seen, random)]
    } else {
      const excluded = new Set(options.excludeQuestionIds ?? [])
      const fresh = filtered.filter((question) => !excluded.has(question.id))
      const seen = filtered.filter((question) => excluded.has(question.id))
      filtered = [...shuffle(fresh, random), ...shuffle(seen, random)]
    }
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

/**
 * Baralha os grupos (tasks) e devolve os itens com os grupos contíguos.
 * O `limit` é aplicado depois, por isso o último grupo pode ficar incompleto.
 */
function shuffleTaskGroups(questions: Question[], random: () => number): Question[] {
  const groups = new Map<string, Question[]>()
  for (const question of questions) {
    const group = groups.get(question.taskId)
    if (group) group.push(question)
    else groups.set(question.taskId, [question])
  }
  const ordered: Question[] = []
  for (const taskId of shuffle([...groups.keys()], random)) {
    const group = groups.get(taskId)
    if (!group) continue
    ordered.push(...[...group].sort((a, b) => a.order - b.order))
  }
  return ordered
}

async function loadQuestions(
  skill: string,
  options: BuildOptions,
): Promise<Question[]> {
  const questions = await db.questions.where('skill').equals(skill as never).toArray()
  return filterQuestions(questions, options)
}

/**
 * Ids de perguntas desta habilidade respondidas nos últimos dias. Só serve
 * para as empurrar para o fim da seleção — não as elimina do banco.
 */
async function recentlyAnsweredIds(skill: Skill): Promise<string[]> {
  const cutoff = Date.now() - RECENT_REPEAT_WINDOW_DAYS * 24 * 60 * 60 * 1000
  const attempts = await db.attempts.where('timestamp').aboveOrEqual(cutoff).toArray()
  return attempts
    .filter((attempt) => attempt.skill === skill)
    .map((attempt) => attempt.questionId)
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
  const config = EXAM_CONFIGS[mode]
  const passages = await db.passages.toArray()
  const passageMap = new Map(passages.map((passage) => [passage.id, passage]))
  const stages: Stage[] = []

  /**
   * Uma "prova completa de uma habilidade" é uma prova a sério: 18 itens
   * (ascolto: 6 + 12; lettura: 12 + 6) e não o banco inteiro (600+ itens). Sem
   * este limite, clicar em "Lettura" abria uma sessão de 629 perguntas — com o
   * cronómetro de 40 minutos.
   */
  const provaItemCount = config.tasks.reduce((sum, task) => sum + task.itemCount, 0)
  const isSingleSkillPractice = mode === 'ascolto' || mode === 'lettura'
  const practiceLimit = isSingleSkillPractice && provaItemCount > 0 ? provaItemCount : undefined
  const resolved: BuildOptions = {
    ...options,
    bank,
    limit: options.limit ?? practiceLimit,
    shuffle: options.shuffle ?? practiceLimit !== undefined,
    groupByTask: options.groupByTask ?? practiceLimit !== undefined,
  }

  /**
   * A prática e o estudo mandam para o fim as perguntas já respondidas nos
   * últimos `RECENT_REPEAT_WINDOW_DAYS` dias (só quando há alternativa). O
   * simulado NÃO: usa a prova oficial, na ordem oficial.
   */
  const avoidRepeats =
    options.excludeRecent ??
    (bank === 'all' &&
      resolved.shuffle === true &&
      resolved.limit !== undefined &&
      !options.questionIds?.length)

  async function practiceQuestions(skill: Skill): Promise<Question[]> {
    const recent = avoidRepeats ? await recentlyAnsweredIds(skill) : []
    return loadQuestions(skill, {
      ...resolved,
      excludeQuestionIds: [...(options.excludeQuestionIds ?? []), ...recent],
    })
  }

  if (mode === 'ascolto' || mode === 'mock_cittadinanza') {
    const questions = await practiceQuestions('ascolto')
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
    const questions = await practiceQuestions('lettura')
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
    const questions = await practiceQuestions(skill)
    if (questions.length > 0) {
      stages.push({
        kind: 'objective',
        id: 'studio',
        skill,
        title:
          options.origin === 'study'
            ? 'Studio — esercizi'
            : skill === 'ascolto'
              ? 'Studio — ascolto'
              : 'Studio — lettura e grammatica',
        subtitle: 'Sem cronómetro · explicação depois de cada resposta',
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
