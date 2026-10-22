/**
 * Conteúdo por fase — gramática do Sillabo e vocabulário civic/burocrático.
 *
 * Lê do banco (o mesmo que o `syncQuestionBank` semeia) e mostra, por fase:
 * - as regras de gramática com exemplos traduzidos;
 * - o vocabulário com uma frase de exemplo.
 *
 * É a ponte entre o plano de estudos (as 3 fases) e a prática: cada fase tem
 * botões para treinar só o material desse tema.
 */

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Languages, MessageSquare, Volume2 } from 'lucide-react'
import { db } from '../db/database'
import { PHASES, type GrammarItem, type Phase, type VocabItem } from '../db/schemas'
import { PHASE_FOCUS, PHASE_TITLES } from '../lib/phases'
import { Card, CollapsibleCard } from './ui'

export function PhaseContent({
  onPractice,
}: {
  /** Começa uma prática só com o material da fase. */
  onPractice: (phase: Phase, skill: 'ascolto' | 'lettura') => void
}) {
  const [grammar, setGrammar] = useState<GrammarItem[]>([])
  const [vocab, setVocab] = useState<VocabItem[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [grammarItems, vocabItems] = await Promise.all([
        db.grammarItems.toArray(),
        db.vocabItems.toArray(),
      ])
      if (cancelled) return
      setGrammar(grammarItems)
      setVocab(vocabItems)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const byPhase = useMemo(() => {
    const map: Record<Phase, { grammar: GrammarItem[]; vocab: VocabItem[] }> = {
      fondazione: { grammar: [], vocab: [] },
      struttura: { grammar: [], vocab: [] },
      cittadinanza: { grammar: [], vocab: [] },
    }
    for (const item of grammar) map[item.phase].grammar.push(item)
    for (const item of vocab) map[item.phase].vocab.push(item)
    return map
  }, [grammar, vocab])

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-teal-700 dark:text-teal-300" />
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Conteúdo por fase
          </h2>
        </div>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          A gramática vem do Sillabo B1 Cittadinanza (a lista oficial de estruturas que a
          examinadora pode cobrar). O vocabulário é o dos contextos do exame: vida quotidiana,
          escritórios, assistência sanitária e cultura.
        </p>
      </Card>

      {PHASES.map((phase) => {
        const content = byPhase[phase]
        return (
          <section key={phase} className="flex flex-col gap-3">
            <Card className="border-l-4 border-l-teal-600">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {PHASE_TITLES[phase]}
              </p>
              <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
                {PHASE_FOCUS[phase]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onPractice(phase, 'ascolto')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
                >
                  <Volume2 size={14} /> Treinar ascolto
                </button>
                <button
                  type="button"
                  onClick={() => onPractice(phase, 'lettura')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100"
                >
                  <BookOpen size={14} /> Treinar lettura
                </button>
              </div>
            </Card>

            <CollapsibleCard
              title={`Gramática (${content.grammar.length})`}
              icon={<Languages size={16} />}
            >
              {content.grammar.length === 0 ? (
                <p className="text-xs font-semibold text-slate-500">Sem itens de gramática.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {content.grammar.map((item) => (
                    <li key={item.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
                      <p className="text-[11px] font-black uppercase tracking-wide text-teal-700 dark:text-teal-300">
                        {item.topic} · {item.level}
                      </p>
                      <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-200">
                        {item.rule}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-500">
                        {item.explanationPt}
                      </p>
                      <ul className="mt-2 flex flex-col gap-1">
                        {item.examples.map((example) => (
                          <li
                            key={example.it}
                            className="rounded-lg bg-white p-2 dark:bg-slate-800"
                          >
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {example.it}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-500">
                              {example.pt}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleCard>

            <CollapsibleCard
              title={`Vocabulário (${content.vocab.length})`}
              icon={<MessageSquare size={16} />}
            >
              {content.vocab.length === 0 ? (
                <p className="text-xs font-semibold text-slate-500">Sem vocabulário.</p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {content.vocab.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40"
                    >
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {item.it}
                      </p>
                      <p className="text-[11px] font-bold text-teal-700 dark:text-teal-300">
                        {item.pt}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {item.example}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">{item.examplePt}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleCard>
          </section>
        )
      })}
    </div>
  )
}
