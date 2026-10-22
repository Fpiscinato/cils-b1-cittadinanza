import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Version bump do CILS B1 Cittadinanza.
 *
 * A versão é sempre `major.minor.patch` e cada parte é UM dígito base-10 (0-9).
 * O bump segue a regra decimal, dígito a dígito:
 *
 *   1.0.0 -> 1.0.1 -> ... -> 1.0.9 -> 1.1.0 -> ... -> 1.9.9 -> 2.0.0
 *
 * Uso:
 *   npm run version:bump            -> sobe o dígito do patch
 *   npm run version:bump -- 1.2.0   -> define uma versão explícita
 */

const VERSION_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/config/version.ts')
const VERSION_PATTERN = /export const APP_VERSION = '([^']+)'/

export function parseVersion(version: string): [number, number, number] {
  const parts = version.split('.')
  if (parts.length !== 3) {
    throw new Error(`A versão "${version}" tem de ter três partes (major.minor.patch).`)
  }
  const numbers = parts.map((part) => {
    if (!/^\d$/.test(part)) {
      throw new Error(`A versão "${version}" só pode usar dígitos base-10 (0-9).`)
    }
    return Number(part)
  })
  return numbers as [number, number, number]
}

/** 1.0.4 -> 1.0.5, 1.0.9 -> 1.1.0, 1.9.9 -> 2.0.0 */
export function bumpVersion(version: string): string {
  const digits = parseVersion(version)
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    if (digits[index] < 9) {
      digits[index] += 1
      return digits.join('.')
    }
    digits[index] = 0
  }
  throw new Error('Não é possível passar de 9.9.9 — começa uma nova linha à mão.')
}

function main(): void {
  const source = readFileSync(VERSION_FILE, 'utf8')
  const match = source.match(VERSION_PATTERN)
  if (!match) throw new Error(`APP_VERSION não encontrado em ${VERSION_FILE}.`)
  const current = match[1]
  const requested = process.argv[2]
  const next = requested ? requested.trim() : bumpVersion(current)
  parseVersion(next)
  if (next === current) {
    console.log(`A versão já é ${current}.`)
    return
  }
  writeFileSync(VERSION_FILE, source.replace(VERSION_PATTERN, `export const APP_VERSION = '${next}'`))
  console.log(`Versão atualizada: ${current} -> ${next}`)
  console.log('Corre `npm run icons` para regenerar os ícones.')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
