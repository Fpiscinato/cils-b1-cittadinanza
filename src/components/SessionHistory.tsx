import { useMemo, useState } from 'react'
import { ChevronDown, History } from 'lucide-react'
import type { Attempt, Session } from '../db/schemas'
import { Card } from './ui'
import { formatDuration } from '../lib/timing'
import {
  SESSION_KIND_DOT,
  SESSION_KIND_LABELS,
  buildSessionSummaries,
  groupSummariesByDay,
  type SessionSummary,
} from '../lib/sessionSummary'
import { SKILL_LABELS, TOTAL_POINTS } from '../lib/scoring'

/**
 * Histórico de sessões do Progresso.
 *
 * Uma linha por sessão (estudo, prática ou simulado) com data, duração,
 * acertos/erros e a bolinha da cor do gráfico. Agrupado por dia e recolhido
 * por dia: só os dois dias mais recentes abrem, o resto fica num clique.
 */
export function SessionHistory({
  sessions,
  attempts,
  onReview,
  defaultOpenDays = 2,
}: {
  sessions: Session[]
  attempts: Attempt[]
  onReview: (sessionId: string) => void
  /** Quantos dias recentes aparecem abertos (o resto fecha). */
  defaultOpenDays?: number
}) {
  const groups = useMemo(() => groupSummariesByDay(buildSessionSummaries(sessions, attempts)), [
    sessions,
    attempts,
  ])

  return (
    <Card>
      <div className="flex items-center gap-2">
        <History size={18} className="text-teal-700 dark:text-teal-300" />
        <p className="text-sm font-black text-slate-900 dark:text-slate-100">Últimas sessões</p>
      </div>
      <p className="mt-1 text-[11px] font-semibold text-slate-500">
        Tudo o que você já fez, por dia. Os dias mais antigos ficam recolhidos.
      </p>

      {groups.length === 0 ? (
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Ainda não há sessões concluídas. Comece pelo estudo de hoje no Painel.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {groups.map((group, index) => (
            <DayGroup
              key={group.key}
              label={group.label}
              summaries={group.summaries}
              initiallyOpen={index < defaultOpenDays}
              onReview={onReview}
            />
          ))}
        </div>
      )}
    </Card>
  )
}

function DayGroup({
  label,
  summaries,
  initiallyOpen,
  onReview,
}: {
  label: string
  summaries: SessionSummary[]
  initiallyOpen: boolean
  onReview: (sessionId: string) => void
}) {
  const [open, setOpen] = useState(initiallyOpen)
  const correct = summaries.reduce((sum, entry) => sum + entry.correct, 0)
  const wrong = summaries.reduce((sum, entry) => sum + entry.wrong, 0)

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="text-xs font-black text-slate-800 dark:text-slate-100">{label}</span>
        <span className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
          {summaries.length} sessão(ões) · {correct} ✓ · {wrong} ✗
          <ChevronDown
            size={14}
            className={`transition ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open ? (
        <ul className="flex flex-col gap-1 px-2 pb-2">
          {summaries.map((summary) => (
            <SessionRow key={summary.session.id} summary={summary} onReview={onReview} />
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function SessionRow({
  summary,
  onReview,
}: {
  summary: SessionSummary
  onReview: (sessionId: string) => void
}) {
  const { session, kind, correct, wrong } = summary
  const time = new Date(session.startedAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/40">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            title={SESSION_KIND_LABELS[kind]}
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${SESSION_KIND_DOT[kind]}`}
          />
          <span className="truncate text-xs font-black text-slate-900 dark:text-slate-100">
            {session.title || SESSION_KIND_LABELS[kind]}
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-black tabular-nums text-slate-500">
          {kind === 'mock' && session.score !== null ? `${session.score}/${TOTAL_POINTS}` : ''}
        </span>
      </div>
      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 pl-4.5 text-[11px] font-semibold text-slate-500">
        <span className="font-black text-slate-600 dark:text-slate-300">
          {SESSION_KIND_LABELS[kind]}
        </span>
        <span>
          {time} · {formatDuration(session.totalTimeSeconds)}
        </span>
        <span className="text-emerald-700 dark:text-emerald-300">{correct} acerto(s)</span>
        <span className="text-rose-700 dark:text-rose-300">{wrong} erro(s)</span>
      </p>
      {session.perSkill ? (
        <p className="mt-0.5 pl-4.5 text-[10px] font-semibold text-slate-500">
          {Object.entries(session.perSkill)
            .map(
              ([skill, score]) =>
                `${SKILL_LABELS[skill as keyof typeof SKILL_LABELS]?.pt ?? skill}: ${score}/12`,
            )
            .join(' · ')}
        </p>
      ) : null}
      {kind !== 'study' ? (
        <button
          type="button"
          onClick={() => onReview(session.id)}
          className="ml-4 mt-1 rounded-lg bg-white px-2 py-1 text-[10px] font-black text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
        >
          Rever a prova
        </button>
      ) : null}
    </li>
  )
}
