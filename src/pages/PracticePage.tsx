import { useState } from 'react'
import { ArrowLeft, BookOpen, ClipboardCheck, Dices, GraduationCap, Layers, Volume2 } from 'lucide-react'
import { ExamSession } from '../components/exam/ExamSession'
import { StudyPicker, type StudyRequest } from '../components/StudyPicker'
import { studySkill } from '../lib/study'
import { Button, Card, CollapsibleCard } from '../components/ui'
import { EXAM_CONFIGS } from '../lib/exam'
import type { ExamMode, Phase } from '../db/schemas'
import type { Route } from '../lib/routes'
import { PHASE_FOCUS, PHASE_TITLES } from '../lib/phases'

/**
 * Uma prova pedida noutro ecrã (painel, conteúdo por fase).
 *
 * `null` = nenhum pedido pendente. Quando existe, o ecrã abre a prova
 * DIRECTAMENTE — a aluna não tem de voltar a clicar.
 */
export interface PendingSession {
  mode: ExamMode
  phase?: Phase
}

/**
 * PRÁTICA — o ecrã único para treinar.
 *
 * Tem as três-portas do "treinar um bocado por dia":
 * 1. **Estudo rápido**: quiz aleatório do nível escolhido (A1/A2/B1);
 * 2. **Prova de uma habilidade**: a prova completa de uma abilità, cronometrada;
 * 3. **Prática por fase**: só o material do tema que estás a estudar.
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
  /** Abre o relatório da prova (rever e enviar à professora). */
  onReview?: (sessionId: string) => void
}) {
  // A prova pedida noutro ecrã entra pelo estado inicial: o ecrã é montado
  // quando se chega do painel, por isso o arranque é imediato (sem flash).
  const [mode, setMode] = useState<ExamMode | null>(pending?.mode ?? null)
  const [phase, setPhase] = useState<Phase | undefined>(pending?.phase)
  const [study, setStudy] = useState<StudyRequest | null>(null)

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

  if (study) {
    return (
      <ExamSession
        mode="studio"
        profileId={profileId}
        buildOptions={{
          bank: 'all',
          level: study.level,
          phase: study.phase,
          skill: studySkill(study.kind),
          shuffle: true,
          limit: 12,
        }}
        onExit={() => setStudy(null)}
        onCompleted={() => {
          setStudy(null)
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
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Prática</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
          O que queres treinar hoje?
        </p>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Estudo rápido para todos os dias, a prova de uma habilidade, ou só o material de uma
          fase do plano.
        </p>
      </Card>

      {/* 1. Estudo rápido (aleatório, por nível) */}
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Dices size={18} className="text-teal-700 dark:text-teal-300" />
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
            1 · Estudo rápido (aleatório)
          </p>
        </div>
        <StudyPicker
          onStart={(request) => {
            setStudy(request)
          }}
        />
      </Card>

      {/* 2. Prova de uma habilidade */}
      <Card>
        <div className="mb-2 flex items-center gap-2">
          <GraduationCap size={18} className="text-teal-700 dark:text-teal-300" />
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
            2 · Prova de uma habilidade
          </p>
        </div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Cronometrada como no exame, com o material baralhado.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(['ascolto', 'lettura', 'scrittura', 'orale'] as const).map((item) => {
            const config = EXAM_CONFIGS[item]
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setPhase(undefined)
                  setMode(item)
                }}
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

      {/* 3. Prática por fase */}
      <CollapsibleCard title="3 · Prática por fase" icon={<Layers size={16} />}>
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Treina só o material do tema em que estás. O conteúdo extra da app (textos de escuta, de
          leitura e de gramática) é original e foi escrito para este nível.
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
                  <Volume2 size={14} /> Ascolto
                </Button>
                <Button
                  variant="secondary"
                  className="px-3 py-1.5 text-xs"
                  onClick={() => {
                    setPhase(item)
                    setMode('lettura')
                  }}
                >
                  <BookOpen size={14} /> Lettura
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleCard>

      <CollapsibleCard title="📋 Como funciona a prova de escuta" icon={<ClipboardCheck size={16} />}>
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Na prova oficial cada texto é ouvido <strong>duas vezes</strong>. Depois da 1ª audição tens
          2 minutos para ler as perguntas, depois da 2ª mais 2 minutos para conferir, e no fim 3
          minutos para escrever as respostas no foglio delle risposte. A app reproduz este
          protocolo: o botão de áudio bloqueia ao fim da 2ª passagem.
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

      <Card>
        <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft size={16} /> Voltar ao painel
        </Button>
      </Card>
    </div>
  )
}
