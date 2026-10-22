import { useState } from 'react'
import { ExamSession } from '../components/exam/ExamSession'
import { Button, Card } from '../components/ui'
import { EXAM_CONFIGS } from '../lib/exam'
import type { ExamMode } from '../db/schemas'

/**
 * Página de simulados. O simulado completo replica a prova escrita real:
 * ascolto (30 min) → lettura (40 min) → produzione scritta (40 min), com
 * section lock (não se volta atrás) e a oral marcada à parte.
 */
export function MockPage({
  profileId,
  onCompleted,
}: {
  profileId: string
  onCompleted: () => void
}) {
  const [mode, setMode] = useState<ExamMode | null>(null)

  if (mode) {
    return (
      <ExamSession
        mode={mode}
        profileId={profileId}
        onExit={() => setMode(null)}
        onCompleted={() => {
          setMode(null)
          onCompleted()
        }}
      />
    )
  }

  const full = EXAM_CONFIGS.mock_cittadinanza

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Simulado completo</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">{full.titlePt}</p>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{full.subtitlePt}</p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          {full.blurbPt}
        </p>
        <button
          type="button"
          onClick={() => setMode('mock_cittadinanza')}
          className="mt-3 w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800 sm:w-auto"
        >
          ▶️ Começar o simulado completo
        </button>
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
                onClick={() => setMode(item)}
                className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-teal-500 dark:border-slate-700"
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
          marcada com a grelha oficial, como na prova real. O resultado de cada prova fica guardado
          no histórico e nunca é apagado automaticamente.
        </p>
        <div className="mt-3">
          <Button variant="secondary" onClick={onCompleted}>
            Voltar ao painel
          </Button>
        </div>
      </Card>
    </div>
  )
}
