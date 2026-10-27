import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  BookOpenCheck,
  ClipboardCheck,
  Dices,
  GraduationCap,
  Layers,
  ListChecks,
  Volume2,
} from 'lucide-react'
import { ExamSession } from '../components/exam/ExamSession'
import { LearnPanel } from '../components/LearnPanel'
import { StudyPicker } from '../components/StudyPicker'
import { buildStudyOptions, type StudyRequest } from '../lib/study'
import { buildLevelProgress, nextLevel, recommendLevel } from '../lib/studyPlan'
import { readStudyLevel, storeStudyLevel } from '../lib/studyLevel'
import { Button, Card, CollapsibleCard } from '../components/ui'
import { EXAM_CONFIGS } from '../lib/exam'
import type { BuildOptions } from '../lib/examBuilder'
import type { Attempt, ExamMode, Level, Phase } from '../db/schemas'
import type { Route } from '../lib/routes'
import { PHASE_FOCUS, PHASE_TITLES } from '../lib/phases'

/**
 * Uma prova pedida noutra tela (painel, conteúdo por fase).
 *
 * `null` = nenhum pedido pendente. Quando existe, a tela abre a prova
 * DIRECTAMENTE — a aluna não tem de voltar a clicar.
 */
export interface PendingSession {
  mode: ExamMode
  phase?: Phase
  /** Opções de montagem (nível, origem, limite) — usadas pelo estudo. */
  buildOptions?: BuildOptions
}

/**
 * PRÁTICA — a tela única para treinar.
 *
 * Duas portas, por ordem de importância:
 * 1. **Estudar**: o percurso por nível (A1 → A2 → B1), com exercícios de
 *    apostila (completar frases e vocabulário), ascolto e lettura;
 * 2. **Perguntas de prova**: o treino no formato do exame.
 *
 * Só o bloco de estudo aparece aberto; o resto fica recolhido (regra de UX:
 * a tela não pode ser um muro de opções).
 */
