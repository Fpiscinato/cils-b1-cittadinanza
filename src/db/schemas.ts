import { z } from 'zod'

/* -------------------------------------------------------------------------- */
/* Habilidades                                                                */
/* -------------------------------------------------------------------------- */

export const SKILLS = ['ascolto', 'lettura', 'scrittura', 'orale'] as const
export const skillSchema = z.enum(SKILLS)
export type Skill = z.infer<typeof skillSchema>

/* -------------------------------------------------------------------------- */
/* Tipos de item das provas objetivas                                        */
/* -------------------------------------------------------------------------- */

/** `mcq3` = 3 opções; `truefalse` = verdadeiro/falso; `cloze` = 3 opções. */
export const objectiveItemTypes = ['mcq3', 'truefalse', 'cloze'] as const
export const objectiveItemTypeSchema = z.enum(objectiveItemTypes)
export type ObjectiveItemType = z.infer<typeof objectiveItemTypeSchema>

/* -------------------------------------------------------------------------- */
/* Fases do plano de estudos                                                    */
/* -------------------------------------------------------------------------- */

/** As 3 fases do plano de estudos (ver `src/lib/roadmapCalculator.ts`). */
export const PHASES = ['fondazione', 'struttura', 'cittadinanza'] as const
export const phaseSchema = z.enum(PHASES)
export type Phase = z.infer<typeof phaseSchema>

/** Níveis do conteúdo (o Sillabo vai de A1 a B1). */
export const LEVELS = ['A1', 'A2', 'B1'] as const
export const levelSchema = z.enum(LEVELS)
export type Level = z.infer<typeof levelSchema>

/* -------------------------------------------------------------------------- */
/* Perfis                                                                     */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PROFILE_ID = 'profile-student'
export const GUEST_PROFILE_ID = 'profile-guest'

export const profileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(40),
  avatar: z.string().min(1).max(8),
  /** Data da prova marcada, em ISO (YYYY-MM-DD). Vazio = ainda não decidida. */
  examDate: z.string().max(10),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
})
export type Profile = z.infer<typeof profileSchema>

/* -------------------------------------------------------------------------- */
/* Conteúdo: passagens e perguntas                                           */
/* -------------------------------------------------------------------------- */

export const passageKindSchema = z.enum(['reading', 'audio_transcript', 'writing_prompt', 'oral_topic'])
export type PassageKind = z.infer<typeof passageKindSchema>

export const passageSchema = z.object({
  id: z.string().min(1),
  kind: passageKindSchema,
  title: z.string().min(1),
  content: z.string().min(1),
  /** Fonte (ex.: "CILS B1 Cittadinanza – Quaderno ufficiale"). */
  source: z.string().max(200).optional(),
})
export type Passage = z.infer<typeof passageSchema>

export const questionSchema = z.object({
  id: z.string().min(1),
  skill: skillSchema,
  /** Id da prova dentro da habilidade (ex.: "ascolto-p1"). */
  taskId: z.string().min(1),
  itemType: objectiveItemTypeSchema,
  /** Posição do item dentro da prova (1-based). */
  order: z.number().int().positive(),
  stem: z.string().min(1),
  passageId: z.string().optional(),
  /** 3 opções para mcq3/cloze, 2 (Vero/Falso) para truefalse. */
  options: z.array(z.string().min(1)).min(2).max(3),
  correctIndex: z.number().int().min(0).max(2),
  pointsPerItem: z.number().positive(),
  /** Explicação mostrada depois da resposta (tela de ajuda). */
  explanation: z.string().min(1),
  /** Id do áudio (ascolto) — aponta para `public/audio/`. */
  audioId: z.string().optional(),
  /**
   * De que banco vem o item.
   * - `official`: a prova oficial de exemplo do CILS (o simulado completo usa
   *   SÓ este banco, para manter o gabarito intacto).
   * - `practice`: conteúdo extra da app, para treinar com material novo.
   */
  bank: z.enum(['official', 'practice']).optional(),
  /**
   * Fase do plano de estudos a que o item pertence (só no banco extra).
   * Serve para a "prática por fase": a aluna treina só o material do tema
   * que está a estudar.
   */
  phase: phaseSchema.optional(),
  /**
   * Nível do item (A1, A2, B1). Serve para o "estudo por nível": escolher
   * A1 treina o básico, B1 treina o nível do exame.
   */
  level: levelSchema.optional(),
})
export type Question = z.infer<typeof questionSchema>

/* -------------------------------------------------------------------------- */
/* Conteúdo por fase (gramática e vocabulário)                                 */
/* -------------------------------------------------------------------------- */

export const grammarExampleSchema = z.object({
  it: z.string().min(1),
  pt: z.string().min(1),
})

/**
 * Um item de gramática do Sillabo B1 Cittadinanza.
 * A regra e os exemplos estão em italiano (é o que a aluna vai ler na prova);
 * a explicação está em português (é a língua da interface).
 */
export const grammarItemSchema = z.object({
  id: z.string().min(1),
  phase: phaseSchema,
  /** Tema do Sillabo (ex.: "Indicativo passato prossimo"). */
  topic: z.string().min(1),
  /** Título da regra em italiano. */
  title: z.string().min(1),
  /** A regra, em italiano e em uma frase. */
  rule: z.string().min(1),
  /** Explicação em português. */
  explanationPt: z.string().min(1),
  examples: z.array(grammarExampleSchema).min(1),
  level: levelSchema,
})
export type GrammarItem = z.infer<typeof grammarItemSchema>

