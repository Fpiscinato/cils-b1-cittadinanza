/**
 * FONTE ÚNICA DA VERDADE DO SCORING DO CILS B1 CITTADINANZA.
 *
 * Todos os pesos, limites e regras de aprovação vivem aqui. Nenhum outro arquivo
 * pode escrever um número de ponto ou o limiar de aprovação: tudo o mais importa
 * deste módulo.
 *
 * Fonte oficial: "Criteri di attribuzione dei punteggi — Livello B1 Cittadinanza"
 * (Università per Stranieri di Siena). Especificação completa e links em
 * `docs/exam-spec.md`.
 */

/* -------------------------------------------------------------------------- */
/* Abilities                                                                 */
/* -------------------------------------------------------------------------- */

export const SKILLS = ['ascolto', 'lettura', 'scrittura', 'orale'] as const
export type Skill = (typeof SKILLS)[number]

/** Cada abilidade vale 12 pontos. Total: 48. */
export const POINTS_PER_SKILL = 12
export const TOTAL_POINTS = POINTS_PER_SKILL * SKILLS.length // 48

/**
 * Limiar de aprovação.
 *
 * O documento oficial "Criteri di valutazione B1 Cittadinanza" NÃO publica um
 * número: a regra oficial é "sufficienza in ogni abilità" (e a capitalizzazione
 * é vietata neste nível). O limiar de 7/12 por abilidade (=> 28/48 no total) é a
 * regra operativa usada por sedes de exame e preparadores.
 *
 * A UI deve avisar a aluna para confirmar o limiar com a sua sede de exame.
 */
export const PASS_THRESHOLD_PER_SKILL = 7
/** O total mínimo é consequência do limiar por abilidade — nunca digitado à mão. */
export const PASS_THRESHOLD_TOTAL = PASS_THRESHOLD_PER_SKILL * SKILLS.length // 28

export const SKILL_LABELS: Record<Skill, { it: string; pt: string }> = {
  ascolto: { it: 'Ascolto', pt: 'Escuta' },
  lettura: { it: 'Lettura e riflessione grammaticale', pt: 'Leitura e gramática' },
  scrittura: { it: 'Produzione scritta', pt: 'Escrita' },
  orale: { it: 'Produzione orale', pt: 'Oral' },
}

/* -------------------------------------------------------------------------- */
/* Tipos de item das provas objetivas                                        */
/* -------------------------------------------------------------------------- */

/**
 * - `mcq3`     : scelta multipla com 3 opções (Ascolto prova 1).
 * - `truefalse`: vero/falso (Ascolto prova 2, Lettura prova 1).
 * - `cloze`    : completamento del testo con 3 opções (Lettura prova 2).
 * - `writing`  : produzione scritta (rubrica).
 * - `oral`     : produzione orale (rubrica).
 */
export const ITEM_TYPES = ['mcq3', 'truefalse', 'cloze', 'writing', 'oral'] as const
export type ItemType = (typeof ITEM_TYPES)[number]

/* -------------------------------------------------------------------------- */
/* Pesos por prova (Criteri ufficiali)                                        */
/* -------------------------------------------------------------------------- */

/** Ascolto prova 1: 6 item a scelta multipla, 1 ponto cada. */
export const ASCOLTO_P1_ITEMS = 6
export const ASCOLTO_P1_POINTS_PER_ITEM = 1
/** Ascolto prova 2: 12 item vero/falso, 0,5 ponto cada. */
export const ASCOLTO_P2_ITEMS = 12
export const ASCOLTO_P2_POINTS_PER_ITEM = 0.5

/** Lettura prova 1: 12 item vero/falso, 0,5 ponto cada. */
export const LETTURA_P1_ITEMS = 12
export const LETTURA_P1_POINTS_PER_ITEM = 0.5
/** Lettura prova 2: 6 item di completamento con scelta multipla, 1 ponto cada. */
export const LETTURA_P2_ITEMS = 6
export const LETTURA_P2_POINTS_PER_ITEM = 1

