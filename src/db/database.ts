import Dexie, { type Table } from 'dexie'
import type {
  Attempt,
  Oral,
  Passage,
  Profile,
  Question,
  Session,
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
  }
}

export const db = new CilsDatabase()

export async function initializeDatabase(): Promise<void> {
  await db.open()
}
