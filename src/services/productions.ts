/**
 * Persistência das produções do aluno (escrita e oral).
 *
 * A app tira a pontuação da grelha oficial, mas o TEXTO e a auto-avaliação
 * também têm de ficar guardados: são o que permite rever a prova depois e
 * enviar o relatório à professora (ver `src/components/exam/ReportPage.tsx`).
 */

import { db } from '../db/database'
import { newId } from './sessions'
import type { Oral, Writing } from '../db/schemas'
import { countWords } from '../lib/wordCount'

export interface WritingInput {
  profileId: string
  promptId: string
  text: string
  rubric: Record<string, number>
  score: number
}

export async function saveWriting(input: WritingInput): Promise<Writing> {
  const writing: Writing = {
    id: newId('writing'),
    profileId: input.profileId,
    promptId: input.promptId,
    text: input.text,
    wordCount: countWords(input.text),
    rubric: input.rubric,
    score: input.score,
    createdAt: Date.now(),
  }
  await db.writings.put(writing)
  return writing
}

export interface OralInput {
  profileId: string
  topicId: string
  notes: string
  rubric: Record<string, number>
  score: number
  durationSeconds: number
  /** Gravação opcional (MediaRecorder). Fica só neste aparelho. */
  audio?: Blob | null
}

export async function saveOral(input: OralInput): Promise<Oral> {
  const oral: Oral = {
    id: newId('oral'),
    profileId: input.profileId,
    topicId: input.topicId,
    notes: input.notes,
    rubric: input.rubric,
    score: input.score,
    durationSeconds: input.durationSeconds,
    createdAt: Date.now(),
  }
  await db.orals.put(oral)
  if (input.audio && input.audio.size > 0) {
    await db.oralAudios.put({ id: oral.id, blob: input.audio, createdAt: oral.createdAt })
  }
  return oral
}
