import { useMemo, useState } from 'react'
import { ChevronDown, ChevronsDownUp, ChevronsUpDown, History } from 'lucide-react'
import type { Attempt, Session } from '../db/schemas'
import { Card } from './ui'
import { formatDuration } from '../lib/timing'
import {
  SESSION_KIND_ORDER,
  SESSION_KIND_THEME,
  buildSessionSummaries,
  countSessionsByKind,
  groupSummariesByDay,
  kindsInGroup,
  type SessionKind,
  type SessionSummary,
} from '../lib/sessionSummary'
import { SKILL_LABELS, TOTAL_POINTS } from '../lib/scoring'

type KindFilter = SessionKind | 'all'

/** "1 sessão" / "3 sessões" — sem o feio "sessão(ões)". */
function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

/**
 * Histórico de sessões do Progresso.
 *
 * Uma linha por sessão encerrada (estudo, prática ou simulado) com data,
 * duração, acertos/erros e a cor do tipo. O cartão abre SEMPRE recolhido: os
 * dias ficam fechados e cada um abre num clique (o cabeçalho do dia já mostra
 * as bolinhas dos tipos que lá estão, para o simulado não passar despercebido).
 *
 * Os filtros (Todas / Estudo / Prática / Simulado) são também a legenda das
 * cores usadas no gráfico e nos menus.
 */
export function SessionHistory({
  sessions,
  attempts,
  onReview,
}: {
  sessions: Session[]
  attempts: Attempt[]
  onReview: (sessionId: string) => void
}) {
  const [filter, setFilter] = useState<KindFilter>('all')
  const [expandAll, setExpandAll] = useState(false)
  const [expandVersion, setExpandVersion] = useState(0)

  const summaries = useMemo(() => buildSessionSummaries(sessions, attempts), [sessions, attempts])
  const counts = useMemo(() => countSessionsByKind(summaries), [summaries])
  const filtered = useMemo(
    () => (filter === 'all' ? summaries : summaries.filter((entry) => entry.kind === filter)),
    [summaries, filter],
  )
  const groups = useMemo(() => groupSummariesByDay(filtered), [filtered])

  function toggleAll(): void {
    setExpandAll((value) => !value)
    // Remonta os dias com o novo estado inicial (sem efeitos de sincronização).
    setExpandVersion((value) => value + 1)
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-slate-100">
            <History size={18} className="text-slate-500" />
            Últimas sessões
          </p>
          <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">
            Tudo o que você já fez, por dia. Os dias ficam fechados — clique num para abrir.
          </p>
        </div>
        {groups.length > 0 ? (
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 px-2 py-1.5 text-[11px] font-black text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {expandAll ? <ChevronsDownUp size={13} /> : <ChevronsUpDown size={13} />}
            {expandAll ? 'Fechar todos' : 'Abrir todos'}
          </button>
        ) : null}
      </div>

      {/* Filtros = legenda das cores (a mesma do gráfico e dos menus) */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar sessões">
        <button
          type="button"
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className={`rounded-full px-2.5 py-1 text-[11px] font-black transition ${
            filter === 'all'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          Todas <span className="tabular-nums opacity-70">{summaries.length}</span>
        </button>
        {SESSION_KIND_ORDER.map((kind) => {
          const theme = SESSION_KIND_THEME[kind]
          const active = filter === kind
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setFilter((value) => (value === kind ? 'all' : kind))}
              aria-pressed={active}
              title={`Mostrar só ${theme.label.toLowerCase()}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black transition ${
                active
                  ? `${theme.chip} ring-2 ring-current`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
              {theme.label}
              <span className="tabular-nums opacity-70">{counts[kind]}</span>
            </button>
          )
        })}
      </div>

      {summaries.length === 0 ? (
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Ainda não há sessões encerradas. Comece pelo estudo de hoje no Painel.
        </p>
      ) : groups.length === 0 ? (
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Nenhuma sessão de{' '}
          {filter === 'all' ? 'nenhum tipo' : SESSION_KIND_THEME[filter].label.toLowerCase()} por
          aqui. Toque em “Todas” para ver o resto.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {groups.map((group) => (
            <DayGroup
              // A chave inclui o filtro: ao filtrar, os dias que têm esse tipo
              // abrem já expandidos (filtrar e continuar fechado não serve de nada).
              key={`${group.key}-${expandVersion}-${filter}`}
              label={group.label}
              summaries={group.summaries}
              initiallyOpen={expandAll || filter !== 'all'}
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
  const interrupted = summaries.filter((entry) => !entry.completed).length
  const kinds = kindsInGroup(summaries)

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-1 px-3 py-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-xs font-black text-slate-800 dark:text-slate-100">
            {label}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {kinds.map((kind) => (
              <span
                key={kind}
                aria-hidden="true"
                title={SESSION_KIND_THEME[kind].label}
                className={`h-2 w-2 rounded-full ${SESSION_KIND_THEME[kind].dot}`}
              />
            ))}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-[11px] font-bold text-slate-500">
          <span>
            {plural(summaries.length, 'sessão', 'sessões')} · {correct} ✓ · {wrong} ✗
            {interrupted > 0 ? ` · ${plural(interrupted, 'interrompida', 'interrompidas')}` : ''}
          </span>
          <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
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
  const { session, kind, completed, correct, wrong, answered } = summary
  const theme = SESSION_KIND_THEME[kind]
  const time = new Date(session.startedAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <li
      className={`rounded-lg border-l-4 bg-slate-50 px-3 py-2 dark:bg-slate-700/40 ${theme.border} ${
        completed ? '' : 'opacity-80'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            title={theme.label}
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.dot}`}
          />
          <span className="truncate text-xs font-black text-slate-900 dark:text-slate-100">
            {session.title || theme.label}
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-black tabular-nums text-slate-500">
          {completed && kind === 'mock' && session.score !== null
            ? `${session.score}/${TOTAL_POINTS}`
            : ''}
        </span>
      </div>

      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 pl-4.5 text-[11px] font-semibold text-slate-500">
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${theme.chip}`}>
          {theme.label}
        </span>
        {!completed ? (
          <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-black text-slate-600 dark:bg-slate-600 dark:text-slate-100">
            Interrompida
          </span>
        ) : null}
        <span>
          {time} · durou {formatDuration(session.totalTimeSeconds)}
        </span>
        {answered > 0 ? (
          <>
            <span className="text-emerald-700 dark:text-emerald-300">
              {plural(correct, 'acerto', 'acertos')}
            </span>
            <span className="text-rose-700 dark:text-rose-300">
              {plural(wrong, 'erro', 'erros')}
            </span>
          </>
        ) : (
          <span>sem respostas</span>
        )}
      </p>

      {completed && session.perSkill ? (
        <p className="mt-0.5 pl-4.5 text-[10px] font-semibold text-slate-500">
          {Object.entries(session.perSkill)
            .map(
              ([skill, score]) =>
                `${SKILL_LABELS[skill as keyof typeof SKILL_LABELS]?.pt ?? skill}: ${score}/12`,
            )
            .join(' · ')}
        </p>
      ) : null}

      {!completed ? (
        <p className="mt-0.5 pl-4.5 text-[10px] font-semibold text-slate-500">
          As respostas contam no gráfico de atividade, mas a sessão não conta como prova.
        </p>
      ) : null}

      {completed && kind !== 'study' ? (
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
