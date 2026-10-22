/**
 * Sync opcional por GitHub Gist.
 *
 * Como o app é 100% offline, o modo "guardar noutro aparelho" é feito com um
 * Gist privado do GitHub: o token é da aluna, vive só no `localStorage` deste
 * dispositivo e a comunicação é directa do browser para `api.github.com`
 * (sem backend nenhum).
 *
 * Regras:
 * - o token só precisa do scope `gist`;
 * - o Gist é PRIVADO (`public: false`);
 * - o merge é "o registo mais novo vence" e nada local é apagado;
 * - o conteúdo do banco de questões NÃO viaja (é re-seedado localmente).
 */

import { db } from '../db/database'
import { gistPayloadSchema, type GistPayload } from '../db/schemas'
import { mergeRecords, sessionTimestamp } from '../lib/merge'

export const GIST_TOKEN_KEY = 'cils.gist.token'
export const GIST_ID_KEY = 'cils.gist.id'
export const GIST_AUTO_KEY = 'cils.gist.auto'
export const GIST_FILENAME = 'cils-b1-progress-sync.json'
export const GIST_DESCRIPTION = 'CILS B1 Cittadinanza — progresso'

const GIST_API = 'https://api.github.com/gists'

export type SyncState = 'disabled' | 'idle' | 'syncing' | 'ok' | 'error'

export interface SyncStatus {
  state: SyncState
  /** Último sync bem feito (timestamp). */
  lastSyncAt: number | null
  /** Última mensagem de erro (PT). */
  lastError: string | null
  /** Id do Gist em uso. */
  gistId: string | null
  /** Quantos registos vieram do outro aparelho no último sync. */
  lastReceived: number
}

export const INITIAL_SYNC_STATUS: SyncStatus = {
  state: 'disabled',
  lastSyncAt: null,
  lastError: null,
  gistId: null,
  lastReceived: 0,
}

export function getToken(): string {
  try {
    return window.localStorage.getItem(GIST_TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

export function setToken(token: string): void {
  try {
    const clean = token.trim()
    if (clean === '') window.localStorage.removeItem(GIST_TOKEN_KEY)
    else window.localStorage.setItem(GIST_TOKEN_KEY, clean)
  } catch {
    /* modo privado */
  }
}

export function hasToken(): boolean {
  return getToken().length > 0
}

export function getGistId(): string | null {
  try {
    return window.localStorage.getItem(GIST_ID_KEY)
  } catch {
    return null
  }
}

export function setGistId(id: string | null): void {
  try {
    if (id === null) window.localStorage.removeItem(GIST_ID_KEY)
    else window.localStorage.setItem(GIST_ID_KEY, id)
  } catch {
    /* modo privado */
  }
}

export function getAutoSync(): boolean {
  try {
    return window.localStorage.getItem(GIST_AUTO_KEY) === '1'
  } catch {
    return false
  }
}

export function setAutoSync(enabled: boolean): void {
  try {
    window.localStorage.setItem(GIST_AUTO_KEY, enabled ? '1' : '0')
  } catch {
    /* modo privado */
  }
}

/** Token mascarado, para mostrar na UI sem expor o segredo. */
export function maskToken(token: string): string {
  if (token.length <= 8) return '•'.repeat(token.length)
  return `${token.slice(0, 4)}••••${token.slice(-4)}`
}

/* -------------------------------------------------------------------------- */
/* API do GitHub                                                              */
/* -------------------------------------------------------------------------- */

interface GistFile {
  filename: string
  content?: string
  raw_url?: string
}

interface GistResponse {
  id: string
  files: Record<string, GistFile>
}

async function githubFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getToken()
  if (!token) throw new Error('Falta o token do GitHub.')
  const response = await fetch(`${GIST_API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Token inválido ou expirado.')
    if (response.status === 403) throw new Error('Sem permissão (o token precisa do scope gist).')
    if (response.status === 404) throw new Error('Gist não encontrado.')
    throw new Error(`Erro do GitHub (${response.status}).`)
  }
  return response
}

/* -------------------------------------------------------------------------- */
/* Payload e merge                                                            */
/* -------------------------------------------------------------------------- */

export async function buildSyncPayload(): Promise<GistPayload> {
  const [profiles, sessions, attempts, writings, orals] = await Promise.all([
    db.profiles.toArray(),
    db.sessions.toArray(),
    db.attempts.toArray(),
    db.writings.toArray(),
    db.orals.toArray(),
  ])
  return {
    app: 'CILS B1 Cittadinanza',
    kind: 'gist-sync',
    version: 1,
    createdAt: Date.now(),
    profiles,
    sessions,
    attempts,
    writings,
    orals,
  }
}

export interface MergeOutcome {
  added: number
  updated: number
  kept: number
}

/**
 * Aplica um payload remoto no banco local.
 * Regra: o registo mais novo vence; nada local é apagado.
 */
export async function mergePayload(payload: GistPayload): Promise<MergeOutcome> {
  const [localProfiles, localSessions, localAttempts, localWritings, localOrals] =
    await Promise.all([
      db.profiles.toArray(),
      db.sessions.toArray(),
      db.attempts.toArray(),
      db.writings.toArray(),
      db.orals.toArray(),
    ])

  const profiles = mergeRecords(localProfiles, payload.profiles, (p) => p.updatedAt)
  const sessions = mergeRecords(localSessions, payload.sessions, sessionTimestamp)
  const attempts = mergeRecords(localAttempts, payload.attempts, (a) => a.timestamp)
  const writings = mergeRecords(localWritings, payload.writings, (w) => w.createdAt)
  const orals = mergeRecords(localOrals, payload.orals, (o) => o.createdAt)

  await db.transaction(
    'rw',
    [db.profiles, db.sessions, db.attempts, db.writings, db.orals],
    async () => {
      await db.profiles.bulkPut(profiles.merged)
      await db.sessions.bulkPut(sessions.merged)
      await db.attempts.bulkPut(attempts.merged)
      await db.writings.bulkPut(writings.merged)
      await db.orals.bulkPut(orals.merged)
    },
  )

  return {
    added: profiles.added + sessions.added + attempts.added + writings.added + orals.added,
    updated:
      profiles.updated + sessions.updated + attempts.updated + writings.updated + orals.updated,
    kept: profiles.kept + sessions.kept + attempts.kept + writings.kept + orals.kept,
  }
}

/* -------------------------------------------------------------------------- */
/* Push / pull                                                                */
/* -------------------------------------------------------------------------- */

/** Procura (ou cria) o Gist do progresso. */
async function resolveGistId(): Promise<string> {
  const known = getGistId()
  if (known) return known

  const response = await githubFetch('')
  const gists = (await response.json()) as GistResponse[]
  const found = gists.find((gist) => gist.files[GIST_FILENAME])
  if (found) {
    setGistId(found.id)
    return found.id
  }
  return ''
}

export async function pushGist(payload: GistPayload): Promise<string> {
  const content = JSON.stringify(payload, null, 2)
  const existingId = await resolveGistId()

  if (existingId) {
    await githubFetch(`/${existingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ description: GIST_DESCRIPTION, files: { [GIST_FILENAME]: { content } } }),
    })
    return existingId
  }

  const response = await githubFetch('', {
    method: 'POST',
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: { [GIST_FILENAME]: { content } },
    }),
  })
  const created = (await response.json()) as GistResponse
  setGistId(created.id)
  return created.id
}

