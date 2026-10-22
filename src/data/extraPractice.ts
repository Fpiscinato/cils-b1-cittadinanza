/**
 * CONTEÚDO EXTRA DE PRÁTICA — material original da app.
 *
 * A prova oficial de exemplo (`officialSample.ts`) fica intacta: é a única com
 * gabarito garantido e é o que o **simulado completo** usa. Este ficheiro
 * acrescenta material novo para a **Prática**:
 *
 * - ascolto P1 (6 scelte multiple) e P2 (8 vero/falso), com transcrição para o TTS;
 * - lettura P1 (8 vero/falso) e P2 (6 cloze con riflessione grammaticale);
 * - temas de scrittura e argomenti dell'orale in registro civile.
 *
 * Tudo em italiano de nível B1, com temi di vita quotidiana, contesti pubblici
 * e amministrazione locale — os mesmos ambiti do Sillabo B1 Cittadinanza.
 *
 * Os itens do banco extra têm `bank: 'practice'` e task ids com sufixo `-x`,
 * para nunca se misturarem com o gabarito oficial.
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'Contenuto originale CILS B1 Prep — pratica non ufficiale'

/* -------------------------------------------------------------------------- */
/* Passaggi                                                                    */
/* -------------------------------------------------------------------------- */

export const EXTRA_PASSAGES: Passage[] = [
  {
    id: 'passage-ascolto-p1-x',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática) — sei situazioni quotidiane',
    source: SOURCE,
    content: `1.
− Buongiorno, vorrei un cappuccino e una cornice.
− Va bene, subito. E con il pane?
− No, grazie. Posso pagare con il bancomat?
− Sì, il bancomat è vicino alla cassa. Un euro e venti.
(stacco musicale)
2.
− Scusi, il treno per Firenze parte dal binario 3?
− Sì, il binario 3. Parte tra venti minuti, ma il ritardo è di dieci minuti.
− Devo cambiare treno a Firenze?
− No, è diretto. Arriva alle 16:40.
(stacco musicale)
3.
− Buongiorno, ho la febbre e un raffreddore. Cosa mi consiglia?
− Le consiglio di riposare e di bere acqua. Se i sintomi non passano, consulti il medico.
− In farmacia posso comprare medicine senza ricetta?
− Sì, per i sintomi lievi. Per gli antibiotici, invece, serve la ricetta.
(stacco musicale)
4.
− Buongiorno, vorrei prenotare un appuntamento per l'iscrizione all'anagrafe.
− Certamente. Che giorno preferisce?
− Venerdì mattina, se possibile.
− Ho venerdì alle 10:30. Si porti il passaporto e la bolletta della luce.
(stacco musicale)
5.
− Buongiorno, ho prenotato una camera doppia per tre giorni.
− Sì, a nome Bianchi. La camera è al terzo piano. La colazione è servita dalle 7 alle 10.
− A che ora devo liberare la camera?
− Entro le 11. Se ha bisogno di una navetta per l'aeroporto, possiamo chiamarla.
(stacco musicale)
6.
− Buongiorno, vorrei pagare il conto.
− Certo. La camera doveva essere liberata entro le 11. Non ha problemi.
− Perfetto. Posso lasciare le valigie al deposito bagagli?
− Certamente, il deposito è aperto fino alle 22.`,
  },
  {
    id: 'passage-ascolto-p2-x',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática) — il nuovo portale dei servizi',
    source: SOURCE,
    content: `La città di Siena ha introdotto un nuovo servizio per aiutare i cittadini a svolgere le pratiche online. Il servizio si chiama "Siena Facile" e permette di pagare la bolletta, prenotare un appuntamento in ufficio e scaricare i certificati dal computer di casa. Per accedere al servizio è necessario avere lo SPID, cioè l'identità digitale che viene rilasciata per via elettronica. Lo SPID si può richiedere gratuitamente in un punto SPID oppure online, usando la carta d'identità elettronica o il passaporto e la webcam. Il Comune ha aperto il servizio di assistenza in un apposito ufficio in piazza del Campo, dove un impiegato aiuta i cittadini che hanno difficoltà a registrarsi. Secondo un'indagine pubblicata dal Comune, circa il 40% delle persone che si sono presentate all'ufficio di assistenza non aveva mai usato internet. Il servizio è gratuito e si può usare anche solo per la posta: ogni utente riceve un indirizzo email e può inviare e ricevere documenti. Il piano per il 2026 prevede di estendere il servizio anche ad altre città della Toscana, a cominciare da Firenze e Arezzo. L'ufficio di assistenza è aperto dal lunedì al venerdì, dalle 9 alle 17, e il sabato mattina.`,
  },
  {
    id: 'passage-lettura-p1-x',
    kind: 'reading',
    title: 'Sportello di accoglienza per le persone straniere',
    source: SOURCE,
    content: `Il Comune di Siena ha aperto uno "Sportello di accoglienza" per le persone straniere che vivono in città. Lo sportello si trova in via Banchi di Sopra e offre informazioni su più di venti servizi: dall'iscrizione all'anagrafe alla scelta della scuola per i figli.

Lo sportello è aperto dal lunedì al venerdì, dalle 9 alle 12, e il giovedì anche dalle 15 alle 17. L'accesso è libero e non è necessario fissare un appuntamento, anche se nei giorni di maggiore affluenza è consigliabile arrivare prima delle 9.30.

Presso lo sportello è possibile: iscriversi all'anagrafe, ricevere una copia del contratto di affitto in italiano, prenotare un test di italiano per stranieri e ricevere assistenza per la compilazione dei moduli online. Il servizio di traduzione è disponibile per le lingue più parlate in città: inglese, francese, arabo, romeno, albanese e ucraino. Per le altre lingue è possibile fissare un interprete con un giorno di anticipo.

Lo sportello è finanziato dal progetto europeo "Città Welcome" e le attività proseguiranno fino alla fine del 2026. Secondo i dati pubblicati dal Comune, nel primo anno di attività sono state assistite più di ottomila persone, e la domanda di assistenza per l'iscrizione all'anagrafe è in continua crescita.`,
  },
  {
    id: 'passage-ascolto-p1-s2',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, fase 2) — situazioni di ogni giorno',
    source: SOURCE,
    content: `1.
− Buongiorno, come state? Vi ho visto ieri al mercato.
− Molto bene, grazie. Ieri pioveva, ma siamo usciti lo stesso.
− E cosa avete comprato?
− Un po' di frutta e del formaggio. I prezzi erano più alti del solito.
(stacco musicale)
2.
− Scusi, ieri ho preso il bus sbagliato e sono arrivata in ritorno al lavoro.
— Non si preoccupi, capita a tutti. Ha perso molto tempo?
— Circa mezz'ora. La prossima volta partirò con più anticipo.
(stacco musicale)
3.
− Buongiorno, vorrei sapere se il museo sarà aperto domani.
— Sarà aperto dalle 9 alle 19, ma il mercoledì è il giorno di chiusura.
— Quindi mercoledì non potrò visitare la mostra, vero?
— Esatto. Il giovedì, invece, l'ingresso è gratuito.
(stacco musicale)
4.
− Scusi, questo ristorante è più economico di quello davanti?
— Sì, e la cucina è anche migliore. Però nei fine settimana c'è più gente.
— Capisco. Allora proverò a venire durante la settimana.
(stacco musicale)
5.
− Quando hai iniziato a studiare l'italiano?
— Ho cominciato tre anni fa, quando sono arrivato in Italia.
— E ti è difficile?
— All'inizio sì, ma adesso capisco quasi tutto. Studio ogni giorno.
(stacco musicale)
6.
− Buongiorno, vorrei restituire un libro e prendere in prestito altri due.
— Certo, il prestito è possibile per un mese. Quali libri vorrebbe?
— Questo romanzo e questo manuale di grammatica.
— Perfetto. Con la sua tessera, l'operazione è gratuita.`,
  },
  {
    id: 'passage-lettura-p1-f1',
    kind: 'reading',
    title: 'Il centro sociale del quartiere',
    source: SOURCE,
    content: `Il centro sociale del quartiere è aperto dal lunedì al sabato, dalle 9 alle 19. L'entrata è libera e non è necessario iscriversi, anche se per i corsi è consigliato farlo alla reception.

Al centro si possono trovare una biblioteca con più di tremila libri, una sala con il computer per studiare e Internet veloce, e una cucina piccola dove si può mangiare a prezzo scontato. Il bar apre alle 8 e chiude alle 18; la sala prove è disponibile solo su prenotazione.

Ogni mercoledì alle 17 ci sono i corsi di italiano per stranieri: due livelli, uno per chi comincia e uno per chi vuole migliorare la grammatica. Le iscrizioni sono sempre aperte e il corso è gratuito. Il giovedì sera, invece, c'è il gruppo di teatro e il circolo di lettura.

Il centro è gestito dal Comune insieme all'associazione di quartiere. Nelle vacanze estive l'orario è ridotto: il centro chiude per due settimane in agosto.`,
  },
  {
    id: 'passage-lettura-p2-x',
    kind: 'reading',
    title: 'La residenza in Italia per i cittadini stranieri',
    source: SOURCE,
    content: `Residenza in Italia per i cittadini stranieri

La domanda deve essere inoltrata (1) ufficio competente, che verifica la documentazione entro trenta giorni. Se la documentazione non è completa, l'ufficio (2) invia una richiesta di integrazione e sospende la pratica.

Molti stranieri che vivono in Italia da anni (3) scelto di iscriversi all'anagrafe: è un obbligo di legge e permette di ricevere la posta, di votare e di chiedere certificati.

Il permesso di soggiorno deve essere rinnovato (4) un anno dalla prima emissione. In caso di errore nella domanda, l'ufficio (5) una proroga di trenta giorni per integrare la documentazione.

Per informazioni più dettagliate, potete consultare (6) sito del Comune o rivolgervi allo Sportello di accoglienza, aperto dal lunedì al venerdì.`,
  },
]

