import { gmailCompose } from '@/lib/mail'
import { PLACE, SITE } from './site'

/**
 * Informativa privacy e cookie policy.
 *
 * Sono documenti legali e sono scritti come tali: ogni sezione dice quali dati,
 * per quale scopo, su quale base giuridica e per quanto tempo. Non dichiarano
 * nulla che non sia vero di questa build: ogni assenza (cookie, statistiche,
 * richieste a terzi) si verifica aprendo il pannello di rete del browser, e la
 * CSP in netlify.toml la rende impossibile da introdurre per sbaglio.
 *
 * Una sezione ha un titolo, i suoi paragrafi e al massimo un link. Il numero
 * non è qui: lo assegna la pagina, così aggiungere una sezione non obbliga a
 * rinumerare le altre a mano.
 *
 * `updated` è in formato ISO: la pagina lo mostra in italiano e lo mette così
 * com'è nell'elemento <time>.
 */

const HOST = new URL(SITE.url).host

const CONTACT = { label: SITE.email, href: gmailCompose(SITE.email) }

export const PRIVACY = {
  path: '/privacy/',
  updated: '2026-11-05',
  title: 'Informativa sulla privacy',
  description: `Informativa sul trattamento dei dati personali di ${HOST}, resa ai sensi dell'articolo 13 del Regolamento (UE) 2016/679.`,
  intro:
    "Questa informativa è resa ai sensi dell'articolo 13 del Regolamento (UE) 2016/679 (GDPR) e descrive come tratto i dati personali di chi visita il sito web.",
  sections: [
    {
      heading: 'Titolare del trattamento',
      body: [
        `Il titolare del trattamento sono io, ${SITE.fullName}, a ${PLACE.city}. Per qualunque questione relativa ai dati personali il recapito è l'indirizzo email indicato qui sotto.`,
        "Non ho nominato un responsabile della protezione dei dati, perché il trattamento svolto attraverso questo sito non rientra tra i casi previsti dall'articolo 37 del Regolamento.",
      ],
      link: CONTACT,
    },
    {
      heading: 'Dati di navigazione',
      body: [
        "I sistemi informatici e le procedure software che fanno funzionare questo sito acquisiscono, nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita nell'uso dei protocolli di comunicazione di Internet.",
        "Si tratta dell'indirizzo IP, della data e dell'ora della richiesta, dell'indirizzo della pagina richiesta, del codice di risposta del server e delle informazioni sul browser e sul sistema operativo. Sono registrati dal fornitore di hosting nei log del server.",
        'Li tratto per consegnare le pagine, per mantenere sicuro il sito e per accertare eventuali abusi. La base giuridica è il legittimo interesse a mantenere il servizio funzionante e sicuro, articolo 6, paragrafo 1, lettera f del Regolamento.',
        'Non uso questi dati per identificare chi visita il sito, non ne ricavo profili e non li collego ad altre informazioni.',
      ],
    },
    {
      heading: 'Dati forniti volontariamente',
      body: [
        "Su questo sito non ci sono moduli di contatto. I collegamenti all'indirizzo email aprono il programma di posta di chi legge: nessun dato parte finché non è chi legge a decidere di scrivere.",
        "Quando ricevo un messaggio tratto i dati che contiene, cioè il nome o il recapito di chi scrive e il contenuto della comunicazione, per rispondere e per valutare o gestire la richiesta. La base giuridica è l'esecuzione di misure precontrattuali e, se dalla richiesta nasce un incarico, l'esecuzione del contratto: articolo 6, paragrafo 1, lettera b del Regolamento.",
      ],
    },
    {
      heading: 'Cookie, tracciamento e memoria del dispositivo',
      body: [
        'Questo sito non utilizza cookie, di nessun tipo, non scrive nulla nella memoria del browser e non ospita strumenti di statistica, di analisi o di tracciamento. Caratteri tipografici, immagini e video sono serviti dallo stesso dominio delle pagine, quindi la semplice consultazione non comporta richieste verso server di terze parti.',
        "Non svolgo attività di profilazione e non adotto processi decisionali automatizzati ai sensi dell'articolo 22 del Regolamento. I dettagli sono nella cookie policy.",
      ],
      link: { label: 'Cookie policy', href: '/cookie-policy/' },
    },
    {
      heading: "Destinatari e trasferimenti fuori dall'Unione Europea",
      body: [
        'Non comunico a terzi i dati che ricevo, non li diffondo e non li cedo per finalità commerciali.',
        "Il sito è ospitato da Netlify, che agisce come responsabile del trattamento per i log descritti sopra e può trattarli anche su server situati fuori dall'Unione Europea, sulla base delle garanzie previste dal proprio accordo sul trattamento dei dati.",
        'I messaggi inviati per email restano anche nella disponibilità del fornitore di posta, che li tratta come titolare autonomo secondo la propria informativa, sulla quale non ho controllo.',
      ],
    },
    {
      heading: 'Periodo di conservazione',
      body: [
        "I log del server sono conservati dal fornitore di hosting per il tempo strettamente necessario alle finalità di sicurezza indicate sopra, secondo le politiche del servizio, salva la conservazione per l'accertamento di reati da parte dell'autorità giudiziaria.",
        'I messaggi restano nella casella da cui sono arrivati per il tempo necessario a rispondere e, se ne nasce un incarico, per la durata del rapporto e per il periodo in cui la legge impone di conservarne la documentazione. Oltre questi termini vengono cancellati, e possono esserlo prima su richiesta.',
      ],
    },
    {
      heading: 'Natura del conferimento dei dati',
      body: [
        'Consultare il sito non richiede di comunicare alcun dato, a parte quelli di navigazione, la cui trasmissione è tecnicamente necessaria perché le pagine possano essere consegnate.',
        'Comunicare i propri dati scrivendo è invece del tutto facoltativo, ma senza di essi non è possibile ricevere una risposta.',
      ],
    },
    {
      heading: "Diritti dell'interessato",
      body: [
        'Gli articoli dal 15 al 22 del Regolamento riconoscono il diritto di accedere ai propri dati, di ottenerne la rettifica o la cancellazione, di chiederne la limitazione, di riceverli in un formato leggibile da una macchina e di opporsi in qualsiasi momento al trattamento fondato sul legittimo interesse.',
        "Per esercitare uno di questi diritti basta scrivere all'indirizzo indicato al punto 1. La richiesta non ha costi e ricevo risposta entro un mese, come previsto dall'articolo 12 del Regolamento.",
      ],
    },
    {
      heading: "Reclamo all'autorità di controllo",
      body: [
        "Chi ritiene che il trattamento dei propri dati avvenga in violazione del Regolamento può proporre reclamo al Garante per la protezione dei dati personali, ai sensi dell'articolo 77 del Regolamento, oppure rivolgersi all'autorità giudiziaria.",
      ],
      link: { label: 'Garante per la protezione dei dati personali', href: 'https://www.garanteprivacy.it' },
    },
    {
      heading: 'Modifiche a questa informativa',
      body: [
        'Questa informativa può essere aggiornata se cambiano il sito o i servizi che lo rendono raggiungibile. La versione in vigore è sempre quella pubblicata a questo indirizzo, con la data di ultimo aggiornamento indicata in cima alla pagina.',
      ],
    },
  ],
}

