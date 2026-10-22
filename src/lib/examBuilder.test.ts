// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/database'
import { syncQuestionBank } from '../db/seed'
import { buildExam } from './examBuilder'
import { OFFICIAL_ORAL_TOPICS, OFFICIAL_WRITING_PROMPTS } from '../data/officialSample'

describe('montagem das provas', () => {
  beforeEach(async () => {
    await db.open()
    await db.questions.clear()
    await db.passages.clear()
    await syncQuestionBank()
  })

  it('a prova de ascolto tem 18 itens (6 + 12) e o áudio das 2 provas', async () => {
    const built = await buildExam('ascolto')
    expect(built).not.toBeNull()
    const stage = built?.stages[0]
    expect(stage?.kind).toBe('objective')
    if (stage?.kind !== 'objective') return
    expect(stage.questions).toHaveLength(18)
    expect(stage.questions.filter((q) => q.taskId === 'ascolto-p1')).toHaveLength(6)
    expect(stage.questions.filter((q) => q.taskId === 'ascolto-p2')).toHaveLength(12)
    expect(Object.keys(stage.audioByTask ?? {})).toEqual(['ascolto-p1', 'ascolto-p2'])
    expect(stage.audioByTask?.['ascolto-p1']?.length).toBeGreaterThan(100)
  })

  it('a prova de leitura tem 18 itens (12 + 6)', async () => {
    const built = await buildExam('lettura')
    const stage = built?.stages[0]
    if (stage?.kind !== 'objective') throw new Error('stage inválido')
    expect(stage.questions).toHaveLength(18)
    expect(stage.questions.filter((q) => q.taskId === 'lettura-p1')).toHaveLength(12)
    expect(stage.questions.filter((q) => q.taskId === 'lettura-p2')).toHaveLength(6)
  })

  it('o simulado completo tem as 3 provas escritas, na ordem oficial', async () => {
    const built = await buildExam('mock_cittadinanza')
    expect(built?.stages.map((stage) => stage.id)).toEqual(['ascolto', 'lettura', 'scrittura'])
    expect(built?.stages[2]?.kind).toBe('writing')
  })

  it('a prova de escrita traz os 2 temas oficiais', async () => {
    const built = await buildExam('scrittura')
    const stage = built?.stages[0]
    if (stage?.kind !== 'writing') throw new Error('stage inválido')
    expect(stage.prompts).toHaveLength(2)
    expect(stage.prompts[0]?.id).toBe(OFFICIAL_WRITING_PROMPTS[0]?.id)
  })

  it('a prova oral traz os temas oficiais', async () => {
    const built = await buildExam('orale')
    const stage = built?.stages[0]
    if (stage?.kind !== 'oral') throw new Error('stage inválido')
    expect(stage.topics).toHaveLength(OFFICIAL_ORAL_TOPICS.length)
    expect(stage.topics.map((topic) => topic.id)).toContain('orale-topic-4')
  })

  it('as passagens de leitura estão disponíveis para as perguntas', async () => {
    const built = await buildExam('lettura')
    const stage = built?.stages[0]
    if (stage?.kind !== 'objective') throw new Error('stage inválido')
    for (const question of stage.questions) {
      expect(built?.passages.has(question.passageId ?? '')).toBe(true)
    }
  })
})
