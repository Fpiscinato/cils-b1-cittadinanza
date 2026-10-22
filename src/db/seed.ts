/**
 * Seed do banco de conteúdo.
 *
 * O banco começa com a PROVA OFICIAL DE EXEMPLO do CILS (36 itens com gabarito
 * oficial). Re-seedar o banco NUNCA toca em sessões ou tentativas já concluídas —
 * o histórico de progresso da aluna é sacred (ver `src/lib/admin.ts`).
 */

import { db } from './database'
import { BANK_VERSION_KEY } from '../lib/admin'
import { BANK_VERSION } from '../config/version'
import { OFFICIAL_PASSAGES, OFFICIAL_QUESTIONS } from '../data/officialSample'

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

  // O re-seed acontece quando a versão do banco sobe OU quando o banco está
  // vazio. Sem a segunda condição, limpar o IndexedDB sem limpar o
  // localStorage deixaria a app sem conteúdo nenhum.
  if (current === BANK_VERSION && questionCount > 0) return

  // Só o conteúdo é reescrito. Sessões e tentativas ficam intactas.
  await db.passages.bulkPut(OFFICIAL_PASSAGES)
  await db.questions.bulkPut(OFFICIAL_QUESTIONS)

  writeBankVersion(BANK_VERSION)
}

/** Quantas questões existem para uma habilidade (ou para todas). */
export async function countQuestions(skill?: string): Promise<number> {
  if (skill) return db.questions.where('skill').equals(skill as never).count()
  return db.questions.count()
}
