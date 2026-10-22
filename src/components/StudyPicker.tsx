import { useState } from 'react'
import { BookOpen, Dices, Layers, Volume2 } from 'lucide-react'
import type { Level, Phase } from '../db/schemas'
import { PHASE_LABELS } from '../lib/phases'

/**
 * Escolha do material de ESTUDO (o "treinar um bocado por dia").
 *
 * Vive dentro do ecrã de Prática: a aluna escolhe o nível, o tipo de
 * material e, se quiser, a fase. O quiz é sempre aleatório.
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

export function StudyPicker({
  onStart,
}: {
  onStart: (request: StudyRequest) => void
}) {
  const [level, setLevel] = useState<Level>('B1')
  const [kind, setKind] = useState<StudyKind>('exercises')
  const [phase, setPhase] = useState<Phase | undefined>(undefined)

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Nível</p>
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
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          O que queres treinar
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
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Fase (opcional)
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
          onClick={() => onStart({ level, kind, phase })}
          className="mt-3 w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
        >
          🎲 Começar o estudo de {level}
        </button>
        <p className="mt-1 text-[11px] font-semibold text-slate-500">
          10-15 itens · ~10 minutos · com explicação depois de cada resposta
        </p>
      </div>
    </div>
  )
}
