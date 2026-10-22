import { BookOpen, Check, Clock, FileText, Headphones, MessageSquare, PenLine } from 'lucide-react'
import { Alert, BackButton, Card, CollapsibleCard } from '../components/ui'
import type { Route } from '../lib/routes'
import {
  PASS_THRESHOLD_PER_SKILL,
  PASS_THRESHOLD_TOTAL,
  POINTS_PER_SKILL,
  TOTAL_POINTS,
} from '../lib/scoring'

/**
 * Guia de uso da app.
 *
 * A aluna abre a app para uma pergunta — "se fizesse a prova amanhã, passava?"
 * — e este ecrã responde à outra: "como é que uso isto?".
 */
export function GuidePage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton onBack={() => onNavigate('dashboard')} />
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-teal-700 dark:text-teal-300" />
          <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Como usar a app
          </h1>
        </div>
        <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Esta app não é um curso de italiano: é um simulador da prova oficial. Serve para te dizer
          se passarias amanhã, qual é a tua abilità mais fraca e quanto tempo te falta.
        </p>
      </Card>

      {/* 1. Começar */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          1 · Começar em 5 minutos
        </p>
        <ol className="mt-2 flex flex-col gap-2">
          {[
            {
              title: 'Marca a data da prova',
              detail: 'Ajustes → Data da prova. As 3 fases de preparação são calculadas a partir dela.',
              route: 'settings' as Route,
              cta: 'Abrir Ajustes',
            },
            {
              title: 'Escolhe o tema (claro / escuro / sistema)',
              detail: 'O botão no canto superior direito muda o aspeto; a escolha fica guardada.',
              route: 'settings' as Route,
              cta: 'Abrir Ajustes',
            },
            {
              title: 'Treina uma habilidade',
              detail:
                'Prática → Ascolto (6 min). O áudio só pode ser ouvido 2 vezes, como na prova — a transcrição só aparece depois de responder.',
              route: 'practice' as Route,
              cta: 'Ir para Prática',
            },
            {
              title: 'Faz o simulado completo',
              detail:
                'Simulado → começar. São 30 min de ascolto, 40 de lettura e 40 de scrittura, cronometrados, com a prova oficial de exemplo.',
              route: 'mock' as Route,
              cta: 'Ir para Simulado',
            },
            {
              title: 'Lê o veredito no Painel',
              detail:
                'O Painel mostra a prontidão por abilità, o abilità de risco e o gráfico de evolução em Progresso.',
              route: 'dashboard' as Route,
              cta: 'Voltar ao Painel',
            },
          ].map((step, index) => (
            <li
              key={step.title}
              className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">{step.title}</p>
                <p className="mt-0.5 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                  {step.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(step.route)}
                className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-black text-slate-700 shadow-sm hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200"
              >
                {step.cta}
              </button>
            </li>
          ))}
        </ol>
      </Card>

      {/* 2. A prova num relance */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          2 · A prova num relance
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {[
            {
              icon: <Headphones size={16} />,
              name: 'Ascolto',
              points: '30 min · 12 pontos',
              detail: 'Prova 1: 6 scelta multipla (3 opções, 1 pt). Prova 2: 12 vero/falso (0,5 pt).',
            },
            {
              icon: <FileText size={16} />,
              name: 'Lettura e riflessione grammaticale',
              points: '40 min · 12 pontos',
              detail: 'Prova 1: 12 vero/falso (0,5 pt). Prova 2: 6 cloze (1 pt).',
            },
            {
              icon: <PenLine size={16} />,
              name: 'Produzione scritta',
              points: '40 min · 12 pontos',
              detail: 'Escolhes 1 dos 2 temas. 80-120 palavras, grelha oficial de 5 critérios.',
            },
            {
              icon: <MessageSquare size={16} />,
              name: 'Produzione orale',
              points: '~10 min · 12 pontos',
              detail: 'Apresentação de 1 min + conversa de 2-3 min, grelha oficial de 4 critérios.',
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40"
            >
              <p className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-slate-100">
                <span className="text-teal-700 dark:text-teal-300">{item.icon}</span>
                {item.name}
              </p>
              <p className="mt-0.5 text-[11px] font-black text-teal-700 dark:text-teal-300">
                {item.points}
              </p>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs font-bold text-slate-500">
          Total: {TOTAL_POINTS} pontos ({POINTS_PER_SKILL} por abilità) e 36 itens objetivos.
        </p>
      </Card>

      {/* 3. As regras de aprovação */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          3 · As regras que decidem a aprovação
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <Alert tone="teal" title="Sufficienza em TODAS as abilità">
            Precisas de pelo menos {PASS_THRESHOLD_PER_SKILL}/{POINTS_PER_SKILL} em cada uma das 4
            abilità (o que dá {PASS_THRESHOLD_TOTAL}/{TOTAL_POINTS} no total). Uma abilità abaixo do
            limiar não é "recuperável" — obriga a refazer a prova inteira.
          </Alert>
          <Alert tone="rose" title="Sem capitalização">
            Não se guardam as abilità que passaram. Por isso o Painel nunca mostra "3 de 4 ok" como
            algo parcial: ou as quatro estão acima da sufficienza, ou tens de repetir tudo.
          </Alert>
          <Alert tone="amber" title="Erro e omissão valem 0">
            Não há penalização negativa, mas uma pergunta em branco é um ponto perdido.
          </Alert>
        </div>
      </Card>

      {/* 4. Cada ecrã */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          4 · O que há em cada ecrã
        </p>

        <CollapsibleCard title="Painel" icon={<Check size={16} />}>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <li>
              <strong>Primeiros passos</strong>: a sequência para ter a primeira leitura fiável da
              tua pontuação.
            </li>
            <li>
              <strong>Prontidão para a prova</strong>: a média recente de cada abilità, a margem
              sobre a sufficienza e a abilità de risco.
            </li>
            <li>
              <strong>Tarefa de hoje</strong>: o que fazer agora, consoante a fase em que estás.
            </li>
            <li>
              <strong>As 3 fases</strong>: Fondazione (A1) → Struttura (A2) → Cittadinanza (B1),
              calculadas a partir da data da prova.
            </li>
          </ul>
        </CollapsibleCard>

        <CollapsibleCard title="Prática" icon={<Check size={16} />}>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            Treina uma abilità de cada vez, com os tempos e os pesos oficiais. Serve para
            ambientar-te ao formato antes do simulado. Uma prática também conta como prova
            (fica no histórico).
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="Simulado" icon={<Clock size={16} />}>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            A prova completa, cronometrada: ascolto (30 min) → lettura (40 min) → scrittura
            (40 min). Depois de fechares uma prova não voltas atrás (section lock), como no
            exame. A prova oral é marcada à parte.
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="Progresso" icon={<Check size={16} />}>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            O gráfico da evolução (pontuação de cada prova ao longo do tempo), as médias por
            abilità e o histórico completo das provas concluídas.
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="Ajustes" icon={<Check size={16} />}>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            Perfil e data da prova, tema claro/escuro, cópia de segurança (exportar/importar JSON),
            snapshots locais automáticos, sync por Gist (outros aparelhos) e limpeza de sessões por
            terminar.
          </p>
        </CollapsibleCard>
      </div>

      {/* 5. Detalhes */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          5 · Detalhes que contam na prova
        </p>

        <CollapsibleCard title="O protocolo do ascolto (2 reproduções)" icon={<Headphones size={16} />}>
          <ol className="flex list-decimal flex-col gap-1 pl-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <li>Ascoltas a Prova 1 (1ª vez).</li>
            <li>2 minutos para ler as perguntas.</li>
            <li>Ascoltas a Prova 1 (2ª vez) — depois o áudio bloqueia.</li>
            <li>2 minutos de revisão.</li>
            <li>Repetes o ciclo para a Prova 2.</li>
            <li>3 minutos finais para escrever as risposte no foglio.</li>
          </ol>
          <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Na app o áudio é sintetizado pela voz italiana do sistema — é a transcrição oficial do
            CILS que está a ser lida. A transcrição só aparece depois de responderes, como no
            papel.
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="A scrittura (80-120 palavras)" icon={<PenLine size={16} />}>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            Escolhes 1 dos 2 temas (os dois aparecem juntos, como no foglio oficial). A app conta as
            palavras em tempo real e avisa se ficares fora do intervalo — mas deixa submeter na
            mesma, porque o examinador não recusa o texto, penaliza a clareza. Auto-avalias com a
            grelha oficial de 5 critérios (eficácia comunicativa, adequação estilística, correção
            morfosintática, riqueza lexical, ortografia e pontuação).
          </p>
        </CollapsibleCard>

        <CollapsibleCard title="A orale (1 min + 2-3 min)" icon={<MessageSquare size={16} />}>
          <p className="text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
            Não é um monólogo. Primeiro apresentas-te (nome, idade, de onde vieste, onde vives,
            trabalho ou estudos) em ~1 minuto; depois o examinador escolhe um tema e faz-te mais
            perguntas durante 2-3 minutos. Os temas oficiais incluem città/campagna, cultura,
            assistenza sanitaria e documenti per la cittadinanza.
          </p>
        </CollapsibleCard>
      </div>

      {/* 6. Dados */}
      <Card>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          6 · Os teus dados
        </p>
        <ul className="mt-2 flex flex-col gap-1.5 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          <li>
            <strong>Tudo fica no aparelho.</strong> A app não tem servidor nem conta de utilizador.
          </li>
          <li>
            <strong>Snapshots locais.</strong> O progresso é copiado automaticamente para o
            browser (até 8 cópias). Se limpares os dados, consegues restaurar de Ajustes.
          </li>
          <li>
            <strong>Sync por Gist (opcional).</strong> Com um token do GitHub (permissão{' '}
            <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">gist</code>) o progresso
            viaja para o outro aparelho. O token só é guardado neste dispositivo e a nuvem fica
            <strong> verde</strong> quando o sync está OK, <strong> laranja</strong> quando não
            está.
          </li>
          <li>
            <strong>Provas concluídas são imutáveis.</strong> Nenhuma limpeza as apaga.
          </li>
        </ul>
      </Card>
    </div>
  )
}
