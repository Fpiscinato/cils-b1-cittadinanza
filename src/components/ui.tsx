import type { ReactNode } from 'react'
import { useState } from 'react'

export const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`${cardClass} ${className}`}>{children}</div>
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50'
  const styles: Record<string, string> = {
    primary: 'bg-teal-700 text-white hover:bg-teal-800',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function ProgressBar({
  percent,
  tone = 'teal',
}: {
  percent: number
  tone?: 'teal' | 'emerald' | 'amber' | 'rose'
}) {
  const tones: Record<string, string> = {
    teal: 'bg-teal-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-600',
  }
  const safe = Math.max(0, Math.min(100, Math.round(percent)))
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
      <div className={`h-full rounded-full ${tones[tone]} transition-all`} style={{ width: `${safe}%` }} />
    </div>
  )
}

/** Card colapsável, fechado por padrão (regra de UX do ElevenSpark). */
export function CollapsibleCard({
  title,
  icon,
  badge,
  children,
}: {
  title: string
  icon?: ReactNode
  badge?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <section className={cardClass}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-slate-100">
          {icon}
          {title}
        </span>
        <span className="flex items-center gap-2">
          {badge}
          <span className="text-slate-400">{open ? '▲' : '▼'}</span>
        </span>
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </section>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-xl font-black text-slate-900 dark:text-slate-100">{value}</p>
      {hint ? <p className="text-[11px] font-semibold text-slate-500">{hint}</p> : null}
    </div>
  )
}

export function Alert({
  tone = 'amber',
  title,
  children,
}: {
  tone?: 'amber' | 'rose' | 'teal'
  title?: string
  children: ReactNode
}) {
  const tones: Record<string, string> = {
    amber: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100',
    rose: 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-100',
    teal: 'border-teal-300 bg-teal-50 text-teal-900 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-100',
  }
  return (
    <div className={`rounded-xl border p-3 text-xs font-semibold leading-relaxed ${tones[tone]}`}>
      {title ? <p className="mb-1 text-sm font-black">{title}</p> : null}
      {children}
    </div>
  )
}
