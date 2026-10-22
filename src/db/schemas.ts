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
})
export type Question = z.infer<typeof questionSchema>

/* -------------------------------------------------------------------------- */
/* Sessões e tentativas                                                       */
/* -------------------------------------------------------------------------- */

export const EXAM_MODES = ['ascolto', 'lettura', 'scrittura', 'orale', 'mock_cittadinanza'] as const
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