export function PracticePage({
  profileId,
  attempts,
  onCompleted,
  onNavigate,
  pending,
  onPendingConsumed,
  onReview,
  onSessionChange,
}: {
  profileId: string
  attempts: Attempt[]
  onCompleted: () => void
  onNavigate: (route: Route) => void
  /** Prova pedida noutra tela — abre directamente. */
  pending: PendingSession | null
  onPendingConsumed: () => void
  /** Abra o relatório da prova (rever e enviar à professora). */
  onReview?: (sessionId: string) => void
  /** Avisa o App de que há uma sessão a correr (para a barra "Continuar"). */
  onSessionChange?: (active: boolean) => void
}) {
  // A prova pedida noutra tela entra pelo estado inicial: a tela é montada
  // quando se chega do painel, por isso o arranque é imediato (sem flash).
  const [mode, setMode] = useState<ExamMode | null>(
    pending && pending.mode !== 'mock_cittadinanza' ? pending.mode : null,
  )
  const [phase, setPhase] = useState<Phase | undefined>(pending?.phase)
  const [buildOptions, setBuildOptions] = useState<BuildOptions | undefined>(
    pending?.buildOptions,
  )
  const [study, setStudy] = useState<StudyRequest | null>(null)
  const [sessionTitle, setSessionTitle] = useState<string | undefined>(undefined)
  const [level, setLevel] = useState<Level>(
    () => pending?.buildOptions?.level ?? readStudyLevel(),
  )
  const [learnOpen, setLearnOpen] = useState(false)
  /** A sessão já terminou (ecrã de resultado): deixa de ser "sessão em curso". */
  const [finished, setFinished] = useState(false)

  const levelProgress = useMemo(() => buildLevelProgress({ attempts }), [attempts])
  const suggestedLevel = recommendLevel(levelProgress)
  const upcoming = nextLevel(level)

  /**
   * O tela fica SEMPRE montado (para a sessão não morrer ao mudar de aba).
   * Por isso a prova pedida noutra tela chega por efeito, não só no arranque.
   */
  useEffect(() => {
    if (!pending || pending.mode === 'mock_cittadinanza') return
    setMode(pending.mode)
    setPhase(pending.phase)
    setBuildOptions(pending.buildOptions)
    setSessionTitle(undefined)
    setStudy(null)
    setFinished(false)
    if (pending.buildOptions?.level) setLevel(pending.buildOptions.level)
    onPendingConsumed()
  }, [pending, onPendingConsumed])

  const inSession = (mode !== null || study !== null) && !finished
  useEffect(() => {
    onSessionChange?.(inSession)
  }, [inSession, onSessionChange])

  function chooseLevel(next: Level): void {
    setLevel(next)
    storeStudyLevel(next)
  }

  function startStudy(request: StudyRequest): void {
    chooseLevel(request.level)
    setFinished(false)
    setStudy(request)
  }

  /**
   * Mix rápido = sessão de PRÁTICA (barra azul, entra no gráfico como
   * prática), 10 perguntas de lettura do nível, sempre diferente.
   */
  function startMix(): void {
    setPhase(undefined)
    setBuildOptions({
      bank: 'all',
      level,
      shuffle: true,
      limit: 10,
    })
    setSessionTitle(`Mix rápido — ${level}`)
    setFinished(false)
    setMode('lettura')
  }

  function clearExam(): void {
    setMode(null)
    setPhase(undefined)
    setBuildOptions(undefined)
    setSessionTitle(undefined)
    setFinished(false)
    onPendingConsumed()
  }

  if (mode) {
    return (
      <ExamSession
        mode={mode}
        profileId={profileId}
        phase={phase}
        buildOptions={buildOptions}
        title={sessionTitle}
        onReview={onReview}
        onSaved={() => {
          setFinished(true)
          onCompleted()
        }}
        onExit={clearExam}
        onCompleted={() => {
          clearExam()
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
        buildOptions={buildStudyOptions(study)}
        onExit={() => setStudy(null)}
        onSaved={() => {
          setFinished(true)
          onCompleted()
        }}
        onCompleted={() => {
          setStudy(null)
          onNavigate('dashboard')
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <ArrowLeft size={14} /> Voltar ao painel
        </button>
      </div>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Prática</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
          O que quer fazer hoje?
        </p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Continue seu percurso por nível — ou treine perguntas no formato do exame. Só a
          seção que você precisa fica aberta.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-900 dark:bg-teal-950/60 dark:text-teal-200">
            Nível atual: {level}
          </span>
          {levelProgress[level].answered > 0 ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {levelProgress[level].accuracy}% de acerto
            </span>
          ) : null}
          {suggestedLevel !== level && levelProgress[level].mastered && upcoming ? (
            <button
              type="button"
              onClick={() => chooseLevel(upcoming)}
              className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white hover:bg-emerald-700"
            >
              Subir para {upcoming} →
            </button>
          ) : null}
        </div>
      </Card>

      {/* 1. Estudar — o percurso por nível, aberto por omissão */}
      <CollapsibleCard
        title={`Estudar — nível ${level}`}
        defaultOpen
        icon={<GraduationCap size={16} />}
        badge={
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {levelProgress[level].percent}%
          </span>
        }
      >
        <StudyPicker
          level={level}
          stats={levelProgress}
          onLevelChange={chooseLevel}
          onStart={startStudy}
        />

        <button
          type="button"
          onClick={() => setLearnOpen((value) => !value)}
          aria-expanded={learnOpen}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-teal-300 bg-teal-50 px-3 py-2.5 text-xs font-black text-teal-900 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200 dark:hover:bg-teal-950"
        >
          <BookOpenCheck size={15} />
          {learnOpen ? 'Fechar as palavras' : `Aprender palavras de ${level} (com tradução)`}
        </button>
        {learnOpen ? (
          <div className="mt-3">
            <LearnPanel level={level} />
          </div>
        ) : null}
      </CollapsibleCard>

      {/* 2. Perguntas de prova — recolhido */}
      <CollapsibleCard
        title="Perguntas de prova"
        icon={<ClipboardCheck size={16} />}
        badge={
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 dark:bg-slate-700 dark:text-slate-200">
            cronometrado
          </span>
        }
      >
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          O formato do exame, cronometrado: uma prova de 18 perguntas tirada do banco completo. A
          escuta tem áudio com duas reproduções; a leitura tem verdadeiro/falso e lacunas.
        </p>

        <button
          type="button"
          onClick={startMix}
          className="mt-3 w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
        >
          <Dices size={16} className="mr-1 inline" /> Mix rápido — perguntas de {level}
        </button>

        <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-500">
          Prova completa de uma habilidade
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(['ascolto', 'lettura', 'scrittura', 'orale'] as const).map((item) => {
            const config = EXAM_CONFIGS[item]
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setPhase(undefined)
                  setBuildOptions(undefined)
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

        <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">
          Praticar só o material de uma fase
        </p>
        <div className="mt-2 flex flex-col gap-2">
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
                    setBuildOptions(undefined)
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
                    setBuildOptions(undefined)
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

      <CollapsibleCard title="Como funciona a prova de escuta" icon={<ListChecks size={16} />}>
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Na prova oficial cada texto é ouvido <strong>duas vezes</strong>. Depois da 1ª audição
          tem 2 minutos para ler as perguntas, depois da 2ª mais 2 minutos para conferir, e no
          fim 3 minutos para escrever as respostas no foglio delle risposte. A app reproduz este
          protocolo: o botão de áudio bloqueia ao fim da 2ª passagem.
        </p>
      </CollapsibleCard>

      <CollapsibleCard title="Sobre a prova e os pontos" icon={<Layers size={16} />}>
        <ul className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <li>• Escute: 6 perguntas de escolha múltipla (1 pt) + 12 de verdadeiro/falso (0,5 pt).</li>
          <li>• Leitura: 12 de verdadeiro/falso (0,5 pt) + 6 de completar o texto (1 pt).</li>
          <li>• Escrita: 80-120 palavras, avaliada com a grelha oficial de 5 critérios.</li>
          <li>• Oral: apresentação de 1 min + conversa de 2-3 min, grelha oficial de 4 critérios.</li>
        </ul>
      </CollapsibleCard>
    </div>
  )
}