/** Total de item oggettivi de uma prova completa: 6 + 12 + 12 + 6 = 36. */
export const OBJECTIVE_ITEM_COUNT =
  ASCOLTO_P1_ITEMS + ASCOLTO_P2_ITEMS + LETTURA_P1_ITEMS + LETTURA_P2_ITEMS // 36

/** A prova de escrita tem 80 a 120 parole. */
export const WRITING_MIN_WORDS = 80
export const WRITING_MAX_WORDS = 120

/* -------------------------------------------------------------------------- */
/* Rubriche ufficiali                                                        */
/* -------------------------------------------------------------------------- */

export interface RubricCriterion {
  key: string
  label: string
  labelPt: string
  max: number
}

/** Criteri di valutazione — Produzione scritta (12 punti). */
export const WRITING_RUBRIC: readonly RubricCriterion[] = [
  { key: 'communicativeEffectiveness', label: 'Efficacia comunicativa', labelPt: 'Eficácia comunicativa', max: 3 },
  { key: 'stylisticAppropriateness', label: 'Adeguatezza stilistica', labelPt: 'Adequação estilística', max: 1 },
  { key: 'morphosyntacticAccuracy', label: 'Correttezza morfosintattica', labelPt: 'Correção morfossintática', max: 4 },
  { key: 'lexicalRichness', label: 'Adeguatezza e ricchezza lessicale', labelPt: 'Riqueza lexical', max: 3 },
  { key: 'spellingPunctuation', label: 'Ortografia e punteggiatura', labelPt: 'Ortografia e pontuação', max: 1 },
]

/** Criteri di valutazione — Produzione orale (12 punti). */
export const ORAL_RUBRIC: readonly RubricCriterion[] = [
  { key: 'communicativeEffectiveness', label: 'Efficacia comunicativa', labelPt: 'Eficácia comunicativa', max: 4 },
  { key: 'morphosyntacticAccuracy', label: 'Correttezza morfosintattica', labelPt: 'Correção morfossintática', max: 4 },
  { key: 'lexicalRichness', label: 'Adeguatezza e ricchezza lessicale', labelPt: 'Riqueza lexical', max: 3 },
  { key: 'pronunciationIntonation', label: 'Pronuncia e intonazione', labelPt: 'Pronúncia e entoação', max: 1 },
]

/* -------------------------------------------------------------------------- */
/* Funzioni de cálculo                                                        */
/* -------------------------------------------------------------------------- */

/** Arredonda para 2 casas, matando ruído de ponto flutuante (0.1 + 0.2). */
export function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

/**
 * Pontuação de uma prova oggettiva.
 *
 * Regra oficial: resposta errada OU omissa vale 0. Não há penalidade negativa.
 * `correct` nunca pode exceder `itemCount` (a auditoria de conteúdo valida isso).
 */
export function scoreObjective(correct: number, itemCount: number, pointsPerItem: number): number {
  const safeCorrect = clamp(Math.floor(correct), 0, Math.max(0, itemCount))
  return round2(safeCorrect * pointsPerItem)
}

/** Ascolto: prova 1 (6 MCQ × 1) + prova 2 (12 V/F × 0,5) = 12 pontos. */
export function scoreAscolto(correctP1: number, correctP2: number): number {
  return round2(
    scoreObjective(correctP1, ASCOLTO_P1_ITEMS, ASCOLTO_P1_POINTS_PER_ITEM) +
      scoreObjective(correctP2, ASCOLTO_P2_ITEMS, ASCOLTO_P2_POINTS_PER_ITEM),
  )
}

/** Lettura: prova 1 (12 V/F × 0,5) + prova 2 (6 cloze × 1) = 12 pontos. */
export function scoreLettura(correctP1: number, correctP2: number): number {
  return round2(
    scoreObjective(correctP1, LETTURA_P1_ITEMS, LETTURA_P1_POINTS_PER_ITEM) +
      scoreObjective(correctP2, LETTURA_P2_ITEMS, LETTURA_P2_POINTS_PER_ITEM),
  )
}

/**
 * Peso de cada prova (task) dentro da sua habilidade.
 * A chave é o `taskId` guardado em cada questão.
 */
