/**
 * Configuração das provas do CILS B1 Cittadinanza.
 *
 * Espelha o padrão de `src/lib/exam.ts` do ElevenSpark: os tempos, a contagem de
 * itens e a estrutura de cada prova vivem num único objeto, e a UI lê daqui.
 *
 * Fonte oficial: Quaderno B1 Cittadinanza + Trascrizioni (protocolo di
 * somministrazione dell'ascolto). Ver `docs/exam-spec.md`.
 */

import {
  ASCOLTO_P1_ITEMS,
  ASCOLTO_P2_ITEMS,
  LETTURA_P1_ITEMS,
  LETTURA_P2_ITEMS,
  type Skill,
} from './scoring'

export const EXAM_MODES = [
  'ascolto',
  'lettura',
  'scrittura',
  'orale',
  'mock_cittadinanza',
  'studio',
] as const
export type ExamMode = (typeof EXAM_MODES)[number]

export const SKILL_TO_MODE: Record<Skill, ExamMode> = {
  ascolto: 'ascolto',
  lettura: 'lettura',
  scrittura: 'scrittura',
  orale: 'orale',
}

const MINUTE = 60

export interface ExamTaskConfig {
  id: string
  /** `prova1` / `prova2` dentro da habilidade. */
  label: string
  labelPt: string
  /** Tipo de item, conforme `ItemType` do scoring. */
  itemType: 'mcq3' | 'truefalse' | 'cloze'
  itemCount: number
  pointsPerItem: number
  /** Tempo de leitura do enunciado antes do áudio (ascolto) — 0 quando não se aplica. */
  readSeconds: number
}

export interface ExamConfig {
  mode: ExamMode
  skill: Skill | 'all'
  title: string
  titlePt: string
  subtitlePt: string
  blurbPt: string
  /** Duração total da prova, em segundos. */
  timeSeconds: number
  tasks: readonly ExamTaskConfig[]
  /** A prova exige escrever as respostas no foglio delle risposte (OMR). */
  omrEligible: boolean
}

/* -------------------------------------------------------------------------- */
/* Ascolto — o protocolo real de somministrazione                             */
/* -------------------------------------------------------------------------- */

export type AscoltoStepKind = 'audio' | 'read' | 'review' | 'write'

export interface AscoltoStep {
  id: string
  kind: AscoltoStepKind
  /** Qual task do ascolto este passo serve (1 ou 2). */
  task: 1 | 2
  /** 1 = primeira ascolto, 2 = segunda. `null` quando não é áudio. */
  pass: 1 | 2 | null
  /** Duração em segundos. `0` = "até o fim do áudio". */
  durationSeconds: number
  labelPt: string
}

/**
 * O texto oficial diz: "Sentirai i testi due volte" — cada prova é ouvida DUAS
 * vezes, com 2 minutos para ler o enunciado, 2 minutos para conferir e, no fim,
 * 3 minutos para escrever as respostas no foglio delle risposte.
 */
export const ASCOLTO_PROTOCOL: readonly AscoltoStep[] = [
  { id: 'p1-audio-1', kind: 'audio', task: 1, pass: 1, durationSeconds: 0, labelPt: 'Ascolta a prova 1 (1ª vez)' },
  { id: 'p1-read', kind: 'read', task: 1, pass: null, durationSeconds: 2 * MINUTE, labelPt: 'Lê as 6 perguntas' },
  { id: 'p1-audio-2', kind: 'audio', task: 1, pass: 2, durationSeconds: 0, labelPt: 'Ascolta a prova 1 (2ª vez)' },
  { id: 'p1-review', kind: 'review', task: 1, pass: null, durationSeconds: 2 * MINUTE, labelPt: 'Confere as respostas' },
  { id: 'p2-audio-1', kind: 'audio', task: 2, pass: 1, durationSeconds: 0, labelPt: 'Ascolta a prova 2 (1ª vez)' },
  { id: 'p2-read', kind: 'read', task: 2, pass: null, durationSeconds: 2 * MINUTE, labelPt: 'Lê as 12 afirmações' },
  { id: 'p2-audio-2', kind: 'audio', task: 2, pass: 2, durationSeconds: 0, labelPt: 'Ascolta a prova 2 (2ª vez)' },
  { id: 'p2-review', kind: 'review', task: 2, pass: null, durationSeconds: 2 * MINUTE, labelPt: 'Confere as respostas' },
  { id: 'write', kind: 'write', task: 2, pass: null, durationSeconds: 3 * MINUTE, labelPt: 'Escreve as respostas no foglio' },
]

/** Cada texto de ascolto pode ser ouvido no máximo duas vezes. */
export const MAX_AUDIO_PASSES = 2

/* -------------------------------------------------------------------------- */
/* As configurações                                                          */
/* -------------------------------------------------------------------------- */

