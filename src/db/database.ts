import Dexie, { type Table } from 'dexie'
import type {
  Attempt,
  GrammarItem,
  OralAudio,
  Oral,
  Passage,
  Profile,
  Question,
  Session,
  VocabItem,
  Writing,
} from './schemas'

export class CilsDatabase extends Dexie {
  profiles!: Table<Profile, string>
  passages!: Table<Passage, string>
  questions!: Table<Question, string>
  sessions!: Table<Session, string>
  attempts!: Table<Attempt, string>
  writings!: Table<Writing, string>
  orals!: Table<Oral, string>
  grammarItems!: Table<GrammarItem, string>
  vocabItems!: Table<VocabItem, string>
  /** Gravações da prova oral (Blob do MediaRecorder). */
  oralAudios!: Table<OralAudio, string>

  constructor() {
    super('cils-b1-cittadinanza')
    this.version(1).stores({
      profiles: 'id, updatedAt',
      passages: 'id, kind',
      questions: 'id, skill, taskId, order',
      sessions: 'id, profileId, status, mode, startedAt',
      attempts: 'id, profileId, sessionId, questionId, skill, timestamp',
      writings: 'id, profileId, createdAt',
      orals: 'id, profileId, createdAt',
    })
    // v2: o conteúdo por fase (gramática do Sillabo e vocabulário civic/burocrático).
    // As tabelas do v1 são herdadas — o histórico da aluna nunca é tocado.
    this.version(2).stores({
      grammarItems: 'id, phase, topic, level',
      vocabItems: 'id, phase, category, level',
    })
    // v3: a gravação de áudio da prova oral (ficca só neste dispositivo).
    this.version(3).stores({
      oralAudios: 'id, createdAt',
    })
  }
}

export const db = new CilsDatabase()

/**
 * Sem isto, a atualização da app fica bloqueada.
 *
 * O Dexie abre a base de dados com a versão do esquema. Se um separador
 * antigo da app (com o esquema v1) ficar aberto, a nova versão (v3) fica a
 * espera — o `open()` nunca resolve e a app fica eternamente na tela
 * "Carregando…". Com o evento `versionchange`, o separador antigo fecha a
 * ligação e deixa o upgrade acontecer.
 */
db.on('versionchange', () => {
  db.close()
})

export async function initializeDatabase(): Promise<void> {
  await db.open()
}
