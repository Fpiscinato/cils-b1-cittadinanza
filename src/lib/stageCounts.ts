import type { Skill } from '../db/schemas'

export interface StageCounts {
  correct: number
  total: number
}

/** O mínimo que a contagem precisa de saber de uma etapa do runner. */
export interface CountableStage {
  kind: 'objective' | 'writing' | 'oral'
  skill: Skill
  questions?: ReadonlyArray<{ id: string }>
}

/**
 * Conta, por habilidade, quantos itens saíram certos de quantos.
 *
 * É o que o fim da sessão de estudo mostra ("acertaste 9 de 12") em vez da
 * nota na escala 0-12 da prova — que não se aplica a um treino de apostila.
 * Um item não respondido conta como errado (na prova oficial, erro ou omissão
 * valem 0), e etapas de escrita/oral não entram nesta contagem.
 */
export function buildStageCounts(
  stages: ReadonlyArray<CountableStage>,
  correctById: Readonly<Record<string, boolean>>,
): Partial<Record<Skill, StageCounts>> {
  const counts: Partial<Record<Skill, StageCounts>> = {}
  for (const stage of stages) {
    if (stage.kind !== 'objective') continue
    const questions = stage.questions ?? []
    const current = counts[stage.skill] ?? { correct: 0, total: 0 }
    counts[stage.skill] = {
      correct:
        current.correct + questions.filter((question) => correctById[question.id] === true).length,
      total: current.total + questions.length,
    }
  }
  return counts
}
