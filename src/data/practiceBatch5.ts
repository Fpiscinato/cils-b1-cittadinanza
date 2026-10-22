/**
 * LOTE 5 DO BANCO DE PRÁTICA — mais ascolto e mais leitura.
 *
 * - 2 transcrições de ascolto com 6 scelte multiple (A1 e A2);
 * - 2 "gémeos de áudio" de textos cívicos com 8 vero/falso cada (B1);
 * - 1 texto de leitura com 8 vero/falso (B1);
 * - 1 texto de gramática com 6 lacunas (A2).
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'Contenuto originale CILS B1 Prep — pratica non ufficiale'

export const PASSAGES_BATCH5: Passage[] = [
  {
    id: 'passage-ascolto-p1-d9',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 5) — dal sarto, in autonoleggio, dal meccanico',
    source: SOURCE,
    content: `1.
— Buongiorno, vorrei un paio di jeans e una giacca leggera.
— Guardi, abbiamo questi blu e questi neri. Prova i jeans, sono di cotone italiano.
— Vanno bene, ma costano quarantacinque euro.
— Se li compra insieme alla giacca le faccio quarantadue.
(stacco musicale)
2.
— Buongiorno, vorrei noleggiare un'auto per tre giorni.
— Per che tipo di viaggio? City car, SUV o-station?
— Solo per la città, e qualche gita. Una city car va bene.
— Costa quaranta euro al giorno con il carburante compreso. Ha la patente?
— Sì, ce l'ho da tre anni.
(stacco musicale)
3.
— Buongiorno, l'auto non parte. Ha la spia della batteria accesa.
— Ah, è vero, ieri ho dimenticato le luci.
— Le carico un attimo? Se non parte, la porto in un'altra officina.
— Grazie, ma preferisco aspettare qui. Quanto tempo ci vuole?
— Una mezz'ora, se la batteria non è completamente scarica.
(stacco musicale)
4.
— Buongiorno, abbiamo una camera matrimoniale e una doppia con letti singoli.
— Quale preferisce?
— La doppia, se possibile. Lavoro di notte e ho bisogno di dormire bene.
— Va bene, la 25. La colazione è dalle 7 alle 9 e il check-out è alle 11.
(stacco musicale)
5.
— Scusi, la piscina del centro sportivo è aperta al pubblico?
— Sì, ma solo ai soci. Per i non soci c'è la piscina comunale, aperta a tutti.
— Quanto costa l'ingresso?
— Due euro per gli adulti, un euro per gli studenti con il biglietto.
(stacco musicale)
6.
— Buongiorno, vorrei un pacco per l'estero.
— Deve dichiarare il contenuto. Cosa c'è dentro?
— Due libri e un maglione. Niente liquidi pericolosi, niente batterie.
— Perfetto. Con la spedizione EXPRESS arriva in tre giorni, costa dodici euro.`,
  },
  {
    id: 'passage-ascolto-p1-e1',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 5, A2) — progetti, ricordi e programmi',
    source: SOURCE,
    content: `1.
— Buongiorno, come state?
— Molto bene, grazie. Io ho cambiato casa l'anno scorso e non mi sono ancora abituata.
— Ah, capisco. Il quartiere è diverso?
— Sì, ma è più tranquillo. Prima abitavo in centro, con tutto il rumore.
(stacco musicale)
2.
— Scusi, ha visto il mio bagaglio? Non lo trovo da un'ora.
— Mi faccia pensare... Era vicino alla biglietteria, no?
— Sì, l'ho appena ritrovato. Grazie mille.
— Ha un volo impegnativo o è solo una pausa?
— Sto aspettando il treno per Milano; partiva alle sei.
(stacco musicale)
3.
— Che cosa farai quest'estate?
— Penso di fare un viaggio in treno: volevo visitare il Sud, ma non avevo mai preso quel treno.
— È un'ottima idea. Hai già prenotato?
— Non ancora, preferivo aspettare i saldi. Poi ho deciso di andare a cena al ristorante di pesce.
(stacco musicale)
4.
— Ti ricordi quando andavamo a quel mercato?
— Sì, il mercato del sabato mattina. Mio padre comprava sempre le mele.
— Erano buonissime. Adesso quel negozio è diventato una libreria.
— Peccato, non ci vado più da anni. Comunque, non mi ricordo se abbiamo già visitato quel museo.
(stacco musicale)
5.
— Buongiorno, vorrei sapere quando parte il prossimo treno per Bologna.
— Ce n'è uno tra venti minuti e uno fra un'ora e mezza.
— Meglio quello fra un'ora e mezza, devo passare a casa.
— Allora biglietto di seconda classe, ventidue euro?
— Sì, e un posto vicino al finestrino, per favore.
(stacco musicale)
6.
— Scusi, il professore non è arrivato?
— No, mi ha scritto che la lezione è annullata perché era malato.
— Ah, capisco. Allora potrò ripassare il capitolo a casa.
— Sì, le slide sono già sulla piattaforma.`,
  },
  {
    id: 'passage-ascolto-p2-e2',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 5) — le regole del campostanato',
    source: SOURCE,
    content: `In molte città universitarie italiane il campostanato è regolato da un regolamento comunale. A Bologna, per esempio, per soggiornare nella città studentesca è necessario iscriversi all'anagrafe degli studenti e presentare un contratto di affitto o una dichiarazione dell'università.

Il regolamento prevede il divieto di affittare singole stanze a studenti dello stesso sesso, un tempo diffuso in molte città. La norma è stata pensata per evitare situazioni di disagio negli appartamenti condivisi, anche se oggi il dibattito è molto aperto e diverse città hanno cambiato le regole.

Chi non rispetta il regolamento rischia una sanzione amministrativa, che va da una multa leggera alla decadenza dall'iscrizione. Non tutte le città però prevedono la decadenza: a Pisa e a Padova, per esempio, la sanzione è più lieve.

Un altro aspetto riguarda il numero di abitanti percamera: in alcune città il regolamento fissa un limite di due studenti per camera, mentre in altre città non c'è un numero preciso. Il Comune di Firenze, ad esempio, parla genericamente di "stanze adatte".

Infine, il regolamento riguarda anche il chiasso: sono vietati gli schiamazzi notturni e gli assembramenti in strada dopo le 23. Le forze dell'ordine possono elevare una multa e, nei casi più gravi, segnalare i comportamenti ripetuti all'università.`,
  },
  {
    id: 'passage-ascolto-p2-e3',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 5) — i mezzi di trasporto in città',
    source: SOURCE,
    content: `Negli ultimi anni i comuni italiani hanno cercato di ridurre il traffico in centro. Le misure più comuni sono tre: l'aumento dei parcheggi bianchi, la creazione di aree pedonali e il potenziamento dei mezzi pubblici.

Secondo un rapporto pubblicato da un'associazione di Mobilità, i centri storici in cui il limite di velocità è trenta chilometri orari hanno visto diminuire gli incidenti del quindici per cento. Nelle città che hanno invece creato più corsie riservate ai mezzi pubblici, il tempo medio di percorrenza in centro è calato di circa due minuti.

Anche il bike sharing è cresciuto: in molte città si possono trovare sia le biciclette inSharing con pedale, sia i monopattini elettrici, che si nolegano con l'applicazione e si lasciano in aree segnalate. Le nuove ciclabili hanno superato i mille chilometri in dieci città italiane.

Non tutto, però, è andato come previsto. Molti cittadini si lamentano del caos lasciato dai monopattini: i veicoli abbandonati sui marciapiedi sono un problema segnalato ovunque. Per questo motivo alcuni comuni hanno impose un parcheggio obbligatorio in aree delimitate e un limite di velocità più basso per i monopattini elettrici.

Anche il costo dei biglietti divide. In alcune città è stato introdotto un abbonamento unico che comprende bus, metro e treni, con prezzi scontati per studenti e pensionati. Secondo i dati del rapporto, chi usa l'abbonamento unico viaggia in media il venti per cento in più rispetto a chi compra il biglietto singolo.`,
  },
  {
    id: 'passage-lettura-p1-e4',
    kind: 'reading',
    title: 'La biblioteca comunale e i servizi per chi studia',
    source: SOURCE,
    content: `La biblioteca comunale di una città media italiana offre molto più dei libri. Nelle sale di lettura ci sono postazioni con computer e accesso gratuito a internet, e in quasi tutte le biblioteche è disponibile un servizio di consulenza per cercare un libro, un articolo o una tesi.

Gli studenti universitari possono spesso accedere alle biblioteche anche attraverso convenzioni tra atenei: un docente fornisce la lista dei testi obbligatori e lo studente può prenderli in prestito con la tessera dell'università. I prestiti, in questo caso, durano più a lungo e si possono rinnovare una volta.

Un servizio ormai diffuso è la "biblioteca digitale": dal computer di casa si possono scaricare libri e articoli con una password, per un numero limitato di utenti contemporanei. Alcune biblioteche prestano anche tablet e laptop, disponibili su prenotazione per un massimo di due ore.

Chi preferisce studiare in casa può iscriversi al servizio di "presti a domicilio", che porta a casa i libri richiesti una volta alla settimana. Il servizio è gratuito per gli anziani e per le persone con mobilità ridotta, e a pagamento per tutti gli altri.

Infine, la biblioteca organizza attività gratuite: corsi di lingua per stranieri, gruppi di lettura, conferenze e un servizio di aiuto per la scrittura accademica, dove uno studente può essere seguito da un volontario che lo aiuta a rivedere un testo in italiano.`,
  },
  {
    id: 'passage-lettura-p2-e5',
    kind: 'reading',
    title: 'Che cosa cambia quando si cambia casa',
    source: SOURCE,
    content: `Quando ci si trasferisce in un'altra città, non cambia solo l'indirizzo. Cambiano le abitudini, i servizi e, spesso, la burocrazia.

La prima cosa da fare è comunicare il cambiamento di residenza al Comune di provenienza, di solito entro un termine che va da quindici giorni a tre mesi, a seconda del regolamento. Poi bisogna iscriversi all'anagrafe del nuovo Comune, portando il certificato di residenza, il passaporto o la carta d'identità e il contratto d'affitto.

Il medico di base cambia: bisogna scegliere un nuovo medico e comunicare il passaggio di residenza all'Asl, che invia il fascicolo del paziente al nuovo medico. Anche la scuola dei figli richiede l'iscrizione al nuovo circolo, con il certificato di iscrizione della scuola precedente.

Molti si chiedono se i vecchi conti restino aperti. La risposta è che dipende: i contratti di utenza (energia, acqua, internet) vanno chiusi o trasferiti entro un mese, mentre il telefono e la televisione si possono spostare con un semplice passaggio di proprietà.

Un consiglio pratico (1) mantenere la vecchia mailbox attiva per qualche mese: (2) per il cambio, perché spesso arrivano le bollette dell'estate. E ricordate di (3) comunicare l'indirizzo al datore di lavoro, alla banca e (4) all'assicurazione.`,
  },
]

export const QUESTIONS_BATCH5: Question[] = [
  /* ---------------- Ascolto P1 (lote 5) — 6 MCQ --------------------------- */
  {
    id: 'ascolto-p1-d9-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-d9',
    itemType: 'mcq3',
    order: 1,
    stem: 'I jeans e la giacca insieme costano',
    passageId: 'passage-ascolto-p1-d9',
    options: ['quarantadue euro.', 'quarantacinque euro.', 'quarantotto euro.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Se li compra insieme alla giacca le faccio quarantadue”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-d9-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-d9',
    itemType: 'mcq3',
    order: 2,
    stem: 'L\'autonoleggio costa',
    passageId: 'passage-ascolto-p1-d9',
    options: [
      'quaranta euro al giorno con il carburante.',
      'quaranta euro al giorno senza carburante.',
      'trenta euro al giorno con il carburante.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Costa quaranta euro al giorno con il carburante compreso”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-d9-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-d9',
    itemType: 'mcq3',
    order: 3,
    stem: 'Il meccanico dice che per caricare la batteria ci vuole',
    passageId: 'passage-ascolto-p1-d9',
    options: ['una mezz\'ora.', 'due ore.', 'cinque minuti.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Una mezz\'ora, se la batteria non è completamente scarica”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-d9-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-d9',
    itemType: 'mcq3',
    order: 4,
    stem: 'La camera scelta è la',
    passageId: 'passage-ascolto-p1-d9',
    options: ['doppia, camera 25.', 'matrimoniale, camera 12.', 'singola, camera 25.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“La doppia, se possibile… Va bene, la 25”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-d9-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-d9',
    itemType: 'mcq3',
    order: 5,
    stem: 'L\'ingresso alla piscina comunale costa',
    passageId: 'passage-ascolto-p1-d9',
    options: ['due euro.', 'un euro.', 'tre euro.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Due euro per gli adulti, un euro per gli studenti”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-d9-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-d9',
    itemType: 'mcq3',
    order: 6,
    stem: 'La spedizione EXPRESS arriva in',
    passageId: 'passage-ascolto-p1-d9',
    options: ['tre giorni.', 'cinque giorni.', 'una settimana.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Con la spedizione EXPRESS arriva in tre giorni, costa dodici euro”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },

  /* ---------------- Ascolto P1 (lote 5, A2) — 6 MCQ ----------------------- */
  {
    id: 'ascolto-p1-e1-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-e1',
    itemType: 'mcq3',
    order: 1,
    stem: 'La signora ha cambiato casa',
    passageId: 'passage-ascolto-p1-e1',
    options: [
      'l\'anno scorso e il nuovo quartiere è più tranquillo.',
      'due anni fa e il nuovo quartiere è più rumoroso.',
      'l\'anno scorso e preferisce il centro.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Ho cambiato casa l\'anno scorso… il nuovo quartiere è più tranquillo”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-e1-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-e1',
    itemType: 'mcq3',
    order: 2,
    stem: 'La persona cerca il treno per',
    passageId: 'passage-ascolto-p1-e1',
    options: ['Milano.', 'Bologna.', 'Roma.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Sto aspettando il treno per Milano; partiva alle sei”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-e1-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-e1',
    itemType: 'mcq3',
    order: 3,
    stem: 'Il progetto dell\'estate è',
    passageId: 'passage-ascolto-p1-e1',
    options: [
      'un viaggio in treno nel Sud e una cena al ristorante.',
      'una vacanza al mare già prenotata.',
      'un corso di italiano all\'estero.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      '“Volevo visitare il Sud… poi ho deciso di andare a cena al ristorante di pesce”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-e1-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-e1',
    itemType: 'mcq3',
    order: 4,
    stem: 'Il vecchio negozio del mercato è ora',
    passageId: 'passage-ascolto-p1-e1',
    options: ['una libreria.', 'un bar.', 'un supermercato.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Adesso quel negozio è diventato una libreria”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-e1-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-e1',
    itemType: 'mcq3',
    order: 5,
    stem: 'Il biglietto di seconda classe per Bologna costa',
    passageId: 'passage-ascolto-p1-e1',
    options: ['ventidue euro.', 'dodici euro.', 'trentadue euro.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Allora biglietto di seconda classe, ventidue euro?”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-e1-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-e1',
    itemType: 'mcq3',
    order: 6,
    stem: 'La lezione è stata annullata perché',
    passageId: 'passage-ascolto-p1-e1',
    options: ['il professore era malato.', 'c\'era troppa presenza.', 'il materiale non era pronto.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“La lezione è annullata perché era malato”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },

  /* ---------------- Ascolto P2 (lote 5) — 8 V/F --------------------------- */
  {
    id: 'ascolto-p2-e2-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 1,
    stem: 'A Bologna per soggiornare nella città studentesca serve l\'iscrizione all\'anagrafe degli studenti.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Per soggiornare nella città studentesca è necessario iscriversi all\'anagrafe degli studenti”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e2-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 2,
    stem: 'Tutte le città hanno le stesse regole sul campostanato.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“Non tutte le città però prevedono la decadenza” e “diverse città hanno cambiato le regole”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e2-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 3,
    stem: 'Chi non rispetta il regolamento può perdere l\'iscrizione all\'università.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Chi non rispetta il regolamento rischia… la decadenza dall\'iscrizione”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e2-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 4,
    stem: 'A Pisa e a Padova la sanzione è più lieve.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“A Pisa e a Padova, per esempio, la sanzione è più lieve”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e2-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 5,
    stem: 'Ogni città fissa un limite preciso di studenti per camera.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“In alcune città il regolamento fissa un limite di due studenti per camera, mentre in altre città non c\'è un numero preciso”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e2-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 6,
    stem: 'Il regolamento di Firenze usa un\'espressione generica.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il Comune di Firenze… parla genericamente di ‘stanze adatte’”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e2-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 7,
    stem: 'Gli assembramenti in strada sono vietati prima delle 23.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Sono vietati gli schiamazzi notturni e gli assembramenti in strada dopo le 23”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e2-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e2',
    itemType: 'truefalse',
    order: 8,
    stem: 'Le forze dell\'ordine possono segnalare i comportamenti ripetuti all\'università.',
    passageId: 'passage-ascolto-p2-e2',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Possono elevare una multa e, nei casi più gravi, segnalare i comportamenti ripetuti all\'università”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 1,
    stem: 'Una delle misure per ridurre il traffico è l\'aumento dei parcheggi bianchi.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Le misure più comuni sono tre: l\'aumento dei parcheggi bianchi…”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 2,
    stem: 'Nelle città con limite di trenta chilometri orari gli incidenti sono aumentati.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Hanno visto diminuire gli incidenti del quindici per cento”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 3,
    stem: 'Le ciclovie esistenti superano i mille chilometri in dieci città.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Le nuove ciclabili hanno superato i mille chilometri in dieci città italiane”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 4,
    stem: 'I monopattini elettrici si lasciano in aree delimitate.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…si lasciano in aree segnalate”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 5,
    stem: 'Alcuni comuni hanno imposto un limite di velocità più basso per i monopattini.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“…e un limite di velocità più basso per i monopattini elettrici”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 6,
    stem: 'L\'abbonamento unico comprende bus, metro e treni.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…comprende bus, metro e treni, con prezzi scontati per studenti e pensionati”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 7,
    stem: 'Chi usa l\'abbonamento unico viaggia meno di chi compra il biglietto singolo.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Viaggia in media il venti per cento in più”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-e3-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-e3',
    itemType: 'truefalse',
    order: 8,
    stem: 'Il prezzo degli abbonamenti divide i cittadini.',
    passageId: 'passage-ascolto-p2-e3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Anche il costo dei biglietti divide”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (lote 5) — 8 V/F --------------------------- */
  {
    id: 'lettura-p1-e4-1',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 1,
    stem: 'Nelle biblioteche comunali ci sono postazioni con computer e internet gratuito.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…postazioni con computer e accesso gratuito a internet”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-e4-2',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 2,
    stem: 'Gli studenti possono prendere in prestito libri con la tessera dell\'università.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Un docente fornisce la lista dei testi obbligatori e lo studente può prenderli in prestito con la tessera dell\'università”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-e4-3',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 3,
    stem: 'Con le convenzioni, i prestiti durano meno di quelli normali.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“I prestiti, in questo caso, durano più a lungo”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-e4-4',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 4,
    stem: 'La biblioteca digitale permette scaricare articoli con una password.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…si possono scaricare libri e articoli con una password”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-e4-5',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 5,
    stem: 'I tablet e i laptop si possono prenotare per un massimo di due ore.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…disponibili su prenotazione per un massimo di due ore”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-e4-6',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 6,
    stem: 'Il servizio di prestiti a domicilio è gratuito solo per gli anziani.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'È gratuito “per gli anziani e per le persone con mobilità ridotta, e a pagamento per tutti gli altri”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-e4-7',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 7,
    stem: 'La biblioteca organizza corsi di lingua per stranieri.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Attività gratuite: corsi di lingua per stranieri, gruppi di lettura…”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-e4-8',
    skill: 'lettura',
    taskId: 'lettura-p1-e4',
    itemType: 'truefalse',
    order: 8,
    stem: 'Il servizio di aiuto alla scrittura accademica è seguito da un volontario.',
    passageId: 'passage-lettura-p1-e4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“…uno studente può essere seguito da un volontario che lo aiuta a rivedere un testo in italiano”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P2 (lote 5) — 6 cloze -------------------------- */
  {
    id: 'lettura-p2-e5-1',
    skill: 'lettura',
    taskId: 'lettura-p2-e5',
    itemType: 'cloze',
    order: 1,
    stem: 'La prima cosa da fare è comunicare il cambiamento di residenza ___ Comune di provenienza.',
    passageId: 'passage-lettura-p2-e5',
    options: ['al', 'del', 'nel'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'A + il = al ("al Comune di provenienza").',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-e5-2',
    skill: 'lettura',
    taskId: 'lettura-p2-e5',
    itemType: 'cloze',
    order: 2,
    stem: 'Poi bisogna iscriversi all\'anagrafe ___ nuovo Comune.',
    passageId: 'passage-lettura-p2-e5',
    options: ['del', 'al', 'nel'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '"all\'anagrafe del nuovo Comune" — preposição + artigo.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-e5-3',
    skill: 'lettura',
    taskId: 'lettura-p2-e5',
    itemType: 'cloze',
    order: 3,
    stem: 'Il medico di base cambia: bisogna scegliere un nuovo medico e ___ il passaggio all\'Asl.',
    passageId: 'passage-lettura-p2-e5',
    options: ['comunicare', 'comunicarsi', 'comunicano'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Comunicare il passaggio di residenza all\'Asl” — verbo transitivo.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-e5-4',
    skill: 'lettura',
    taskId: 'lettura-p2-e5',
    itemType: 'cloze',
    order: 4,
    stem: 'I contratti di utenza vanno chiusi o trasferiti entro ___ mese.',
    passageId: 'passage-lettura-p2-e5',
    options: ['un', 'uno', "un'"],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '"entro un mese" — artigo masculino.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-e5-5',
    skill: 'lettura',
    taskId: 'lettura-p2-e5',
    itemType: 'cloze',
    order: 5,
    stem: 'Un consiglio pratico: mantenere la vecchia mailbox attiva per ___ mesi.',
    passageId: 'passage-lettura-p2-e5',
    options: ['qualche', 'alcuni', 'quelli'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '"Qualche mese" — poucos, com singular.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-e5-6',
    skill: 'lettura',
    taskId: 'lettura-p2-e5',
    itemType: 'cloze',
    order: 6,
    stem: 'E ricordate di comunicare l\'indirizzo ___ datore di lavoro e all\'assicurazione.',
    passageId: 'passage-lettura-p2-e5',
    options: ['al', 'del', 'nel'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'A + il = al ("al datore di lavoro").',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
]
