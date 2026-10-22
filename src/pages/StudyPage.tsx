import { useState } from 'react'
import { ArrowLeft, BookOpen, Dices, Layers, Volume2 } from 'lucide-react'
import { Card } from '../components/ui'
import { ExamSession } from '../components/exam/ExamSession'
import type { Level, Phase, Skill } from '../db/schemas'
import type { Route } from '../lib/routes'
import { PHASE_LABELS } from '../lib/phases'

/**
 * ESTUDO POR NÍVEL — o "treinar um bocado por dia".
 *
 * A aluna escolhe:
 * - o **nível** (A1, A2, B1) — o banco tem material de todos;
 * - o **tipo de material**:
 *   · "Exercícios" (gramática e vocabulário) — o mais rápido;
 *   · "Ascolto" — com áudio;
 *   · "Lettura" — leitura e gramática.
 *
 * O quiz é sempre **aleatório**: o baralhador tira itens diferentes a cada
 * sessão (pode repetir, mas só depois de o banco ser grande).
 */

export type StudyKind = 'exercises' | 'ascolto' | 'lettura'

export interface StudyRequest {
  level: Level
  kind: StudyKind
  phase?: Phase
}

const LEVELS: Array<{ id: Level; label: string; detail: string }> = [
  { id: 'A1', label: 'A1', detail: 'O básico: ser e estar, artigos, vida quotidiana.' },
  { id: 'A2', label: 'A2', detail: 'Estruturas: passado, futuro, pronomes, comparativos.' },
  { id: 'B1', label: 'B1', detail: 'Nível do exame: condicional, subordinadas, registo.' },
]

const KINDS: Array<{ id: StudyKind; label: string; detail: string; icon: typeof Dices }> = [
  {
    id: 'exercises',
    label: 'Exercícios',
    detail: 'Gramática e vocabulário do Sillabo, com explicação depois de cada resposta.',
    icon: Layers,
  },
  {
    id: 'ascolto',
    label: 'Ascolto',
    detail: 'Textos com áudio (2 reproduções, como no exame).',
    icon: Volume2,
  },
  {
    id: 'lettura',
    label: 'Lettura',
    detail: 'Leitura e riflessione grammaticale (verdadeiro/falso e lacunas).',
    icon: BookOpen,
  },
]

export function StudyPage({
  profileId,
  onNavigate,
  onCompleted,
}: {
  profileId: string
  onNavigate: (route: Route) => void
  onCompleted: () => void
}) {
  const [level, setLevel] = useState<Level>('B1')
  const [kind, setKind] = useState<StudyKind>('exercises')
  const [phase, setPhase] = useState<Phase | undefined>(undefined)
  const [request, setRequest] = useState<StudyRequest | null>(null)

  if (request) {
    return (
      <ExamSession
        mode="studio"
        profileId={profileId}
        buildOptions={{
          bank: 'all',
          level: request.level,
          phase: request.phase,
          skill: studySkill(request.kind),
          shuffle: true,
          limit: 12,
        }}
        onExit={() => setRequest(null)}
        onCompleted={() => {
          setRequest(null)
          onCompleted()
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
        <div className="flex items-center gap-2">
          <Dices size={20} className="text-teal-700 dark:text-teal-300" />
          <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Estudo por nível
          </h1>
        </div>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Um exercício curto e <strong>aleatório</strong>: as perguntas são sempre baralhadas e
          tiradas do banco grande. Pode repetir — mas só depois de passar por muitas outras.
        </p>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">1 · Nível</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {LEVELS.map((item) => {
            const active = level === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLevel(item.id)}
                aria-pressed={active}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/30'
                    : 'border-slate-200 hover:border-teal-400 dark:border-slate-700'
                }`}
              >
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold leading-snug text-slate-600 dark:text-slate-300">
                  {item.detail}
                </p>
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          2 · O que queres treinar
        </p>
        <div className="mt-2 grid gap-2">
          {KINDS.map((item) => {
            const active = kind === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setKind(item.id)}
                aria-pressed={active}
                className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/30'
                    : 'border-slate-200 hover:border-teal-400 dark:border-slate-700'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-slate-900 dark:text-slate-100">
                    {item.label}
                  </span>
                  <span className="block text-[11px] font-semibold leading-snug text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          3 · Fase (opcional)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPhase(undefined)}
            aria-pressed={phase === undefined}
            className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
              phase === undefined
                ? 'border-teal-600 bg-teal-700 text-white'
                : 'border-slate-200 text-slate-700 hover:border-teal-400 dark:border-slate-700 dark:text-slate-200'
            }`}
          >
            Todas as fases
          </button>
          {(['fondazione', 'struttura', 'cittadinanza'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPhase(item)}
              aria-pressed={phase === item}
              className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
                phase === item
                  ? 'border-teal-600 bg-teal-700 text-white'
                  : 'border-slate-200 text-slate-700 hover:border-teal-400 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              {PHASE_LABELS[item]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRequest({ level, kind, phase })}
          className="mt-4 w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800 disabled:opacity-50"
        >
          🎲 Começar o estudo de {level}
        </button>
        <p className="mt-1 text-[11px] font-semibold text-slate-500">
          10-15 itens · ~10 minutos · com explicação depois de cada resposta
        </p>
      </Card>

      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Porque é que a Prática e o Simulado são diferentes
        </p>
        <ul className="mt-2 flex flex-col gap-1.5 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          <li>
            <strong>Estudo</strong> — 10-15 itens aleatórios do nível escolhido, para treinar
            todos os dias sem pressão.
          </li>
          <li>
            <strong>Prática</strong> — a prova de uma habilidade, cronometrada como no exame
            (30 ou 40 min), também com material baralhado.
          </li>
          <li>
            <strong>Simulado</strong> — a prova oficial do CILS, completa, na ordem e nos
            tempos exatos (30 + 40 + 40 min). É o ensaio do dia do exame.
          </li>
        </ul>
      </Card>
    </div>
  )
}

/** Tipo de habilidade que o estudo vai treinar. */
function studySkill(kind: StudyKind): Skill {
  return kind === 'ascolto' ? 'ascolto' : 'lettura'
}