/* -------------------------------------------------------------------------- */
/* Ascolto P1 (prática) — 6 scelte multiple                                    */
/* -------------------------------------------------------------------------- */

export const EXTRA_QUESTIONS: Question[] = [
  /* ------------------------- Ascolto P1 (prática) ------------------------- */
  {
    id: 'ascolto-p1-x-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-x',
    itemType: 'mcq3',
    order: 1,
    stem: 'La signora al bar ordina',
    passageId: 'passage-ascolto-p1-x',
    options: ['un cappuccino e una cornice.', 'un tè e un panino.', 'solo un cappuccino.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Vorrei un cappuccino e una cornice”. Quando le chiedono il pane, risponde “No, grazie”: quindi non prende anche il pane.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-x-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-x',
    itemType: 'mcq3',
    order: 2,
    stem: 'Il treno per Firenze parte',
    passageId: 'passage-ascolto-p1-x',
    options: ['dal binario 3.', 'dal binario 5.', 'dal binario 1.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Il treno per Firenze parte dal binario 3?” — “Sì, il binario 3”. La risposta è una domanda con risposta affermativa: il numero è il 3.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-x-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-x',
    itemType: 'mcq3',
    order: 3,
    stem: 'Il farmacista le consiglia di',
    passageId: 'passage-ascolto-p1-x',
    options: [
      'prendere antibiotici subito.',
      'riposare e bere acqua.',
      'andare subito in ospedale.',
    ],
    correctIndex: 1,
    pointsPerItem: 1,
    explanation:
      '“Le consiglio di riposare e di bere acqua”. Gli antibiotici richiedono la ricetta: non è quello che consiglia.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-x-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-x',
    itemType: 'mcq3',
    order: 4,
    stem: 'Per l’appuntamento all’anagrafe deve portare',
    passageId: 'passage-ascolto-p1-x',
    options: [
      'il passaporto e la bolletta della luce.',
      'solo il passaporto.',
      'il contratto d’affitto.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Si porti il passaporto e la bolletta della luce” — sono due documenti, non uno.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-x-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-x',
    itemType: 'mcq3',
    order: 5,
    stem: 'La colazione in albergo è servita',
    passageId: 'passage-ascolto-p1-x',
    options: ['dalle 7 alle 10.', 'dalle 8 alle 9.', 'solo su richiesta.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“La colazione è servita dalle 7 alle 10”.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-x-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-x',
    itemType: 'mcq3',
    order: 6,
    stem: 'Il deposito bagagli è aperto',
    passageId: 'passage-ascolto-p1-x',
    options: ['fino alle 22.', 'fino alle 18.', 'solo la domenica.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il deposito è aperto fino alle 22”.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },

  /* ------------------------- Ascolto P2 (prática) ------------------------- */
  {
    id: 'ascolto-p2-x-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 1,
    stem: 'Con il servizio “Siena Facile” si può pagare la bolletta dal computer di casa.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      'Il testo dice che il servizio “permette di pagare la bolletta, prenotare un appuntamento in ufficio e scaricare i certificati dal computer di casa”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-x-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 2,
    stem: 'Per usare il servizio è obbligatorio andare di persona al Comune.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'Non è obbligatorio: lo SPID si può richiedere anche online e il servizio si usa dal computer di casa. L’ufficio di assistenza è solo per chi ha difficoltà.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-x-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 3,
    stem: 'Lo SPID si può richiedere gratuitamente.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Lo SPID si può richiedere gratuitamente in un punto SPID oppure online”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-x-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 4,
    stem: 'Per richiedere lo SPID online è necessaria la webcam.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“usando la carta d’identità elettronica o il passaporto e la webcam” — la webcam è una delle opzioni indicate.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-x-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 5,
    stem: 'L’ufficio di assistenza si trova in piazza del Campo.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il Comune ha aperto il servizio di assistenza in un apposito ufficio in piazza del Campo”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-x-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 6,
    stem: 'Circa il 40% delle persone assistite in ufficio aveva già usato internet.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'Il testo dice il contrario: “circa il 40% delle persone che si sono presentate all’ufficio di assistenza non aveva mai usato internet”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-x-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 7,
    stem: 'Ogni utente del servizio riceve anche un indirizzo email.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“ogni utente riceve un indirizzo email e può inviare e ricevere documenti”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-x-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-x',
    itemType: 'truefalse',
    order: 8,
    stem: 'L’ufficio di assistenza è aperto anche la domenica.',
    passageId: 'passage-ascolto-p2-x',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'È aperto “dal lunedì al venerdì, dalle 9 alle 17, e il sabato mattina”: la domenica no.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ------------------------- Lettura P1 (prática) ------------------------- */
  {
    id: 'lettura-p1-x-1',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 1,
    stem: 'Per andare allo Sportello di accoglienza è necessario fissare un appuntamento.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“L’accesso è libero e non è necessario fissare un appuntamento”. Consigliamo apenas de chegar cedo nos dias de maior affluência.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-x-2',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 2,
    stem: 'Il giovedì lo Sportello è aperto anche nel pomeriggio.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“il giovedì anche dalle 15 alle 17” — o seja, há um horário extra à tarde.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-x-3',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 3,
    stem: 'Allo Sportello si può ricevere una copia del contratto d’affitto in italiano.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: 'Compare na lista: “ricevere una copia del contratto di affitto in italiano”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-x-4',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 4,
    stem: 'Il test di italiano per stranieri si tiene soltanto il venerdì mattina.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'O texto só diz que se pode “prenotare un test di italiano per stranieri”: não indica dia nem hora. É essa a armadilha do vero/falso.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-x-5',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 5,
    stem: 'Para as línguas menos faladas na cidade é possível marcar um intérprete com um dia de antecedência.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Per le altre lingue è possibile fissare un interprete con un giorno di anticipo”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-x-6',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 6,
    stem: 'O serviço de tradução está disponível para seis idiomas.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      'São seis: “inglese, francese, arabo, romeno, albanese e ucraino”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-x-7',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 7,
    stem: 'As atividades do Sportello estão previstas até ao final de 2026.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“le attività proseguiranno fino alla fine del 2026”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-x-8',
    skill: 'lettura',
    taskId: 'lettura-p1-x',
    itemType: 'truefalse',
    order: 8,
    stem: 'No primeiro ano de atividade foram assistidas mais de oito mil pessoas.',
    passageId: 'passage-lettura-p1-x',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“sono state assistite più di ottomila persone”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },


  /* ---------------- Ascolto P1 (prática, fase 2 — Struttura) --------------- */
  {
    id: 'ascolto-p1-s2-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-s2',
    itemType: 'mcq3',
    order: 1,
    stem: 'Il tempo di ieri era',
    passageId: 'passage-ascolto-p1-s2',
    options: ['soleggiato.', 'pioggioso.', 'molto ventoso.'],
    correctIndex: 1,
    pointsPerItem: 1,
    explanation: '“Ieri pioveva, ma siamo usciti lo stesso”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-s2-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-s2',
    itemType: 'mcq3',
    order: 2,
    stem: 'La signora è arrivata in ritorno perché',
    passageId: 'passage-ascolto-p1-s2',
    options: [
      'aveva preso il bus sbagliato.',
      'non aveva trovato il lavoro.',
      'il bus era arrivato in ritardo.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Ieri ho preso il bus sbagliato e sono arrivata in ritorno al lavoro”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-s2-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-s2',
    itemType: 'mcq3',
    order: 3,
    stem: 'Il museo è chiuso',
    passageId: 'passage-ascolto-p1-s2',
    options: ['il lunedì.', 'il mercoledì.', 'il giovedì.'],
    correctIndex: 1,
    pointsPerItem: 1,
    explanation:
      '“Il mercoledì è il giorno di chiusura”. O giovedì, invece, l’ingresso è gratuito.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-s2-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-s2',
    itemType: 'mcq3',
    order: 4,
    stem: 'Il ristorante davanti a quello in cui parlano',
    passageId: 'passage-ascolto-p1-s2',
    options: ['ha prezzi più alti.', 'è più economico.', 'chiude prima.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Questo ristorante è più economico di quello davanti?” — “Sì, e la cucina è anche migliore”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-s2-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-s2',
    itemType: 'mcq3',
    order: 5,
    stem: 'Lo studente dice che studia l’italiano',
    passageId: 'passage-ascolto-p1-s2',
    options: ['solo all’inizio.', 'ogni giorno.', 'solo il mercoledì.'],
    correctIndex: 1,
    pointsPerItem: 1,
    explanation: '“Studio ogni giorno”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-s2-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-s2',
    itemType: 'mcq3',
    order: 6,
    stem: 'Il prestito dei libri dura',
    passageId: 'passage-ascolto-p1-s2',
    options: ['un mese.', 'una settimana.', 'tre mesi.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il prestito è possibile per un mese”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (prática, fase 1 — Fondazione) -------------- */
  {
    id: 'lettura-p1-f1-1',
    skill: 'lettura',
    taskId: 'lettura-p1-f1',
    itemType: 'truefalse',
    order: 1,
    stem: 'Per frequentare la biblioteca del centro sociale non è necessario iscriversi.',
    passageId: 'passage-lettura-p1-f1',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“L’entrata è libera e non è necessario iscriversi, anche se per i corsi è consigliato farlo”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f1-2',
    skill: 'lettura',
    taskId: 'lettura-p1-f1',
    itemType: 'truefalse',
    order: 2,
    stem: 'Per i corsi è consigliato iscriversi alla reception.',
    passageId: 'passage-lettura-p1-f1',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Per i corsi è consigliato farlo alla reception”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f1-3',
    skill: 'lettura',
    taskId: 'lettura-p1-f1',
    itemType: 'truefalse',
    order: 3,
    stem: 'Il bar del centro chiude alle 19.',
    passageId: 'passage-lettura-p1-f1',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Il bar apre alle 8 e chiude alle 18”. O centro fecha às 19, o bar não.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f1-4',
    skill: 'lettura',
    taskId: 'lettura-p1-f1',
    itemType: 'truefalse',
    order: 4,
    stem: 'La sala prove si può usare senza prenotazione.',
    passageId: 'passage-lettura-p1-f1',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“La sala prove è disponibile solo su prenotazione”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f1-5',
    skill: 'lettura',
    taskId: 'lettura-p1-f1',
    itemType: 'truefalse',
    order: 5,
    stem: 'I corsi di italiano per stranieri si tengono il mercoledì alle 17.',
    passageId: 'passage-lettura-p1-f1',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Ogni mercoledì alle 17 ci sono i corsi di italiano per stranieri”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f1-6',
    skill: 'lettura',
    taskId: 'lettura-p1-f1',
    itemType: 'truefalse',
    order: 6,
    stem: 'In estate il centro chiude per due settimane.',
    passageId: 'passage-lettura-p1-f1',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il centro chiude per due settimane in agosto”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },

  /* ------------------------- Lettura P2 (prática, cloze) ------------------ */
  {
    id: 'lettura-p2-x-1',
    skill: 'lettura',
    taskId: 'lettura-p2-x',
    itemType: 'cloze',
    order: 1,
    stem: 'La domanda deve essere inoltrata (1) ufficio competente.',
    passageId: 'passage-lettura-p2-x',
    options: ['al', 'del', 'dal'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Inoltrata” + preposição articolata: a + il = al. “All’ufficio competente” (ao escritório competente).',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-x-2',
    skill: 'lettura',
    taskId: 'lettura-p2-x',
    itemType: 'cloze',
    order: 2,
    stem: 'Se la documentazione non è completa, l’ufficio (2) invia una richiesta di integrazione.',
    passageId: 'passage-lettura-p2-x',
    options: ['le', 'le ne', 'gli'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      'Pronome objeto direto feminino (le = a REQUEST, “a richiesta”). “Le ne invia” existe em italiano, mas com um verbo impersonale: “Le ne inviano un avviso”. Aqui o sujeito é “l’ufficio”.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-x-3',
    skill: 'lettura',
    taskId: 'lettura-p2-x',
    itemType: 'cloze',
    order: 3,
    stem: 'Molti stranieri che vivono in Italia da anni (3) scelto di iscriversi all’anagrafe.',
    passageId: 'passage-lettura-p2-x',
    options: ['hanno', 'avevano', 'avranno'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      'A frase é sobre um passado ainda ligado ao presente: “hanno scelto” (passato prossimo). O imperfetto (“avevano scelto”) contaria um passado já fechado.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-x-4',
    skill: 'lettura',
    taskId: 'lettura-p2-x',
    itemType: 'cloze',
    order: 4,
    stem: 'Il permesso di soggiorno deve essere rinnovato (4) un anno dalla prima emissione.',
    passageId: 'passage-lettura-p2-x',
    options: ['entro', 'dopo', 'prima'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Entro un anno dalla prima emissione” = dentro de um ano a contar da primeira emissão. É a expressão do prazo em italiano burocrático.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-x-5',
    skill: 'lettura',
    taskId: 'lettura-p2-x',
    itemType: 'cloze',
    order: 5,
    stem: 'In caso di errore nella domanda, l’ufficio (5) una proroga di trenta giorni.',
    passageId: 'passage-lettura-p2-x',
    options: ['concederebbe', 'concede', 'concederà'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      'A frase é hipotética (“in caso di errore”): o escritório usaria o condicional → “concederebbe”. O presente “concede” é o facto real.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-x-6',
    skill: 'lettura',
    taskId: 'lettura-p2-x',
    itemType: 'cloze',
    order: 6,
    stem: 'Per informazioni più dettagliate, potete consultare (6) sito del Comune.',
    passageId: 'passage-lettura-p2-x',
    options: ['il', 'lo', 'l\''],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Il sito”: o artigo masculine singular definite. “Lo” usa-se antes de s+consoante, z, gn, ps, x, y (“lo stesso”, “lo studente”).',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
]

/* -------------------------------------------------------------------------- */
/* Scrittura e orale (material extra)                                          */
/* -------------------------------------------------------------------------- */

export const EXTRA_WRITING_PROMPTS = [
  {
    id: 'scrittura-prompt-x1',
    text: 'Hai trasferito la tua residenza in un\'altra città italiana. Scrivi una mail all\'ufficio del Comune per chiedere informazioni sulla cancellazione dall\'anagrafe. Spiega da quanto tempo vivi in Italia e cosa hai portato con te.',
  },
  {
    id: 'scrittura-prompt-x2',
    text: 'Il medico di base che frequentavi da due anni ha cambiato indirizzo. Scrivi una mail al servizio sanitario per chiedere se è possibile trasferire la tua scelta del medico di base e come fare.',
  },
  {
    id: 'scrittura-prompt-x3',
    text: 'Nel tuo quartiere il trasporto pubblico passa poco la sera. Scrivi una mail al Comune per segnalare il problema, raccontando la tua situazione e proponendo una soluzione concreta.',
  },
  {
    id: 'scrittura-prompt-x4',
    text: 'Hai frequentato un corso di italiano per stranieri e vuoi ringraziare i docenti. Scrivi una breve lettera di ringraziamento, ricordando quello che hai imparato e come ti ha aiutato nella vita di ogni giorno.',
  },
  {
    id: 'scrittura-prompt-x5',
    text: 'Un amico straniero ti chiede consigli per vivere in Italia. Scrivi un messaggio in cui spieghi tre cose pratiche: un documento che deve preparare, un ufficio che deve conoscere e una cosa che gli renderà la vita più facile.',
  },
  {
    id: 'scrittura-prompt-x6',
    text: 'Il tuo vicino di casa organizza una festa nel cortile ogni sabato sera e il rumore ti disturba. Scrivi un messaggio educato per propose un accordo, spiegando il tuo problema e suggerendo un\'alternativa.',
  },
]

export const EXTRA_ORAL_TOPICS = [
  {
    id: 'orale-topic-x1',
    text: 'Come si fa a cambiare residenza in Italia? Quali documenti servono e quanto tempo ci vuole?',
  },
  {
    id: 'orale-topic-x2',
    text: 'Nella tua vita quotidiana quale servizio pubblico usi di più? È facile da usare? Che cosa miglioreresti?',
  },
  {
    id: 'orale-topic-x3',
    text: 'Racconta un\'esperienza che hai avuto con un ufficio o con un servizio pubblico: com\'è andata e che cosa hai imparato?',
  },
  {
    id: 'orale-topic-x4',
    text: 'Quali sono le feste e le tradizioni più importanti del tuo Paese? Quale preferisci e perché?',
  },
  {
    id: 'orale-topic-x5',
    text: 'Che differenza c\'è fra la vita in Italia e quella nel tuo Paese? Pensa agli orari, al cibo, alla famiglia e al tempo libero.',
  },
  {
    id: 'orale-topic-x6',
    text: 'Se potessi cambiare una cosa nella tua città, quale sarebbe? Perché proprio quella?',
  },
]
