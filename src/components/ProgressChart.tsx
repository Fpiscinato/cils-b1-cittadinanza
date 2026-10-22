import type { SeriesPoint } from '../lib/chart'

/**
 * Gráfico de evolução (SVG puro — sem dependências externas, 100% offline).
 *
 * Mostra a pontuação de cada prova concluída ao longo do tempo, com a linha
 * do limiar de aprovação. É o "acompanhar a evolução" pedido pela aluna.
 */
export function ProgressChart({
  points,
  max,
  threshold,
  thresholdLabel,
  emptyText = 'Ainda não há provas concluídas para desenhar o gráfico.',
}: {
  points: SeriesPoint[]
  max: number
  threshold?: number
  thresholdLabel?: string
  emptyText?: string
}) {
  if (points.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl bg-slate-50 p-4 text-center text-xs font-semibold text-slate-500 dark:bg-slate-700/40">
        {emptyText}
      </div>
    )
  }

  const width = 600
  const height = 200
  const padding = { top: 16, right: 16, bottom: 28, left: 34 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const x = (index: number): number =>
    points.length === 1
      ? padding.left + innerW / 2
      : padding.left + (index / (points.length - 1)) * innerW
  const y = (value: number): number =>
    padding.top + innerH - (Math.max(0, Math.min(value, max)) / max) * innerH

  const line = points.map((point, index) => `${x(index).toFixed(1)},${y(point.value).toFixed(1)}`)
  const area = `${padding.left},${padding.top + innerH} ${line.join(' ')} ${x(points.length - 1).toFixed(1)},${padding.top + innerH}`

  const gridValues = [0, max / 2, max]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Gráfico da evolução das provas"
    >
      {/* Grelha horizontal */}
      {gridValues.map((value) => (
        <g key={value}>
          <line
            x1={padding.left}
            y1={y(value)}
            x2={width - padding.right}
            y2={y(value)}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={1}
          />
          <text
            x={padding.left - 6}
            y={y(value) + 4}
            textAnchor="end"
            className="fill-slate-400 text-[10px] font-bold"
          >
            {value}
          </text>
        </g>
      ))}

      {/* Limiar de aprovação */}
      {threshold !== undefined && threshold <= max ? (
        <g>
          <line
            x1={padding.left}
            y1={y(threshold)}
            x2={width - padding.right}
            y2={y(threshold)}
            className="stroke-rose-400"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          {thresholdLabel ? (
            <text
              x={width - padding.right}
              y={y(threshold) - 5}
              textAnchor="end"
              className="fill-rose-500 text-[10px] font-black"
            >
              {thresholdLabel}
            </text>
          ) : null}
        </g>
      ) : null}

      {/* Área e linha */}
      <polygon points={area} className="fill-teal-500/10" />
      <polyline
        points={line.join(' ')}
        fill="none"
        className="stroke-teal-600 dark:stroke-teal-400"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Pontos */}
      {points.map((point, index) => (
        <g key={point.id}>
          <circle
            cx={x(index)}
            cy={y(point.value)}
            r={4}
            className="fill-white stroke-teal-600 dark:fill-slate-900 dark:stroke-teal-400"
            strokeWidth={2}
          >
            <title>{`${point.label}: ${point.value}`}</title>
          </circle>
        </g>
      ))}

      {/* Rótulos do eixo X (primeiro e último) */}
      {points.length > 0 ? (
        <>
          <text
            x={padding.left}
            y={height - 8}
            className="fill-slate-400 text-[10px] font-bold"
          >
            {points[0]?.label}
          </text>
          {points.length > 1 ? (
            <text
              x={width - padding.right}
              y={height - 8}
              textAnchor="end"
              className="fill-slate-400 text-[10px] font-bold"
            >
              {points[points.length - 1]?.label}
            </text>
          ) : null}
        </>
      ) : null}
    </svg>
  )
}
