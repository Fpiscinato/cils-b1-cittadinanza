import { useState } from 'react'
import { ExamSession } from '../components/exam/ExamSession'
import { Button, Card, CollapsibleCard } from '../components/ui'
import { EXAM_CONFIGS } from '../lib/exam'
import type { ExamMode } from '../db/schemas'

/**
 * Página de prática — "action first": o botão de começar fica no PRIMEIRO
 * card, com o resumo da seleção logo abaixo. O resto vive em cards
 * colapsáveis, fechados por padrão (regra herdada do ElevenSpark).
 */
export function PracticePage({
  profileId,
  onCompleted,
}: {
  profileId: string
  onCompleted: () => void
}) {
  const [mode, setMode] = useState<ExamMode | null>(null)

  if (mode) {
    return (
      <ExamSession
        mode={mode}
        profileId={profileId}
        onExit={() => setMode(null)}
        onCompleted={() => {
          setMode(null)
          onCompleted()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Escolha</p>
        <p className="mt-1 text-base font-black text-slate-900 dark:text-slate-100">
          Prova de prática · CILS B1 Cittadinanza
        </p>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Escolhe a habilidade que queres treinar. Os tempos e os pesos de ponto são os da prova
          oficial.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(['ascolto', 'lettura', 'scrittura', 'orale'] as const).map((item) => {
            const config = EXAM_CONFIGS[item]
            return (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
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

      <CollapsibleCard title="📋 Como funciona a prova de escuta">
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Na prova oficial cada texto é ouvido <strong>duas vezes</strong>. Depois da 1ª audição tens
          2 minutos para ler as perguntas, depois da 2ª mais 2 minutos para conferir, e no fim 3
          minutos para escrever as respostas no foglio delle risposte. A app reproduz este
          protocolo: o botão de áudio bloqueia ao fim da 2ª passagem.
        </p>
      </CollapsibleCard>

      <CollapsibleCard title="🧾 Foglio delle risposte (OMR)">
        <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Na prova real tens de escrever as respostas na folha oficial com caneta azul ou preta. As
          perguntas de escuta e de leitura têm 3 opções (A/B/C) ou verdadeiro/falso, e o gabarito
          ofuscado segue exatamente o layout do original.
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
        <Button variant="secondary" onClick={onCompleted}>
          Voltar ao painel
        </Button>
      </Card>
    </div>
  )
}
