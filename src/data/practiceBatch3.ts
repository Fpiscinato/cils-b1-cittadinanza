/**
 * LOTE 3 DO BANCO DE PRÁTICA — material original da app.
 *
 * Mais 28 itens:
 * - 1 transcrição de ascolto com 6 scelte multiple (A1, vida quotidiana);
 * - 1 transcrição sobre direitos e deveres com 8 vero/falso (B1);
 * - 1 texto de leitura sobre a cittadinanza com 8 vero/falso (B1);
 * - 1 texto de gramática com 6 lacunas (B1).
 *
 * A ideia é a mesma do resto do banco: material que segue o formato e o
 * nível do exame, para a aluna poder treinar todos os dias sem repetir as
 * mesmas perguntas.
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'Contenuto originale CILS B1 Prep — pratica non ufficiale'

export const PASSAGES_BATCH3: Passage[] = [
  {
    id: 'passage-ascolto-p1-c5',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 3) — al mercato, in hotel, dal medico',
    source: SOURCE,
    content: `1.
— Scusi, il mercato è ancora aperto?
— Sì, chiude alle 14, ma le verdure le finisce verso l'una.
— Perfetto.Quanto costano i pomodori?
— Due euro e mezzo al chilo. O pangrattato è di oggi.
(stacco musicale)
2.
— Buongiorno, ho prenotato una camera per tre notti a nome Rossi.
— Benvenuto! La camera 12 è al secondo piano. La colazione è compresa.
— A che ora devo fare il check-out?
— Entro le 10. Se ha bisogno di una fattura, la prepariamo alla reception.
(stacco musicale)
3.
— Buongiorno, dottore. Ho la febbre da due giorni e un raffreddore.
— Ha preso qualcosa? Vedo che ha preso il vaccino.
— Sì, l'autunno scorso. Posso prendere un antibiotico?
— Non serve, per una virgolite. Le prescrivo un antipiretico e riposi.
(stacco musicale)
4.
— Scusi, questo biglietto è valido anche per il treno delle 18?
— Sì, vale per tutte le linee urbane fino alle 20.
— E devo cambiare il biglietto quando prendo il metro?
— No, lo stesso biglietto vale anche per il metro.
(stacco musicale)
5.
— Buongiorno, vorrei restituire questa giacca di taglia 42.
— Certamente, ha la ricevuta? Sono passati più di trenta giorni.
— No, non l'ho più. Ma il prezzo era lo stesso del week-end.
— Allora posso fare lo sconto del venti per cento.
(stacco musicale)
6.
— Scusi, la farmacia di turno è sempre aperta?
— Sì, di notte c'è sempre una farmacia di turno. Basta chiedere in farmacia o cercare l'elenco sulla porta.
— E se ho bisogno di un medicinale urgente?
— Può comprarlo direttamente li, senza ricetta.`,
  },
  {
    id: 'passage-ascolto-p2-c6',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 3) — diritti e doveri',
    source: SOURCE,
    content: `In questa puntazione parliamo dei diritti e dei doveri dei cittadini stranieri che vivono in Italia. Non è vero che uno straniero debba pagare per tutto quello che usa: la sanità, per esempio, è garantita a chi ha il permesso di soggiorno e lavora in Italia.

Molti stranieri non sanno che possono iscriversi ai corsi di lingua del Comune a prezzi ridotti. Le scuole offrono anche un servizio di doposcuola gratuito per i figli degli immigrati, soprattutto nella scuola primaria.

C'è anche un tema che divide: il voto. Attualmente gli stranieri residenti da almeno tre anni possono votare nelle elezioni locali, ma non in quelle nazionali. Il governo ha promesso di allargare questo diritto, però non è ancora legge.

Un altro diritto importante è quello di portare a termine gli studi. Le scuole professionali e i corsi di formazione per adulti accettano anche chi non ha il diploma, e chi lavora ha diritto a permessi per formazione. Infine, ricordate che il Comune deve informare i nuovi cittadini: c'è un servizio di sportelli che spiega i diritti e aiuta a fare le pratiche, anche con l'aiuto di un mediatore linguistico.`,
  },
  {
    id: 'passage-lettura-p1-c7',
    kind: 'reading',
    title: 'La cittadinanza italiana: che cosa cambia per chi arriva da fuori',
    source: SOURCE,
    content: `Ottenere la cittadinanza italiana non è automatico. La strada più seguita è la naturalizzazione, che spetta allo Stato, ma esistono anche vie comunali e comunali ai residenti stranieri.

La naturalizzazione richiede in genere: la residenza legale in Italia da almeno due anni, un permesso di soggiorno valido, un reddito annuo che rispetti il livello di vita del Paese e la conoscenza della lingua italiana. Fino al 2025, la richiesta si poteva presentare dopo un colloquio con un commissario e la decisione arrivava entro due anni.

La legge del 2025 ha introdotto importanti cambiamenti. Il tempo di residenza richiesto è stato ridotto da due a quattro anni, ma la procedura è diventata più rapida: se la documentazione è completa, la risposta deve arrivare entro un anno. Inoltre, per la prima volta, chi ha vissuto in Italia fin da bambino e ha frequentato le scuole italiane per almeno un ciclo completo può presentare domanda di cittadinanza già a diciotto anni, senza dover dimostrare il reddito richiesto.

Il nuovo testo introduce anche il cosiddetto "silenzio-assenso": se lo Stato non risponde entro il termine previsto, la domanda si considera accettata. La cittadinanza, una volta concessa, è permanente e non si può perdere, tranne che per motivi molto gravi e previsti dalla legge.`,
  },
  {
    id: 'passage-lettura-p2-c8',
    kind: 'reading',
    title: 'Come scrivere una mail formale',
    source: SOURCE,
    content: `Scrivere una mail formale in italiano non è difficile, ma (1) pochi dettagli fanno la differenza.

In primo luogo, l'oggetto (2) deve essere chiaro e breve: "Richiesta di informazioni sul permesso di soggiorno" è meglio di "Gentile signore". Poi, l'esordio (3) è obbligatorio: "Gentile signor Rossi," oppure "Le scrivo per…", che è l'inizio più usato negli uffici.

Nel corpo del messaggio si spiega il motivo (4) si scrive in modo semplice, con il " Lei" formale: non "ti scrivo", ma "Le scrivo". Se si ringrazia, si usa "La ringrazio per l'attenzione" e non "Grazie per l'attenzione".

Alla fine (5) non si mette solo "ciao": la chiusura corretta è "Cordiali saluti" o "Distinti saluti". Il mittente firma con nome e cognome e, se lavora in un ufficio, aggiunge il ruolo e il recapito (6) di contatto.`,
  },
]

export const QUESTIONS_BATCH3: Question[] = [
  /* ---------------- Ascolto P1 (lote 3) — 6 MCQ --------------------------- */
  {
    id: 'ascolto-p1-c5-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-c5',
    itemType: 'mcq3',
    order: 1,
    stem: 'Le verdure del mercato finiscono',
    passageId: 'passage-ascolto-p1-c5',
    options: ['verso l\'una.', 'alle 14.', 'non prima delle 15.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Le verdure le finisce verso l\'una”. O mercado fecha às 14.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-c5-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-c5',
    itemType: 'mcq3',
    order: 2,
    stem: 'Il check-out deve essere fatto',
    passageId: 'passage-ascolto-p1-c5',
    options: ['entro le 10.', 'entro le 11.', 'prima delle 8.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Entro le 10”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-c5-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-c5',
    itemType: 'mcq3',
    order: 3,
    stem: 'Il medico prescrive',
    passageId: 'passage-ascolto-p1-c5',
    options: [
      'un antibiotico.',
      'un antipiretico.',
      'una radiografia.',
    ],
    correctIndex: 1,
    pointsPerItem: 1,
    explanation:
      '“Non serve, per una virgolite. Le prescrivo un antipiretico e riposi”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-c5-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-c5',
    itemType: 'mcq3',
    order: 4,
    stem: 'Il biglietto dell\'autobus è valido anche',
    passageId: 'passage-ascolto-p1-c5',
    options: ['per il metro.', 'per i treni.', 'solo per gli autobus.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Lo stesso biglietto vale anche per il metro”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-c5-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-c5',
    itemType: 'mcq3',
    order: 5,
    stem: 'Senza ricevuta, il negozio offre',
    passageId: 'passage-ascolto-p1-c5',
    options: [
      'uno sconto del venti per cento.',
      'il cambio della giacca.',
      'nessuna soluzione.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Allora posso fare lo sconto del venti per cento”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-c5-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-c5',
    itemType: 'mcq3',
    order: 6,
    stem: 'Il medicinale urgente si compra',
    passageId: 'passage-ascolto-p1-c5',
    options: ['senza ricetta.', 'solo con ricetta.', 'solo in farmacia di turno.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Può comprarlo direttamente li, senza ricetta”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },

  /* ---------------- Ascolto P2 (lote 3) — 8 V/F --------------------------- */
  {
    id: 'ascolto-p2-c6-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 1,
    stem: 'Gli stranieri con permesso di soggiorno e lavoro in Italia hanno la sanità garantita.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“La sanità… è garantita a chi ha il permesso di soggiorno e lavora in Italia”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-c6-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 2,
    stem: 'I corsi di lingua del Comune sono sempre gratuiti.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: 'Sono “a prezzi ridotti”, não gratuitos.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-c6-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 3,
    stem: 'Il servizio di doposcuola è pensato soprattutto per le scuole primarie.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Soprattutto nella scuola primaria”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-c6-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 4,
    stem: 'Gli stranieri residenti da almeno tre anni possono votare alle elezioni nazionali.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“Possono votare nelle elezioni locali, ma non in quelle nazionali”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-c6-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 5,
    stem: 'Il governo ha promesso di allargare il diritto di voto, ma non è ancora legge.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il governo ha promesso di allargare questo diritto, però non è ancora legge”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-c6-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 6,
    stem: 'I corsi di formazione per adulti accettano anche chi non ha il diploma.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Accettano anche chi non ha il diploma”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-c6-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 7,
    stem: 'Chi lavora ha diritto a permessi per la formazione.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Chi lavora ha diritto a permessi per formazione”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-c6-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-c6',
    itemType: 'truefalse',
    order: 8,
    stem: 'Lo sportello del Comune offre anche l\'aiuto di un mediatore linguistico.',
    passageId: 'passage-ascolto-p2-c6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Anche con l\'aiuto di un mediatore linguistico”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (lote 3) — 8 V/F --------------------------- */
  {
    id: 'lettura-p1-c7-1',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 1,
    stem: 'La naturalizzazione spetta allo Stato.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“La strada più seguita è la naturalizzazione, che spetta allo Stato”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-c7-2',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 2,
    stem: 'Fino al 2025 la domanda si poteva presentare dopo due anni di residenza legale.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“La residenza legale in Italia da almeno due anni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-c7-3',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 3,
    stem: 'La legge del 2025 ha ridotto il tempo di residenza richiesto.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il tempo di residenza richiesto è stato ridotto da due a quattro anni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-c7-4',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 4,
    stem: 'Chi ha studiato in Italia può chiedere la cittadinanza a diciotto anni senza dimostrare il reddito.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Può presentare domanda di cittadinanza già a diciotto anni, senza dover dimostrare il reddito richiesto”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-c7-5',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 5,
    stem: 'Con la nuova legge, se lo Stato non risponde entro il termine, la domanda viene respinta.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'É o contrário: com o “silenzio-assenso”, a domanda “si considera accettata”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-c7-6',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 6,
    stem: 'La cittadinanza concessa è permanente.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Una volta concessa, è permanente”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-c7-7',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 7,
    stem: 'La cittadinanza può essere revocata per fatti molto gravi previsti dalla legge.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Non si può perdere, tranne che per motivi molto gravi e previsti dalla legge”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-c7-8',
    skill: 'lettura',
    taskId: 'lettura-p1-c7',
    itemType: 'truefalse',
    order: 8,
    stem: 'Con la nuova legge, la decisione arriva entro un anno se la documentazione è completa.',
    passageId: 'passage-lettura-p1-c7',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Se la documentazione è completa, la risposta deve arrivare entro un anno”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P2 (lote 3) — 6 cloze (gramática) -------------- */
  {
    id: 'lettura-p2-c8-1',
    skill: 'lettura',
    taskId: 'lettura-p2-c8',
    itemType: 'cloze',
    order: 1,
    stem: 'Scrivere una mail formale in italiano non è difficile, ma (1) pochi dettagli fanno la differenza.',
    passageId: 'passage-lettura-p2-c8',
    options: ['alcuni', 'qualche', 'pochi pochi'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'Com substantivo plural: “ma alcuni pochi dettagli fanno la differenza”.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-c8-2',
    skill: 'lettura',
    taskId: 'lettura-p2-c8',
    itemType: 'cloze',
    order: 2,
    stem: 'L\'oggetto (2) deve essere chiaro e breve.',
    passageId: 'passage-lettura-p2-c8',
    options: ['della mail', 'di mail', 'a mail'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“L\'oggetto della mail” — preposição + nome con artículo.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-c8-3',
    skill: 'lettura',
    taskId: 'lettura-p2-c8',
    itemType: 'cloze',
    order: 3,
    stem: 'Poi, l\'esordio (3) è obbligatorio.',
    passageId: 'passage-lettura-p2-c8',
    options: ['di apertura', 'a apertura', 'da apertura'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“L\'esordio di apertura” — a abertura da mensagem.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-c8-4',
    skill: 'lettura',
    taskId: 'lettura-p2-c8',
    itemType: 'cloze',
    order: 4,
    stem: 'Nel corpo del messaggio si spiega il motivo (4) si scrive in modo semplice.',
    passageId: 'passage-lettura-p2-c8',
    options: ['e', 'ma', 'perché'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'A conjunção “e” liga as duas orações (“si spiega… e si scrive…”).',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-c8-5',
    skill: 'lettura',
    taskId: 'lettura-p2-c8',
    itemType: 'cloze',
    order: 5,
    stem: 'Alla fine (5) non si mette solo "ciao".',
    passageId: 'passage-lettura-p2-c8',
    options: ['non', 'niente', 'mai'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Alla fine non si mette solo ‘ciao’” — negação com “non”.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-c8-6',
    skill: 'lettura',
    taskId: 'lettura-p2-c8',
    itemType: 'cloze',
    order: 6,
    stem: 'Il mittente firma con nome e cognome e aggiunge il ruolo e il recapito (6) di contatto.',
    passageId: 'passage-lettura-p2-c8',
    options: ['telefonico', 'telefono', 'telefoniche'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il recapito telefonico” — adjetivo concorda com “recapito” (masculino).',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
]