export const EXAM_CONFIGS: Record<ExamMode, ExamConfig> = {
  ascolto: {
    mode: 'ascolto',
    skill: 'ascolto',
    title: 'Test di ascolto',
    titlePt: 'Prova de Escuta (Ascolto)',
    subtitlePt: '2 provas · 30 minutos · 12 pontos',
    blurbPt:
      'Textos do dia a dia, gravados em estúdio, em italiano standard. Cada texto é ouvido ' +
      'DUAS vezes: depois de ouvir, você tem 2 minutos para ler, 2 para conferir e, no fim, ' +
      '3 minutos para escrever no foglio delle risposte.',
    timeSeconds: 30 * MINUTE,
    tasks: [
      {
        id: 'ascolto-p1',
        label: 'Prova n. 1',
        labelPt: 'Prova 1 — escolha múltipla',
        itemType: 'mcq3',
        itemCount: ASCOLTO_P1_ITEMS,
        pointsPerItem: 1,
        readSeconds: 2 * MINUTE,
      },
      {
        id: 'ascolto-p2',
        label: 'Prova n. 2',
        labelPt: 'Prova 2 — verdadeiro ou falso',
        itemType: 'truefalse',
        itemCount: ASCOLTO_P2_ITEMS,
        pointsPerItem: 0.5,
        readSeconds: 2 * MINUTE,
      },
    ],
    omrEligible: true,
  },
  lettura: {
    mode: 'lettura',
    skill: 'lettura',
    title: 'Test di comprensione della lettura e riflessione grammaticale',
    titlePt: 'Prova de Leitura e Gramática (Lettura)',
    subtitlePt: '2 provas · 40 minutos · 12 pontos',
    blurbPt:
      'Textos de 350-500 palavras (cartas, e-mails, artigos, regulamentos, manuais). ' +
      'Prova 1: 12 afirmações de verdadeiro ou falso. Prova 2: 6 lacunas de gramática com ' +
      '3 opções cada.',
    timeSeconds: 40 * MINUTE,
    tasks: [
      {
        id: 'lettura-p1',
        label: 'Prova n. 1',
        labelPt: 'Prova 1 — verdadeiro ou falso',
        itemType: 'truefalse',
        itemCount: LETTURA_P1_ITEMS,
        pointsPerItem: 0.5,
        readSeconds: 0,
      },
      {
        id: 'lettura-p2',
        label: 'Prova n. 2',
        labelPt: 'Prova 2 — completa o texto',
        itemType: 'cloze',
        itemCount: LETTURA_P2_ITEMS,
        pointsPerItem: 1,
        readSeconds: 0,
      },
    ],
    omrEligible: true,
  },
  scrittura: {
    mode: 'scrittura',
    skill: 'scrittura',
    title: 'Test di produzione scritta',
    titlePt: 'Prova de Escrita (Produzione scritta)',
    subtitlePt: '1 prova · 40 minutos · 12 pontos',
    blurbPt:
      'Escolhe 1 dos 2 temas e escreve de 80 a 120 palavras. A correção usa a grilha ' +
      'oficial: eficácia comunicativa, adequação estilística, correção morfossintática, ' +
      'riqueza lexical, ortografia e pontuação.',
    timeSeconds: 40 * MINUTE,
    tasks: [],
    omrEligible: false,
  },
  orale: {
    mode: 'orale',
    skill: 'orale',
    title: 'Test di produzione orale',
    titlePt: 'Prova Oral (Produzione orale)',
    subtitlePt: '~10 minutos · 12 pontos',
    blurbPt:
      'Uma apresentação pessoal de cerca de 1 minuto e uma conversa de 2 a 3 minutos sobre ' +
      'um tema que VOCÊ escolhe. A correção usa a griglia oficial: eficácia comunicativa, ' +
      'correção morfossintática, riqueza lexical, pronúncia e entoação.',
    timeSeconds: 10 * MINUTE,
    tasks: [],
    omrEligible: false,
  },
  mock_cittadinanza: {
    mode: 'mock_cittadinanza',
    skill: 'all',
    title: 'Esame completo CILS B1 Cittadinanza',
    titlePt: 'Simulado completo — CILS B1 Cittadinanza',
    subtitlePt: 'Escuta + Leitura + Escrita · 110 minutos · 36 pontos · Oral à parte',
    blurbPt:
      'A prova escrita inteira, cronometrada, na ordem real: ascolto (30 min), lettura ' +
      '(40 min) e produzione scritta (40 min). A prova orale é marcada à parte, como no ' +
      'dia do exame.',
    timeSeconds: 30 * MINUTE + 40 * MINUTE + 40 * MINUTE,
    tasks: [],
    omrEligible: true,
  },
  studio: {
    mode: 'studio',
    skill: 'all',
    title: 'Studio per livello',
    titlePt: 'Estudo por nível (A1 / A2 / B1)',
    subtitlePt: '10-15 itens aleatórios · sem pressão de tempo',
    blurbPt:
      'Um exercício curto e ALEATÓRIO do nível que escolheres: as perguntas são sempre ' +
      'baralhadas e tiradas do banco grande (oficial + conteúdo extra + exercícios de ' +
      'gramática e vocabulário). Cada dia é um dia novo.',
    timeSeconds: 15 * MINUTE,
    tasks: [],
    omrEligible: false,
  },
}

export function examConfig(mode: ExamMode): ExamConfig {
  return EXAM_CONFIGS[mode]
}

/** Segue uma lista de passos do protocolo de ascolto. */
export function ascoltoStepAt(index: number): AscoltoStep | null {
  return ASCOLTO_PROTOCOL[index] ?? null
}

/** Quantas vezes cada task pode ser reproduzida (2, como no exame real). */
export function maxPassesForTask(_task: 1 | 2): number {
  return MAX_AUDIO_PASSES
}
