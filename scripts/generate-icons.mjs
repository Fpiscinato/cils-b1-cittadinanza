import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Gerador de ícones do CILS B1 Cittadinanza.
 *
 * A marca é a bandeira italiana sobre um fundo verde-petróleo (a cor de
 * confiança do app). Os ícones são escritos numa pasta versionada
 * (public/app-icons/vX.Y.Z) e o manifest aponta para essa pasta, para que um
 * novo lançamento sirva sempre um URL novo e o telemóvel apanhe o ícone novo
 * sem a aluna ter de desinstalar e instalar a app.
 *
 * Os ficheiros antigos são removidos automaticamente.
 */

const TEAL_TOP = [15, 118, 110]
const TEAL_BOTTOM = [13, 74, 76]
const GREEN = [0, 140, 69]
const WHITE = [244, 245, 244]
const RED = [205, 33, 42]

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public/app-icons')
const PUBLIC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public')
const VERSION_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/config/version.ts')

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  return table
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  data.copy(out, 8)
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length)
  return out
}

function encodePng(size, pixelAt) {
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1)
    raw[rowStart] = 0
    for (let x = 0; x < size; x += 1) {
      const [r, g, b, a] = pixelAt(x, y)
      const o = rowStart + 1 + x * 4
      raw[o] = r
      raw[o + 1] = g
      raw[o + 2] = b
      raw[o + 3] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

/**
 * @param size lado do ícone em pixels
 * @param flagScale fração do lado ocupada pela bandeira (maskable usa menos)
 */
function makeIcon(size, flagScale, rounded) {
  return encodePng(size, (x, y) => {
    const u = x / size
    const v = y / size

    // Fundo com um degradé vertical suave.
    let color = mix(TEAL_TOP, TEAL_BOTTOM, v)

    // Cantos arredondados (as versões normais; as maskable são cheias).
    if (rounded) {
      const radius = 0.22
      const cx = Math.min(Math.max(u, radius), 1 - radius)
      const cy = Math.min(Math.max(v, radius), 1 - radius)
      const distance = Math.hypot(u - cx, v - cy)
      if (distance > radius) return [0, 0, 0, 0]
    }

    // Bandeira italiana centrada: 3 faixas verticais.
    const flagWidth = 0.66 * flagScale
    const flagHeight = 0.44 * flagScale
    const left = 0.5 - flagWidth / 2
    const top = 0.5 - flagHeight / 2
    if (u >= left && u < left + flagWidth && v >= top && v < top + flagHeight) {
      const band = Math.floor(((u - left) / flagWidth) * 3)
      color = band === 0 ? GREEN : band === 1 ? WHITE : RED
      // Borda suave para a bandeira não parecer recortada.
      const edge = Math.min(
        (u - left) / 0.02,
        (left + flagWidth - u) / 0.02,
        (v - top) / 0.02,
        (top + flagHeight - v) / 0.02,
      )
      if (edge < 1) {
        const blend = Math.max(0, edge)
        color = mix(mix(TEAL_TOP, TEAL_BOTTOM, v), color, blend)
      }
    }

    return [color[0], color[1], color[2], 255]
  })
}

function readVersion() {
  const source = readFileSync(VERSION_FILE, 'utf8')
  const match = source.match(/export const APP_VERSION = '([^']+)'/)
  if (!match) throw new Error('APP_VERSION não encontrado em src/config/version.ts')
  return match[1]
}

function main() {
  const version = readVersion()
  const target = resolve(OUT_DIR, `v${version}`)
  mkdirSync(target, { recursive: true })

  writeFileSync(resolve(target, 'icon-192.png'), makeIcon(192, 1, true))
  writeFileSync(resolve(target, 'icon-512.png'), makeIcon(512, 1, true))
  writeFileSync(resolve(target, 'maskable-192.png'), makeIcon(192, 0.68, false))
  writeFileSync(resolve(target, 'maskable-512.png'), makeIcon(512, 0.68, false))
  writeFileSync(resolve(target, 'apple-touch-icon.png'), makeIcon(180, 1, false))

  // Ícones antigos são removidos.
  for (const entry of readdirSync(OUT_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== `v${version}`) {
      rmSync(resolve(OUT_DIR, entry.name), { recursive: true, force: true })
    }
  }

  // Favicon simples na raiz de public/.
  writeFileSync(resolve(PUBLIC_DIR, 'favicon-32.png'), makeIcon(32, 1, true))

  console.log(`Ícones gerados em ${target}`)
}

main()
