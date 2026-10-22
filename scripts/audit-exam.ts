/**
 * AUDITORIA DA CONFIGURAÇÃO DA PROVA.
 *
 * Confere que a configuração dos testes corresponde EXATAMENTE à
 * especificação oficial do CILS B1 Cittadinanza (Criteri di attribuzione dei
 * punteggi + Quaderno + Sillabo). Se esta auditoria falha, o app está a
 * ensinar a aluna a estrutura errada da prova — o deploy não pode sair.
 *
 * Fonte: docs/exam-spec.md
 */

import {
  ASCOLTO_P1_ITEMS,
  ASCOLTO_P1_POINTS_PER_ITEM,
  ASCOLTO_P2_ITEMS,
  ASCOLTO_P2_POINTS_PER_ITEM,
  LETTURA_P1_ITEMS,
  LETTURA_P1_POINTS_PER_ITEM,
  LETTURA_P2_ITEMS,
  LETTURA_P2_POINTS_PER_ITEM,
  OBJECTIVE_ITEM_COUNT,
  ORAL_RUBRIC,
  PASS_THRESHOLD_PER_SKILL,
  PASS_THRESHOLD_TOTAL,
  POINTS_PER_SKILL,
  TOTAL_POINTS,
  WRITING_MAX_WORDS,
  WRITING_MIN_WORDS,
  WRITING_RUBRIC,
} from '../src/lib/scoring'
import { ASCOLTO_PROTOCOL, EXAM_CONFIGS, MAX_AUDIO_PASSES } from '../src/lib/exam'

interface Failure {
  rule: string
  detail: string
}

const failures: Failure[] = []

function check(condition: boolean, rule: string, detail: string): void {
  if (!condition) failures.push({ rule, detail })
}

const MINUTE = 60

/* -------------------------------------------------------------------------- */
/* Pontos e limiares                                                          */
/* -------------------------------------------------------------------------- */

check(POINTS_PER_SKILL === 12, 'pontos por habilidade', `esperado 12, obtido ${POINTS_PER_SKILL}`)
check(TOTAL_POINTS === 48, 'total de pontos', `esperado 48, obtido ${TOTAL_POINTS}`)
check(
  PASS_THRESHOLD_PER_SKILL === 7,
  'limiar por habilidade',
  `esperado 7, obtido ${PASS_THRESHOLD_PER_SKILL}`,
)
check(
  PASS_THRESHOLD_TOTAL === 28,
  'limiar total',
  `esperado 28, obtido ${PASS_THRESHOLD_TOTAL}`,
)
check(
  PASS_THRESHOLD_TOTAL === PASS_THRESHOLD_PER_SKILL * 4,
  'limiar total é derivado',
  'o limiar total tem de ser derivado do limiar por habilidade, nunca digitado à mão',
)

/* -------------------------------------------------------------------------- */
/* Item e pesos das provas objetivas                                          */
/* -------------------------------------------------------------------------- */

check(ASCOLTO_P1_ITEMS === 6, 'ascolto p1', `esperado 6 itens, obtido ${ASCOLTO_P1_ITEMS}`)
check(
  ASCOLTO_P1_POINTS_PER_ITEM === 1,
  'ascolto p1 pontos',
  `esperado 1, obtido ${ASCOLTO_P1_POINTS_PER_ITEM}`,
)
check(ASCOLTO_P2_ITEMS === 12, 'ascolto p2', `esperado 12 itens, obtido ${ASCOLTO_P2_ITEMS}`)
check(
  ASCOLTO_P2_POINTS_PER_ITEM === 0.5,
  'ascolto p2 pontos',
  `esperado 0.5, obtido ${ASCOLTO_P2_POINTS_PER_ITEM}`,
)
check(LETTURA_P1_ITEMS === 12, 'lettura p1', `esperado 12 itens, obtido ${LETTURA_P1_ITEMS}`)
check(
  LETTURA_P1_POINTS_PER_ITEM === 0.5,
  'lettura p1 pontos',
  `esperado 0.5, obtido ${LETTURA_P1_POINTS_PER_ITEM}`,
)
check(LETTURA_P2_ITEMS === 6, 'lettura p2', `esperado 6 itens, obtido ${LETTURA_P2_ITEMS}`)
check(
  LETTURA_P2_POINTS_PER_ITEM === 1,
  'lettura p2 pontos',
  `esperado 1, obtido ${LETTURA_P2_POINTS_PER_ITEM}`,
)
check(
  OBJECTIVE_ITEM_COUNT === 36,
  'total de itens objetivos',
  `esperado 36, obtido ${OBJECTIVE_ITEM_COUNT}`,
)

/* -------------------------------------------------------------------------- */
/* Configuração das provas                                                    */
/* -------------------------------------------------------------------------- */

const ascolto = EXAM_CONFIGS.ascolto
check(ascolto.timeSeconds === 30 * MINUTE, 'ascolto tempo', `esperado 30 min, obtido ${ascolto.timeSeconds}`)
check(ascolto.tasks.length === 2, 'ascolto nº de provas', `esperado 2, obtido ${ascolto.tasks.length}`)
check(
  ascolto.tasks[0]?.itemCount === 6 && ascolto.tasks[0]?.itemType === 'mcq3',
  'ascolto prova 1',
  'tem de ser scelta multipla com 6 itens',
)
check(
  ascolto.tasks[1]?.itemCount === 12 && ascolto.tasks[1]?.itemType === 'truefalse',
  'ascolto prova 2',
  'tem de ser vero/falso com 12 itens',
)

