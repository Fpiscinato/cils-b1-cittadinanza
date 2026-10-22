/**
 * Lista de "primeiros passos" do painel.
 *
 * O painel tem de responder a uma pergunta simples: "o que faço agora?".
 * Estes passos são a sequência mínima para ter a primeira leitura fiável da
 * pontuação. Cada passo aponta para o ecrã onde se resolve.
 */

import type { Route } from './routes'

export interface OnboardingStep {
  id: string
  title: string
  detail: string
  done: boolean
  route: Route
  cta: string
}

export interface OnboardingInput {
  /** Data da prova marcada (vazio = ainda não marcada). */
  examDate: string
  /** Número de provas concluídas. */
  completedSessions: number
  /** Já exportou um backup manual em algum momento? */
  hasBackup: boolean
  /** Já ativou o sync por Gist? */
  hasSync: boolean
}

export function buildOnboardingSteps(input: OnboardingInput): OnboardingStep[] {
  return [
    {
      id: 'exam-date',
      title: 'Marca a data da prova',
      detail:
        'As 3 fases de preparação são calculadas a partir do teu prazo. Sem data, a app não sabe o que recomendar para hoje.',
      done: input.examDate !== '',
      route: 'settings',
      cta: 'Abrir Ajustes',
    },
    {
      id: 'first-practice',
      title: 'Faz a primeira prática',
      detail:
        'Treina uma habilidade de cada vez (6 min de ascolto, 5 min de lettura) para veres o formato das perguntas e o áudio com as 2 reproduções.',
      done: input.completedSessions >= 1,
      route: 'practice',
      cta: 'Ir para Prática',
    },
    {
      id: 'first-mock',
      title: 'Faz o simulado completo',
      detail:
        'A prova oficial de exemplo, cronometrada (30 + 40 + 40 min) com o gabarito real do CILS. É o teu primeiro veredito.',
      done: input.completedSessions >= 2,
      route: 'mock',
      cta: 'Ir para Simulado',
    },
    {
      id: 'backup',
      title: 'Guarda uma cópia de segurança',
      detail:
        'Exporta um JSON (Ajustes → Cópia de segurança). Os snapshots automáticos locais também protegem o teu histórico.',
      done: input.hasBackup,
      route: 'settings',
      cta: 'Exportar backup',
    },
    {
      id: 'sync',
      title: 'Sincroniza entre aparelhos',
      detail:
        'Com um token do GitHub (apenas com a permissão gist) o progresso segue para o telemóvel e para o portátil. Opcional.',
      done: input.hasSync,
      route: 'settings',
      cta: 'Ativar sync',
    },
  ]
}

/** Steps por fazer — o painel mostra só os que faltam. */
export function pendingSteps(steps: OnboardingStep[]): OnboardingStep[] {
  return steps.filter((step) => !step.done)
}
