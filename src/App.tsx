import { useCallback, useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'
import { AppShell } from './components/AppShell'
import { UpdateBanner, type PwaBannerState } from './components/UpdateBanner'
import { DashboardPage } from './pages/DashboardPage'
import { PracticePage, type PendingSession } from './pages/PracticePage'
import { MockPage } from './pages/MockPage'
import { ProgressPage } from './pages/ProgressPage'
import { GuidePage } from './pages/GuidePage'
import { ReportPage } from './components/exam/ReportPage'
import { MistakesPage } from './pages/MistakesPage'
import { AnswerSheetPage } from './pages/AnswerSheetPage'
import { SettingsPage } from './pages/SettingsPage'
import { db } from './db/database'
import { initializeDatabase } from './db/database'
import { syncQuestionBank } from './db/seed'
import { ensureDefaultProfile, getActiveProfileId } from './lib/admin'
import { loadProfileHistory } from './services/sessions'
import type { Attempt, Profile, Session } from './db/schemas'
import { routeFromHash, type Route } from './lib/routes'
import { applyTheme, prefersDark, readStoredTheme, storeTheme, type Theme } from './lib/theme'
import {
  getAutoSync,
  hasToken,
  syncNow,
  INITIAL_SYNC_STATUS,
  type SyncStatus,
} from './services/gistSync'
import { createSnapshotIfChanged } from './services/snapshots'
import { BACKUP_EXPORTED_KEY } from './lib/backup'

export default function App() {
  const [route, setRoute] = useState<Route>(() => routeFromHash(window.location.hash))
  const [ready, setReady] = useState(false)
  const [bootError, setBootError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme())
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(INITIAL_SYNC_STATUS)
  const [hasBackup, setHasBackup] = useState(false)
  const [pwaState, setPwaState] = useState<PwaBannerState>('none')
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(null)
  const [reportSessionId, setReportSessionId] = useState<string | null>(null)
  const updateWorker = useRef<((reload?: boolean) => Promise<void>) | null>(null)
  const autoSynced = useRef(false)

  const refresh = useCallback(async () => {
    const profileId = getActiveProfileId()
    const [current, history] = await Promise.all([
      db.profiles.get(profileId),
      loadProfileHistory(profileId),
    ])
    setProfile(current ?? null)
    setSessions(history.sessions)
    setAttempts(history.attempts)
    try {
      setHasBackup(Boolean(window.localStorage.getItem(BACKUP_EXPORTED_KEY)))
    } catch {
      setHasBackup(false)
    }
  }, [])

  /* ---------------------------------------------------------------------- */
  /* Arranque                                                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      applyTheme(readStoredTheme())
      // O arranque não pode ficar eternamente no "A carregar…": se a base de
      // dados estiver bloqueada (outro separador com a versão antiga da app
      // aberta) ou a semear o conteúdo falhar, mostramos o erro e deixamos
      // a aluna tentar de novo.
      const timeout = window.setTimeout(() => {
        if (!cancelled) {
          setBootError(
            'A app está a demorar a abrir. Se tens outro separador desta app aberto, fecha-o e toca em "Tentar de novo".',
          )
        }
      }, 15000)

      try {
        await initializeDatabase()
        await syncQuestionBank()
        await ensureDefaultProfile()
        await refresh()
        if (cancelled) return
        setReady(true)
        setBootError(null)
        // Snapshot local de segurança: automático, sem ruído para a aluna.
        void createSnapshotIfChanged().catch(() => undefined)
      } catch (cause) {
        if (cancelled) return
        setBootError(
          cause instanceof Error
            ? `Não foi possível abrir os dados: ${cause.message}`
            : 'Não foi possível abrir os dados.',
        )
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [refresh])

  /* ---------------------------------------------------------------------- */
  /* Tema                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const resolved = applyTheme(theme)
    storeTheme(theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0f172a' : '#0f766e')
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyTheme('system', prefersDark())
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [theme])

  /* ---------------------------------------------------------------------- */
  /* PWA — registo do service worker                                        */
  /* ---------------------------------------------------------------------- */

  /**
   * O `vite-plugin-pwa` está configurado com `injectRegister: null`: o
   * registo é feito aqui, para a app controlar a mensagem de "nova versão".
   * Sem este registo a app NÃO funciona offline — o requisito do projeto.
   */
  useEffect(() => {
    if (import.meta.env.DEV) return
    updateWorker.current = registerSW({
      immediate: true,
      onNeedRefresh() {
        setPwaState('update-available')
      },
      onOfflineReady() {
        setPwaState('offline-ready')
      },
    })
  }, [])

  /* ---------------------------------------------------------------------- */
  /* Navegação (hash)                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function navigate(next: Route): void {
    // Um pedido de prova só vale para a entrada immediate: ao sair do ecrã
    // que o recebeu, o pedido é limpo.
    if (next !== 'practice' && next !== 'mock') setPendingSession(null)
    window.location.hash = `#/${next}`
    setRoute(next)
    window.scrollTo({ top: 0 })
  }

  /* ---------------------------------------------------------------------- */
  /* Sync por Gist                                                          */
  /* ---------------------------------------------------------------------- */

  const runSync = useCallback(async () => {
    if (!hasToken()) {
      setSyncStatus(INITIAL_SYNC_STATUS)
      return
    }
    setSyncStatus((current) => ({ ...current, state: 'syncing' }))
    const status = await syncNow()
    setSyncStatus(status)
  }, [])

  useEffect(() => {
    if (!ready) return
    if (!hasToken()) return
    if (getAutoSync() && !autoSynced.current) {
      autoSynced.current = true
      void runSync()
    }
  }, [ready, runSync])

  /** Depois de uma prova: guarda um snapshot e sincroniza (se estiver ligado). */
  const afterSession = useCallback(async () => {
    await refresh()
    void createSnapshotIfChanged().catch(() => undefined)
    if (getAutoSync() && hasToken()) void runSync()
  }, [refresh, runSync])

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center dark:bg-slate-900">
        {bootError ? (
          <>
            <p className="max-w-sm text-sm font-black text-slate-700 dark:text-slate-200">
              {bootError}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-black text-white hover:bg-teal-800"
            >
              Tentar de novo
            </button>
          </>
        ) : (
          <p className="text-sm font-bold text-slate-500">A carregar…</p>
        )}
      </div>
    )
  }

  const profileId = profile?.id ?? getActiveProfileId()

  /**
   * O estado mostrado: sem token é "sem sync"; com token mas sem sync ainda
   * feito é "idle" (nuvem laranja). Só fica verde depois de um sync OK.
   */
  const displaySyncStatus: SyncStatus = !hasToken()
    ? INITIAL_SYNC_STATUS
    : syncStatus.state === 'disabled'
      ? { ...syncStatus, state: 'idle' }
      : syncStatus

  return (
    <AppShell
      route={route}
      onNavigate={navigate}
      theme={theme}
      onThemeChange={setTheme}
      syncStatus={displaySyncStatus}
      onSyncClick={() => navigate('settings')}
    >
      {route === 'dashboard' ? (
        <DashboardPage
          profile={profile}
          sessions={sessions}
          attempts={attempts}
          hasBackup={hasBackup}
          hasSync={hasToken()}
          onStart={(mode) => {
            // O painel ABRE a prova directamente (sem salto + clique outra vez).
            setPendingSession({ mode })
            navigate(mode === 'mock_cittadinanza' ? 'mock' : 'practice')
          }}
          onNavigate={navigate}
        />
      ) : null}

      {route === 'practice' ? (
        <PracticePage
          profileId={profileId}
          onCompleted={() => void afterSession()}
          onNavigate={navigate}
          pending={pendingSession}
          onPendingConsumed={() => setPendingSession(null)}
          onReview={(sessionId) => {
            setReportSessionId(sessionId)
            navigate('report')
          }}
        />
      ) : null}

      {route === 'mock' ? (
        <MockPage
          profileId={profileId}
          onCompleted={() => void afterSession()}
          onNavigate={navigate}
          pending={pendingSession}
          onPendingConsumed={() => setPendingSession(null)}
          onReview={(sessionId) => {
            setReportSessionId(sessionId)
            navigate('report')
          }}
        />
      ) : null}

      {route === 'progress' ? (
        <ProgressPage
          sessions={sessions}
          attempts={attempts}
          onNavigate={navigate}
          onReview={(sessionId) => {
            setReportSessionId(sessionId)
            navigate('report')
          }}
        />
      ) : null}

      {route === 'mistakes' ? (
        <MistakesPage
          profileId={profileId}
          onNavigate={navigate}
          onCompleted={() => void afterSession()}
        />
      ) : null}

      {route === 'foglio' ? <AnswerSheetPage onNavigate={navigate} /> : null}

      {route === 'report' && reportSessionId ? (
        <ReportPage
          sessionId={reportSessionId}
          onNavigate={(target) => navigate(target)}
        />
      ) : null}

      {route === 'guide' ? (
        <GuidePage
          onNavigate={navigate}
          onPracticePhase={(phase, skill) => {
            setPendingSession({ mode: skill, phase })
            navigate('practice')
          }}
        />
      ) : null}

      {route === 'settings' ? (
        <SettingsPage
          profile={profile}
          onChanged={() => void refresh()}
          onNavigate={navigate}
          theme={theme}
          onThemeChange={setTheme}
          syncStatus={displaySyncStatus}
          onSyncNow={runSync}
        />
      ) : null}

      <UpdateBanner
        state={pwaState}
        onApply={() => {
          void updateWorker.current?.(true)
        }}
        onDismiss={() => setPwaState('none')}
      />
    </AppShell>
  )
}