/** Lê o payload do Gist (null se ainda não existe). */
export async function pullGist(): Promise<GistPayload | null> {
  const gistId = await resolveGistId()
  if (!gistId) return null
  const response = await githubFetch(`/${gistId}`)
  const gist = (await response.json()) as GistResponse
  const file = gist.files[GIST_FILENAME]
  if (!file?.content) return null
  const parsed = gistPayloadSchema.safeParse(JSON.parse(file.content))
  return parsed.success ? parsed.data : null
}

/**
 * Sync completo: puxa o que existe no outro aparelho, funde, e volta a
 * enviar o resultado (já com o merge feito).
 */
export async function syncNow(): Promise<SyncStatus> {
  if (!hasToken()) {
    return { ...INITIAL_SYNC_STATUS, state: 'disabled', lastError: null }
  }
  try {
    const remote = await pullGist()
    let received = 0
    if (remote) {
      const outcome = await mergePayload(remote)
      received = outcome.added + outcome.updated
    }
    const payload = await buildSyncPayload()
    const gistId = await pushGist(payload)
    setGistId(gistId)
    return {
      state: 'ok',
      lastSyncAt: Date.now(),
      lastError: null,
      gistId,
      lastReceived: received,
    }
  } catch (cause) {
    return {
      ...INITIAL_SYNC_STATUS,
      state: 'error',
      lastError: cause instanceof Error ? cause.message : 'Falha ao sincronizar.',
      gistId: getGistId(),
    }
  }
}

/** Testa o token sem escrever nada (usado no botão "Testar"). */
export async function testToken(): Promise<{ ok: boolean; message: string }> {
  if (!hasToken()) return { ok: false, message: 'Falta o token do GitHub.' }
  try {
    const response = await githubFetch('')
    if (!response.ok) return { ok: false, message: `Erro do GitHub (${response.status}).` }
    return { ok: true, message: 'Token válido. O sync está pronto.' }
  } catch (cause) {
    return {
      ok: false,
      message: cause instanceof Error ? cause.message : 'Falha ao falar com o GitHub.',
    }
  }
}