export const TASK_WEIGHTS: Readonly<Record<string, number>> = {
  'ascolto-p1': ASCOLTO_P1_POINTS_PER_ITEM,
  'ascolto-p2': ASCOLTO_P2_POINTS_PER_ITEM,
  'lettura-p1': LETTURA_P1_POINTS_PER_ITEM,
  'lettura-p2': LETTURA_P2_POINTS_PER_ITEM,
  // Banco extra de prática (material original da app): mesmos pesos das
  // provas oficiais, para a pontuação ser comparável.
  'ascolto-p1-x': ASCOLTO_P1_POINTS_PER_ITEM,
  'ascolto-p1-s2': ASCOLTO_P1_POINTS_PER_ITEM,
  'ascolto-p2-x': ASCOLTO_P2_POINTS_PER_ITEM,
  'lettura-p1-f1': LETTURA_P1_POINTS_PER_ITEM,
  'lettura-p1-x': LETTURA_P1_POINTS_PER_ITEM,
  'lettura-p2-x': LETTURA_P2_POINTS_PER_ITEM,
  'ascolto-p1-b3': ASCOLTO_P1_POINTS_PER_ITEM,
  'ascolto-p1-c5': ASCOLTO_P1_POINTS_PER_ITEM,
  'ascolto-p2-b4': ASCOLTO_P2_POINTS_PER_ITEM,
  'ascolto-p2-c6': ASCOLTO_P2_POINTS_PER_ITEM,
  'lettura-p1-b5': LETTURA_P1_POINTS_PER_ITEM,
  'lettura-p1-b6': LETTURA_P1_POINTS_PER_ITEM,
  'lettura-p1-c7': LETTURA_P1_POINTS_PER_ITEM,
  'lettura-p2-b7': LETTURA_P2_POINTS_PER_ITEM,
  'lettura-p2-c8': LETTURA_P2_POINTS_PER_ITEM,
  'ascolto-p2-d7': ASCOLTO_P2_POINTS_PER_ITEM,
  'ascolto-p2-d8': ASCOLTO_P2_POINTS_PER_ITEM,
  'ascolto-p1-d9': ASCOLTO_P1_POINTS_PER_ITEM,
  'ascolto-p1-e1': ASCOLTO_P1_POINTS_PER_ITEM,
  'ascolto-p2-e2': ASCOLTO_P2_POINTS_PER_ITEM,
  'ascolto-p2-e3': ASCOLTO_P2_POINTS_PER_ITEM,
  'lettura-p1-e4': LETTURA_P1_POINTS_PER_ITEM,
  'lettura-p2-e5': LETTURA_P2_POINTS_PER_ITEM,
}

/**
 * Pontuação de uma etapa (um `stage` objetivo) na escala 0-12.
 *
 * A fórmula é `12 × (acerto ponderado / peso total)`. Para o banco OFICIAL
 * dá exatamente a pontuação oficial (a soma dos pesos de uma prova é 12), e
 * para o banco misto (oficial + prática) mantém a escala 0-12 — sem nunca
 * passar de 12 nem descer abaixo de 0.
 */
export function scoreStageFromCounts(
  items: readonly { taskId: string; pointsPerItem: number }[],
  correctByTask: Readonly<Record<string, number>>,
): number {
  const tasks = new Map<string, { count: number; weight: number }>()
  for (const item of items) {
    const entry = tasks.get(item.taskId)
    if (entry) {
      entry.count += 1
    } else {
      tasks.set(item.taskId, { count: 1, weight: item.pointsPerItem })
    }
  }

  let weightedCorrect = 0
  let weightedTotal = 0
  for (const [taskId, entry] of tasks) {
    const correct = clamp(Math.floor(correctByTask[taskId] ?? 0), 0, entry.count)
    weightedCorrect += correct * entry.weight
    weightedTotal += entry.count * entry.weight
  }

  if (weightedTotal <= 0) return 0
  return round2(clamp((POINTS_PER_SKILL * weightedCorrect) / weightedTotal, 0, POINTS_PER_SKILL))
}

/**
 * Pontuação de uma habilidade a partir do número de acertos por prova.
 * Uma task desconhecida vale 0 pontos (e o audit de conteúdo apanha isso).
 */
