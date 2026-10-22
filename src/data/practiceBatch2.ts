/**
 * LOTE 2 DO BANCO DE PRÁTICA — material original da app.
 *
 * Complementa `src/data/extraPractice.ts` com mais:
 * - 2 transcrições de ascolto (6 scelte multiple + 8 vero/falso);
 * - 2 textos de leitura (6 + 8 vero/falso);
 * - 1 texto de gramática com 6 lacunas (riflessione grammaticale).
 *
 * Todos os itens são tagged com `phase` e `level`, para que a aluna possa
 * treinar por nível (A1 / A2 / B1) e a app escolha sempre um conjunto
 * aleatório.
 */

import type { Passage, Question } from '../db/schemas'

const SOURCE = 'Contenuto originale CILS B1 Prep — pratica non ufficiale'

export const PASSAGES_BATCH2: Passage[] = [
  {
    id: 'passage-ascolto-p1-b3',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 1 (prática, lote 2) — una giornata qualsiasi',
    source: SOURCE,
    content: `1.
— Buongiorno! Vorrei un chilo di pomodori e un etto di formaggio.
— Certo, signora. Le pomodori sono di serra, ma sono buonissimi. Il formaggio è di pecora.
— Perfetto. Quanto fa il conto?
— Otto euro e cinquanta. Ha la moneta? Posso usare il bancomat, se preferisce.
(stacco musicale)
2.
— Buongiorno, vorrei tagliarmi i capelli. Avete un appuntamento per oggi?
— Abbiamo le 16 e le 17 e mezza. Lei è già cliente?
— No, è la prima volta. Quanto costa?
— Venticinque euro, taglio e lavaggio compresi. Sono tutti i giorni fino alle 19.
(stacco musicale)
3.
— Scusi, posso restituire qui un libro? Avevo finito ieri.
— Sì, la biblioteca chiude alle 18, ma la restituzione si può fare anche alla reception.
— Perfetto. Posso anche prenotare un computer per studiare?
— Sì, ci sono due posti liberi. Deve fare il badge all'ingresso.
(stacco musicale)
4.
— Buongiorno, il treno per Firenze è in ritardo?
— Sì, di venti minuti. L'avviso è sul display: partirà dal binario 4.
— Quindi ho tempo per un caffè?
— Ha venti minuti, ma il bar chiude alle 15 e mezza.
(stacco musicale)
5.
— Buongiorno, una pizza margherita per favore. Da mangere sul posto?
— No, da portare via. Sarà pronta in dieci minuti.
— Posso pagare con la carta?
— Certamente, qui si può pagare con la carta o con il bancomat.
(stacco musicale)
6.
— Scusi, dove posso trovare i biglietti per l'autobus?
— All'edicola, all'ingresso della stazione. Compra anche il biglietto giornaliero.
— Quanto costa il biglietto giornaliero?
— Cinque euro. Con quello può prendere tutti gli autobus urbani per un giorno.`,
  },
  {
    id: 'passage-ascolto-p2-b4',
    kind: 'audio_transcript',
    title: 'Ascolto Prova 2 (prática, lote 2) — le piste ciclabili della città',
    source: SOURCE,
    content: `Il Comune di Firenze ha presentato il nuovo piano delle piste ciclabili, che prevede venti chilometri di percorsi protetti entro il 2027. Secondo il progetto, le nuove piste saranno separate dal traffico da barriere fisse e saranno collegate ai giardini e alle scuole.

Il piano è stato preparato dopo un'indagine realizzata tra studenti e residenti, alla quale hanno partecipato più di ottomila persone. Il risultato è stato netto: il sessanta per cento degli intervistati si dichiara disposto a usare la bicicletta se ci fossero percorsi sicuri, ma solo il dodici per cento usa oggi la bici per andare al lavoro.

Per rendere il progetto sostenibile, il Comune ha previsto anche un servizio di biciclette inSharing, con bici elettriche disponibili in più di trecento stazioni. Le stazioni saranno collegate a un'applicazione che indica in tempo reale il numero di bici disponibili e i posti liberi nei parcheggi.

Il piano prevede inoltre più posti biciclette nelle scuole e nei centri sportivi, e un servizio di noleggio per gli studenti universitari a prezzi ridotti. L'assessore ha ammesso che i fondi non bastano per realizzare tutto entro il 2027: la prima tranche riguarderà il centro storico, mentre le periferie saranno affrontate più avanti.`,
  },
  {
    id: 'passage-lettura-p1-b5',
    kind: 'reading',
    title: 'Le feste di quartiere',
    source: SOURCE,
    content: `Ogni anno, alla fine di maggio, il quartiere organizza una festa della sagra del quartiere. Le attività cominciano il venerdì sera, quando i ragazzi allestiscono le bancarelle lungo la via principale.

Il sabato mattina si svolge il mercato dei produttori locali: verdura, formaggi, conserve e vino direttamente dalle aziende della zona. Nel pomeriggio c'è il torneo di pallacanestro dei bambini, organizzato dall'oratorio, e la corsa delle biciclette per i più piccoli.

La domenica è dedicata alla cucina: alle ore 13 si mangia insieme nella piazza, con un menù unico preparato dai volontari. Il ricavato serve a finanziare l'illuminazione del parco giochi, che verrà rinnovata grazie ai soldi della festa.

Chi vuole aiutare può iscriversi come volontario al banco delle iscrizioni, che si trova all'ingresso della piazza e resta aperto tutti i giorni della settimana fino a venerdì. I bambini hanno l'ingresso gratuito, gli adulti pagano cinque euro, che comprende la cena e l'acqua.`,
  },
  {
    id: 'passage-lettura-p1-b6',
    kind: 'reading',
    title: 'Al pronto soccorso: il ticket e i tempi di attesa',
    source: SOURCE,
    content: `In tutti gli ospedali italiani l'attesa per una visita specialistica si gestisce con un numero: il ticket. Al momento dell'accoglienza, la persona prende un biglietto dall'apposita macchina e il sistema le indica il numero di turno e la sala in cui essere servita.

Il numero chiamato può essere molto lontano dal proprio. Per questo motivo il sistema prevede un pulsante di "priorità": chi ha un'emergenza o una visita programmata può chiedere di essere avvisato quando mancano pochi numeri. Dal 2024, inoltre, tutti gli ospedali pubblici permettono di prendere il ticket anche con l'applicazione sul telefono, che fa una notifica quando è il turno.

Le visite urgenti non seguono il ticket: chi ha una situazione grave viene visitato subito, in base alla valutazione del medico di pronto soccorso. La priorità non è quindi un diritto: è una decisione clinica.

Per chi lavora, esiste la cosiddetta "codice bianco", che riguarda le visite specialistiche non urgenti. Il medico di famiglia può assegnare questo codice quando ritiene che la visita non possa aspettare i tempi normali. Il codice bianco dà accesso a un percorso accelerato, ma non garantisce una visita immediata: l'ordine dipende sempre dalla gravità dei casi.

L'attesa media negli ospedali italiani è di circa quattro ore, ma i tempi variano molto da regione a regione e da reparto a reparto.`,
  },
  {
    id: 'passage-lettura-p2-b7',
    kind: 'reading',
    title: 'Che differenza c\'è tra il passato prossimo e l\'imperfetto',
    source: SOURCE,
    content: `Quando leggete un racconto in italiano, dovete capire due cose: che cosa è successo e che cosa era solito succedere. In italiano queste due idee hanno due tempi diversi.

Il passato prossimo (1) azioni che sono successe e sono finite: ieri sono andata al mercato, ho comprato il pane. L'imperfetto, invece, descrive una situazione che durava nel passato: da piccola andavo al mercato con mia madre.

Le frasi con il passato prossimo raccontano i fatti; quelle con l'imperfetto (2) lo sfondo. Per esempio: "Sono arrivata tardi (3) la stazione era chiusa (4) la pioggia (5) impossibile aspettare (6) fermo." Le tre forme marcate descrivono lo sfondo dell'azione.

Attenzione però: l'imperfetto si usa anche con lo stato, non solo con le abitudini. Si dice "abitavo a Siena" e non "ho abitato a Siena", perché l'abitare era una situazione che durava. E si dice "c'era molta gente", perché la quantità è uno stato di quel momento.`,
  },
]

