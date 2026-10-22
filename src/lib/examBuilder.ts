/**
 * Monta as provas (stages) a partir do banco de conteúdo.
 *
 * A prova de ascolto é a única com áudio: as transcrições oficiais servem de
 * fonte para o TTS. O resto é lido diretamente do banco.
 */

import { db } from '../db/database'
import type { ExamMode, Passage, Question } from '../db/schemas'
import type { Stage } from '../components/exam/ExamRunner'
import { EXAM_CONFIGS } from './exam'
import { scoreOrale, scoreScrittura } from './scoring'
import { OFFICIAL_ORAL_TOPICS, OFFICIAL_WRITING_PROMPTS } from '../data/officialSample'

export interface BuiltExam {
  stages: Stage[]
  passages: Map<string, Passage>
}

async function loadQuestions(skill: string): Promise<Question[]> {
  const questions = await db.questions.where('skill').equals(skill as never).toArray()
  return questions.sort((a, b) => {
    if (a.taskId !== b.taskId) return a.taskId.localeCompare(b.taskId)
    return a.order - b.order
  })
}

/** As transcrições oficiais são indexadas pelo id da task do ascolto. */
function audioByTask(passages: Passage[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const passage of passages) {
    if (passage.kind !== 'audio_transcript') continue
    if (passage.id.endsWith('p1')) map['ascolto-p1'] = passage.content
    if (passage.id.endsWith('p2')) map['ascolto-p2'] = passage.content
  }
  return map
}

export async function buildExam(mode: ExamMode): Promise<BuiltExam | null> {
  const passages = await db.passages.toArray()
  const passageMap = new Map(passages.map((passage) => [passage.id, passage]))
  const config = EXAM_CONFIGS[mode]
  const stages: Stage[] = []

  if (mode === 'ascolto' || mode === 'mock_cittadinanza') {
    const questions = await loadQuestions('ascolto')
    if (questions.length > 0) {
      stages.push({
        kind: 'objective',
        id: 'ascolto',
        skill: 'ascolto',
        title: 'Test di ascolto',
        subtitle: '2 provas · 30 minutos · 12 pontos',
        timeSeconds: config.timeSeconds,
        questions,
        audioByTask: audioByTask(passages),
      })
    }
  }

  if (mode === 'lettura' || mode === 'mock_cittadinanza') {
    const questions = await loadQuestions('lettura')
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

  if (mode === 'scrittura' || mode === 'mock_cittadinanza') {
    stages.push({
      kind: 'writing',
      id: 'scrittura',
      skill: 'scrittura',
      title: 'Test di produzione scritta',
      subtitle: '1 prova · 40 minutos · 12 pontos',
      timeSeconds: EXAM_CONFIGS.scrittura.timeSeconds,
      prompts: OFFICIAL_WRITING_PROMPTS,
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
      topics: OFFICIAL_ORAL_TOPICS,
      rubricScore: scoreOrale,
    })
  }

  if (stages.length === 0) return null
  return { stages, passages: passageMap }
}
