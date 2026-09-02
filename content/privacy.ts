import { GMAIL_COMPOSE, SITE, type L10n } from "./site";

/**
 * The domain without its scheme, which is how a document names a site rather
 * than links to it. Derived so that the address is written down once.
 */
const HOST = SITE.url.replace(/^https?:\/\//, "");

/**
 * One numbered part of the informativa: a heading, its paragraphs, and at
 * most one address the reader is sent to.
 *
 * The link is separate from the prose rather than embedded in it, because a
 * paragraph carrying markup would have to be written as markup, in two
 * languages, in a file that is otherwise plain strings. The number is not
 * here either: the page counts the sections as it renders them, so inserting
 * one does not renumber the rest by hand.
 */
export interface PrivacySection {
  heading: L10n;
  body: L10n<string[]>;
  link?: { label: L10n; href: string };
}

/**
 * The privacy policy, in both languages, and the notice that points at it.
 *
 * This is a legal document and is written as one: the sections a reader looks
 * for are all here and in the order they are looked for, each stating the data,
 * the purpose, the legal basis and the retention rather than describing how
 * the site works. It is the one text on the site that has to be complete
 * before it is short.
 *
 * Two things separate it from a generated informativa. It speaks in the first
 * person, because the controller is one person and a reader who has never
 * spoken to him is owed a name rather than an entity. And it claims nothing
 * that is not true of this build: every absence it declares, from the cookies
 * to the profiling, is verifiable by opening the network panel.
 *
 * The reader is described, never addressed, which is the rule the rest of the
 * site follows too.
 *
 * `updated` is the date of the last revision to this text. It is ISO because
 * two readers want it: `Intl` renders it into each language, and the <time>
 * element carries it as it is.
 */
export const PRIVACY = {
  updated: "2026-09-02",

  meta: {
    title: {
      it: "Informativa privacy · Omar Bayadi",
      en: "Privacy policy · Omar Bayadi",
    },
    description: {
      it:
        `Informativa sul trattamento dei dati personali di ${HOST}, resa ` +
        "ai sensi dell'articolo 13 del Regolamento (UE) 2016/679.",
      en:
        `How personal data is processed on ${HOST}, under Article 13 of ` +
        "Regulation (EU) 2016/679.",
    },
  },

  title: { it: "Informativa sulla privacy", en: "Privacy policy" },

  intro: {
    it:
      "Questa informativa è resa ai sensi dell'articolo 13 del Regolamento " +
      "(UE) 2016/679 e descrive come tratto i dati personali di chi visita " +
      "il sito web.",
    en:
      "This notice is provided under Article 13 of Regulation (EU) 2016/679 " +
      "and describes how I process the personal data of anyone visiting the " +
      "website.",
  },

  updatedLabel: { it: "Ultimo aggiornamento", en: "Last updated" },

  sections: [
    {
      heading: { it: "Titolare del trattamento", en: "The controller" },
      body: {
        it: [
          "Il titolare del trattamento sono io, Omar Bayadi, a Reggio " +
            "Emilia. Per qualunque questione relativa ai dati personali il " +
            "recapito è l'indirizzo email indicato qui sotto.",
          "Non ho nominato un responsabile della protezione dei dati, perché " +
            "il trattamento svolto attraverso questo sito non rientra tra i " +
            "casi previsti dall'articolo 37 del Regolamento.",
        ],
        en: [
          "I am the data controller: Omar Bayadi, in Reggio Emilia. For " +
            "anything concerning personal data the contact point is the " +
            "email address below.",
          "I have not appointed a data protection officer, because the " +
            "processing carried out through this site does not fall within " +
            "the cases listed in Article 37 of the Regulation.",
        ],
      },
      link: {
        label: { it: SITE.email, en: SITE.email },
        href: GMAIL_COMPOSE,
      },
    },

    {
      heading: { it: "Dati di navigazione", en: "Browsing data" },
      body: {
        it: [
          "I sistemi informatici e le procedure software che fanno " +
            "funzionare questo sito acquisiscono, nel corso del loro normale " +
            "esercizio, alcuni dati personali la cui trasmissione è implicita " +
            "nell'uso dei protocolli di comunicazione di Internet.",
          "Si tratta dell'indirizzo IP, della data e dell'ora della " +
            "richiesta, dell'indirizzo della pagina richiesta, del codice di " +
            "risposta del server e delle informazioni sul browser e sul " +
            "sistema operativo. Sono registrati dal fornitore di hosting nei " +
            "log del server.",
          "Li tratto per consegnare le pagine, per mantenere sicuro il sito " +
            "e per accertare eventuali abusi. La base giuridica è il " +
            "legittimo interesse a mantenere il servizio funzionante e " +
            "sicuro, articolo 6, paragrafo 1, lettera f del Regolamento.",
          "Non uso questi dati per identificare chi visita il sito, non ne " +
            "ricavo profili e non li collego ad altre informazioni.",
        ],
        en: [
          "The computer systems and software procedures that run this site " +
            "acquire, in the course of their normal operation, certain " +
            "personal data whose transmission is implicit in the use of " +
            "internet communication protocols.",
          "These are the IP address, the date and time of the request, the " +
            "address of the requested page, the server's response code and " +
            "information about the browser and the operating system. They are " +
            "recorded by the hosting provider in the server logs.",
          "I process them in order to deliver the pages, to keep the site " +
            "secure and to establish whether it is being abused. The legal " +
            "basis is the legitimate interest in keeping the service running " +
            "and safe, Article 6(1)(f) of the Regulation.",
          "These data are not used to identify visitors, no profile is drawn " +
            "from them and they are not combined with other information.",
        ],
      },
    },

    {
      heading: {
        it: "Dati forniti volontariamente",
        en: "Data provided voluntarily",
      },
      body: {
        it: [
          "Su questo sito non ci sono moduli di contatto. I collegamenti in " +
            "fondo alle pagine aprono WhatsApp, la finestra di composizione " +
            "di Gmail o un profilo pubblico: nessun dato parte finché non è " +
            "chi legge a decidere di scrivere.",
          "Quando ricevo un messaggio tratto i dati che contiene, cioè il " +
            "nome o il recapito di chi scrive e il contenuto della " +
            "comunicazione, per rispondere e per valutare o gestire la " +
            "richiesta. La base giuridica è l'esecuzione di misure " +
            "precontrattuali e, se dalla richiesta nasce un incarico, " +
            "l'esecuzione del contratto: articolo 6, paragrafo 1, lettera b " +
            "del Regolamento.",
        ],
        en: [
          "There is no contact form on this site. The links at the foot of " +
            "each page open WhatsApp, the Gmail compose window or a public " +
            "profile: nothing is sent until someone decides to write.",
          "When a message reaches me I process the data it carries, that is " +
            "the name or address of the sender and the content of the " +
            "communication, in order to reply and to consider or carry out " +
            "the request. The legal basis is the performance of " +
            "pre-contractual measures and, where the request turns into an " +
            "engagement, the performance of the contract: Article 6(1)(b) of " +
            "the Regulation.",
        ],
      },
    },

    {
      heading: {
        it: "Cookie, tracciamento e memoria locale",
        en: "Cookies, tracking and local storage",
      },
      body: {
        it: [
          "Questo sito non utilizza cookie, di nessun tipo, e non ospita " +
            "strumenti di statistica, di analisi o di tracciamento. I " +
            "caratteri tipografici e le immagini sono serviti dallo stesso " +
            "dominio delle pagine, quindi la semplice consultazione non " +
            "comporta richieste verso server di terze parti.",
          "L'unico dato che il sito scrive sul dispositivo è una voce nella " +
            "memoria locale del browser, che registra la chiusura dell'avviso " +
            "mostrato all'apertura perché non si ripresenti a ogni pagina. " +
            "Non è un cookie, non viene trasmessa a nessuno e si rimuove in " +
            "qualsiasi momento svuotando i dati del sito dal browser.",
          "Non svolgo attività di profilazione e non adotto processi " +
            "decisionali automatizzati ai sensi dell'articolo 22 del " +
            "Regolamento.",
        ],
        en: [
          "This site uses no cookies of any kind, and hosts no statistics, " +
            "analytics or tracking tool. Fonts and images are served from the " +
            "same domain as the pages, so simply reading the site produces no " +
            "request to any third party server.",
          "The only thing the site writes to the device is one entry in the " +
            "browser's local storage, recording that the notice shown on " +
            "arrival has been closed so that it does not appear again on " +
            "every page. It is not a cookie, it is transmitted to nobody, and " +
            "it is removed at any time by clearing the site's data in the " +
            "browser.",
          "I carry out no profiling and no automated decision-making within " +
            "the meaning of Article 22 of the Regulation.",
        ],
      },
    },

    {
      heading: {
        it: "Destinatari e trasferimenti fuori dall'Unione Europea",
        en: "Recipients and transfers outside the European Union",
      },
      body: {
        it: [
          "Non comunico a terzi i dati che ricevo, non li diffondo e non li " +
            "cedo per finalità commerciali.",
          "Il sito è ospitato da Netlify, che agisce come responsabile del " +
            "trattamento per i log descritti sopra e può trattarli anche su " +
            "server situati fuori dall'Unione Europea, sulla base delle " +
            "garanzie previste dal proprio accordo sul trattamento dei dati.",
          "I messaggi inviati tramite WhatsApp, Gmail o i profili social " +
            "restano anche nella disponibilità delle rispettive piattaforme, " +
            "che li trattano come titolari autonomi secondo le proprie " +
            "informative, sulle quali non ho controllo.",
        ],
        en: [
          "I do not disclose the data I receive to third parties, do not " +
            "publish it and do not pass it on for commercial purposes.",
          "The site is hosted by Netlify, which acts as data processor for " +
            "the logs described above and may process them on servers outside " +
            "the European Union, under the safeguards set out in its own data " +
            "processing agreement.",
          "Messages sent through WhatsApp, Gmail or the social profiles also " +
            "remain with those platforms, which process them as controllers " +
            "in their own right under their own privacy policies, over which " +
            "I have no control.",
        ],
      },
    },

    {
      heading: {
        it: "Periodo di conservazione",
        en: "How long the data is kept",
      },
      body: {
        it: [
          "I log del server sono conservati dal fornitore di hosting per il " +
            "tempo strettamente necessario alle finalità di sicurezza " +
            "indicate sopra, secondo le politiche del servizio, salva la " +
            "conservazione per l'accertamento di reati da parte " +
            "dell'autorità giudiziaria.",
          "I messaggi restano nella casella o nell'applicazione da cui sono " +
            "arrivati per il tempo necessario a rispondere e, se ne nasce un " +
            "incarico, per la durata del rapporto e per il periodo in cui la " +
            "legge impone di conservarne la documentazione. Oltre questi " +
            "termini vengono cancellati, e possono esserlo prima su richiesta.",
        ],
        en: [
          "The server logs are kept by the hosting provider for as long as " +
            "the security purposes above require, according to that service's " +
            "policies, save for their retention for the investigation of " +
            "offences by the judicial authorities.",
          "Messages remain in the mailbox or the application they arrived " +
            "through for as long as replying requires and, where an " +
            "engagement follows, for the duration of that relationship and " +
            "for the period during which the law requires the paperwork to be " +
            "kept. Beyond those terms they are deleted, and they can be " +
            "deleted sooner on request.",
        ],
      },
    },

    {
      heading: {
        it: "Natura del conferimento dei dati",
        en: "Whether data has to be provided",
      },
      body: {
        it: [
          "Consultare il sito non richiede di comunicare alcun dato, a parte " +
            "quelli di navigazione, la cui trasmissione è tecnicamente " +
            "necessaria perché le pagine possano essere consegnate.",
          "Comunicare i propri dati scrivendo è invece del tutto " +
            "facoltativo, ma senza di essi non è possibile ricevere una " +
            "risposta.",
        ],
        en: [
          "Reading the site requires no data beyond the browsing data, whose " +
            "transmission is technically necessary for the pages to be " +
            "delivered at all.",
          "Providing data by writing, on the other hand, is entirely " +
            "optional, but without it no reply is possible.",
        ],
      },
    },

    {
      heading: { it: "Diritti dell'interessato", en: "Rights" },
      body: {
        it: [
          "Gli articoli dal 15 al 22 del Regolamento riconoscono il diritto " +
            "di accedere ai propri dati, di ottenerne la rettifica o la " +
            "cancellazione, di chiederne la limitazione, di riceverli in un " +
            "formato leggibile da una macchina e di opporsi in qualsiasi " +
            "momento al trattamento fondato sul legittimo interesse.",
          "Per esercitare uno di questi diritti basta scrivere all'indirizzo " +
            "indicato al punto 1. La richiesta non ha costi e ricevo risposta " +
            "entro un mese, come previsto dall'articolo 12 del Regolamento.",
        ],
        en: [
          "Articles 15 to 22 of the Regulation grant the right to access " +
            "one's own data, to have it corrected or erased, to ask for the " +
            "processing to be restricted, to receive the data in a " +
            "machine-readable format and to object at any time to processing " +
            "based on legitimate interest.",
          "Exercising any of these rights takes no more than an email to the " +
            "address given in section 1. There is no charge, and a reply " +
            "follows within one month, as Article 12 of the Regulation " +
            "requires.",
        ],
      },
    },

    {
      heading: {
        it: "Reclamo all'autorità di controllo",
        en: "Complaints to the supervisory authority",
      },
      body: {
        it: [
          "Chi ritiene che il trattamento dei propri dati avvenga in " +
            "violazione del Regolamento può proporre reclamo al Garante per " +
            "la protezione dei dati personali, ai sensi dell'articolo 77 del " +
            "Regolamento, oppure rivolgersi all'autorità giudiziaria.",
        ],
        en: [
          "Anyone who considers that their data is being processed in breach " +
            "of the Regulation may lodge a complaint with the Italian data " +
            "protection authority under Article 77 of the Regulation, or " +
            "bring the matter before the courts.",
        ],
      },
      link: {
        label: {
          it: "Garante per la protezione dei dati personali",
          en: "Italian data protection authority",
        },
        href: "https://www.garanteprivacy.it",
      },
    },

    {
      heading: {
        it: "Modifiche a questa informativa",
        en: "Changes to this notice",
      },
      body: {
        it: [
          "Questa informativa può essere aggiornata se cambiano il sito o i " +
            "servizi che lo rendono raggiungibile. La versione in vigore è " +
            "sempre quella pubblicata a questo indirizzo, con la data di " +
            "ultimo aggiornamento indicata in cima alla pagina.",
        ],
        en: [
          "This notice may be updated if the site changes, or if the " +
            "services that make it reachable do. The version in force is " +
            "always the one published at this address, carrying the last " +
            "updated date shown at the top of the page.",
        ],
      },
    },
  ] satisfies PrivacySection[],

  /**
   * The notice itself. It asks for nothing: there is no cookie to consent to,
   * and a banner that asks anyway teaches the reader to dismiss without
   * reading. It states what the site does not do and points at this page.
   */
  notice: {
    text: {
      it: "Questo sito non usa cookie e non traccia chi lo visita.",
      en: "This site uses no cookies and does not track its visitors.",
    },
    more: { it: "Informativa", en: "Privacy policy" },
    dismiss: { it: "Ho capito", en: "Got it" },
  },
} as const;
