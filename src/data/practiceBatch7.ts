/**
 * LOTE 7 DO BANCO DE PRÁTICA — mais ascolto e mais leitura.
 *
 * - 2 transcrições de ascolto com 6 scelte multiple (A1 e B1);
 * - 1 "gémeo de áudio" de um texto cívico com 8 vero/falso (B1);
 * - 1 texto di lettura con 8 vero/falso (B1);
 * - 1 testo di grammatica con 6 lacune (B1).
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'Contenuto originale CILS B1 Prep — pratica non ufficiale'

export const PASSAGES_BATCH7: Passage[] = [
  {
    id: 'passage-ascolto-p1-g1',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 7, A1) — um dia qualquer',
    source: SOURCE,
    content: `1.
— Buongiorno, vorrei sapere se le camere sono libere per il fine settimana.
— Sì, abbiamo una doppia con terrazza e una tripla.
— La doppia con terrazza quanto costa?
— Novanta euro a notte, colazione compresa. Per due notti fanno centosessanta.
(stacco musicale)
2.
— Scusi, posso pagare con il bancomat anche per il caffè?
— Certamente, il bancomat è lì. Oppure può pagare in contanti.
— Allora in contanti. Tenga, il biglietto da cinque euro.
— Perfetto, grazie. Ha bisogno di altro?
— No, grazie, era solo per sapere l'orario.
(stacco musicale)
3.
— Buongiorno, il treno per la spiaggia parte dal binario 7?
— Sì, ma parte solo d'estate. In inverno parte dalla stazione centrale.
— E quanto dura il viaggio?
— Circa un'ora e un quarto. Si ferma a tre stazioni lungo il mare.
(stacco musicale)
4.
— Buongiorno, vorrei un caffè e un cornetto.
— Il cornetto è caldo, è appena uscito dal forno.
— Perfetto. Posso pagare con il telefono?
— Sì, basta avvicinare il telefono al lettore. E non dimenticate la ricevuta!
(stacco musicale)
5.
— Scusi, l'ufficio postale è aperto oggi?
— No, il sabato l'ufficio postale è chiuso. La rottina si fa al bar qui vicino.
— Ah, va bene. E domani?
— Domani è lunedì, quindi sì, dalle 9 alle 13.
(stacco musicale)
6.
— Buongiorno, questo zaino è per la gita?
— Sì, è per la gita in montagna. Ci metto panino, acqua e giacca.
— Ma piove, no? Meglio portare anche l'ombrello.
— Hai ragione, me lo prendo. Grazie!`,
  },
  {
    id: 'passage-ascolto-p1-g2',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 7, B1) — o SSM e os crepitanti',
    source: SOURCE,
    content: `1.
— Buongiorno, vorrei prenotare un colloquio per l'assistenza domiciliare.
— Certamente. Ha già il CUFM (Codice Univoco di Fascicolo Motivo)?
— No, non so di cosa si tratta.
— È il codice che il medico di base le dà quando apre il fascicolo. Me lo porti, altrimenti non posso procedere.
— Vado subito dal medico e torno domani.
(stacco musicale)
2.
— Scusi, per il servizio di igiene ambientale ci sono moduli diversi?
— Sì: uno per l'inizio dell'attività e un altro per ogni variazione, per esempio se cambia il nome dell'azienda.
— E il canone deve essere versato con bollettino?
— Esatto, con il bollettino intestato al servizio, non all'azienda. Se sbaglia l'intestatario, il pagamento non viene accettato.
(stacco musicale)
3.
— Buongiorno, ho ricevuto una multa per il divieto di sosta. Posso fare ricorso?
— Sì, entro trenta giorni. Serve la copia della multa e va presentata all'ufficio competente.
— E se ho perso il ticket del pagamento?
— Basta l'estratto conto del veicolo. Se l'ha perso, l'ufficio lo recupera dal sistema.
(stacco musicale)
4.
— Buongiorno, vorrei sapere come funziona la raccolta dei rifiuti porta a porta nel mio quartiere.
— Dal 2024 il comune ha introdotto il "porta a porta" in questa zona: i sacchi si lasciano davanti a casa, nel giorno indicato.
— E se non sono in casa?
— I sacchi restano fuori; basta non metterli in posti che blocchino il passaggio. Nei giorni di raccolta del vetro non si raccolgono altri rifiuti.
(stacco musicale)
5.
— Scusi, vorrei capire la differenza fra "residenza" e "domicilio".
— La residenza è dove si vive stabilmente, con l'iscrizione all'anagrafe. Il domicilio può essere temporaneo.
— E per il permesso di soggiorno conta la residenza?
— Sì, per il permesso conta la residenza. Se cambia casa, deve comunicarlo entro un mese, altrimenti la situazione non è più regolare.
(stacco musicale)
6.
— Buongiorno, vorrei un certificato di residenza per la banca.
— Certamente. Lo rilasciamo subito, ma per ritirarlo servono un documento e venti minuti.
— Posso inviare il certificato via email?
— Sì, ma solo se ha fatto la richiesta online con la SPID. Con la SPID, in tre giorni lavorativi, arriva a casa.`,
  },
  {
    id: 'passage-ascolto-p2-g3',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 7) — i rifiuti che non vengono raccolti',
    source: SOURCE,
    content: `A volte i rifiuti non vengono raccolti, e la ragione non è quasi mai il disordine. In una città come Bologna, dove la raccolta porta a porta copre la maggior parte delle zone, il problema più frequente è un altro: il numero di contenitori.

In alcuni quartieri i contenitori sono insufficienti per il numero di famiglie che scarica i rifiuti. Il risultato è che la raccolta finisce alle undici di sera, con il cassonetto strapieno e il mezzo che passa a metà notte. I residenti protestano perché il rumore disturba il sonno, ma il problema vero è che il cassonetto non basta.

Il Comune ha quindi deciso, in via sperimentale, di aumentare il numero di contenitori in quattro quartieri e di spostarli in posizioni più accessibili ai mezzi. La sperimentazione dura un anno: alla fine si confronteranno i dati delle raccolte, i costi e le segnalazioni dei cittadini.

C'è anche un aspetto che riguarda tutti, indipendentemente dal quartiere: i materiali che si buttano insieme non si riciclano. Un cassonetto con plastica, carta e vetro viene svuotato come rifiuto indifferenziato. È la ragione per cui la raccolta differenziata funziona solo se ciascuno separa bene.

Infine, chi ha bisogno di ritirare i rifiuti a casa, perché non può scendere con il cassonetto, può chiedere il "ritiro a domicilio" all'operatore: il servizio è gratuito per le persone con disabilità certificate e, a pagamento, per tutti gli altri.`,
  },
  {
    id: 'passage-lettura-p1-g4',
    kind: 'reading',
    title: 'Il mercato e la piccola distribuzione',
    source: SOURCE,
    content: `I mercati rionali sono una delle forme più antiche di distribuzione alimentare, e in molte città italiane sono anche un servizio pubblico. Il comune li organizza, li pulisce e garantisce che i banchi siano occupati, ma non decide che cosa si vende: quello lo fanno i rivenditori, che pagano un canone per il posto.

Ogni mercato ha i suoi giorni. In quello di un quartiere di Bologna, per esempio, il pesce si compra il martedì e il venerdì mattina, la verdura il giovedì e il pane tutti i giorni. Chi ci va spesso impara l'orario meglio di chi lo cerca online.

La qualità cambia molto da un banco all'altro, e i clienti abituali lo sanno: sono loro a fare, di fatto, la reputazione del mercato. Un cliente fedele che parla con il fruttivolo è la garanzia più efficace della qualità della merce.

I problemi, però, non mancano. Il numero di banchi è diminuito in dieci anni, perché molti venditori non riescono a coprire i costi del canone e del trasporto del merce. Inoltre, l'orario di chiusura anticipato (le 13 e30 in molti mercati) rende difficile per chi lavora usare il mercato, nonostante sia l'ora in cui la gente lavora.

Alcuni comuni hanno risposto trasformando il mercato in un punto di servizi: sportello bancomat, sportello postale, biblioteca, assistenza per le famiglie. La sperienza è positiva, dicono, e i venditori non ci perdono clienti, perché il mercato resta il posto dove si viene per fare la spesa e conoscere qualcuno.`,
  },
  {
    id: 'passage-lettura-p2-g5',
    kind: 'reading',
    title: 'Perché la lingua si impara in certi luoghi',
    source: SOURCE,
    content: `C'è un luogo dove l'italiano si impara con una facilità che non si spiega: è la scuola del mattino, il doposcuola, o il centro sociale del quartiere. Non per la qualità dei docenti, ma per la quantità di occasioni.

In una classe per stranieri, le regole sono semplici: si parla solo la lingua che si sta imparando. Un errore non è una colpa, è un materiale. Questo cambia tutto rispetto allo studio tra adulti, dove spesso si ha paura di sbagliare e si preferisce tacere.

Il secondo motivo è la routine. Chi va a lezione tre volte alla settimana per sei mesi crea un'abitudine: la lingua smette di essere qualcosa che si studia e diventa il modo in cui si parla. La differenza fra chi studia l'italiano e chi lo usa sta quasi tutta lì.

C'è poi un aspetto meno ovvio, che riguarda la grammatica. Nella scuola si studiano i tempi verbali, gli ausiliari, i pronomi, e insomma quella parte della lingua che da sola non basta mai. Ma la grammatica, in un contesto in cui si parla, si impara per prima: si sente che "sono arrivato tardi" è diverso da "ero arrivato tardi" perché la frase è stata detta, non letta.

Il risultato di tutto questo è che, in molti corsi, l'apprendimento della lingua e l'uso della lingua coincidono. Non è una coincidenza: è il progetto.`,
  },
]

export const QUESTIONS_BATCH7: Question[] = [
  /* ---------------- Ascolto P1 (lote 7, A1) — 6 MCQ --------------------- */
  {
    id: 'ascolto-p1-g1-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g1',
    itemType: 'mcq3',
    order: 1,
    stem: 'La doppia con terrazza costa',
    passageId: 'passage-ascolto-p1-g1',
    options: [
      'novanta euro a notte, colazione compresa.',
      'centosessanta euro a notte.',
      'novanta euro per due notti.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Novanta euro a notte, colazione compresa. Per due notti fanno centosessanta”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g1-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g1',
    itemType: 'mcq3',
    order: 2,
    stem: 'Per il caffè si può pagare',
    passageId: 'passage-ascolto-p1-g1',
    options: [
      'in contanti o con il bancomat.',
      'solo in contanti.',
      'solo con il bancomat.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il bancomat è lì. Oppure può pagare in contanti”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g1-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g1',
    itemType: 'mcq3',
    order: 3,
    stem: 'In inverno il treno per la spiaggia parte',
    passageId: 'passage-ascolto-p1-g1',
    options: [
      'dalla stazione centrale.',
      'dal binario 7.',
      'dal binacio 5.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“In inverno parte dalla stazione centrale”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g1-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g1',
    itemType: 'mcq3',
    order: 4,
    stem: 'Il cornetto è',
    passageId: 'passage-ascolto-p1-g1',
    options: [
      'appena uscito dal forno.',
      'del giorno prima.',
      'sempre surgelato.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il cornetto è caldo, è appena uscito dal forno”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g1-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g1',
    itemType: 'mcq3',
    order: 5,
    stem: 'Il sabato l\'ufficio postale',
    passageId: 'passage-ascolto-p1-g1',
    options: ['è chiuso.', 'è aperto fino alle 19.', 'chiude alle 13.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il sabato l\'ufficio postale è chiuso”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g1-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g1',
    itemType: 'mcq3',
    order: 6,
    stem: 'Per la gita in montagna conviene portare',
    passageId: 'passage-ascolto-p1-g1',
    options: [
      'anche l\'ombrello, perché piove.',
      'solo il panino e l\'acqua.',
      'un cappello, perché fa caldo.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Ma piove, no? Meglio portare anche l\'ombrello”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },

  /* ---------------- Ascolto P1 (lote 7, B1) — 6 MCQ --------------------- */
  {
    id: 'ascolto-p1-g2-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g2',
    itemType: 'mcq3',
    order: 1,
    stem: 'Per l\'assistenza domiciliare serve il',
    passageId: 'passage-ascolto-p1-g2',
    options: ['CUFM.', 'CUP.', 'codice fiscale.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Ha già il CUFM? … È il codice che il medico di base le dà”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g2-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g2',
    itemType: 'mcq3',
    order: 2,
    stem: 'Il canone del servizio rifiuti si paga con bollettino intestato',
    passageId: 'passage-ascolto-p1-g2',
    options: [
      'al servizio, non all\'azienda.',
      'all\'azienda.',
      'al comune.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Con il bollettino intestato al servizio, non all\'azienda”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g2-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g2',
    itemType: 'mcq3',
    order: 3,
    stem: 'Il ricorso di una multa si può presentare entro',
    passageId: 'passage-ascolto-p1-g2',
    options: ['trenta giorni.', 'dieci giorni.', 'novanta giorni.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Sì, entro trenta giorni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g2-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g2',
    itemType: 'mcq3',
    order: 4,
    stem: 'Nella raccolta porta a porta i sacchi si lasciano',
    passageId: 'passage-ascolto-p1-g2',
    options: [
      'davanti a casa, nel giorno indicato.',
      'nel cortile, la sera prima.',
      'dentro, presso la porta.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“I sacchi si lasciano davanti a casa, nel giorno indicato”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g2-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g2',
    itemType: 'mcq3',
    order: 5,
    stem: 'Il permesso di soggiorno tiene conto',
    passageId: 'passage-ascolto-p1-g2',
    options: ['della residenza.', 'del domicilio.', 'del lavoro.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Per il permesso conta la residenza”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-g2-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-g2',
    itemType: 'mcq3',
    order: 6,
    stem: 'Il certificato di residenza per la banca si ritira',
    passageId: 'passage-ascolto-p1-g2',
    options: [
      'con un documento, in venti minuti.',
      'in tre giorni lavorativi.',
      'solo per posta.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Lo rilasciamo subito… servono un documento e venti minuti”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Ascolto P2 (lote 7) — 8 V/F --------------------------- */
  {
    id: 'ascolto-p2-g3-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 1,
    stem: 'Il motivo più frequente dei rifiuti non raccolti è il disordine.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“La ragione non è quasi mai il disordine. Il problema è il numero di contenitori”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-g3-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 2,
    stem: 'In alcuni quartieri i contenitori sono insufficienti.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“In alcuni quartieri i contenitori sono insufficienti per il numero di famiglie”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-g3-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 3,
    stem: 'La raccolta finisce spesso alle undici di sera.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…finisce alle undici di sera, con il cassonetto strapieno”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-g3-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 4,
    stem: 'Il Comune ha aumentato i contenitori in tutti i quartieri.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: 'L\'aumento è sperimentale “in quattro quartieri”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-g3-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 5,
    stem: 'La sperimentazione dura un anno.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“La sperimentazione dura un anno”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-g3-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 6,
    stem: 'Un cassonetto con plastica, carta e vetro viene svuotato come rifiuto indifferenziato.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Un cassonetto con plastica, carta e vetro viene svuotato come rifiuto indifferenziato”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-g3-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 7,
    stem: 'Il ritiro a domicilio è gratuito solo per chi ha una disabilità certificata.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'É gratuito “per le persone con disabilità certificate e, a pagamento, per tutti gli altri”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-g3-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-g3',
    itemType: 'truefalse',
    order: 8,
    stem: 'Chi non può scendere con il cassonetto può chiedere il ritiro a domicilio all\'operatore.',
    passageId: 'passage-ascolto-p2-g3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Può chiedere il ‘ritiro a domicilio’ all\'operatore”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (lote 7) — 8 V/F --------------------------- */
  {
    id: 'lettura-p1-g4-1',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 1,
    stem: 'In molti comuni il mercato è un servizio pubblico organizzato dal comune.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“In molte città italiane sono anche un servizio pubblico. Il comune li organizza”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-g4-2',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 2,
    stem: 'Il comune decide che cosa si vende al mercato.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Non decide che cosa si vende: quello lo fanno i rivenditori”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-g4-3',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 3,
    stem: 'I clienti abituali garantiscono la qualità della merce.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Un cliente fedele… è la garanzia più efficace della qualità della merce”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-g4-4',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 4,
    stem: 'Il numero di banchi è aumentato negli ultimi dieci anni.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Il numero di banchi è diminuito in dieci anni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-g4-5',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 5,
    stem: 'In molti mercati la chiusura è alle 13 e30.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“L\'orario di chiusura anticipato (le 13 e30 in molti mercati)”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-g4-6',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 6,
    stem: 'Trasformare il mercato in punto di servizi ha ridotto i clienti dei venditori.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“I venditori non ci perdono clienti”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-g4-7',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 7,
    stem: 'Il numero di banchi diminuisce perché molti venditori non coprono i costi.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Molti venditori non riescono a coprire i costi del canone e del trasporto del merce”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-g4-8',
    skill: 'lettura',
    taskId: 'lettura-p1-g4',
    itemType: 'truefalse',
    order: 8,
    stem: 'I clienti abituali conoscono l\'orario del mercato meglio di chi lo cerca online.',
    passageId: 'passage-lettura-p1-g4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Chi ci va spesso impara l\'orario meglio di chi lo cerca online”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P2 (lote 7) — 6 cloze -------------------------- */
  {
    id: 'lettura-p2-g5-1',
    skill: 'lettura',
    taskId: 'lettura-p2-g5',
    itemType: 'cloze',
    order: 1,
    stem: 'Nella scuola del mattino l\'italiano si impara con una facilità che non si spiega: è la scuola del mattino, il doposcuola, o il centro sociale (1) quartiere.',
    passageId: 'passage-lettura-p2-g5',
    options: ['del', 'di', 'a'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il centro sociale del quartiere” — preposição + artigo.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-g5-2',
    skill: 'lettura',
    taskId: 'lettura-p2-g5',
    itemType: 'cloze',
    order: 2,
    stem: 'Un errore non è una colpa, è (2) materiale.',
    passageId: 'passage-lettura-p2-g5',
    options: ['un', 'uno', "un'"],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Materiale” é masculino: “è un materiale”.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-g5-3',
    skill: 'lettura',
    taskId: 'lettura-p2-g5',
    itemType: 'cloze',
    order: 3,
    stem: 'Chi va a lezione tre volte alla settimana per sei mesi crea (3) abitudine.',
    passageId: 'passage-lettura-p2-g5',
    options: ['un\'', 'una', 'uno'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Crea un\'abitudine” — feminino.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-g5-4',
    skill: 'lettura',
    taskId: 'lettura-p2-g5',
    itemType: 'cloze',
    order: 4,
    stem: 'La grammatica, in un contesto in cui si parla, si impara (4) prima.',
    passageId: 'passage-lettura-p2-g5',
    options: ['per', 'di', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Si impara per prima” — preposição.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-g5-5',
    skill: 'lettura',
    taskId: 'lettura-p2-g5',
    itemType: 'cloze',
    order: 5,
    stem: 'La differenza fra chi studia l\'italiano e chi lo usa sta quasi (5) lì.',
    passageId: 'passage-lettura-p2-g5',
    options: ['tutto', 'tutta', 'tutti'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Sta quasi tutto lì” — locuzione.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-g5-6',
    skill: 'lettura',
    taskId: 'lettura-p2-g5',
    itemType: 'cloze',
    order: 6,
    stem: 'In molti corsi l\'apprendimento della lingua e l\'uso della lingua (6).',
    passageId: 'passage-lettura-p2-g5',
    options: ['coincidono', 'coincide', 'coincidono a'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Coincidono” — sujeito plural e verbo plural.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
]
