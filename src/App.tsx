import { useCallback, useEffect, useState } from 'react'
import { AppShell, type Route } from './components/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { PracticePage } from './pages/PracticePage'
import { MockPage } from './pages/MockPage'
import { ProgressPage } from './pages/ProgressPage'
import { SettingsPage } from './pages/SettingsPage'
import { db } from './db/database'
import { initializeDatabase } from './db/database'
import { syncQuestionBank } from './db/seed'
import { ensureDefaultProfile, getActiveProfileId } from './lib/admin'
import { loadProfileHistory } from './services/sessions'
import type { Attempt, Profile, Session } from './db/schemas'

const ROUTES: Route[] = ['dashboard', 'practice', 'mock', 'progress', 'settings']

function routeFromHash(): Route {
  const hash = window.location.hash.replace('#/', '')
  return (ROUTES as string[]).includes(hash) ? (hash as Route) : 'dashboard'
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])

  const refresh = useCallback(async () => {
    const profileId = getActiveProfileId()
    const [current, history] = await Promise.all([
      db.profiles.get(profileId),
      loadProfileHistory(profileId),
    ])
    setProfile(current ?? null)
    setSessions(history.sessions)
    setAttempts(history.attempts)
  }, [])

  useEffect(() => {
    async function bootstrap() {
      await initializeDatabase()
      await syncQuestionBank()
      await ensureDefaultProfile()
      await refresh()
      setReady(true)
    }
    void bootstrap()
  }, [refresh])

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function navigate(next: Route): void {
    window.location.hash = `#/${next}`
    setRoute(next)
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-sm font-bold text-slate-500 dark:bg-slate-900">
        A carregar…
      </div>
    )
  }

  const profileId = profile?.id ?? getActiveProfileId()

  return (
    <AppShell route={route} onNavigate={navigate}>
      {route === 'dashboard' ? (
        <DashboardPage
          profile={profile}
          sessions={sessions}
          attempts={attempts}
          onStart={(mode) => {
            navigate(mode === 'mock_cittadinanza' ? 'mock' : 'practice')
          }}
        />
      ) : null}

      {route === 'practice' ? (
        <PracticePage profileId={profileId} onCompleted={() => void refresh()} />
      ) : null}

      {route === 'mock' ? (
        <MockPage profileId={profileId} onCompleted={() => void refresh()} />
      ) : null}

      {route === 'progress' ? (
        <ProgressPage sessions={sessions} attempts={attempts} />
      ) : null}

      {route === 'settings' ? (
        <SettingsPage profile={profile} onChanged={() => void refresh()} />
      ) : null}
    </AppShell>
  )
}
