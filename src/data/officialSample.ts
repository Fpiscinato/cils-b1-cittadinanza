/**
 * CONTEÚDO OFICIAL DE EXEMPLO — a prova real do CILS B1 Cittadinanza.
 *
 * Fonte: "Prototipo Quaderno B1 Cittadinanza" + "TRASCRIZIONI B1 Cittadinanza" +
 * "Chiavi di soluzione" (Università per Stranieri di Siena).
 *
 * É a única prova que temos com gabarito oficial garantido, por isso entra
 * primeiro no banco: serve de simulado de referência e valida todo o motor de
 * pontuação contra as chaves do CILS.
 *
 * As transcrições (o áudio lido) estão aqui para o modo de escuta com TTS:
 * o browser lê o texto em italiano com a voz do sistema.
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'CILS B1 Cittadinanza – Quaderno e Trascrizioni ufficiali (Unistrasi Siena)'

export const OFFICIAL_PASSAGES: Passage[] = [
  {
    id: 'passage-ascolto-p1',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 — sei brevi conversazioni',
    source: SOURCE,
    content: `1.
− Buongiorno, sono il vincitore del concorso “Fotografa la tua estate”. (uomo)
− Lei allora è il signor Cavani, benvenuto! (donna)
− Sì, ecco la lettera ufficiale della vincita.
− Bene, l'accompagno alla sua camera e le auguro di trascorrere una buona vacanza.
(stacco musicale)
2.
− Mi scusi dove si trova il ristorante la “Luna nel pozzo”? (uomo)
− Guardi, deve prendere la prima strada a sinistra e poi va sempre dritto. (donna)
− Ma è lontano da qui?
− Sono 20 minuti a piedi… se vuole, può prendere un taxi.
(stacco musicale)
3.
− Ramona, perché non andiamo al cinema stasera? (donna)
− Grazie Alex, ma non posso, viene a trovarmi un'amica. (uomo)
− Ma io volevo andare allo spettacolo delle 22.30, può venire anche lei.
− Ok, allora possiamo mangiare una pizza tutti insieme prima del cinema.
(stacco musicale)
4.
− Buongiorno, parlo con il comando dei Carabinieri? (uomo)
− Sì, che cosa è successo? (donna)
− Mi chiamo Paul Vlady, mi hanno rubato la valigia mentre aspettavo il taxi.
− Deve venire qui al comando e compilare un modulo.
(stacco musicale)
5.
− Buongiorno, vorrei un biglietto per la visita al museo, per tutta la famiglia. (uomo)
− Quanti siete? Se siete almeno in 4 potete fare un biglietto per visitare anche la cattedrale e salire sul campanile. (donna)
− Va bene, siamo in 4. Quanto costa?
− Il biglietto costa 20 euro in totale, se volete anche l'audioguida sono 2 euro in più.
(stacco musicale)
6.
− Giacomo, hai prenotato il volo aereo per Palermo? (donna)
− Non ancora Beatrice, i prezzi sono troppo alti. (uomo)
− Ma allora come facciamo?
− Pensavo di prenotare i biglietti due giorni prima, costano meno!`,
  },
  {
    id: 'passage-ascolto-p2',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 — la Puglia e Chiara Burberi',
    source: SOURCE,
    content: `Buongiorno a tutti i nostri ascoltatori. Lo sapete che la regione Puglia ha vinto il premio del National Geographic come migliore luogo di vacanza nel mondo? Mare fantastico, paesaggi naturali, borghi antichi, ricchi di cultura e cibo. Anche la famosa guida di viaggio Lonely Planet descrive la regione Puglia in maniera entusiasta: piccoli centri abitati e borghi dove non esiste il caos delle grandi città. Una regione per trascorrere le vacanze in famiglia oppure anche da soli. Si possono trovare strutture per tutti i gusti.

Da una ricerca del 2015 sulle novità nel campo informatico e digitale risulta che le migliori idee vengono dalle donne. Sono donne di età diverse e con situazioni familiari molto diverse. Ecco alcune delle loro storie: Chiara Burberi ha 49 anni e due figlie. Si è laureata in Economia all'Università Bocconi di Milano, dove ha insegnato tanti anni. Chiara ha creato un sito per la matematica, una materia che spaventa tutti gli studenti delle scuole. Il sito propone più di mille video-lezioni e settemila esercizi svolti che riguardano tutti i programmi scolastici.`,
  },
  {
    id: 'passage-lettura-p1',
    kind: 'reading',
    title: 'Regione Toscana: ultime novità nell’ambito della mobilità pubblica',
    source: SOURCE,
    content: `Regione Toscana: ultime novità nell'ambito della mobilità pubblica
Numero Verde per il trasporto pubblico locale
La Regione Toscana ha attivato il numero verde 800-570530 per i cittadini che usano il trasporto pubblico locale. Questo numero serve per comunicare problemi e cattivo funzionamento del trasporto pubblico all'interno della Regione Toscana, per presentare segnalazioni e suggerimenti su autobus urbani, extraurbani, treni regionali e collegamenti via mare. I cittadini possono contattare il numero verde dalle 8:00 alle 18:00 dal lunedì al venerdì. Il numero verde raccoglie la segnalazione e la trasmette sia all'azienda che offre il servizio sia all'ente competente, per trovare una soluzione al problema. Dopo la segnalazione al numero verde, il cittadino riceve una comunicazione che spiega le cause del problema e le possibili soluzioni.
Sito internet "Muoversi in Toscana"
La Regione Toscana ha messo delle telecamere nelle zone della città con maggiore traffico. Grazie a queste telecamere il cittadino può guardare le immagini direttamente sul sito internet "Muoversi in Toscana" o sulla relativa App.
Con questo nuovo servizio è possibile avere un quadro chiaro e preciso del traffico stradale. Basta navigare online nella mappa della Toscana e cliccare sulle webcam per vedere le immagini del traffico in tempo reale sulle strade regionali. Tutti, con un semplice clic, possono quindi vedere in anticipo la situazione delle strade che devono percorrere.
Le novità di "Muoversi in Toscana" non riguardano solo il traffico urbano, ma anche quello in mare: grazie alla collaborazione con l'Autorità Portuale di Livorno è possibile consultare online gli orari di arrivi e partenze dal Porto di Livorno.`,
  },
  {
    id: 'passage-lettura-p2',
    kind: 'reading',
    title: 'Lo sport torna in piazza',
    source: SOURCE,
    content: `Venerdì 1 e sabato 2 marzo ritorna l'(0) iniziativa "Sport in Piazza". Pilates, yoga, step, gag, total body, stretching sono alcune tra le tante (1) attività che si possono fare grazie al progetto "Sport in Piazza".

Questo appuntamento ha due obiettivi importanti: la salute e un percorso culturale per coinvolgere non solo i giovani e gli appassionati di sport, ma (2) anche le persone adulte, gli anziani e i bambini.

Le due giornate dedicate al benessere (3) fisico si svolgono in Piazza della Costituzione (4) con inizio venerdì 1 marzo, dalle ore 15:00 alle ore 19:00.

Il programma di venerdì prevede:
- dalle 15:00 alle 17:30: pilates, gag, circuit training, ginnastica posturale, step;
- dalle 18:00 alle 19:00: yoga flex, zumba, stretching, total body.

La giornata di sabato prevede:
- ore 10:00: risveglio muscolare, tonificazione;
- dalle 11:00 alle 12:30: yoga, step, postural workout, zumba;
- dalle 16:00 alle 18:00: stretching, gag, pilates, zumba, tonificazione.

Sabato alle ore 19:10 c'è la corsa a piedi per principianti "The Selfie Run" dove i partecipanti si divertono a farsi dei selfie. Alle ore 20:30 ha inizio l'evento musicale "Music & Fun" con DJ Osso di M2O. Nella serata è possibile vedere le foto che i partecipanti (5) hanno fatto durante la corsa.

L'ingresso alle lezioni è gratuito. (6) tutti possono provare le varie discipline e gli istruttori sono a disposizione per seguire i vari gruppi.

Non è necessaria la prenotazione, è sufficiente iscriversi al momento.`,
  },
  {
    id: 'passage-scrittura-prompts',
    kind: 'writing_prompt',
    title: 'Temi di produzione scritta (foglio ufficiale)',
    source: SOURCE,
    content: `Scegli uno dei seguenti argomenti. Devi scrivere da 80 a 120 parole.

1. Hai dei problemi con i vicini e hai deciso di cambiare casa. Scrivi un messaggio al proprietario del tuo appartamento per chiedere cosa è necessario fare. Spiega perché vuoi trasferirti e chiedi se devi pagare l'affitto dei prossimi mesi.

2. La mensa scolastica di tuo figlio, negli ultimi mesi, ha proposto un menù poco ricco e vario. I genitori non sono contenti. Tu sei il rappresentante dei genitori. Scrivi una mail al dirigente scolastico per spiegare la situazione e chiedere di risolvere il problema il prima possibile.`,
  },
  {
    id: 'passage-orale-topics',
    kind: 'oral_topic',
    title: 'Temi e domande della produzione orale',
    source: SOURCE,
    content: `Breve presentazione personale (circa 1 minuto):
• Come ti chiami?
• Quanti anni hai?
• Di dove sei?
• Dove vivi? Se vivi in Italia, da quanto tempo?
• Che cosa fai nella vita, studi o lavori? Che cosa studi? Che lavoro fai?

Prova n. 1 — conversazione faccia a faccia (2-3 minuti), l'esaminatore fa scegliere uno di questi argomenti:
• Preferisci vivere in città o in campagna? Quali sono i vantaggi e gli svantaggi?
• Quali sono gli aspetti della cultura italiana che senti più lontani rispetto alla tua cultura?
• L'assistenza sanitaria in Italia e nel tuo Paese: somiglianze e differenze.
• Quali documenti ti servono per ottenere la cittadinanza italiana? Quali sono le procedure?`,
  },
]

/* -------------------------------------------------------------------------- */
/* Ascolto — Prova 1 (6 scelte multiple, chiave C C A C B B)                   */
/* -------------------------------------------------------------------------- */

