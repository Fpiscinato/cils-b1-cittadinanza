import { describe, expect, it } from 'vitest'
import { checkWordCount, countWords } from './wordCount'

describe('contagem de palavras', () => {
  it('conta palavras separadas por espaço', () => {
    expect(countWords('uno due tre')).toBe(3)
  })

  it('ignora a pontuação', () => {
    expect(countWords('Ciao, come stai? Bene!')).toBe(4)
  })

  it('"l\'acqua" é uma palavra só', () => {
    expect(countWords("l'acqua fredda")).toBe(2)
  })

  it('conta números como palavras', () => {
    expect(countWords('ho 25 euro')).toBe(3)
  })

  it('não conta o texto vazio', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   \n  ')).toBe(0)
  })

  it('avisa quando está abaixo do mínimo', () => {
    const result = checkWordCount('poucas palavras', 80, 120)
    expect(result.inRange).toBe(false)
    expect(result.delta).toBe(78)
  })

  it('avisa quando excede o máximo', () => {
    const result = checkWordCount(Array.from({ length: 130 }, () => 'parola').join(' '), 80, 120)
    expect(result.inRange).toBe(false)
    expect(result.words).toBe(130)
    expect(result.delta).toBe(10)
  })

  it('aceita o intervalo oficial (80-120)', () => {
    const result = checkWordCount(Array.from({ length: 100 }, () => 'parola').join(' '), 80, 120)
    expect(result.inRange).toBe(true)
    expect(result.delta).toBe(0)
  })
})
