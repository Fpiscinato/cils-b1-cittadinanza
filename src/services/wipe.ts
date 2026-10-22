/**
 * Apagar TUDO deste aparelho.
 *
 * É uma acção DELIBERADA da aluna (com confirmação escrita "APAGAR"), não um
 * reset automático: por isso pode apagar também as provas concluídas.
 *
 * O que é apagado:
 * - a base de dados IndexedDB (provas, tentativas, textos, conteúdo);
 * - o `localStorage` (tema, snapshots, token do GitHub, versão do banco);
 * - a cache do service worker (para a app ir buscar a versão nova).
 *
 * O `BANK_VERSION` fica a zero: no arranque seguinte a app volta a semear o
 * conteúdo original e fica como uma instalação nova.
 */

import { db } from '../db/database'

export async function wipeEverything(): Promise<void> {
  // 1. Cache do service worker (a app passa a buscar a versão nova).
  if (typeof caches !== 'undefined') {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }

  // 2. Base de dados.
  db.close()
  await db.delete()

  // 3. localStorage (tema, snapshots, token do GitHub, versão do banco).
  try {
    window.localStorage.clear()
  } catch {
    /* modo privado: seguimos */
  }
}
