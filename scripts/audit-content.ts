/**
 * AUDITORIA DE INTEGRIDADE DO BANCO DE QUESTÕES.
 *
 * Valida o conteúdo contra a especificação oficial do CILS:
 * - contagem de itens por prova (6 / 12 / 12 / 6);
 * - número de opções correcto por tipo de item (3 para escolha múltipla e
 *   cloze, 2 para verdadeiro/falso);
 * - pesos por item correctos;
 * - `correctIndex` dentro do intervalo;
 * - enunciado e explicação não vazios;
 * - chaves oficiais: a soma das respostas do gabarito do CILS tem de bater
 *   certo com o gabarito publicado (a auditoria recalcula a pontuação).
 *
 * Valida também o BANCO EXTRA da app (material original de prática) e o
 * CONTEÚDO POR FASE (gramática do Sillabo + vocabulário).
 */

import { OFFICIAL_PASSAGES, OFFICIAL_QUESTIONS } from '../src/data/officialSample'
import { EXTRA_PASSAGES, EXTRA_QUESTIONS } from '../src/data/extraPractice'
import { PASSAGES_BATCH2, QUESTIONS_BATCH2 } from '../src/data/practiceBatch2'
import { PASSAGES_BATCH3, QUESTIONS_BATCH3 } from '../src/data/practiceBatch3'
import { PASSAGES_BATCH4, QUESTIONS_BATCH4 } from '../src/data/practiceBatch4'
import { PASSAGES_BATCH5, QUESTIONS_BATCH5 } from '../src/data/practiceBatch5'
import { PASSAGES_BATCH6, QUESTIONS_BATCH6 } from '../src/data/practiceBatch6'
import { PASSAGES_BATCH7, QUESTIONS_BATCH7 } from '../src/data/practiceBatch7'
import { PASSAGES_BATCH8, QUESTIONS_BATCH8 } from '../src/data/practiceBatch8'
import { GRAMMAR_ITEMS, VOCAB_ITEMS } from '../src/data/phaseContent'
import { STUDY_QUESTIONS } from '../src/data/studyBank'
import { TASK_WEIGHTS } from '../src/lib/scoring'
import { LEVELS, PHASES } from '../src/db/schemas'
import type { Question } from '../src/db/schemas'

interface Failure {
  id: string
  reason: string
  detail: string
}

const failures: Failure[] = []

function fail(question: Question, reason: string, detail: string): void {
  failures.push({ id: question.id, reason, detail })
}

const expectedCounts: Record<string, number> = {
  'ascolto-p1': 6,
  'ascolto-p2': 12,
  'lettura-p1': 12,
  'lettura-p2': 6,
}

const expectedOptions: Record<string, number> = {
  mcq3: 3,
  truefalse: 2,
  cloze: 3,
}

const seenIds = new Set<string>()
const passageIds = new Set(OFFICIAL_PASSAGES.map((passage) => passage.id))

for (const question of OFFICIAL_QUESTIONS) {
  if (seenIds.has(question.id)) fail(question, 'id duplicado', question.id)
  seenIds.add(question.id)

  if (question.stem.trim().length === 0) fail(question, 'enunciado vazio', question.id)
  if (question.explanation.trim().length === 0) fail(question, 'explicação vazia', question.id)

  const expected = expectedOptions[question.itemType]
  if (question.options.length !== expected) {
    fail(question, 'número de opções', `esperado ${expected}, obtido ${question.options.length}`)
  }
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    fail(question, 'correctIndex fora do intervalo', String(question.correctIndex))
  }
  if (new Set(question.options.map((option) => option.trim())).size !== question.options.length) {
    fail(question, 'opções duplicadas', question.options.join(' | '))
  }
  if (question.passageId && !passageIds.has(question.passageId)) {
    fail(question, 'passagem inexistente', question.passageId)
  }

  const weight = TASK_WEIGHTS[question.taskId]
  if (weight === undefined) {
    fail(question, 'task desconhecida', question.taskId)
  } else if (weight !== question.pointsPerItem) {
    fail(
      question,
      'peso do item errado',
      `esperado ${weight}, obtido ${question.pointsPerItem}`,
    )
  }
}