const lettura = EXAM_CONFIGS.lettura
check(lettura.timeSeconds === 40 * MINUTE, 'lettura tempo', `esperado 40 min, obtido ${lettura.timeSeconds}`)
check(lettura.tasks.length === 2, 'lettura nº de provas', `esperado 2, obtido ${lettura.tasks.length}`)
check(
  lettura.tasks[0]?.itemCount === 12 && lettura.tasks[0]?.itemType === 'truefalse',
  'lettura prova 1',
  'tem de ser vero/falso com 12 itens',
)
check(
  lettura.tasks[1]?.itemCount === 6 && lettura.tasks[1]?.itemType === 'cloze',
  'lettura prova 2',
  'tem de ser cloze com 6 itens',
)

const scrittura = EXAM_CONFIGS.scrittura
check(
  scrittura.timeSeconds === 40 * MINUTE,
  'scrittura tempo',
  `esperado 40 min, obtido ${scrittura.timeSeconds}`,
)
check(WRITING_MIN_WORDS === 80, 'scrittura mínimo', `esperado 80, obtido ${WRITING_MIN_WORDS}`)
check(WRITING_MAX_WORDS === 120, 'scrittura máximo', `esperado 120, obtido ${WRITING_MAX_WORDS}`)

const orale = EXAM_CONFIGS.orale
check(orale.timeSeconds === 10 * MINUTE, 'orale tempo', `esperado 10 min, obtido ${orale.timeSeconds}`)

const mock = EXAM_CONFIGS.mock_cittadinanza
check(
  mock.timeSeconds === 30 * MINUTE + 40 * MINUTE + 40 * MINUTE,
  'mock tempo',
  `esperado 110 min, obtido ${mock.timeSeconds}`,
)

/* -------------------------------------------------------------------------- */
/* Grelhas oficiais                                                           */
/* -------------------------------------------------------------------------- */

const writingSum = WRITING_RUBRIC.reduce((sum, criterion) => sum + criterion.max, 0)
check(writingSum === 12, 'grelha escrita', `esperado 12 pontos, obtido ${writingSum}`)
const oralSum = ORAL_RUBRIC.reduce((sum, criterion) => sum + criterion.max, 0)
check(oralSum === 12, 'grelha oral', `esperado 12 pontos, obtido ${oralSum}`)
check(
  WRITING_RUBRIC.map((criterion) => criterion.max).join(',') === '3,1,4,3,1',
  'grelha escrita critérios',
  `esperado 3,1,4,3,1, obtido ${WRITING_RUBRIC.map((c) => c.max).join(',')}`,
)
check(
  ORAL_RUBRIC.map((criterion) => criterion.max).join(',') === '4,4,3,1',
  'grelha oral critérios',
  `esperado 4,4,3,1, obtido ${ORAL_RUBRIC.map((c) => c.max).join(',')}`,
)

/* -------------------------------------------------------------------------- */
/* Protocolo de somministrazione do ascolto                                    */
/* -------------------------------------------------------------------------- */

check(MAX_AUDIO_PASSES === 2, 'máximo de reproduções', `esperado 2, obtido ${MAX_AUDIO_PASSES}`)

const audioSteps = ASCOLTO_PROTOCOL.filter((step) => step.kind === 'audio')
check(audioSteps.length === 4, 'passagens de áudio', `esperado 4 (2 por prova), obtido ${audioSteps.length}`)
for (const task of [1, 2] as const) {
  const passes = ASCOLTO_PROTOCOL.filter(
    (step) => step.kind === 'audio' && step.task === task && step.pass !== null,
  ).length
  check(passes === 2, `áudio da prova ${task}`, `esperado 2 passagens, obtido ${passes}`)
}
const readSteps = ASCOLTO_PROTOCOL.filter((step) => step.kind === 'read')
check(
  readSteps.length === 2 && readSteps.every((step) => step.durationSeconds === 2 * MINUTE),
  'tempos de leitura',
  'esperado 2 minutos de leitura em cada prova',
)
const reviewSteps = ASCOLTO_PROTOCOL.filter((step) => step.kind === 'review')
check(
  reviewSteps.length === 2 && reviewSteps.every((step) => step.durationSeconds === 2 * MINUTE),
  'tempos de revisão',
  'esperado 2 minutos de conferência em cada prova',
)
const writeStep = ASCOLTO_PROTOCOL.find((step) => step.kind === 'write')
check(
  writeStep?.durationSeconds === 3 * MINUTE,
  'tempo de escrita das respostas',
  `esperado 3 minutos, obtido ${writeStep?.durationSeconds}`,
)

/* -------------------------------------------------------------------------- */
/* Resultado                                                                  */
/* -------------------------------------------------------------------------- */

if (failures.length > 0) {
  console.error(`\n❌ AUDITORIA DA PROVA: ${failures.length} problema(s)\n`)
  for (const failure of failures) {
    console.error(`  • [${failure.rule}] ${failure.detail}`)
  }
  console.error('')
  process.exit(1)
}

console.log('✅ Auditoria da prova: a configuração corresponde à especificação oficial do CILS.')
