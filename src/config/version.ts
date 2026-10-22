/**
 * A versão mostrada nas Settings. Bump de um dígito por vez (base-10):
 * 1.0.0 -> 1.0.1 -> ... -> 1.0.9 -> 1.1.0 -> ...
 */
export const APP_VERSION = '1.0.1'

/**
 * Versão do banco de conteúdo. Quando os geradores mudam, este número sobe e o
 * banco é re-seeded. NÃO pode apagar sessões/tentativas concluídas.
 */
export const BANK_VERSION = 1
