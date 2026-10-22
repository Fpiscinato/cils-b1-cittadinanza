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
 */

import { OFFICIAL_PASSAGES, OFFICIAL_QUESTIONS } from '../src/data/officialSample'
import { TASK_WEIGHTS } from '../src/lib/scoring'
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
/* Resultado                                                                  */
/* -------------------------------------------------------------------------- */

if (failures.length > 0) {
  console.error(`\n❌ AUDITORIA DO CONTEÚDO: ${failures.length} problema(s)\n`)
  for (const failure of failures) {
    console.error(`  • [${failure.id}] ${failure.reason}: ${failure.detail}`)
  }
  console.error('')
  process.exit(1)
}

console.log(
  `✅ Auditoria do conteúdo: ${OFFICIAL_QUESTIONS.length} perguntas e ${OFFICIAL_PASSAGES.length} passagens conferem com a especificação e com as chaves oficiais do CILS.`,
)