export const VOCAB_CATEGORIES = [
  'quotidiano',
  'burocracia',
  'civico',
  'sanita',
  'cultura',
  'lavoro',
] as const
export const vocabCategorySchema = z.enum(VOCAB_CATEGORIES)
export type VocabCategory = z.infer<typeof vocabCategorySchema>

/** Uma entrada de vocabulário, com uma frase de exemplo. */
export const vocabItemSchema = z.object({
  id: z.string().min(1),
  phase: phaseSchema,
  category: vocabCategorySchema,
  /** A palavra ou a expressão em italiano. */
  it: z.string().min(1),
  /** O significado em português. */
  pt: z.string().min(1),
  /** Frase de exemplo em italiano. */
  example: z.string().min(1),
  /** A frase traduzida. */
  examplePt: z.string().min(1),
  level: levelSchema,
})
export type VocabItem = z.infer<typeof vocabItemSchema>

/* -------------------------------------------------------------------------- */
/* Sessões e tentativas                                                       */
/* -------------------------------------------------------------------------- */

export const EXAM_MODES = [
  'ascolto',
  'lettura',
  'scrittura',
  'orale',
  'mock_cittadinanza',
  'studio',
] as const
export const examModeSchema = z.enum(EXAM_MODES)
export type ExamMode = z.infer<typeof examModeSchema>

export const sessionStatusSchema = z.enum(['in_progress', 'completed', 'abandoned'])
export type SessionStatus = z.infer<typeof sessionStatusSchema>

export const sessionSchema = z.object({
  id: z.string().min(1),
  profileId: z.string().min(1).default(DEFAULT_PROFILE_ID),
  mode: examModeSchema,
  status: sessionStatusSchema.default('in_progress'),
  /** Nome legível, ex.: "Simulado oficial CILS". */
  title: z.string().max(120).default(''),
  startedAt: z.number().int(),
  completedAt: z.number().int().nullable().default(null),
  totalTimeSeconds: z.number().min(0).default(0),
  /** Total de pontos (0-48). */
  score: z.number().min(0).nullable().default(null),
  /** Pontos por habilidade. */
  perSkill: z.record(z.string(), z.number()).optional(),
})
export type Session = z.infer<typeof sessionSchema>

export const attemptSchema = z.object({
  id: z.string().min(1),
  profileId: z.string().min(1).default(DEFAULT_PROFILE_ID),
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  skill: skillSchema,
  taskId: z.string().min(1),
  isCorrect: z.boolean(),
  /** true quando a aluna não respondeu (vale 0 pontos na prova real). */
  skipped: z.boolean().default(false),
  /** Índice da opção escolhida (-1 se não respondeu). Serve para o relatório. */
  selectedIndex: z.number().int().min(-1).max(2).default(-1),
  timeSpentSeconds: z.number().min(0).default(0),
  timestamp: z.number().int(),
})
export type Attempt = z.infer<typeof attemptSchema>

/* -------------------------------------------------------------------------- */
/* Produções do aluno                                                         */
/* -------------------------------------------------------------------------- */

export const writingSchema = z.object({
  id: z.string().min(1),
  profileId: z.string().min(1),
  /** Id do prompt (tema) escolhido. */
  promptId: z.string().min(1),
  text: z.string(),
  wordCount: z.number().int().min(0),
  rubric: z.record(z.string(), z.number()),
  score: z.number().min(0).max(12),
  createdAt: z.number().int(),
})
export type Writing = z.infer<typeof writingSchema>

export const oralSchema = z.object({
  id: z.string().min(1),
  profileId: z.string().min(1),
  /** Tema escolhido pela aluna. */
  topicId: z.string().min(1),
  notes: z.string().default(''),
  rubric: z.record(z.string(), z.number()),
  score: z.number().min(0).max(12),
  /** Duração total da prova oral (aprox. 10 min: 1 de apresentação + 2-3 de diálogo). */
  durationSeconds: z.number().min(0).default(0),
  createdAt: z.number().int(),
})
export type Oral = z.infer<typeof oralSchema>

/* -------------------------------------------------------------------------- */
/* Backup                                                                     */
/* -------------------------------------------------------------------------- */

export const backupSchema = z.object({
  app: z.literal('CILS B1 Cittadinanza'),
  version: z.number().int().positive(),
  exportedAt: z.number().int(),
  profiles: z.array(profileSchema),
  passages: z.array(passageSchema),
  questions: z.array(questionSchema),
  sessions: z.array(sessionSchema),
  attempts: z.array(attemptSchema),
  writings: z.array(writingSchema),
  orals: z.array(oralSchema),
})
export type Backup = z.infer<typeof backupSchema>

/**
 * Payload do sync por Gist.
 *
 * É o backup SEM o conteúdo do banco (passagens e perguntas), porque o
 * conteúdo é re-seedado localmente em cada aparelho — o que viaja entre
 * aparelhos é o progresso da aluna.
 */
export const gistPayloadSchema = z.object({
  app: z.literal('CILS B1 Cittadinanza'),
  kind: z.literal('gist-sync'),
  version: z.number().int().positive(),
  createdAt: z.number().int(),
  profiles: z.array(profileSchema),
  sessions: z.array(sessionSchema),
  attempts: z.array(attemptSchema),
  writings: z.array(writingSchema),
  orals: z.array(oralSchema),
})
export type GistPayload = z.infer<typeof gistPayloadSchema>