for (const [taskId, expected] of Object.entries(expectedCounts)) {
  const actual = OFFICIAL_QUESTIONS.filter((question) => question.taskId === taskId).length
  if (actual !== expected) {
    failures.push({
      id: taskId,
      reason: 'contagem de itens',
      detail: `esperado ${expected}, obtido ${actual}`,
    })
  }
}

// Os itens de cada prova têm de ter ordem sequencial sem saltos.
for (const taskId of Object.keys(expectedCounts)) {
  const items = OFFICIAL_QUESTIONS.filter((question) => question.taskId === taskId).sort(
    (a, b) => a.order - b.order,
  )
  items.forEach((question, index) => {
    if (question.order !== index + 1) {
      fail(question, 'ordem quebrada', `esperado ${index + 1}, obtido ${question.order}`)
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Verificação contra as chaves oficiais do CILS                               */
/* -------------------------------------------------------------------------- */

const OFFICIAL_KEYS: Record<string, string> = {
  // "Chiavi di soluzione delle prove" (CILS B1 Cittadinanza).
  'ascolto-p1': 'CCACBB',
  'ascolto-p2': 'FFVFVVVFFFVV',
  'lettura-p1': 'FVVVVFVFFVFF',
  'lettura-p2': 'BACACA',
}

for (const [taskId, key] of Object.entries(OFFICIAL_KEYS)) {
  const items = OFFICIAL_QUESTIONS.filter((question) => question.taskId === taskId).sort(
    (a, b) => a.order - b.order,
  )
  if (items.length !== key.length) {
    failures.push({
      id: taskId,
      reason: 'gabarito oficial não bate',
      detail: `a chave tem ${key.length} letras e a prova tem ${items.length} itens`,
    })
    continue
  }
  const letters = ['A', 'B', 'C']
  items.forEach((question, index) => {
    const expected = key[index]
    // Nos itens de verdadeiro/falso o gabarito oficial usa V e F, não A/B/C.
    const actual =
      question.itemType === 'truefalse'
        ? question.correctIndex === 0
          ? 'V'
          : 'F'
        : letters[question.correctIndex]
    if (expected !== actual) {
      fail(
        question,
        'gabarito oficial não bate',
        `posição ${index + 1}: esperado ${expected}, obtido ${actual}`,
      )
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Banco extra de prática (material original da app)                           */
/* -------------------------------------------------------------------------- */

const extraPassageIds = new Set([
  ...EXTRA_PASSAGES.map((passage) => passage.id),
  ...PASSAGES_BATCH2.map((passage) => passage.id),
  ...PASSAGES_BATCH3.map((passage) => passage.id),
  ...PASSAGES_BATCH4.map((passage) => passage.id),
  ...PASSAGES_BATCH5.map((passage) => passage.id),
  ...PASSAGES_BATCH6.map((passage) => passage.id),
  ...PASSAGES_BATCH7.map((passage) => passage.id),
  ...PASSAGES_BATCH8.map((passage) => passage.id),
])
const seenExtraIds = new Set<string>()
const extraTasks = new Map<string, number>()

/** Valida um lote de itens do banco extra (opções, pesos, ordem, fase, nível). */
function checkExtraBank(
  questions: Question[],
  expectedCounts: Record<string, number>,
  label: string,
): void {
  for (const question of questions) {
    if (seenExtraIds.has(question.id)) {
      fail(question, `id duplicado (${label})`, question.id)
    }
    seenExtraIds.add(question.id)

    if (question.bank !== 'practice') {
      fail(question, `banco errado (${label})`, `bank = ${String(question.bank)}`)
    }
    if (!question.phase) {
      fail(question, `sem fase (${label})`, question.id)
    } else if (!(PHASES as readonly string[]).includes(question.phase)) {
      fail(question, 'fase desconhecida', question.phase)
    }
    if (!question.level) {
      fail(question, `sem nível (${label})`, question.id)
    } else if (!(LEVELS as readonly string[]).includes(question.level)) {
      fail(question, 'nível desconhecido', question.level)
    }
    if (question.stem.trim().length === 0) fail(question, 'enunciado vazio', question.id)
    if (question.explanation.trim().length === 0) fail(question, 'explicação vazia', question.id)

    const expected = expectedOptions[question.itemType]
    if (question.options.length !== expected) {
      fail(question, 'número de opções', `esperado ${expected}, obtido ${question.options.length}`)
    }
    if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
      fail(question, 'correctIndex fora do intervalo', String(question.correctIndex))
    }
    if (new Set(question.options.map((option) => option.trim())).size !== question.options.length) {
      fail(question, 'opções duplicadas', question.options.join(' | '))
    }
    if (!question.passageId || !extraPassageIds.has(question.passageId)) {
      fail(question, 'passagem inexistente', String(question.passageId))
    }
    const weight = TASK_WEIGHTS[question.taskId]
    if (weight === undefined) {
      fail(question, 'task desconhecida', question.taskId)
    } else if (weight !== question.pointsPerItem) {
      fail(
        question,
        'peso do item errado',
        `esperado ${weight}, obtido ${question.pointsPerItem}`,
      )
    }
    extraTasks.set(question.taskId, (extraTasks.get(question.taskId) ?? 0) + 1)
  }

  for (const [taskId, expected] of Object.entries(expectedCounts)) {
    const actual = extraTasks.get(taskId) ?? 0
    if (actual !== expected) {
      failures.push({
        id: taskId,
        reason: `contagem de itens (${label})`,
        detail: `esperado ${expected}, obtido ${actual}`,
      })
    }
    questions
      .filter((question) => question.taskId === taskId)
      .sort((a, b) => a.order - b.order)
      .forEach((question, index) => {
        if (question.order !== index + 1) {
          fail(question, `ordem quebrada (${label})`, `esperado ${index + 1}, obtido ${question.order}`)
        }
      })
  }
}

checkExtraBank(
  EXTRA_QUESTIONS,
  {
    'ascolto-p1-x': 6,
    'ascolto-p1-s2': 6,
    'ascolto-p2-x': 8,
    'lettura-p1-f1': 6,
    'lettura-p1-x': 8,
    'lettura-p2-x': 6,
  },
  'banco extra',
)

checkExtraBank(
  QUESTIONS_BATCH2,
  {
    'ascolto-p1-b3': 6,
    'ascolto-p2-b4': 8,
    'lettura-p1-b5': 6,
    'lettura-p1-b6': 8,
    'lettura-p2-b7': 6,
  },
  'lote 2',
)

checkExtraBank(
  QUESTIONS_BATCH3,
  {
    'ascolto-p1-c5': 6,
    'ascolto-p2-c6': 8,
    'lettura-p1-c7': 8,
    'lettura-p2-c8': 6,
  },
  'lote 3',
)

checkExtraBank(
  QUESTIONS_BATCH4,
  {
    'ascolto-p2-d7': 8,
    'ascolto-p2-d8': 8,
  },
  'lote 4',
)

checkExtraBank(
  QUESTIONS_BATCH8,
  {
    'ascolto-p1-h1': 6,
    'ascolto-p1-h2': 6,
    'ascolto-p2-h3': 8,
    'ascolto-p2-h4': 8,
    'lettura-p1-h5': 8,
    'lettura-p2-h6': 6,
  },
  'lote 8',
)

checkExtraBank(
  QUESTIONS_BATCH7,
  {
    'ascolto-p1-g1': 6,
    'ascolto-p1-g2': 6,
    'ascolto-p2-g3': 8,
    'lettura-p1-g4': 8,
    'lettura-p2-g5': 6,
  },
  'lote 7',
)

checkExtraBank(
  QUESTIONS_BATCH6,
  {
    'ascolto-p1-f1': 6,
    'ascolto-p2-f2': 8,
    'lettura-p1-f3': 8,
    'lettura-p2-f4': 6,
  },
  'lote 6',
)

checkExtraBank(
  QUESTIONS_BATCH5,
  {
    'ascolto-p1-d9': 6,
    'ascolto-p1-e1': 6,
    'ascolto-p2-e2': 8,
    'ascolto-p2-e3': 8,
    'lettura-p1-e4': 8,
    'lettura-p2-e5': 6,
  },
  'lote 5',
)

// Nenhum item do banco oficial pode estar marcado como "practice" (e vice-versa).
for (const question of OFFICIAL_QUESTIONS) {
  if (question.bank === 'practice') {
    fail(question, 'banco errado (oficial)', 'bank = practice')
  }
}

/* -------------------------------------------------------------------------- */
/* Conteúdo por fase (gramática e vocabulário)                                 */
/* -------------------------------------------------------------------------- */

const grammarIds = new Set<string>()
for (const item of GRAMMAR_ITEMS) {
  if (grammarIds.has(item.id)) {
    failures.push({ id: item.id, reason: 'id duplicado (gramática)', detail: item.id })
  }
  grammarIds.add(item.id)
  if (!(PHASES as readonly string[]).includes(item.phase)) {
    failures.push({ id: item.id, reason: 'fase desconhecida', detail: item.phase })
  }
  if (item.title.trim().length === 0 || item.rule.trim().length === 0) {
    failures.push({ id: item.id, reason: 'regra vazia', detail: item.title })
  }
  if (item.explanationPt.trim().length === 0) {
    failures.push({ id: item.id, reason: 'explicação vazia', detail: item.id })
  }
  if (item.examples.length === 0) {
    failures.push({ id: item.id, reason: 'sem exemplos', detail: item.id })
  }
  for (const example of item.examples) {
    if (example.it.trim().length === 0 || example.pt.trim().length === 0) {
      failures.push({ id: item.id, reason: 'exemplo vazio', detail: example.it })
    }
  }
}

const vocabIds = new Set<string>()
for (const item of VOCAB_ITEMS) {
  if (vocabIds.has(item.id)) {
    failures.push({ id: item.id, reason: 'id duplicado (vocabulário)', detail: item.id })
  }
  vocabIds.add(item.id)
  if (!(PHASES as readonly string[]).includes(item.phase)) {
    failures.push({ id: item.id, reason: 'fase desconhecida', detail: item.phase })
  }
  if (item.it.trim().length === 0 || item.pt.trim().length === 0) {
    failures.push({ id: item.id, reason: 'entrada vazia', detail: item.it })
  }
  if (item.example.trim().length === 0 || item.examplePt.trim().length === 0) {
    failures.push({ id: item.id, reason: 'exemplo vazio', detail: item.example })
  }
}

// Cada fase tem de ter gramática e vocabulário (as 3 fases estão no plano).
for (const phase of PHASES) {
  if (!GRAMMAR_ITEMS.some((item) => item.phase === phase)) {
    failures.push({ id: phase, reason: 'fase sem gramática', detail: phase })
  }
  if (!VOCAB_ITEMS.some((item) => item.phase === phase)) {
    failures.push({ id: phase, reason: 'fase sem vocabulário', detail: phase })
  }
}

// Cada fase tem de ter material para AS COLTO e para LETTURA — senão o botão
// "Treinar <habilidade>" da fase não teria nada para mostrar.
for (const phase of PHASES) {
  for (const skill of ['ascolto', 'lettura']) {
    const count = EXTRA_QUESTIONS.filter(
      (question) => question.phase === phase && question.skill === skill,
    ).length
    if (count === 0) {
      failures.push({
        id: `${phase}/${skill}`,
        reason: 'fase sem material de prática',
        detail: 'a prática por fase ficaria vazia',
      })
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Tamanho do banco — o "ideal" para estudar todos os dias                       */
/* -------------------------------------------------------------------------- */

/**
 * IDEAL para o CILS B1 Cittadinanza (a aluna estuda ~3 meses, ~15 min/dia):
 * **800 itens**, o que dá ~20 "provas" completas por habilidade — a aluna
 * pode repetir muito pouco durante meses.
 *
 * Meta por nível: A1 ~120, A2 ~130, B1 ~200 (o B1 é o nível do exame).
 * Meta por habilidade: ascolto ~180, lettura ~250 (a lettura inclui a
 * "riflessione grammaticale" e os exercícios de gramática/vocabulário).
 *
 * O audit garante um MÍNIMO (abaixo disto o banco é pequeno demais para
 * estudar sem repetir); o ideal é o alvo de crescimento.
 */
export const BANK_IDEAL = {
  total: 800,
  byLevel: { A1: 150, A2: 250, B1: 400 },
  bySkill: { ascolto: 200, lettura: 600 },
} as const

/** Mínimo garantido pelo audit (o que já existe hoje). */
export const BANK_MINIMUM = {
  total: 780,
  byLevel: { A1: 160, A2: 220, B1: 370 },
  bySkill: { ascolto: 160, lettura: 610 },
} as const

/* -------------------------------------------------------------------------- */
/* Resultado                                                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Relatório do banco                                                         */
/* -------------------------------------------------------------------------- */

const ALL_QUESTIONS = [
  ...OFFICIAL_QUESTIONS,
  ...EXTRA_QUESTIONS,
  ...QUESTIONS_BATCH2,
  ...QUESTIONS_BATCH3,
  ...QUESTIONS_BATCH4,
  ...QUESTIONS_BATCH5,
  ...QUESTIONS_BATCH6,
  ...QUESTIONS_BATCH7,
  ...QUESTIONS_BATCH8,
  ...STUDY_QUESTIONS,
]

const byLevel: Record<string, number> = {}
const bySkill: Record<string, number> = {}
for (const question of ALL_QUESTIONS) {
  const level = question.level ?? 'oficial'
  byLevel[level] = (byLevel[level] ?? 0) + 1
  bySkill[question.skill] = (bySkill[question.skill] ?? 0) + 1
}

if (ALL_QUESTIONS.length < BANK_MINIMUM.total) {
  failures.push({
    id: 'banco',
    reason: 'banco demasiado pequeno',
    detail: `${ALL_QUESTIONS.length} itens (mínimo ${BANK_MINIMUM.total}, ideal ${BANK_IDEAL.total})`,
  })
}
for (const [level, minimum] of Object.entries(BANK_MINIMUM.byLevel)) {
  const count = byLevel[level] ?? 0
  if (count < minimum) {
    failures.push({
      id: `nivel-${level}`,
      reason: 'poucos itens para o nível',
      detail: `${count} (mínimo ${minimum}, ideal ${BANK_IDEAL.byLevel[level as keyof typeof BANK_IDEAL.byLevel]})`,
    })
  }
}
for (const [skill, minimum] of Object.entries(BANK_MINIMUM.bySkill)) {
  const count = bySkill[skill] ?? 0
  if (count < minimum) {
    failures.push({
      id: `habilidade-${skill}`,
      reason: 'poucos itens para a habilidade',
      detail: `${count} (mínimo ${minimum}, ideal ${BANK_IDEAL.bySkill[skill as keyof typeof BANK_IDEAL.bySkill]})`,
    })
  }
}

if (failures.length > 0) {
  console.error(`\n❌ AUDITORIA DO CONTEÚDO: ${failures.length} problema(s)\n`)
  for (const failure of failures) {
    console.error(`  • [${failure.id}] ${failure.reason}: ${failure.detail}`)
  }
  console.error('')
  process.exit(1)
}

console.log(
  `✅ Auditoria do conteúdo: ${OFFICIAL_QUESTIONS.length} perguntas oficiais (com o gabarito do CILS), ` +
    `${EXTRA_QUESTIONS.length + QUESTIONS_BATCH2.length + QUESTIONS_BATCH3.length + QUESTIONS_BATCH4.length + QUESTIONS_BATCH5.length + QUESTIONS_BATCH6.length + QUESTIONS_BATCH7.length + QUESTIONS_BATCH8.length} itens extra de prática, ` +
    `${GRAMMAR_ITEMS.length} regras de gramática e ${VOCAB_ITEMS.length} entradas de vocabulário.`,
)
console.log(
  `   Banco: ${ALL_QUESTIONS.length} itens (ideal ${BANK_IDEAL.total}) · ` +
    `A1 ${byLevel.A1 ?? 0}/${BANK_IDEAL.byLevel.A1} · A2 ${byLevel.A2 ?? 0}/${BANK_IDEAL.byLevel.A2} · ` +
    `B1 ${byLevel.B1 ?? 0}/${BANK_IDEAL.byLevel.B1} · ` +
    `ascolto ${bySkill.ascolto ?? 0}/${BANK_IDEAL.bySkill.ascolto} · ` +
    `lettura ${bySkill.lettura ?? 0}/${BANK_IDEAL.bySkill.lettura}`,
)
