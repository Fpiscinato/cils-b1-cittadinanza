import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ExamSession } from '../components/exam/ExamSession'
import { Button, Card, CollapsibleCard } from '../components/ui'
import { EXAM_CONFIGS } from '../lib/exam'
import type { ExamMode, Phase } from '../db/schemas'
import type { Route } from '../lib/routes'
import { PHASE_FOCUS, PHASE_LABELS, PHASE_TITLES } from '../lib/phases'

/**
 * Uma prova pedida noutro ecrã (painel, conteúdo por fase, estudo).
 *
 * `null` = nenhum pedido pendente. Quando existe, o ecrã abre a prova
 * DIRECTAMENTE — a aluna não tem de voltar a clicar.
 */
export interface PendingSession {
  mode: ExamMode
  phase?: Phase
}

/**
 * Página de prática — "action first": o botão de começar fica no PRIMEIRO
 * card, com o resumo da seleção logo abaixo. O resto vive em cards
 * colapsáveis, fechados por padrão (regra herdada do ElevenSpark).
 */
export function PracticePage({
  profileId,
  onCompleted,
  onNavigate,
  pending,
  onPendingConsumed,
  onReview,
}: {
  profileId: string
  onCompleted: () => void
  onNavigate: (route: Route) => void
  /** Prova pedida noutro ecrã — abre directamente. */
  pending: PendingSession | null
  onPendingConsumed: () => void
  onReview?: (sessionId: string) => void
}) {
  // A prática por fase entra pelo estado inicial: o ecrã é montado quando se
  // chega do Conteúdo, por isso o arranque é imediato (sem flash).
  const [mode, setMode] = useState<ExamMode | null>(pending?.mode ?? null)
  const [phase, setPhase] = useState<Phase | undefined>(pending?.phase)

  if (mode) {
    return (
      <ExamSession
        mode={mode}
        profileId={profileId}
        phase={phase}
        onReview={onReview}
        onExit={() => {
          setMode(null)
          setPhase(undefined)
          onPendingConsumed()
        }}
        onCompleted={() => {
          setMode(null)
          setPhase(undefined)
          onPendingConsumed()
          onCompleted()
          onNavigate('dashboard')
        }}
      />
    )
  }

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
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Escolha</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
          Prova de prática · CILS B1 Cittadinanza
        </p>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Escolhe a habilidade que queres treinar. Os tempos e os pesos de ponto são os da prova
          oficial.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
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

      <CollapsibleCard title="📋 Como funciona a prova de escuta">
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Na prova oficial cada texto é ouvido <strong>duas vezes</strong>. Depois da 1ª audição tens
          2 minutos para ler as perguntas, depois da 2ª mais 2 minutos para conferir, e no fim 3
          minutos para escrever as respostas no foglio delle risposte. A app reproduz este
          protocolo: o botão de áudio bloqueia ao fim da 2ª passagem.
        </p>
      </CollapsibleCard>

      <CollapsibleCard title="🧾 Foglio delle risposte (OMR)">
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Na prova real tens de escrever as respostas na folha oficial com caneta azul ou preta. As
          perguntas de escuta e de leitura têm 3 opções (A/B/C) ou verdadeiro/falso, e o gabarito
          ofuscado segue exatamente o layout do original.
        </p>
      </CollapsibleCard>

      <CollapsibleCard title="📖 Sobre a prova e os pontos">
        <ul className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <li>• Escuta: 6 perguntas de escolha múltipla (1 pt) + 12 de verdadeiro/falso (0,5 pt).</li>
          <li>• Leitura: 12 de verdadeiro/falso (0,5 pt) + 6 de completar o texto (1 pt).</li>
          <li>• Escrita: 80-120 palavras, avaliada com a grelha oficial de 5 critérios.</li>
          <li>• Oral: apresentação de 1 min + conversa de 2-3 min, grelha oficial de 4 critérios.</li>
        </ul>
      </CollapsibleCard>

      <CollapsibleCard title="🎯 Prática por fase">
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Treina só o material da fase em que estás. O conteúdo extra da app (textos de
          escuta, de leitura e de gramática) é original e foi escrito para este nível.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {(['fondazione', 'struttura', 'cittadinanza'] as const).map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
              <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                {PHASE_TITLES[item]}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                {PHASE_FOCUS[item]}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => {
                    setPhase(item)
                    setMode('ascolto')
                  }}
                >
                  ⚡ Ascolto
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => {
                    setPhase(item)
                    setMode('lettura')
                  }}
                >
                  📖 Lettura
                </Button>
                <span className="self-center text-[10px] font-bold text-slate-500">
                  {PHASE_LABELS[item]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      <Card>
        <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft size={16} /> Voltar ao painel
        </Button>
      </Card>
    </div>
  )
}
