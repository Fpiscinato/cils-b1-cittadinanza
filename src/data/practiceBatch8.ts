/**
 * LOTE 8 DO BANCO DE PRÁTICA — foco no ascolto (a habilidade mais fraca).
 *
 * - 2 transcrições de ascolto com 6 scelte multiple (A2 e B1);
 * - 2 transcrições com 8 vero/falso (B1, temas cívicos);
 * - 1 texto di lettura con 8 vero/falso (B1);
 * - 1 testo di grammatica con 6 lacune (B1).
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'Contenuto originale CILS B1 Prep — pratica non ufficiale'

export const PASSAGES_BATCH8: Passage[] = [
  {
    id: 'passage-ascolto-p1-h1',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 8, A2) — sport, corsi, salute',
    source: SOURCE,
    content: `1.
— Buongiorno, vorrei iscrivermi al corso di nuoto.
— Che corso ha già fatto?
— Nella mia città facevo piscina, ma era molto lontano.
— Ha il certificato medico?
— Sì, l'ho fatto l'anno scorso. Non so se è ancora valido.
— Va bene, lo controlleremo. Il corso è il martedì e il giovedì alle 19.
(stacco musicale)
2.
— Scusi, la palestra chiude a che ora?
— Alle 22, ma la sala pesi chiude alle 21 e30 perché dopo c'è il Corso.
— Posso fare un'ora di corsa senza pagare l'iscrizione?
— Sì, ma solo se ha la tessera. Sono venti euro al mese con tutte le attività.
(stacco musicale)
3.
— Buongiorno, ho un appuntamento per il vaccino.
— Ha il libretto delle vaccinazioni?
— No, non l'ho portato, ma ho la fotografia sulla telefono.
— Va bene, la foto mi basta. Può accomodarsi in sala attesa.
(stacco musicale)
4.
— Scusi, la palestra è al terzo piano?
— Sì, con l'ascensore a destra. La reception è al piano terra.
— Vengo dal lavoro, ho il tempo per una mezz'ora?
— Sì, ma la doccia chiude alle 21.
(stacco musicale)
5.
— Buongiorno, vorrei un corso di italiano per stranieri.
— Ne abbiamo due: uno al mattino e uno alla sera.
— Il serale è più adatto a me, lavoro di giorno.
— Il serale è il lunedì e il giovedì, dalle 19 alle 21. Sono due ore.
— Perfetto, mi iscrivo subito.
(stacco musicale)
6.
— Scusi, il dottore oggi riceve solo su appuntamento?
— Sì, ma le emergenze sono sempre prese. Ha un appuntamento?
— No, pensavo di poter passare direttamente.
— Mi dica pure cosa le serve, forse posso trovare un'ora oggi.
(stacco musicale)`,
  },
  {
    id: 'passage-ascolto-p1-h2',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 8, B1) — banca, assicurazione, contratto',
    source: SOURCE,
    content: `1.
— Buongiorno, vorrei aprire un conto corrente.
— Certamente. Per aprire un conto servono documento d'identità, codice fiscale e la prova di residenza.
— La prova di residenza è una bolletta, giusto?
— Sì, una bolletta degli ultimi tre mesi, oppure l'attestazione del Comune.
(stacco musicale)
2.
— Ho perso la carta di credito, come posso fare?
— Può bloccarla subito dall'applicazione o chiamando il numero verde. Poi deve andare in filiale per fare la denuncia.
— Devo fare la denuncia anche se la ritrovavo dopo?
— No, in quel caso basta sbloccare la carta. Ma la denuncia va fatta entro 48 ore dalla denuncia di furto.
(stacco musicale)
3.
— Vorrei sapere quanto costa un'assicurazione per la mia auto.
— Dipende dalla classe di rischio, che si calcola con il numero di incidenti negli ultimi tre anni.
— Ho avuto un incidente tre anni fa. Cambia molto?
— Cambia il premio, ma non le fascia. Posso farla calcolare in un minuto, se mi lascia i dati della patente.
(stacco musicale)
4.
— Buongiorno, ho ricevuto una raccomandata, ma non posso firmare: sono in ufficio.
— Può chiedere a un collega di firmare al suo posto?
— Sì, ma serve che abbia il codice che c'è sulla lettera.
— Glielo può dare per telefono. Però, se l'importo è alto, serve il documento del delegato.
(stacco musicale)
5.
— Scusi, vorrei estinguere un prestito. Quanto devo versare?
— Ha un piano di rateizzazione? Posso calcolare la quota finale con i dati del contratto.
— Sì, ne restano dodici. Quanto è?
— Centoventitré euro e cinquanta, con l'ultima rata a fine mese. Se preferisce, può estinguere tutto oggi con un piccolo sconto.
(stacco musicale)
6.
— Buongiorno, ho ricevuto una lettera dalla banca che non capisco. Posso parlare con qualcuno?
— Certamente, si accomodi. Le leggo io la lettera e le spiego quello che c'è scritto, se vuole.
— Grazie, perché nel documento c'è una parola che non conosco.
— Nessun problema, me la segni e gliela spiego con calma.`,
  },
  {
    id: 'passage-ascolto-p2-h3',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 8) — il tempo che non passa',
    source: SOURCE,
    content: `In una città come Torino, il tempo che si passa in coda per un servizio pubblico è diventato un tema politico. Non è un caso: l'attesa media alle Poste è di oltre un'ora, e al servizio di accoglienza per gli stranieri, in alcuni quartieri, si arriva a due ore.

Il problema non è solo la fila. È che spesso non si sa quali documenti servono, e quindi si torna a casa per cercarli, e si torna a fare a fila un'altra volta. Un'indagine del Comune ha mostrato che quasi un terzo delle persone al centro di accoglienza ci era già stato una volta e aveva rinunciato.

Dal 2023 il Comune ha introdotto il "prenota e ritira": si fa il numero anche per telefono o online, si lascia il modulo in una cassetta e si torna nel giorno e nell'ora che si è scelti. Il servizio non è gratuito — costa quattro euro — ma ha ridotto le code del venti per cento e, soprattutto, ha tolto la paura di dover ricominciare.

Restano però i casi in cui la fila non è evitabile: le persone senza appuntamento, quelle che hanno bisogno di un certificato per il giorno dopo, quelle che non hanno uno smartphone. Per queste, il Comune ha aperto un servizio dedicato in una sede separata, con un orario più ampio e personale che parla altre lingue.

La lezione che ne traggono gli uffici è semplice: la metà del lavoro per ridurre le code non sta nell'aumentare gli sportelli, sta nel togliere la necessità di tornarci. Ogni informazione che si poteva dare prima, per telefono o per email, è una fila in meno.`,
  },
  {
    id: 'passage-ascolto-p2-h4',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 8) — abitare in affitto',
    source: SOURCE,
    content: `Trovare casa in affitto in una grande città italiana è una delle cose più difficili per chi arriva da fuori. I prezzi sono alti, e i contratti chiedono spesso una garanzia di due o tre mesi prima ancora di iniziare.

La legge prevede che il canone non possa superare una certa percentuale del reddito del conduttore, e in alcune città i contratti hanno una durata minima di quattro anni, per dare stabilità. Chi affitta è comunque libero di fissare un deposito cauzionale, che in genere equivale a due o tre canoni.

Gli affitti "a canone concordato" sono regolati da accordi comunali: il proprietario accetta un canone più basso in cambio di un contratto più lungo e della possibilità di applicare l'aumento previsto dalla legge. In cambio, il Comune garantisce al proprietario il pagamento e offre al conduttino assistenza per gli sfratti. Dal 2024 questi contratti coprono una parte sempre più grande delle case in affitto.

Un consiglio pratico per chi cerca: il passaggio di un immobile da un inquilino a un altro è spesso più semplice che cercare dal proprietario. In quel caso, però, va controllata la certificazione energetica e la "cessione di contratto", che in alcune città richiede l'autorizzazione del proprietario.

Un'ultima cosa: dal 2023 è più facile fare un inventario dei mobili, con foto e una descrizione dettagliata, firmata da entrambe le parti. Non è obbligatorio, ma in caso di contese alla fine del contratto fa risparmiare molti problemi.`,
  },
  {
    id: 'passage-lettura-p1-h5',
    kind: 'reading',
    title: 'La carta d\'identità elettronica (CIE)',
    source: SOURCE,
    content: `La carta d'identità elettronica, o CIE, è il documento di identità introdotto in Italia per sostituire la carta di identità di carta. Ha le stesse dimensioni di una carta di credito e contiene un chip contactless che può essere letto con il telefono o con un lettore.

La differenza più importante rispetto alla carta di identità di carta è la SPID: la CIE può essere usata come strumento di accesso ai servizi online dello Stato, insieme all'identità digitale. In pratica, con la CIE si può accedere a quasi tutti i portali della pubblica amministrazione, dall'INPS al Comune, senza dover ricordare un'altra password.

Per ottenerla, occorre andare all'ufficio comunale che rilascia i documenti di identità, con un documento di identità valido, il codice fiscale e una fotografia. La CIE viene spedita a casa con posta raccomandata e arriva, di solito, entro trenta giorni. Nel frattempo, si riceve una ricevuta con un codice QR, che permette di usare la carta anche prima dell'arrivo fisico.

Il costo è di ventidue euro e la validità è di dieci anni per gli adulti e di cinque per i minori. Dal 2024 il documento può essere richiesto anche in formato digitale, che viene chiamato "CIE digitale" e vale per tutti gli usi tranne quelli che richiedono la firma o il riconoscimento facciale.

Una nota pratica: molte università, banche e servizi privati chiedono ancora la carta di identità di carta, perché i loro sistemi non sono ancora aggiornati. Conviene quindi portare entrambe le versioni per qualche mese.`,
  },
  {
    id: 'passage-lettura-p2-h6',
    kind: 'reading',
    title: 'Come si scrive una mail di lavoro',
    source: SOURCE,
    content: `Una mail di lavoro in italiano ha una struttura semplice, e seguirla evita quasi tutti gli errori. La prima parte è l'oggetto: deve dire chiaramente di che cosa si tratta, per esempio "Conferma appuntamento del 12 marzo" o "Richiesta di informazioni sul contratto di locazione". Un oggetto vago come "Urgenza" costringe chi riceve a aprire la mail per capire di che si tratta.

Poi c'è l'esordio, che in italiano formale si apre con "Gentile signor Rossi," oppure con la frase "Le scrivo per…", che è la più usata negli uffici pubblici. La regola d'oro è la stessa: il "Lei" maiuscolo per chi non si conosce, il "tu" per i colleghi.

Nel corpo della mail si spiega il motivo, in ordine: prima il punto, poi i dettagli, poi la richiesta concreta. Un errore frequente è mettere la richiesta alla fine, dopo un testo lunghissimo: chi legge per fretta può non arrivarci.

Alla fine si ringrazia e si chiude. Le formule classiche sono "Resto in attesa di un suo riscontro" e "Cordiali saluti", a cui segue la firma con nome, cognome, ruolo e recapito telefonico.

Un'ultima buona maniera: se si attachments un documento, si scrive nella mail il nome del documento ("in allegato troverà il modulo compilato"), così chi riceve sa che cosa cercare.`,
  },
]

export const QUESTIONS_BATCH8: Question[] = [
  /* ---------------- Ascolto P1 (lote 8, A2) — 6 MCQ --------------------- */
  {
    id: 'ascolto-p1-h1-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h1',
    itemType: 'mcq3',
    order: 1,
    stem: 'Il corso di nuoto si tiene',
    passageId: 'passage-ascolto-p1-h1',
    options: [
      'il martedì e il giovedì alle 19.',
      'il lunedì e il mercoledì alle 19.',
      'il martedì e il venerdì alle 18.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il corso è il martedì e il giovedì alle 19”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h1-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h1',
    itemType: 'mcq3',
    order: 2,
    stem: 'La palestra costa',
    passageId: 'passage-ascolto-p1-h1',
    options: [
      'venti euro al mese con tutte le attività.',
      'una ora di corsa ogni volta.',
      'quindici euro al mese.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Sono venti euro al mese con tutte le attività”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h1-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h1',
    itemType: 'mcq3',
    order: 3,
    stem: 'Per il vaccino basta',
    passageId: 'passage-ascolto-p1-h1',
    options: [
      'una fotografia del libretto delle vaccinazioni.',
      'il libretto delle vaccinazioni in originale.',
      'un certificato del medico.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Non l\'ho portato, ma ho la fotografia sulla telefono… la foto mi basta”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h1-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h1',
    itemType: 'mcq3',
    order: 4,
    stem: 'La doccia della palestra chiude alle',
    passageId: 'passage-ascolto-p1-h1',
    options: ['21.', '22.', '20 e30.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“La doccia chiude alle 21”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h1-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h1',
    itemType: 'mcq3',
    order: 5,
    stem: 'Il corso di italiano serale si tiene',
    passageId: 'passage-ascolto-p1-h1',
    options: [
      'il lunedì e il giovedì, dalle 19 alle 21.',
      'il lunedì e il mercoledì, dalle 19 alle 21.',
      'due volte alla settimana, la mattina.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Il serale è il lunedì e il giovedì, dalle 19 alle 21”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h1-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h1',
    itemType: 'mcq3',
    order: 6,
    stem: 'Dal medico si può',
    passageId: 'passage-ascolto-p1-h1',
    options: [
      'passare senza appuntamento se è urgente.',
      'passare solo con appuntamento.',
      'passare solo il lunedì.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Sì, ma le emergenze sono sempre prese”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },

  /* ---------------- Ascolto P1 (lote 8, B1) — 6 MCQ --------------------- */
  {
    id: 'ascolto-p1-h2-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h2',
    itemType: 'mcq3',
    order: 1,
    stem: 'Per aprire un conto serve la prova di residenza',
    passageId: 'passage-ascolto-p1-h2',
    options: [
      'come una bolletta degli ultimi tre mesi.',
      'come il passaporto.',
      'come un contratto di affitto.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Una bolletta degli ultimi tre mesi, oppure l\'attestazione del Comune”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h2-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h2',
    itemType: 'mcq3',
    order: 2,
    stem: 'Se ritrovi la carta rubata, la denuncia',
    passageId: 'passage-ascolto-p1-h2',
    options: [
      'va fatta comunque entro 48 ore.',
      'non serve: basta sbloccare la carta.',
      'va fatta entro un mese.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Ma la denuncia va fatta entro 48 ore dalla denuncia di furto” — cioè subito.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h2-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h2',
    itemType: 'mcq3',
    order: 3,
    stem: 'Il premio dell\'assicurazione dipende',
    passageId: 'passage-ascolto-p1-h2',
    options: [
      'dal numero di incidenti negli ultimi tre anni.',
      'dall\'età del conducente.',
      'dalla cilindrata dell\'auto.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Si calcola con il numero di incidenti negli ultimi tre anni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h2-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h2',
    itemType: 'mcq3',
    order: 4,
    stem: 'Per farsi firmare la raccomandata da un collega serve',
    passageId: 'passage-ascolto-p1-h2',
    options: [
      'il codice che c\'è sulla lettera.',
      'il documento del delegato.',
      'un autorizzazione scritta.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Serve che abbia il codice che c\'è sulla lettera”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h2-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h2',
    itemType: 'mcq3',
    order: 5,
    stem: 'L\'ultima rata del prestito è di',
    passageId: 'passage-ascolto-p1-h2',
    options: [
      'centoventitré euro e cinquanta.',
      'centoventidue euro.',
      'centotrenta euro.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Centoventitré euro e cinquanta, con l\'ultima rata a fine mese”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-h2-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-h2',
    itemType: 'mcq3',
    order: 6,
    stem: 'La persona che non capisce una parola nella lettera della banca',
    passageId: 'passage-ascolto-p1-h2',
    options: [
      'può chiedere che venga spiegata con calma.',
      'deve tornare il mese dopo.',
      'deve rivolgersi al direttore della banca.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Me la segni e gliela spiego con calma”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Ascolto P2 (lote 8) — 8 V/F --------------------------- */
  {
    id: 'ascolto-p2-h3-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 1,
    stem: 'L\'attesa media alle Poste supera l\'ora.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“L\'attesa media alle Poste è di oltre un\'ora”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h3-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 2,
    stem: 'Un terzo delle persone aveva rinunciato dopo la prima visita.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Quasi un terzo delle persone… aveva rinunciato”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h3-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 3,
    stem: 'Il servizio "prenota e ritira" è gratuito.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Non è gratuito — costa quattro euro”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h3-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 4,
    stem: 'Il "prenota e ritira" ha ridotto le code del venti per cento.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Ha ridotto le code del venti per cento”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h3-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 5,
    stem: 'Esiste un servizio dedicato per chi non può fare la fila.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Il Comune ha aperto un servizio dedicato in una sede separata”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h3-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 6,
    stem: 'Aumentare gli sportelli risolve da solo il problema delle code.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“La metà del lavoro… non sta nell\'aumentare gli sportelli, sta nel togliere la necessità di tornarci”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h3-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 7,
    stem: 'Il servizio dedicato ha personale che parla altre lingue.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…con un orario più ampio e personale che parla altre lingue”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h3-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h3',
    itemType: 'truefalse',
    order: 8,
    stem: 'Si può prendere il numero anche per telefono.',
    passageId: 'passage-ascolto-p2-h3',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Si fa il numero anche per telefono o online”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 1,
    stem: 'In alcune città i contratti di affitto durano almeno quattro anni.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…i contratti hanno una durata minima di quattro anni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 2,
    stem: 'La legge limita il canone in percentuale del reddito.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Il canone non possa superare una certa percentuale del reddito del conduttore”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 3,
    stem: 'Il deposito cauzionale è obbligatorio per legge.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Chi affitta è comunque libero di fissare un deposito cauzionale”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 4,
    stem: 'Nei contratti a canone concordato il Comune garantisce il pagamento al proprietario.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“…il Comune garantisce al proprietario il pagamento”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 5,
    stem: 'Il passaggio di un immobile è spesso più semplice che cercare casa.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Il passaggio di un immobile da un inquilino a un altro è spesso più semplice”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 6,
    stem: 'La cessione del contratto richiede sempre il permesso del proprietario.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“In alcune città richiede l\'autorizzazione del proprietario” — quindi non sempre.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 7,
    stem: 'L\'inventario dei mobili è obbligatorio.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Non è obbligatorio, ma in caso di conteste… fa risparmiare molti problemi”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-h4-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-h4',
    itemType: 'truefalse',
    order: 8,
    stem: 'Le case a canone concordato sono in aumento.',
    passageId: 'passage-ascolto-p2-h4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Dal 2024 questi contratti coprono una parte sempre più grande delle case in affitto”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (lote 8) — 8 V/F --------------------------- */
  {
    id: 'lettura-p1-h5-1',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 1,
    stem: 'La CIE ha le stesse dimensioni di una carta di credito.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Ha le stesse dimensioni di una carta di credito”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-h5-2',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 2,
    stem: 'Con la CIE si può accedere ai portali dello Stato usando la SPID.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“La CIE può essere usata come strumento di accesso ai servizi online dello Stato, insieme all\'identità digitale”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-h5-3',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 3,
    stem: 'Per ottenerla servono un documento valido, il codice fiscale e una fotografia.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Occorre andare all\'ufficio comunale… con un documento di identità valido, il codice fiscale e una fotografia”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-h5-4',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 4,
    stem: 'La CIE arriva normalmente entro trenta giorni.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Viene spedita a casa con posta raccomandata e arriva… entro trenta giorni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-h5-5',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 5,
    stem: 'La ricevuta con il codice QR permette di usare la carta prima che arrivi.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Si riceve una ricevuta con un codice QR, che permette di usare la carta anche prima dell\'arrivo fisico”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-h5-6',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 6,
    stem: 'La CIE costa ventidue euro.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il costo è di ventidue euro”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-h5-7',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 7,
    stem: 'La CIE digitale vale per todos gli usi.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“Vale per tutti gli usi tranne quelli che richiedono la firma o il riconoscimento facciale”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-h5-8',
    skill: 'lettura',
    taskId: 'lettura-p1-h5',
    itemType: 'truefalse',
    order: 8,
    stem: 'Conviene portare entrambe le versioni della carta d\'identità per qualche mese.',
    passageId: 'passage-lettura-p1-h5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Conviene quindi portare entrambe le versioni per qualche mese”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P2 (lote 8) — 6 cloze -------------------------- */
  {
    id: 'lettura-p2-h6-1',
    skill: 'lettura',
    taskId: 'lettura-p2-h6',
    itemType: 'cloze',
    order: 1,
    stem: 'Un oggetto vago come "Urgenza" costringe chi riceve (1) aprire la mail.',
    passageId: 'passage-lettura-p2-h6',
    options: ['a', 'di', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Costringe chi riceve a aprire la mail” — preposição + infinitivo.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-h6-2',
    skill: 'lettura',
    taskId: 'lettura-p2-h6',
    itemType: 'cloze',
    order: 2,
    stem: 'La regola d\'oro è la stessa: il "Lei" maiuscolo per chi non si conosce, il "tu" per i colleghi.',
    passageId: 'passage-lettura-p2-h6',
    options: ['di', 'a', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Per i colleghi” — preposição.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-h6-3',
    skill: 'lettura',
    taskId: 'lettura-p2-h6',
    itemType: 'cloze',
    order: 3,
    stem: 'Un errore frequente è mettere la richiesta alla fine, dopo un testo lunghissimo: chi legge per fretta può non arrivarci.',
    passageId: 'passage-lettura-p2-h6',
    options: ['può', 'deve', 'vuole'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Può non arrivarci” — possibilità.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-h6-4',
    skill: 'lettura',
    taskId: 'lettura-p2-h6',
    itemType: 'cloze',
    order: 4,
    stem: 'Alla fine si ringrazia e si chiude. Le formule classiche sono "Resto in attesa di un suo riscontro" e "Cordiali saluti", (4) cui segue la firma.',
    passageId: 'passage-lettura-p2-h6',
    options: ['a', 'di', 'da'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“A cui segue la firma” — preposição + soggetto.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-h6-5',
    skill: 'lettura',
    taskId: 'lettura-p2-h6',
    itemType: 'cloze',
    order: 5,
    stem: 'Un\'ultima buona maniera: se si attachments un documento, si scrive nella mail il nome del documento.',
    passageId: 'passage-lettura-p2-h6',
    options: ['allega', 'allega a', 'allega di'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Se si allega un documento” — verbo transitivo.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-h6-6',
    skill: 'lettura',
    taskId: 'lettura-p2-h6',
    itemType: 'cloze',
    order: 6,
    stem: 'Molte università chiedono ancora la carta d\'identità di carta, perché i loro sistemi non sono ancora aggiornati.',
    passageId: 'passage-lettura-p2-h6',
    options: ['le', 'li', 'la'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“La carta d\'identità di carta” — feminino.',
    phase: 'struttura',
    level: 'B1',
    bank: 'practice',
  },
]
