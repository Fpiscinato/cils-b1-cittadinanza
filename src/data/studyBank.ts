/**
 * BANCO DE ESTUDO — o que a aluna treina "um bocado por dia".
 *
 * Duas fontes:
 * 1. **Exercícios de gramática** (`src/data/grammarExercises.ts`) — 2 por regra
 *    do Sillabo, escritos à mão para o nível da regra.
 * 2. **Quiz de vocabulário** — gerado a partir de `src/data/phaseContent.ts`:
 *    cada entrada vira uma pergunta de tradução com dois distractores da mesma
 *    fase. As opções são **baralhadas**, por isso a resposta certa não fica
 *    sempre no mesmo sítio.
 *
 * Tudo é tagged com `phase` e `level`, para a aluna poder estudar por nível
 * (A1 → A2 → B1) e o `buildExam` poder montar um quiz aleatório desse nível.
 */

import type { Question } from '../db/schemas'
import { GRAMMAR_EXERCISES } from './grammarExercises'
import { GRAMMAR_PATTERNS } from './grammarPatterns'
import { VOCAB_ITEMS } from './phaseContent'

/** Task dos itens de estudo: `studio-<fase>-<nível>`. */
export function studioTaskId(phase: string, level: string): string {
  return `studio-${phase}-${level}`
}

/**
 * Baralha uma lista. Usa um gerador injectável para que os testes sejam
 * determinísticos.
 */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    const current = copy[index]
    const other = copy[swap]
    if (current === undefined || other === undefined) continue
    copy[index] = other
    copy[swap] = current
  }
  return copy
}

/** Os exercícios de gramática já vêm prontos (com a opção certa indexada). */
function grammarQuestions(): Question[] {
  const exercises = GRAMMAR_EXERCISES.map((exercise) => ({
    id: `study-gram-${exercise.id}`,
    skill: 'lettura' as const,
    taskId: studioTaskId(exercise.phase, exercise.level),
    itemType: 'mcq3' as const,
    stem: exercise.stem,
    options: [...exercise.options] as [string, string, string],
    correctIndex: exercise.answer,
    pointsPerItem: 1,
    explanation: exercise.explanationPt,
    phase: exercise.phase,
    level: exercise.level,
    bank: 'practice' as const,
  }))

  // Os PADRÕES de gramática entram como cloze (o mesmo formato da Prova 2).
  const patterns = GRAMMAR_PATTERNS.map((pattern) => ({
    id: `study-pat-${pattern.id}`,
    skill: 'lettura' as const,
    taskId: studioTaskId(pattern.phase, pattern.level),
    itemType: 'cloze' as const,
    stem: pattern.sentence,
    options: [...pattern.options] as [string, string, string],
    correctIndex: pattern.answer,
    pointsPerItem: 1,
    explanation: pattern.explanationPt,
    phase: pattern.phase,
    level: pattern.level,
    bank: 'practice' as const,
  }))

  return [...exercises, ...patterns].map((question, index) => ({
    ...question,
    order: index + 1,
  }))
}

/**
 * Quiz de vocabulário: "Como se diz «X» em italiano?" (e o inverso).
 * Os distractores são tirados de outras entradas da MESMA fase, para não
 * serem obviously errados.
 */
function vocabularyQuestions(random: () => number = Math.random): Question[] {
  const questions: Question[] = []
  const byPhase = new Map<string, typeof VOCAB_ITEMS>()
  for (const item of VOCAB_ITEMS) {
    const list = byPhase.get(item.phase) ?? []
    list.push(item)
    byPhase.set(item.phase, list)
  }

  let order = 0
  for (const item of VOCAB_ITEMS) {
    const pool = (byPhase.get(item.phase) ?? []).filter((other) => other.id !== item.id)
    const distractors = shuffle(pool, random).slice(0, 2)
    if (distractors.length < 2) continue

    // 1) português → italiano
    const optionsPtIt = shuffle([item.it, distractors[0]?.it ?? '', distractors[1]?.it ?? ''], random)
    order += 1
    questions.push({
      id: `study-vocab-pt-it-${item.id}`,
      skill: 'lettura',
      taskId: studioTaskId(item.phase, item.level),
      itemType: 'mcq3',
      order,
      stem: `Como se diz «${item.pt}» em italiano?`,
      options: optionsPtIt,
      correctIndex: optionsPtIt.indexOf(item.it),
      pointsPerItem: 1,
      explanation: `"${item.it}" = ${item.pt}. Exemplo: ${item.example} (${item.examplePt})`,
      phase: item.phase,
      level: item.level,
      bank: 'practice',
    })

    // 2) italiano → português
    const optionsItPt = shuffle([item.pt, distractors[0]?.pt ?? '', distractors[1]?.pt ?? ''], random)
    order += 1
    questions.push({
      id: `study-vocab-it-pt-${item.id}`,
      skill: 'lettura',
      taskId: studioTaskId(item.phase, item.level),
      itemType: 'mcq3',
      order,
      stem: `O que significa «${item.it}»?`,
      options: optionsItPt,
      correctIndex: optionsItPt.indexOf(item.pt),
      pointsPerItem: 1,
      explanation: `"${item.it}" = ${item.pt}. Exemplo: ${item.example} (${item.examplePt})`,
      phase: item.phase,
      level: item.level,
      bank: 'practice',
    })
  }

  return questions
}

/** Todo o banco de estudo (gramática + vocabulário). */
export function buildStudyQuestions(random: () => number = Math.random): Question[] {
  return [...grammarQuestions(), ...vocabularyQuestions(random)]
}

/** Itens prontos a semear no banco. */
export const STUDY_QUESTIONS: Question[] = buildStudyQuestions()