export const QUESTIONS_BATCH2: Question[] = [
  /* ---------------- Ascolto P1 (lote 2) — 6 MCQ --------------------------- */
  {
    id: 'ascolto-p1-b3-1',
    skill: 'ascolto',
    taskId: 'ascolto-p1-b3',
    itemType: 'mcq3',
    order: 1,
    stem: 'La signora al mercato compra',
    passageId: 'passage-ascolto-p1-b3',
    options: [
      'un chilo di pomodori e un etto di formaggio.',
      'solo i pomodori.',
      'due chili di pomodori.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Vorrei un chilo di pomodori e un etto di formaggio”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-b3-2',
    skill: 'ascolto',
    taskId: 'ascolto-p1-b3',
    itemType: 'mcq3',
    order: 2,
    stem: 'Il taglio dei capelli costa',
    passageId: 'passage-ascolto-p1-b3',
    options: [
      'venticinque euro, taglio e lavaggio compresi.',
      'sedici euro, solo taglio.',
      'diciannove euro, con lavaggio.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Venticinque euro, taglio e lavaggio compresi”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-b3-3',
    skill: 'ascolto',
    taskId: 'ascolto-p1-b3',
    itemType: 'mcq3',
    order: 3,
    stem: 'La persona alla biblioteca può',
    passageId: 'passage-ascolto-p1-b3',
    options: [
      'restituire il libro e prenotare un computer.',
      'restituire il libro solo alla reception.',
      'prenotare un computer solo se è studente.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      'Si può restituire il libro “anche alla reception” e “si può anche prenotare un computer per studiare”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-b3-4',
    skill: 'ascolto',
    taskId: 'ascolto-p1-b3',
    itemType: 'mcq3',
    order: 4,
    stem: 'Il treno per Firenze partirà',
    passageId: 'passage-ascolto-p1-b3',
    options: [
      'in ritardo di venti minuti, dal binario 4.',
      'in orario, dal binario 2.',
      'in ritardo di dieci minuti, dal binario 4.',
    ],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“È in ritardo di venti minuti… partirà dal binario 4”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-b3-5',
    skill: 'ascolto',
    taskId: 'ascolto-p1-b3',
    itemType: 'mcq3',
    order: 5,
    stem: 'La pizza sarà pronta',
    passageId: 'passage-ascolto-p1-b3',
    options: ['in dieci minuti.', 'in mezz\'ora.', 'subito.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Sarà pronta in dieci minuti”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p1-b3-6',
    skill: 'ascolto',
    taskId: 'ascolto-p1-b3',
    itemType: 'mcq3',
    order: 6,
    stem: 'Il biglietto giornaliero dell\'autobus costa',
    passageId: 'passage-ascolto-p1-b3',
    options: ['cinque euro.', 'tre euro.', 'dieci euro.'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: '“Cinque euro. Con quello può prendere tutti gli autobus urbani per un giorno”.',
    phase: 'fondazione',
    level: 'A1',
    bank: 'practice',
  },

  /* ---------------- Ascolto P2 (lote 2) — 8 V/F --------------------------- */
  {
    id: 'ascolto-p2-b4-1',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 1,
    stem: 'Il piano prevede venti chilometri di piste ciclabili entro il 2027.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Prevede venti chilometri di percorsi protetti entro il 2027”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-b4-2',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 2,
    stem: 'Le nuove piste saranno separate dal traffico da barriere fisse.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Le nuove piste saranno separate dal traffico da barriere fisse”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-b4-3',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 3,
    stem: 'All\'indagine hanno partecipato più di ottomila persone.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Un\'indagine realizzata tra studenti e residenti, alla quale hanno partecipato più di ottomila persone”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-b4-4',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 4,
    stem: 'Più della metà degli intervistati usa già la bicicletta per andare al lavoro.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'Il sessanta per cento si dichiara disposto a usarla, “ma solo il dodici per cento usa oggi la bici”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-b4-5',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 5,
    stem: 'Il servizio di biciclette inSharing prevede bici elettriche.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Un servizio di biciclette inSharing, con bici elettriche disponibili in più di trecento stazioni”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-b4-6',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 6,
    stem: 'Le stazioni di biciclette indicano in tempo reale il numero di bici disponibili.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Un\'applicazione che indica in tempo reale il numero di bici disponibili e i posti liberi nei parcheggi”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-b4-7',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 7,
    stem: 'Il piano sarà realizzato completamente entro il 2027.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      'L\'assessore ammette che “i fondi non bastano per realizzare tutto entro il 2027”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'ascolto-p2-b4-8',
    skill: 'ascolto',
    taskId: 'ascolto-p2-b4',
    itemType: 'truefalse',
    order: 8,
    stem: 'Le periferie saranno affrontate prima del centro storico.',
    passageId: 'passage-ascolto-p2-b4',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“La prima tranche riguarderà il centro storico, mentre le periferie saranno affrontate più avanti”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (lote 2) — 6 V/F --------------------------- */
  {
    id: 'lettura-p1-b5-1',
    skill: 'lettura',
    taskId: 'lettura-p1-b5',
    itemType: 'truefalse',
    order: 1,
    stem: 'La festa del quartiere comincia alla fine di maggio.',
    passageId: 'passage-lettura-p1-b5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Alla fine di maggio, il quartiere organizza una festa della sagra”.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b5-2',
    skill: 'lettura',
    taskId: 'lettura-p1-b5',
    itemType: 'truefalse',
    order: 2,
    stem: 'Il ricavato della festa serve a sistemare il parco giochi.',
    passageId: 'passage-lettura-p1-b5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Il ricavato serve a finanziare l\'illuminazione del parco giochi, che verrà rinnovata”.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b5-3',
    skill: 'lettura',
    taskId: 'lettura-p1-b5',
    itemType: 'truefalse',
    order: 3,
    stem: 'Gli adulti pagano l\'ingresso e la cena è compresa.',
    passageId: 'passage-lettura-p1-b5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Gli adulti pagano cinque euro, che comprende la cena e l\'acqua”.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b5-4',
    skill: 'lettura',
    taskId: 'lettura-p1-b5',
    itemType: 'truefalse',
    order: 4,
    stem: 'Il banco delle iscrizioni chiude solo il sabato.',
    passageId: 'passage-lettura-p1-b5',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“Resta aperto tutti i giorni della settimana fino a venerdì” — a festa è il fine settimana.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b5-5',
    skill: 'lettura',
    taskId: 'lettura-p1-b5',
    itemType: 'truefalse',
    order: 5,
    stem: 'Il torneo di pallacanestro è organizzato dall\'oratorio.',
    passageId: 'passage-lettura-p1-b5',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il torneo di pallacanestro dei bambini, organizzato dall\'oratorio”.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b5-6',
    skill: 'lettura',
    taskId: 'lettura-p1-b5',
    itemType: 'truefalse',
    order: 6,
    stem: 'La corsa delle biciclette è riservata ai bambini più grandi.',
    passageId: 'passage-lettura-p1-b5',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“La corsa delle biciclette per i più piccoli”.',
    phase: 'fondazione',
    level: 'A2',
    bank: 'practice',
  },

  /* ---------------- Lettura P1 (lote 2, B1) — 8 V/F ------------------------ */
  {
    id: 'lettura-p1-b6-1',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 1,
    stem: 'Il ticket si prende all\'accoglienza o alla macchinetta.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Al momento dell\'accoglienza, la persona prende un biglietto dall\'apposita macchina”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b6-2',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 2,
    stem: 'Oggi si può prendere il ticket anche con l\'applicazione sul telefono.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Dal 2024, inoltre, tutti gli ospedali pubblici permettono di prendere il ticket anche con l\'applicazione sul telefono”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b6-3',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 3,
    stem: 'Il pulsante di priorità garantisce una visita immediata.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation:
      '“La priorità non è quindi un diritto: è una decisione clinica”. O texto diz que garante só um aviso quando faltam poucos números.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b6-4',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 4,
    stem: 'Le visite urgenti seguono il ticket come le altre.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“Le visite urgenti non seguono il ticket”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b6-5',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 5,
    stem: 'Il codice bianco dà accesso a un percorso accelerato.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“Il codice bianco dà accesso a un percorso accelerato”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b6-6',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 6,
    stem: 'Il codice bianco può essere assegnato dal medico di famiglia.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation:
      '“Il medico di famiglia può assegnare questo codice quando ritiene che la visita non possa aspettare”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b6-7',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 7,
    stem: 'L\'attesa media negli ospedali italiani è di circa quattro ore.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 0,
    pointsPerItem: 0.5,
    explanation: '“L\'attesa media negli ospedali italiani è di circa quattro ore”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },
  {
    id: 'lettura-p1-b6-8',
    skill: 'lettura',
    taskId: 'lettura-p1-b6',
    itemType: 'truefalse',
    order: 8,
    stem: 'I tempi di attesa são iguais em todos os hospitais.',
    passageId: 'passage-lettura-p1-b6',
    options: ['Vero', 'Falso'],
    correctIndex: 1,
    pointsPerItem: 0.5,
    explanation: '“I tempi variano molto da regione a regione e da reparto a reparto”.',
    phase: 'cittadinanza',
    level: 'B1',
    bank: 'practice',
  },

  /* ---------------- Lettura P2 (lote 2) — 6 cloze (gramática) ------------- */
  {
    id: 'lettura-p2-b7-1',
    skill: 'lettura',
    taskId: 'lettura-p2-b7',
    itemType: 'cloze',
    order: 1,
    stem: 'Il passato prossimo (1) azioni che sono successe e sono finite.',
    passageId: 'passage-lettura-p2-b7',
    options: ['indica', 'indicava', 'indicherà'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      'O texto explica: “Il passato prossimo indica azioni che sono successe e sono finite”.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-b7-2',
    skill: 'lettura',
    taskId: 'lettura-p2-b7',
    itemType: 'cloze',
    order: 2,
    stem: 'L\'imperfetto, invece, (2) una situazione che durava nel passato.',
    passageId: 'passage-lettura-p2-b7',
    options: ['descrive', 'descriverà', 'descrisse'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'A frase está no presente do indicativo (definição do tempo).',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-b7-3',
    skill: 'lettura',
    taskId: 'lettura-p2-b7',
    itemType: 'cloze',
    order: 3,
    stem: 'Le frasi con il passato prossimo raccontano i fatti; quelle con l\'imperfetto (3) lo sfondo.',
    passageId: 'passage-lettura-p2-b7',
    options: ['descrivono', 'descrissero', 'descriveranno'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'Presente indicativo, como no resto do texto (“Il passato prossimo indica…”).',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-b7-4',
    skill: 'lettura',
    taskId: 'lettura-p2-b7',
    itemType: 'cloze',
    order: 4,
    stem: '“Sono arrivata tardi (4) la stazione era chiusa.”',
    passageId: 'passage-lettura-p2-b7',
    options: ['e', 'ma', 'perché'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      'A conjunção "e" liga a ação (passato prossimo) ao fundo (imperfetto).',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-b7-5',
    skill: 'lettura',
    taskId: 'lettura-p2-b7',
    itemType: 'cloze',
    order: 5,
    stem: 'Si dice “abitavo a Siena” e non “(5) abitato a Siena”.',
    passageId: 'passage-lettura-p2-b7',
    options: ['ho', 'avevo', 'avrò'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation:
      'O estado que durava usa o imperfetto ("abitavo"); o passato prossimo ("ho abitato") marcaria uma ação pontual.',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
  {
    id: 'lettura-p2-b7-6',
    skill: 'lettura',
    taskId: 'lettura-p2-b7',
    itemType: 'cloze',
    order: 6,
    stem: 'E si dice “(6) molta gente”, perché la quantità è uno stato di quel momento.',
    passageId: 'passage-lettura-p2-b7',
    options: ['c\'era', 'c\'erano', 'ci sarà'],
    correctIndex: 0,
    pointsPerItem: 1,
    explanation: 'No imperfetto, "c\'era" (singular) + "molta gente".',
    phase: 'struttura',
    level: 'A2',
    bank: 'practice',
  },
]