export const COOKIES = {
  path: '/cookie-policy/',
  updated: '2026-11-05',
  title: 'Cookie policy',
  description: `Cookie policy di ${HOST}: il sito non usa cookie né altri strumenti di tracciamento.`,
  intro:
    "Questa pagina descrive l'uso di cookie e di altri strumenti di tracciamento sul sito, secondo l'articolo 122 del Codice in materia di protezione dei dati personali e le Linee guida del Garante del 10 giugno 2021.",
  sections: [
    {
      heading: 'Cosa sono i cookie',
      body: [
        'I cookie sono piccoli file di testo che un sito salva nel browser di chi lo visita, per riconoscerlo alle visite successive o per raccogliere informazioni sulla navigazione. Strumenti simili, come la memoria locale del browser o i pixel di tracciamento, svolgono funzioni analoghe e sono soggetti alle stesse regole.',
      ],
    },
    {
      heading: 'Cookie usati da questo sito',
      body: [
        'Nessuno. Il sito non installa cookie tecnici, analitici o di profilazione, propri o di terze parti, e non scrive nulla nella memoria locale del browser.',
        'Non contiene contenuti incorporati da altri servizi, come video, mappe o pulsanti social, che potrebbero installare cookie per conto proprio. Caratteri tipografici, immagini e video sono serviti dallo stesso dominio delle pagine.',
      ],
    },
    {
      heading: "Perché non c'è un banner",
      body: [
        'Il consenso va chiesto solo per i cookie e gli strumenti che non sono strettamente necessari. Non usandone nessuno, il sito non ha nulla da chiedere, e mostrare comunque un banner abituerebbe a chiuderli senza leggerli.',
      ],
    },
    {
      heading: 'Link verso altri siti',
      body: [
        'Alcuni collegamenti portano a siti esterni, come i progetti pubblicati. Una volta aperti, valgono le informative e le cookie policy di quei siti, sulle quali non ho controllo.',
      ],
    },
    {
      heading: 'Gestire i cookie dal browser',
      body: [
        "Ogni browser permette di vedere, bloccare e cancellare i cookie e i dati salvati dai siti, dalle proprie impostazioni sulla privacy. Su questo sito non c'è nulla da cancellare, ma le stesse impostazioni valgono per qualunque altro sito.",
      ],
    },
    {
      heading: 'Contatti e aggiornamenti',
      body: [
        "Per qualunque domanda su questa pagina il recapito è l'indirizzo email qui sotto. Se in futuro il sito dovesse usare cookie non necessari, questa pagina verrà aggiornata e il consenso sarà chiesto prima di installarli.",
      ],
      link: CONTACT,
    },
  ],
}

export const LEGAL_UI = {
  updatedLabel: 'Ultimo aggiornamento',
  back: 'Torna alla home',
}
