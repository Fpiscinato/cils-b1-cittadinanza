/**
 * Rotas da app num único sítio.
 *
 * A rota vive aqui (e não no shell) porque tanto a lógica de negócio
 * (onboarding, atalhos do guia) como a UI precisam de a conhecer — sem criar
 * dependências circulares.
 */

export const ROUTES = [
  'dashboard',
  'practice',
  'mock',
  'progress',
  'guide',
  'mistakes',
  'foglio',
  'report',
  'settings',
] as const

export type Route = (typeof ROUTES)[number]

export function isRoute(value: unknown): value is Route {
  return typeof value === 'string' && (ROUTES as readonly string[]).includes(value)
}

export function routeFromHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '')
  return isRoute(clean) ? clean : 'dashboard'
}
