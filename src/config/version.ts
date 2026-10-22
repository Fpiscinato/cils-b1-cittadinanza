/**
 * A versão mostrada nas Settings. Bump de um dígito por vez (base-10):
 * 1.0.0 -> 1.0.1 -> ... -> 1.0.9 -> 1.1.0 -> ...
 */
export const APP_VERSION = '1.1.0'

/**
 * Versão do banco de conteúdo. Quando os geradores mudam, este número sobe e o
 * banco é re-seeded. NÃO pode apagar sessões/tentativas concluídas.
 *
 * v2: banco extra de prática (ascolto/lettura originais) + conteúdo por fase
 * (gramática do Sillabo e vocabulário civic/burocrático).
 * v3: o banco extra foi completado (matéria para as 3 fases) e re-tagado por
 * fase — quem tinha a v2 volta a receber o conteúdo final.
 * v4: banco de estudo (gramática + vocabulário gerados) e lote 2 de prática.
 * v5: lote 3 de prática (mais textos e exercícios) — banco com 322 itens.
 * v6: banco de estudo em volume (padrões de gramática + vocabulário) e
 * lote 4 (ascolto) — banco com 477 itens.
 */
export const BANK_VERSION = 6
