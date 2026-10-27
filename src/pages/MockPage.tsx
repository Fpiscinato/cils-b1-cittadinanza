import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ExamSession } from '../components/exam/ExamSession'
import { Button, Card } from '../components/ui'
import { EXAM_CONFIGS } from '../lib/exam'
import type { ExamMode } from '../db/schemas'
import type { Route } from '../lib/routes'
import type { PendingSession } from './PracticePage'
import { SESSION_KIND_THEME, type SessionKind } from '../lib/sessionSummary'

/**
 * Página de simulados. O simulado completo replica a prova escrita real:
 * ascolto (30 min) → lettura (40 min) → produzione scritta (40 min), com
 * section lock (não se volta atrás) e a oral marcada à parte.
 */
export function MockPage({
  profileId,
  onCompleted,
  onNavigate,
  pending,
  onPendingConsumed,
  onReview,
  onSessionChange,
}: {
  profileId: string
  onCompleted: () => void
  onNavigate: (route: Route) => void
  /** Simulado pedido noutra tela — abre directamente. */
  pending: PendingSession | null
  onPendingConsumed: () => void
  onReview?: (sessionId: string) => void
  /** Avisa o App do tipo de sessão a correr (para a barra "Continuar" com a cor certa). */
  onSessionChange?: (kind: SessionKind | null) => void
}) {
  const [mode, setMode] = useState<ExamMode | null>(
    pending?.mode === 'mock_cittadinanza' ? 'mock_cittadinanza' : null,
  )
  const [finished, setFinished] = useState(false)

  // O tela fica sempre montado (a sessão não pode morrer ao mudar de aba).
  useEffect(() => {
    if (pending?.mode !== 'mock_cittadinanza') return
    setFinished(false)
    setMode('mock_cittadinanza')
    onPendingConsumed()
  }, [pending, onPendingConsumed])

  useEffect(() => {
    onSessionChange?.(mode !== null && !finished ? 'mock' : null)
  }, [mode, finished, onSessionChange])

  if (mode) {
    return (
      <ExamSession
        mode={mode}
        profileId={profileId}
        onReview={onReview}
        onSaved={() => {
          setFinished(true)
          onCompleted()
        }}
        onExit={() => {
          setMode(null)
          setFinished(false)
          onPendingConsumed()
          onCompleted()
        }}
        onCompleted={() => {
          setMode(null)
          onPendingConsumed()
          onNavigate('dashboard')
        }}
      />
    )
  }

  const full = EXAM_CONFIGS.mock_cittadinanza

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="mb-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <ArrowLeft size={14} /> Voltar ao painel
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">
            Simulado completo
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ${SESSION_KIND_THEME.mock.chip}`}
          >
            <span className={`h-2 w-2 rounded-full ${SESSION_KIND_THEME.mock.dot}`} /> Simulado
          </span>
        </div>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">{full.titlePt}</p>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{full.subtitlePt}</p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          {full.blurbPt}
        </p>
        <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">
          O simulado é sempre <strong className="text-amber-700 dark:text-amber-300">âmbar</strong> em
          todo o app (gráfico, histórico e menus) — é a única atividade que conta para o veredito de
          prontidão.
        </p>
        <button
          type="button"
          onClick={() => {
            setFinished(false)
            setMode('mock_cittadinanza')
          }}
          className={`mt-3 w-full rounded-xl px-4 py-3 text-sm font-black sm:w-auto ${SESSION_KIND_THEME.mock.button}`}
        >
          ▶️ Começar o simulado completo
        </button>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              Foglio delle risposte
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              A folha oficial em A4, para escrever as respostas à mão como no dia do exame.
            </p>
          </div>
          <Button variant="secondary" onClick={() => onNavigate('foglio')}>
            📄 Abrir e imprimir
          </Button>
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Ou simula uma prova só
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(['ascolto', 'lettura', 'scrittura', 'orale'] as const).map((item) => {
            const config = EXAM_CONFIGS[item]
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setFinished(false)
                  setMode(item)
                }}
                className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-amber-400 dark:border-slate-700"
              >
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {config.titlePt}
                </p>
                <p className="text-[11px] font-bold text-slate-500">{config.subtitlePt}</p>
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Como corrigir</p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          A app usa os pesos e as rubricas <strong>oficiais</strong> do CILS. A prova de oral é
          marcada com a grelha oficial, como na prova real. O resultado de cada prova fica salvo
          no histórico e nunca é apagado automaticamente.
        </p>
        <div className="mt-3">
          <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft size={16} /> Voltar ao painel
          </Button>
        </div>
      </Card>
    </div>
  )
}
