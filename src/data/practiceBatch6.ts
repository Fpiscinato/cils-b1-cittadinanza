/**
 * LOTE 6 DO BANCO DE PRÁTICA — foco no nível A2 e em mais ascolto.
 *
 * - 1 transcrição com 6 scelte multiple (A2, vida e trabalho);
 * - 1 "gémeo de áudio" de um texto cívico com 8 vero/falso (B1);
 * - 1 texto de leitura com 8 vero/falso (A2);
 * - 1 texto de gramática com 6 lacunas (A2).
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'Contenuto originale CILS B1 Prep — pratica non ufficiale'

export const PASSAGES_BATCH6: Passage[] = [
  {
    id: 'passage-ascolto-p1-f1',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 6, A2) — lavoro, casa, uscite',
    source: SOURCE,
    content: `1.
— Buongiorno, sono la dottoressa Neri. Vorrei fissare un appuntamento per la visita.
— Certamente. Ha preferito il martedì o il giovedì?
— Giovedì, se possibile. Giovedì mattina non lavoro.
— Ho giovedì alle 11 e alle 15. Le va bene?
— Sì, le 15 va bene. Devo portare qualcosa?
— La tessera sanitaria e, se ce l'ha, la ricetta del medico di base.
(stacco musicale)
2.
— Scusi, sto cercando un appartamento con due camere.
— Ha visto l'annuncio sul portale? Appartamento in centro, due locali, 650 euro.
— 650 euro è troppo per me. Nella periferia?
— Ho anche un trilocale a venti minuti dal centro, per 480 euro. Le conviene?
— Sì, lo voglio vedere. Quando posso visitare l'appartamento?
(stacco musicale)
3.
— Buongiorno, ha ricevuto la mia email? Vorrei modificare la prenotazione del tavolo.
— Sì, l'ho ricevuta ieri. Avevate prenotato per sabato alle 20.
— Perfetto, vorremmo spostarla a sabato alle 19 e30, se c'è posto.
— C'è un tavolo per due alle 19 e30, ma vicino alla cucina.
— Va bene, l'importante è che sia libero.
(stacco musicale)
4.
— Scusi, ha visto il mio gatto? È uscito di notte e non è rientrato.
— Mi dispiace, qui dentro non ci sono gatti. Ha chiesto ai vicini?
— Sì, ma nessuno l'ha visto. Ho paura che sia scappato.
— Provi nei giardini vicino alla scuola, a volte si fermano lì.
(stacco musicale)
5.
— Buongiorno, volevo chiedere quanto costa la revisione della bicicletta.
— La revisione completa sono trenta euro, se le ruote non sono storte.
— E il cambio della catena?
— Dodici euro, ma è incluso nella revisione.
— Allora faccio la revisione completa. Quando posso lasciarla?
— Entro le 18, è pronta domani.
(stacco musicale)
6.
— Scusi, vorrei sapere come funziona la raccolta dei rifiuti.
— I rifiuti si raccolgono tre volte a settimana: lunedì, mercoledì e venerdì.
— E per la carta e il vetro?
— La carta il martedì, il vetro il giovedì. I sacchi devono essere lasciati fuori entro le 7.
— Va bene, grazie. Posso lasciare il sacco anche la sera prima?
— Sì, ma non più di un giorno prima.`,
  },
  {
    id: 'passage-ascolto-p2-f2',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 6) — la cittadinanza e i suoi tempi',
    source: SOURCE,
    content: `In questa puntazione parliamo della cittadinanza italiana e di quanto tempo ci vuole per ottenerla. Il percorso più comune è la naturalizzazione, cioè la richiesta che lo Stato diventi cittadino della persona che ha vissuto in Italia per anni.

I tempi sono cambiati più volte. Fino al 2024 la legge prevedeva dieci anni di residenza ininterrotta, con un percorso più semplice per chi aveva studiato in Italia o aveva un familiare cittadino. Con la riforma del 2025 i dieci anni sono diventati quattro, ma i requisiti sono più severi: servono un reddito regolare e la conoscenza della lingua, verificata con un test.

Non tutti gli interessati presentano la domanda per la naturalizzazione. Molti cittadini di paesi dell'Unione europea hanno diritto alla cittadinanza dopo cinque anni di residenza, e chi nasce in Italia è cittadino italiano fin dalla nascita. C'è anche la cosiddetta cittadinanza "per discendenza", che riguarda chi ha un genitore cittadino italiano: in questo caso i tempi sono molto più brevi, spesso bastano pochi mesi per la dichiarazione.

Il percorso, in ogni caso, prevede sempre una verifica: un colloquio con un commissario che valuta la conoscenza dell'italiano, e il controllo della documentazione. La decisione finale arriva entro un anno dalla domanda, anche se in passato questo termine non era sempre rispettato.`,
  },
  {
    id: 'passage-lettura-p1-f3',
    kind: 'reading',
    title: 'Un anno di corsi al centro di formazione per adulti',
    source: SOURCE,
    content: `Il centro di formazione per adulti di un quartiere cittadino offre ogni anno un programma di corsi gratuito per chi cerca lavoro o vuole riqualificarsi. L'anno scorso hanno partecipato più di trecento persone, in gran parte stranieri residenti in città.

I corsi si dividono in due tipi. Da un lato ci sono i corsi di lingua, di italiano per stranieri e di italiano per chi lavora con i cittadini, come negli uffici o negli ospedali. Questi durano da tre mesi a un anno e si tengono due volte alla settimana, sempre nel tardo pomeriggio, per permettere a chi lavora di partecipare.

Dall'altro lato ci sono i corsi professionali, che danno una qualifica riconosciuta: elettricista, impiegato di ristorazione, addetto alle pulizie, operatore socio-assistenziale. Per iscriversi basta un certificato di iscrizione all'anagrafe e la conoscenza minima della lingua italiana, che si verifica con un colloquio.

Il centro offre anche un servizio di orientamento: ogni lunedì un consulente riceve gratuitamente chi vuole capire quale percorso scegliere. Secondo i dati del centro, metà dei partecipanti trova lavoro entro sei mesi dal termine del corso.

Le iscrizioni per il nuovo anno aprono a settembre, ma per i corsi di lingua i posti si esauriscono spesso già a luglio. Il centro è aperto dal lunedì al giovedì, dalle nove alle sedici, e il venerdì solo per le iscrizioni.`,
  },
  {
    id: 'passage-lettura-p2-f4',
    kind: 'reading',
    title: 'Perché si studia l\'italiano ogni giorno',
    source: SOURCE,
    content: `Molti studenti stranieri che arrivano in Italia pensano che imparare la lingua sia solo una questione di gramatica. In realtà, le prime settimane sono spesso le più difficili, perché la lingua si incontra nei luoghi più disparati: al mercato, in ufficio, dal medico, alla reception di un albergo.

La prima cosa che imparano non è una regola, ma un suono. Molti studenti hanno studiato l'inglese a scuola e riconoscono subito le parole che somigliano a quelle inglesi, ma le altre richiedono un esercizio quotidiano. Per questo i corsi di lingua per adulti chiedono quasi sempre un impegno di almeno un'ora al giorno.

C'è poi un altro aspetto, meno visibile ma altrettanto importante. In Italia la cortesia ha regole precise: si usa il "Lei" con le persone che non si conoscono, si saluta con un "buongiorno" anche quando si entra in un negozio, e quando si telefona a un ufficio si dice sempre "prima di tutto, buongiorno". Chi non conosce queste formule rischia di sembrare scortese senza accorgersene.

Per questo i corsi migliori non insegnano solo la grammatica: fanno ascoltare i dialoghi, fanno recitare le frasi del foglio ufficiale, e fanno scrivere testi brevi. Non è un caso che gli studenti che imparano più velocemente siano quelli che, nelle prime settimane, (1) non hanno paura di sbagliare e (2) parlano con qualcuno ogni giorno.`,
  },
]

export const QUESTIONS_BATCH6: Question[] = [
  /* ---------------- Ascolto P1 (lote 6) — 6 MCQ --------------------------- */
  {
    id: 'ascolto-p1-f1-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-f1',
    itemType: 'mcq3',
    order: 1,
    stem: 'La dottoressa fissa l\'appuntamento per',
    passageId: 'passage-ascolto-p1-f1',
    options: ['giovedì alle 15.', 'martedì alle 11.', 'giovedì alle 11.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Ho giovedì alle 11 e alle 15… le 15 va bene”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-f1-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-f1',
    itemType: 'mcq3',
    order: 2,
    stem: 'L\'appartamento in periferia costa',
    passageId: 'passage-ascolto-p1-f1',
    options: ['480 euro.', '650 euro.', '420 euro.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Un trilocale… per 480 euro”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-f1-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-f1',
    itemType: 'mcq3',
    order: 3,
    stem: 'La prenotazione del tavolo viene spostata a',
    passageId: 'passage-ascolto-p1-f1',
    options: [
      'sabato alle 19 e30.',
      'sabato alle 20.',
      'domenica alle 19 e30.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Vorrei spostarla a sabato alle 19 e30”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-f1-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-f1',
    itemType: 'mcq3',
    order: 4,
    stem: 'La persona con il gatto dovrebbe',
    passageId: 'passage-ascolto-p1-f1',
    options: [
      'cercare nei giardini vicino alla scuola.',
      'aspettare a casa tutta la notte.',
      'chiamare subito la polizia.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Provi nei giardini vicino alla scuola”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-f1-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-f1',
    itemType: 'mcq3',
    order: 5,
    stem: 'Il cambio della catena costa',
    passageId: 'passage-ascolto-p1-f1',
    options: [
      '12 euro ed è incluso nella revisione.',
      '30 euro.',
      '12 euro, da pagare a parte.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Dodici euro, ma è incluso nella revisione”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-f1-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-f1',
    itemType: 'mcq3',
    order: 6,
    stem: 'I rifiuti si raccolgono',
    passageId: 'passage-ascolto-p1-f1',
    options: [
      'tre volte a settimana.',
      'due volte a settimana.',
      'una volta a settimana.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“I rifiuti si raccolgono tre volte a settimana”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },

  /* ---------------- Ascolto P2 (lote 6) — 8 V/F --------------------------- */
  {
    id: 'ascolto-p2-f2-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 1,
    stem: 'Il percorso più comune per ottenere la cittadinanza è la naturalizzazione.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il percorso più comune è la naturalizzazione”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-f2-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 2,
    stem: 'Prima del 2024 servivano dieci anni di residenza ininterrotta.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Fino al 2024 la legge prevedeva dieci anni di residenza ininterrotta”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-f2-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 3,
    stem: 'La riforma del 2025 ha reso i requisiti più semplici.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“I dieci anni sono diventati quattro, ma i requisiti sono più severi”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-f2-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 4,
    stem: 'I corsi di lingua si tengono di sera.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: 'É o centro di formazione che tiene i corsi “sempre nel tardo pomeriggio”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-f2-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 5,
    stem: 'Per iscriversi ai corsi professionali serve un certificato di residenza.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      'Nel centro di formazione: “basta un certificato di iscrizione all\'anagrafe”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-f2-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 6,
    stem: 'Il servizio di orientamento è a pagamento.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Riceve gratuitamente chi vuole capire quale percorso scegliere”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-f2-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 7,
    stem: 'Metà dei partecipanti trova lavoro entro sei mesi.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Metà dei partecipanti trova lavoro entro sei mesi dal termine del corso”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-f2-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-f2',
    itemType: 'truefalse',
    order: 8,
    stem: 'Il venerdì il centro è aperto solo per le iscrizioni.',
    passageId: 'passage-ascolto-p2-f2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il venerdì solo per le iscrizioni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (lote 6) — 8 V/F --------------------------- */
  {
    id: 'lettura-p1-f3-1',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 1,
    stem: 'I corsi del centro sono gratuiti.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Un programma di corsi gratuito per chi cerca lavoro o vuole riqualificarsi”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f3-2',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 2,
    stem: 'L\'anno scorso hanno partecipato più di trecento persone.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Hanno partecipato più di trecento persone”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f3-3',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 3,
    stem: 'I corsi di lingua si tengono sempre al mattino.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Si tengono due volte alla settimana, sempre nel tardo pomeriggio”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f3-4',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 4,
    stem: 'I corsi professionali danno una qualifica riconosciuta.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“I corsi professionali, che danno una qualifica riconosciuta”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f3-5',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 5,
    stem: 'Per iscriversi ai corsi professionali non serve la residenza.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“Serve un certificato di iscrizione all\'anagrafe e la conoscenza minima della lingua italiana”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f3-6',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 6,
    stem: 'Il servizio di orientamento è aperto tutti i giorni.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Ogni lunedì un consulente riceve gratuitamente…”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f3-7',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 7,
    stem: 'Le iscrizioni per il nuovo anno aprono a settembre.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Le iscrizioni per il nuovo anno aprono a settembre”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-f3-8',
    skill: 'lettura',
    taskId: 'lettura-p1-f3',
    itemType: 'truefalse',
    order: 8,
    stem: 'Per i corsi di lingua i posti finiscono spesso entro luglio.',
    passageId: 'passage-lettura-p1-f3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Per i corsi di lingua i posti si esauriscono spesso già a luglio”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },

  /* ---------------- Lettura P2 (lote 6) — 6 cloze -------------------------- */
  {
    id: 'lettura-p2-f4-1',
    skill: 'lettura',
    taskId: 'lettura-p2-f4',
    itemType: 'cloze',
    order: 1,
    stem: 'Molti studenti stranieri che arrivano in Italia pensano che imparare la lingua sia solo una questione (1) grammatica.',
    passageId: 'passage-lettura-p2-f4',
    options: ['di', 'a', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Una questione di grammatica” — preposição + nome.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-f4-2',
    skill: 'lettura',
    taskId: 'lettura-p2-f4',
    itemType: 'cloze',
    order: 2,
    stem: 'Molti studenti hanno studiato l\'inglese (2) scuola.',
    passageId: 'passage-lettura-p2-f4',
    options: ['a', 'in', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“A scuola” — lugar (estado).',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-f4-3',
    skill: 'lettura',
    taskId: 'lettura-p2-f4',
    itemType: 'cloze',
    order: 3,
    stem: 'I corsi di lingua chiedono quasi sempre un impegno di almeno ___ ora al giorno.',
    passageId: 'passage-lettura-p2-f4',
    options: ['un\'ora', 'un\'ore', "un'ora'"],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Di un\'ora al giorno” — tempo.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-f4-4',
    skill: 'lettura',
    taskId: 'lettura-p2-f4',
    itemType: 'cloze',
    order: 4,
    stem: 'In Italia si saluta con un "buongiorno" anche quando si entra (5) un negozio.',
    passageId: 'passage-lettura-p2-f4',
    options: ['in', 'a', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Entrare in un negozio” — preposição + artigo.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-f4-5',
    skill: 'lettura',
    taskId: 'lettura-p2-f4',
    itemType: 'cloze',
    order: 5,
    stem: 'Gli studenti che imparano più velocemente sono quelli che non hanno paura (6) sbagliare.',
    passageId: 'passage-lettura-p2-f4',
    options: ['di', 'a', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Paura di sbagliare” — preposição + infinitivo.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-f4-6',
    skill: 'lettura',
    taskId: 'lettura-p2-f4',
    itemType: 'cloze',
    order: 6,
    stem: 'Chi studia di più alla fine impara meglio: gli studenti che (6) parlano con qualcuno ogni giorno.',
    passageId: 'passage-lettura-p2-f4',
    options: ['imparano', 'impareranno', 'imparassero'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'No presente da menos contexto (“chi studia di più”): “gli studenti che imparano parlano…”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
]