export function scoreSkillFromCounts(
  skill: Skill,
  correctByTask: Readonly<Record<string, number>>,
): number {
  let total = 0
  for (const [taskId, correct] of Object.entries(correctByTask)) {
    const weight = TASK_WEIGHTS[taskId]
    if (weight === undefined) continue
    const maxItems = skill === 'ascolto' ? ASCOLTO_P1_ITEMS + ASCOLTO_P2_ITEMS : LETTURA_P1_ITEMS + LETTURA_P2_ITEMS
    total += scoreObjective(correct, maxItems, weight)
  }
  return round2(total)
}


/**
 * Soma uma rubrica auto-avaliada. Cada critério é limitado ao seu máximo, então
 * uma auto-avaliação generosa não pode gerar mais de 12 pontos.
 */
export function scoreRubric(
  rubric: Readonly<Record<string, number>>,
  criteria: readonly RubricCriterion[],
): number {
  const total = criteria.reduce((sum, criterion) => {
    const given = rubric[criterion.key]
    if (given === undefined || !Number.isFinite(given)) return sum
    return sum + clamp(Math.round(given), 0, criterion.max)
  }, 0)
  return round2(total)
}

export function scoreScrittura(rubric: Readonly<Record<string, number>>): number {
  return scoreRubric(rubric, WRITING_RUBRIC)
}

export function scoreOrale(rubric: Readonly<Record<string, number>>): number {
  return scoreRubric(rubric, ORAL_RUBRIC)
}

/* -------------------------------------------------------------------------- */
/* Veredito da prova                                                          */
/* -------------------------------------------------------------------------- */

export interface SkillScore {
  skill: Skill
  score: number
  max: number
  passed: boolean
  /** Quantos pontos faltam para a sufficienza (0 quando já passou). */
  missing: number
}

export interface ExamResult {
  perSkill: Record<Skill, SkillScore>
  total: number
  maxTotal: number
  /**
   * `true` apenas se TODAS as 4 abilidades atingiram o limiar.
   * Um total alto com uma abilidade abaixo do limiar devolve `false`.
   */
  passed: boolean
  failedSkills: Skill[]
  /**
   * Neste nível não há capitalização: reprovar uma abilidade obriga a refazer
   * a prova INTEIRA. A UI deve mostrar este risco com destaque.
   */
  mustRetakeWholeExam: boolean
}

/**
 * Avalia uma prova completa a partir da pontuação de cada abilidade.
 *
 * Uma abilidade sem tentativa vale 0 pontos e, portanto, reprova — igual à prova
 * real, onde uma prova entregue sem a oral não tem aprovação.
 */
export function evaluateExam(scores: Partial<Record<Skill, number>>): ExamResult {
  const perSkill = {} as Record<Skill, SkillScore>
  const failedSkills: Skill[] = []

  for (const skill of SKILLS) {
    const raw = scores[skill] ?? 0
    const score = round2(clamp(raw, 0, POINTS_PER_SKILL))
    const passed = score >= PASS_THRESHOLD_PER_SKILL
    if (!passed) failedSkills.push(skill)
    perSkill[skill] = {
      skill,
      score,
      max: POINTS_PER_SKILL,
      passed,
      missing: passed ? 0 : round2(PASS_THRESHOLD_PER_SKILL - score),
    }
  }

  const total = round2(SKILLS.reduce((sum, skill) => sum + perSkill[skill].score, 0))

  return {
    perSkill,
    total,
    maxTotal: TOTAL_POINTS,
    passed: failedSkills.length === 0,
    failedSkills,
    mustRetakeWholeExam: failedSkills.length > 0,
  }
}

/** Texto de aviso da regra de capitalização, pronto para a UI. */
export const CAPITALISATION_WARNING =
  'O CILS B1 Cittadinanza NÃO permite capitalização: se uma habilidade ficar abaixo ' +
  'da sufficienza, não dá para guardar só as outras — a prova inteira tem de ser refeita.'

export const THRESHOLD_DISCLAIMER =
  'A sede do CILS não publica um número oficial de sufficienza para esta prova. ' +
  'O app usa 7/12 por habilidade (28/48 no total), o limiar mais citado pelas sedes — ' +
  'confirme com a sua sede de exame.'