export const OFFICIAL_QUESTIONS: Question[] = [
  {
    id: 'ascolto-p1-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1',
    itemType: 'mcq3',
    order: 1,
    stem: 'Il signor Cavani',
    passageId: 'passage-ascolto-p1',
    options: ['è a un colloquio di lavoro.', 'è in vacanza con la moglie.', 'ha vinto un concorso fotografico.'],
    correctIndex: 2,
    pointsPerItem: 1,
    level: 'B1',
    explanation:
      'Cavani se presenta come il vincitore del concorso “Fotografa la tua estate” e l’interlocutrice gli augura una buona vacanza.',
  },
  {
    id: 'ascolto-p1-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1',
    itemType: 'mcq3',
    order: 2,
    stem: 'Il signore',
    passageId: 'passage-ascolto-p1',
    options: [
      'cerca un parcheggio vicino al ristorante.',
      'vuole prendere un taxi.',
      'riceve indicazioni stradali da un passante.',
    ],
    correctIndex: 2,
    pointsPerItem: 1,
    level: 'B1',
    explanation:
      'La donna gli indica la strada: “prenda la prima strada a sinistra e poi va sempre dritto”. Il taxi è solo un’alternativa suggerita.',
  },
  {
    id: 'ascolto-p1-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1',
    itemType: 'mcq3',
    order: 3,
    stem: 'Ramona propone di',
    passageId: 'passage-ascolto-p1',
    options: ['cenare prima di vedere il film.', 'preparare la pizza in casa.', 'andare al cinema il giorno dopo.'],
    correctIndex: 0,
    pointsPerItem: 1,
    level: 'B1',
    explanation:
      'Ramona accetta per Alex: “possiamo mangiare una pizza tutti insieme prima del cinema”. Ogni risposta é nel testo, mas só a que corresponde a Ramona é a correta: ela aceita jantar antes do filme.',
  },
  {
    id: 'ascolto-p1-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1',
    itemType: 'mcq3',
    order: 4,
    stem: 'Il signor Vlady telefona al comando dei Carabinieri per',
    passageId: 'passage-ascolto-p1',
    options: [
      'segnalare un incidente stradale.',
      'chiedere aiuto su come compilare un modulo.',
      'denunciare il furto della sua valigia.',
    ],
    correctIndex: 2,
    pointsPerItem: 1,
    level: 'B1',
    explanation:
      '“Mi hanno rubato la valigia mentre aspettavo il taxi” — è una denuncia di furto, non un incidente stradale.',
  },
  {
    id: 'ascolto-p1-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1',
    itemType: 'mcq3',
    order: 5,
    stem: 'Il turista decide di',
    passageId: 'passage-ascolto-p1',
    options: [
      'rinunciare alla visita alla cattedrale.',
      'acquistare un biglietto unico per tutta la famiglia.',
      'prenotare il giro del museo con la guida.',
    ],
    correctIndex: 1,
    pointsPerItem: 1,
    level: 'B1',
    explanation:
      'Con 4 persone si fa “un biglietto per visitare anche la cattedrale e salire sul campanile”: il biglietto unico copre tutto.',
  },
  {
    id: 'ascolto-p1-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1',
    itemType: 'mcq3',
    order: 6,
    stem: 'Beatrice vuol sapere',
    passageId: 'passage-ascolto-p1',
    options: [
      'il costo dei biglietti per Palermo.',
      'se Giacomo ha già preso i biglietti.',
      'perché Giacomo non parte più.',
    ],
    correctIndex: 1,
    pointsPerItem: 1,
    level: 'B1',
    explanation:
      'Giacomo risponde “non ancora”, perché “i prezzi sono troppo alti” — quindi lei vuole sapere se i biglietti sono già stati presi.',
  },

  /* ------------------------------------------------------------------ */
  /* Ascolto — Prova 2 (12 vero/falso, chiave F F V F V V V F F F V V)  */
  /* ------------------------------------------------------------------ */
  {
    id: 'ascolto-p2-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 1,
    stem: 'Il programma radiofonico riguarda la cucina tradizionale italiana.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Il programma parla della Puglia come meta di vacanza, non della cucina.',
  },
  {
    id: 'ascolto-p2-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 2,
    stem: 'Gli ascoltatori partecipano a un quiz e possono vincere un viaggio.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Non si parla di quiz né di premi: si parla del premio ricevuto dalla Puglia.',
  },
  {
    id: 'ascolto-p2-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 3,
    stem: 'La regione Puglia ha ricevuto un importante premio.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “La regione Puglia ha vinto il premio del National Geographic”.',
  },
  {
    id: 'ascolto-p2-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 4,
    stem: 'Questa estate in Puglia è diminuito il numero dei turisti.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Il testo dice il contrario: la Puglia è un luogo dove “si può trascorrere le vacanze”.',
  },
  {
    id: 'ascolto-p2-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 5,
    stem: 'In Puglia ci sono paesi tranquilli dove ci si può rilassare.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “Piccoli centri abitati e borghi dove non esiste il caos delle grandi città”.',
  },
  {
    id: 'ascolto-p2-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 6,
    stem: 'La Puglia offre un’ampia scelta di sistemazioni turistiche.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “Si possono trovare strutture per tutti i gusti”.',
  },
  {
    id: 'ascolto-p2-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 7,
    stem: 'Secondo una recente indagine le donne propongono progetti interessanti in ambito lavorativo.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “Risulta che le migliori idee vengono dalle donne”.',
  },
  {
    id: 'ascolto-p2-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 8,
    stem: 'Le donne con bambini hanno più difficoltà ad avere successo nel lavoro.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Il testo non dice questo: parla di situazioni familiari diverse, senza giudicare le difficoltà.',
  },
  {
    id: 'ascolto-p2-9',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 9,
    stem: 'Chiara Burberi ha una laurea in Ingegneria.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. “Si è laureata in Economia all’Università Bocconi”.',
  },
  {
    id: 'ascolto-p2-10',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 10,
    stem: 'Chiara Burberi ha insegnato matematica nelle scuole di Milano.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation:
      'FALSO. Ha insegnato all’Università Bocconi (e il sito di matematica l’ha creato per gli studenti delle scuole).',
  },
  {
    id: 'ascolto-p2-11',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 11,
    stem: 'Chiara Burberi ha lavorato all’Università Bocconi.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “Si è laureata in Economia all’Università Bocconi di Milano, dove ha insegnato tanti anni”.',
  },
  {
    id: 'ascolto-p2-12',
    skill: 'ascolto',
    taskId: 'ascolto-p2',
    itemType: 'truefalse',
    order: 12,
    stem: 'Gli studenti che vogliono esercitarsi in matematica possono andare sul sito di Chiara Burberi.',
    passageId: 'passage-ascolto-p2',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “Il sito propone più di mille video-lezioni e settemila esercizi svolti”.',
  },

  /* ------------------------------------------------------------------ */
  /* Lettura — Prova 1 (12 vero/falso, chiave F V V V V F V F F V F F) */
  /* ------------------------------------------------------------------ */
  {
    id: 'lettura-p1-1',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 1,
    stem: 'La Regione Toscana vuole migliorare i servizi online per i cittadini e i turisti.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Il testo descrive i servizi (numero verde, webcam, orari dei traghetti) senza dire che l’obiettivo è migliorarli.',
  },
  {
    id: 'lettura-p1-2',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 2,
    stem: 'Attraverso un numero verde i cittadini possono segnalare difficoltà, chiedere informazioni, dare consigli sui trasporti pubblici.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “Serve per comunicare problemi… per presentare segnalazioni e suggerimenti”.',
  },
  {
    id: 'lettura-p1-3',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 3,
    stem: 'L’attivazione del numero verde ha lo scopo di limitare i danni ai viaggiatori durante il trasporto locale.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation:
      'VERO. O número verde existe para resolver os problemas do transporte público local e evitar que os passageiros sofram com eles.',
  },
  {
    id: 'lettura-p1-4',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 4,
    stem: 'Il numero verde 800-570530 non è attivo il sabato e la domenica.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation:
      'VERO. O texto diz “dalle 8:00 alle 18:00 dal lunedì al venerdì”: ao fim de semana não há atendimento.',
  },
  {
    id: 'lettura-p1-5',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 5,
    stem: 'Se il numero verde riceve una telefonata di protesta su un servizio deve informare la ditta responsabile di quel servizio.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. La segnalazione “viene trasmessa sia all’azienda che offre il servizio sia all’ente competente”.',
  },
  {
    id: 'lettura-p1-6',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 6,
    stem: 'In particolari situazioni di emergenza il numero verde può avvertire l’Amministrazione regionale.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. L’Amministrazione regionale riceve la segnalazione, ma non c’è nessuna emergenza nel testo.',
  },
  {
    id: 'lettura-p1-7',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 7,
    stem: 'Chi telefona al numero verde può sapere che cosa ha causato un particolare problema.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “Il cittadino riceve una comunicazione che spiega le cause del problema e le possibili soluzioni”.',
  },
  {
    id: 'lettura-p1-8',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 8,
    stem: 'La Regione Toscana ha posizionato nuovi semafori per regolare il traffico.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Il testo parla di telecamere e webcam, non di semafori.',
  },
  {
    id: 'lettura-p1-9',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 9,
    stem: 'Sul sito della Regione Toscana è possibile segnalare interruzioni e incidenti stradali.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Le segnalazioni si fanno al numero verde, non sul sito.',
  },
  {
    id: 'lettura-p1-10',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 10,
    stem: 'L’Autorità Portuale di Livorno ha messo online gli orari dei traghetti che partono o arrivano a Livorno.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'VERO. “È possibile consultare online gli orari di arrivi e partenze dal Porto di Livorno”.',
  },
  {
    id: 'lettura-p1-11',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 11,
    stem: 'La Regione Toscana vuole pubblicare sul sito le informazioni sui voli in arrivo o in partenza dagli aeroporti toscani.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Il sito riguarda il traffico stradale e i collegamenti via mare, non gli aeroporti.',
  },
  {
    id: 'lettura-p1-12',
    skill: 'lettura',
    taskId: 'lettura-p1',
    itemType: 'truefalse',
    order: 12,
    stem: 'La Regione Toscana ha intenzione di potenziare il servizio di autobus che collegano Firenze al Porto di Livorno.',
    passageId: 'passage-lettura-p1',
    options: ['VERO', 'FALSO'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    level: 'B1',
    explanation: 'FALSO. Il testo non parla di autobus Firenze–Livorno né di intenzioni future.',
  },

  /* ------------------------------------------------------------------ */
  /* Lettura — Prova 2 (6 cloze, chiave B A C A C A)                    */
  /* ------------------------------------------------------------------ */
  {
    id: 'lettura-p2-1',
    skill: 'lettura',
    taskId: 'lettura-p2',
    itemType: 'cloze',
    order: 1,
    stem: 'Pilates, yoga, step, gag, total body, stretching sono alcune tra le tante (1) ____________ che si possono fare grazie al progetto “Sport in Piazza”.',
    passageId: 'passage-lettura-p2',
    options: ['funzioni', 'attività', 'occupazioni'],
    correctIndex: 1,
    pointsPerItem: 1,
    level: 'B1',
    explanation: 'B) attività. “Alcune tra le tante attività che si possono fare” — è la collocazione naturale in italiano.',
  },
  {
    id: 'lettura-p2-2',
    skill: 'lettura',
    taskId: 'lettura-p2',
    itemType: 'cloze',
    order: 2,
    stem: 'Questo appuntamento ha due obiettivi importanti: la salute e un percorso culturale per coinvolgere non solo i giovani e gli appassionati di sport, ma (2) ____________ le persone adulte, gli anziani e i bambini.',
    passageId: 'passage-lettura-p2',
    options: ['anche', 'ancora', 'infine'],
    correctIndex: 0,
    pointsPerItem: 1,
    level: 'B1',
    explanation: 'A) anche. “Non solo X, ma anche Y” — a correlazione aggiuntiva.',
  },
  {
    id: 'lettura-p2-3',
    skill: 'lettura',
    taskId: 'lettura-p2',
    itemType: 'cloze',
    order: 3,
    stem: 'Le due giornate dedicate al benessere (3) ____________ si svolgono in Piazza della Costituzione (4) ____________ inizio venerdì 1 marzo.',
    passageId: 'passage-lettura-p2',
    options: ['materiale', 'reale', 'fisico'],
    correctIndex: 2,
    pointsPerItem: 1,
    level: 'B1',
    explanation: 'C) fisico. “Le giornate dedicate al benessere fisico” — l’aggettivo concorda con il maschile “benessere”.',
  },
  {
    id: 'lettura-p2-4',
    skill: 'lettura',
    taskId: 'lettura-p2',
    itemType: 'cloze',
    order: 4,
    stem: 'Le due giornate dedicate al benessere fisico si svolgono in Piazza della Costituzione (4) ____________ inizio venerdì 1 marzo, dalle ore 15:00 alle ore 19:00.',
    passageId: 'passage-lettura-p2',
    options: ['con', 'di', 'su'],
    correctIndex: 0,
    pointsPerItem: 1,
    level: 'B1',
    explanation: 'A) con. “Con inizio venerdì 1 marzo” — espressione temporale con preposizione.',
  },
  {
    id: 'lettura-p2-5',
    skill: 'lettura',
    taskId: 'lettura-p2',
    itemType: 'cloze',
    order: 5,
    stem: 'Nella serata è possibile vedere le foto che i partecipanti (5) ____________ durante la corsa.',
    passageId: 'passage-lettura-p2',
    options: ['farebbero', 'facevano', 'hanno fatto'],
    correctIndex: 2,
    pointsPerItem: 1,
    level: 'B1',
    explanation:
      'C) hanno fatto. Le foto sono state scattate durante la corsa, cioè prima dell’evento musicale: serve il passato prossimo.',
  },
  {
    id: 'lettura-p2-6',
    skill: 'lettura',
    taskId: 'lettura-p2',
    itemType: 'cloze',
    order: 6,
    stem: 'L’ingresso alle lezioni è gratuito. (6) ____________ possono provare le varie discipline e gli istruttori sono a disposizione per seguire i vari gruppi.',
    passageId: 'passage-lettura-p2',
    options: ['tutti', 'questi', 'molti'],
    correctIndex: 0,
    pointsPerItem: 1,
    level: 'B1',
    explanation: 'A) tutti. “Tutti possono provare” — l’ingresso è gratuito per tutti, quindi il soggetto è generico.',
  },
]

/** Os dois temas de escrita do foglio oficial. */
export const OFFICIAL_WRITING_PROMPTS = [
  {
    id: 'scrittura-prompt-1',
    text: 'Hai dei problemi con i vicini e hai deciso di cambiare casa. Scrivi un messaggio al proprietario del tuo appartamento per chiedere cosa è necessario fare. Spiega perché vuoi trasferirti e chiedi se devi pagare l’affitto dei prossimi mesi.',
  },
  {
    id: 'scrittura-prompt-2',
    text: 'La mensa scolastica di tuo figlio, negli ultimi mesi, ha proposto un menù poco ricco e vario. I genitori non sono contenti. Tu sei il rappresentante dei genitori. Scrivi una mail al dirigente scolastico per spiegare la situazione e chiedere di risolvere il problema il prima possibile.',
  },
]

/** Os temas da prova oral (o candidato escolhe um deles). */
export const OFFICIAL_ORAL_TOPICS = [
  {
    id: 'orale-topic-1',
    text: 'Preferisci vivere in città o in campagna? Quali sono i vantaggi e gli svantaggi?',
  },
  {
    id: 'orale-topic-2',
    text: 'Quali sono gli aspetti della cultura italiana che senti più lontani rispetto alla tua cultura?',
  },
  {
    id: 'orale-topic-3',
    text: 'L’assistenza sanitaria in Italia e nel tuo Paese: somiglianze e differenze.',
  },
  {
    id: 'orale-topic-4',
    text: 'Quali documenti ti servono per ottenere la cittadinanza italiana? Quali sono le procedure?',
  },
]
