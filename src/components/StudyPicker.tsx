import { useState } from 'react'
import { BookOpen, Check, Layers, Volume2 } from 'lucide-react'
import { LEVELS, type Level } from '../db/schemas'
import { LEVEL_FOCUS, LEVEL_LABELS, nextLevel, type LevelProgress } from '../lib/studyPlan'
import type { StudyKind, StudyRequest } from '../lib/study'
import { Alert, ProgressBar } from './ui'

/**
 * O percurso de estudo por nível (A1 → A2 → B1).
 *
 * Cada nível mostra o progresso real (respostas + precisão) e o tipo de
 * material. O quiz é sempre aleatório: o banco de estudo tem centenas de
 * exercícios de completar frases, por isso cada dia é diferente.
 */

const KINDS: Array<{
  id: StudyKind
  label: string
  detail: string
  icon: typeof Layers
}> = [
  {
    id: 'exercises',
    label: 'Exercícios',
    detail: 'Completar frases e vocabulário',
    icon: Layers,
  },
  {
    id: 'ascolto',
    label: 'Ascolto',
    detail: 'Ouvir textos do nível',
    icon: Volume2,
  },
  {
    id: 'lettura',
    label: 'Lettura',
    detail: 'Ler textos do nível',
    icon: BookOpen,
  },
]

export function StudyPicker({
  level,
  stats,
  onLevelChange,
  onStart,
}: {
  level: Level
  stats: Record<Level, LevelProgress>
  onLevelChange: (level: Level) => void
  onStart: (request: StudyRequest) => void
}) {
  const [kind, setKind] = useState<StudyKind>('exercises')
  const current = stats[level]
  const next = nextLevel(level)
  const kindLabel = KINDS.find((item) => item.id === kind)?.label.toLowerCase() ?? kind

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Nível</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {LEVELS.map((item) => {
            const active = level === item
            const entry = stats[item]
            return (
              <button
                key={item}
                type="button"
                onClick={() => onLevelChange(item)}
                aria-pressed={active}
                className={`rounded-xl border p-2.5 text-left transition ${
                  active
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/30'
                    : 'border-slate-200 hover:border-teal-400 dark:border-slate-700'
                }`}
              >
                <span className="flex items-center justify-between gap-1">
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {item}
                  </span>
                  {entry.mastered ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-[10px] font-bold text-slate-500">
                  {entry.answered > 0 ? `${entry.accuracy}% · ${entry.answered} resp.` : 'sem dados'}
                </span>
                <span className="mt-1.5 block">
                  <ProgressBar percent={entry.percent} tone={entry.mastered ? 'emerald' : 'teal'} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          O que queres treinar
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {KINDS.map((item) => {
            const active = kind === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setKind(item.id)}
                aria-pressed={active}
                className={`rounded-xl border p-2.5 text-left transition ${
                  active
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/30'
                    : 'border-slate-200 hover:border-teal-400 dark:border-slate-700'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon size={15} />
                </span>
                <span className="mt-1 block text-xs font-black text-slate-900 dark:text-slate-100">
                  {item.label}
                </span>
                <span className="block text-[10px] font-semibold leading-snug text-slate-500">
                  {item.detail}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
        <p className="text-xs font-black text-slate-900 dark:text-slate-100">{LEVEL_LABELS[level]}</p>
        <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          {LEVEL_FOCUS[level]}
        </p>
        <p className="mt-1 text-[11px] font-bold text-slate-500">
          {kind === 'exercises' ? 12 : 10} itens · ~10 minutos · explicação depois de cada resposta
        </p>
      </div>

      {current.mastered && next ? (
        <Alert tone="teal" title={`Nível ${level} dominado`}>
          Já tens respostas e precisão suficientes para subir. O próximo nível é <strong>{next}</strong>
          — podes escolhê-lo acima quando quiseres.
        </Alert>
      ) : null}

      <button
        type="button"
        onClick={() => onStart({ level, kind })}
        className="w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-black text-white hover:bg-teal-800"
      >
        ▶️ Começar {kindLabel} de {level}
      </button>
    </div>
  )
}
