/**
 * Rótulos das 3 fases do plano de estudos.
 *
 * As fases vêm de `src/lib/roadmapCalculator.ts`; aqui ficam os nomes curtos
 * (para botões e títulos) e os completos (para cabeçalhos).
 */

import type { Phase } from '../db/schemas'

export const PHASE_LABELS: Record<Phase, string> = {
  fondazione: 'Fondazione (A1)',
  struttura: 'Struttura (A2)',
  cittadinanza: 'Cittadinanza (B1)',
}

export const PHASE_TITLES: Record<Phase, string> = {
  fondazione: 'Fase 1 — Fondazione (A1)',
  struttura: 'Fase 2 — Struttura (A2)',
  cittadinanza: 'Fase 3 — Cittadinanza (B1)',
}

/** O que se estuda em cada fase (texto curto, em português). */
export const PHASE_FOCUS: Record<Phase, string> = {
  fondazione:
    'Verbi essere e avere, artigos, apresentação pessoal, vida cotidiana, hora e data, ascolto "in chiaro".',
  struttura:
    'Passato prossimo vs imperfetto, preposições articuladas, futuro, pronomes, comparativos, advérbios de tempo.',
  cittadinanza:
    'Condicional, frases relativas e subordinadas, conectivos, registro formal, burocracia e assistencia sanitaria.',
}
