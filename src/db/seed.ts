/**
 * Seed do banco de conteúdo.
 *
 * O banco começa com a PROVA OFICIAL DE EXEMPLO do CILS (36 itens com gabarito
 * oficial) e, desde a v2, com o CONTEÚDO EXTRA de prática (ascolto/lettura
 * originais da app) e o CONTEÚDO POR FASE (gramática do Sillabo + vocabulário
 * civic/burocrático).
 *
 * Re-seedar o banco NUNCA toca em sessões ou tentativas já concluídas —
 * o histórico de progresso da aluna é sacred (ver `src/lib/admin.ts`).
 */

import { db } from './database'
import { BANK_VERSION_KEY } from '../lib/admin'
import { BANK_VERSION } from '../config/version'
import { OFFICIAL_PASSAGES, OFFICIAL_QUESTIONS } from '../data/officialSample'
import { EXTRA_PASSAGES, EXTRA_QUESTIONS } from '../data/extraPractice'
import { PASSAGES_BATCH2, QUESTIONS_BATCH2 } from '../data/practiceBatch2'
import { PASSAGES_BATCH3, QUESTIONS_BATCH3 } from '../data/practiceBatch3'
import { PASSAGES_BATCH4, QUESTIONS_BATCH4 } from '../data/practiceBatch4'
import { PASSAGES_BATCH5, QUESTIONS_BATCH5 } from '../data/practiceBatch5'
import { PASSAGES_BATCH6, QUESTIONS_BATCH6 } from '../data/practiceBatch6'
import { PASSAGES_BATCH7, QUESTIONS_BATCH7 } from '../data/practiceBatch7'
import { PASSAGES_BATCH8, QUESTIONS_BATCH8 } from '../data/practiceBatch8'
import { STUDY_QUESTIONS } from '../data/studyBank'
import { GRAMMAR_ITEMS, VOCAB_ITEMS } from '../data/phaseContent'

function readBankVersion(): number {
  try {
    const raw = window.localStorage.getItem(BANK_VERSION_KEY)
    const value = Number(raw)
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function writeBankVersion(version: number): void {
  try {
    window.localStorage.setItem(BANK_VERSION_KEY, String(version))
  } catch {
    /* modo privado: seguimos sem persistir */
  }
}

export async function syncQuestionBank(): Promise<void> {
  const current = readBankVersion()
  const questionCount = await db.questions.count()
  const grammarCount = await db.grammarItems.count()

  // O re-seed acontece quando a versão do banco sobe OU quando o banco está
  // vazio. Sem a segunda condição, limpar o IndexedDB sem limpar o
  // localStorage deixaria a app sem conteúdo nenhum.
  if (current === BANK_VERSION && questionCount > 0 && grammarCount > 0) return

  // Só o conteúdo é reescrito. Sessões e tentativas ficam intactas.
  await db.passages.bulkPut([
    ...OFFICIAL_PASSAGES,
    ...EXTRA_PASSAGES,
    ...PASSAGES_BATCH2,
    ...PASSAGES_BATCH3,
    ...PASSAGES_BATCH4,
    ...PASSAGES_BATCH5,
    ...PASSAGES_BATCH6,
    ...PASSAGES_BATCH7,
    ...PASSAGES_BATCH8,
  ])
  await db.questions.bulkPut([
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
  ])
  await db.grammarItems.bulkPut(GRAMMAR_ITEMS)
  await db.vocabItems.bulkPut(VOCAB_ITEMS)

  writeBankVersion(BANK_VERSION)
}

/** Quantas questões existem para uma habilidade (ou para todas). */
export async function countQuestions(skill?: string): Promise<number> {
  if (skill) return db.questions.where('skill').equals(skill as never).count()
  return db.questions.count()
}
