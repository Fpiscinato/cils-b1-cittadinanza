import type { ReadinessReport } from '../lib/readiness'
import { skillPercent } from '../lib/readiness'
import { PASS_THRESHOLD_PER_SKILL, SKILL_LABELS } from '../lib/scoring'
import { Alert, Card, ProgressBar } from './ui'

/**
 * Dashboard de prontidão.
 *
 * A regra que governa esta tela: não há capitalização neste nível. Uma
 * habilidade abaixo da sufficienza significa REFAZER A PROVA INTEIRA — por isso
 * o cartão nunca mostra "3 de 4 ok" como algo parcial.
 */
export function ReadinessCard({ report }: { report: ReadinessReport }) {
  const tone =
    report.verdict === 'ready' ? 'teal' : report.verdict === 'close' ? 'amber' : 'rose'

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Prontidão para a prova
          </h2>
          <p className="text-xs font-bold text-slate-500">
            Sufficienza = {PASS_THRESHOLD_PER_SKILL}/12 em cada uma das 4 habilidades
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            tone === 'teal'
              ? 'bg-teal-700 text-white'
              : tone === 'amber'
                ? 'bg-amber-500 text-white'
                : 'bg-rose-600 text-white'
          }`}
        >
          {report.verdict === 'ready' ? 'PRONTA' : report.verdict === 'close' ? 'QUASE' : 'AINDA NÃO'}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {report.verdictPt}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {report.skills.map((entry) => {
          const isRisk = report.riskSkill === entry.skill && !report.verdictPt.startsWith('Pronta')
          return (
            <div key={entry.skill} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {SKILL_LABELS[entry.skill].it}
                </p>
                <p className="text-sm font-black tabular-nums text-slate-700 dark:text-slate-200">
                  {entry.samples > 0 ? `${entry.average}/12` : '—'}
                </p>
              </div>
              <p className="mb-2 text-[11px] font-semibold text-slate-500">
                {SKILL_LABELS[entry.skill].pt}
                {isRisk ? ' · abilidade de risco' : ''}
              </p>
              <ProgressBar
                percent={skillPercent(entry.average)}
                tone={entry.passed ? 'emerald' : 'rose'}
              />
              <p className="mt-1 text-[11px] font-bold text-slate-500">
                {entry.samples === 0
                  ? 'Sem provas registradas ainda.'
                  : entry.passed
                    ? `Margem: +${entry.margin} pontos sobre a sufficienza`
                    : `Faltam ${Math.abs(entry.margin)} ponto(s) para a sufficienza`}
              </p>
            </div>
          )
        })}
      </div>

      {report.mustRetakeWholeExam ? (
        <div className="mt-3">
          <Alert tone="rose" title="Atenção: sem capitalização">
            O CILS B1 Cittadinanza <strong>não permite guardar</strong> as habilidades que passaram.
            Se uma ficar abaixo da sufficienza, a prova inteira tem de ser refeita na sessão
            seguinte — por isso o objetivo é passar <strong>as quatro</strong>.
          </Alert>
        </div>
      ) : null}
    </Card>
  )
}
