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
    const built = await buildExam('lettura', { bank: 'all' })
    const stage = built?.stages[0]
    if (stage?.kind !== 'objective') throw new Error('stage inválido')
    for (const question of stage.questions) {
      if (!question.passageId) continue
      expect(built?.passages.has(question.passageId)).toBe(true)
    }
  })

  it('o banco "all" acrescenta o conteúdo extra ao banco oficial', async () => {
    const official = await buildExam('ascolto', { bank: 'official' })
    const all = await buildExam('ascolto', { bank: 'all' })
    const officialCount = official?.stages[0]?.kind === 'objective' ? official.stages[0].questions.length : 0
    const allCount = all?.stages[0]?.kind === 'objective' ? all.stages[0].questions.length : 0
    expect(officialCount).toBe(18)
    expect(allCount).toBeGreaterThan(officialCount)
  })

  it('o simulado completo usa SÓ o banco oficial (o gabarito fica intacto)', async () => {
    const built = await buildExam('mock_cittadinanza', { bank: 'official' })
    const stage = built?.stages[0]
    if (stage?.kind !== 'objective') throw new Error('stage inválido')
    expect(stage.questions).toHaveLength(18)
    for (const question of stage.questions) {
      expect(question.bank ?? 'official').toBe('official')
    }
  })

  it('a prática por fase só traz o material dessa fase', async () => {
    const built = await buildExam('ascolto', { bank: 'all', phase: 'cittadinanza' })
    const stage = built?.stages[0]
    if (stage?.kind !== 'objective') throw new Error('stage inválido')
    expect(stage.questions.length).toBeGreaterThan(0)
    for (const question of stage.questions) {
      expect(question.phase).toBe('cittadinanza')
    }
    expect(Object.keys(stage.audioByTask ?? {}).sort()).toEqual([
      'ascolto-p2-b4',
      'ascolto-p2-c6',
      'ascolto-p2-d7',
      'ascolto-p2-d8',
      'ascolto-p2-x',
    ])
  })

  it('cada fase tem material de ascolto E de lettura (a prática por fase nunca fica vazia)', async () => {
    for (const phase of ['fondazione', 'struttura', 'cittadinanza'] as const) {
      for (const skill of ['ascolto', 'lettura'] as const) {
        const built = await buildExam(skill, { bank: 'all', phase })
        const stage = built?.stages[0]
        if (stage?.kind !== 'objective') throw new Error(`stage inválido: ${phase}/${skill}`)
        expect(stage.questions.length).toBeGreaterThan(0)
        for (const question of stage.questions) {
          expect(question.phase).toBe(phase)
          expect(question.skill).toBe(skill)
        }
      }
    }
  })

  it('a prática traz também os temas extra de escrita e oral', async () => {
    const writing = await buildExam('scrittura', { bank: 'all' })
    const writingStage = writing?.stages[0]
    if (writingStage?.kind !== 'writing') throw new Error('stage inválido')
    expect(writingStage.prompts.length).toBeGreaterThan(OFFICIAL_WRITING_PROMPTS.length)

    const oral = await buildExam('orale', { bank: 'all' })
    const oralStage = oral?.stages[0]
    if (oralStage?.kind !== 'oral') throw new Error('stage inválido')
    expect(oralStage.topics.length).toBeGreaterThan(OFFICIAL_ORAL_TOPICS.length)
  })

  it('o estudo por nível traz só itens desse nível, baralhados e limitados', async () => {
    const built = await buildExam('studio', {
      bank: 'all',
      level: 'A1',
      skill: 'lettura',
      shuffle: true,
      limit: 10,
      random: () => 0.42,
    })
    const stage = built?.stages[0]
    if (stage?.kind !== 'objective') throw new Error('stage inválido')
    expect(stage.questions.length).toBeGreaterThan(0)
    expect(stage.questions.length).toBeLessThanOrEqual(10)
    for (const question of stage.questions) {
      expect(question.level).toBe('A1')
    }
  })

  it('o baralhador tira itens diferentes em sessões diferentes', async () => {
    const first = await buildExam('studio', {
      bank: 'all',
      level: 'B1',
      skill: 'lettura',
      shuffle: true,
      limit: 10,
      random: () => 0.1,
    })
    const second = await buildExam('studio', {
      bank: 'all',
      level: 'B1',
      skill: 'lettura',
      shuffle: true,
      limit: 10,
      random: () => 0.9,
    })
    const firstIds = first?.stages[0]?.kind === 'objective' ? first.stages[0].questions.map((q) => q.id) : []
    const secondIds = second?.stages[0]?.kind === 'objective' ? second.stages[0].questions.map((q) => q.id) : []
    expect(firstIds.length).toBeGreaterThan(0)
    expect(secondIds.length).toBeGreaterThan(0)
    expect(firstIds).not.toEqual(secondIds)
  })

  it('o mesmo seed dá sempre a mesma seleção (a app é determinística por dia)', async () => {
    const options = {
      bank: 'all' as const,
      level: 'B1' as const,
      skill: 'lettura' as const,
      shuffle: true,
      limit: 8,
      random: () => 0.33,
    }
    const first = await buildExam('studio', options)
    const second = await buildExam('studio', options)
    const firstIds = first?.stages[0]?.kind === 'objective' ? first.stages[0].questions.map((q) => q.id) : []
    const secondIds = second?.stages[0]?.kind === 'objective' ? second.stages[0].questions.map((q) => q.id) : []
    expect(firstIds).toEqual(secondIds)
  })
})
