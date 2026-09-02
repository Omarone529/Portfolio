import { SITE, type L10n, type Lang } from "./site";

/**
 * A screenshot of the thing running, shown at the foot of a case study.
 *
 * `alt` and `caption` are both written because they are read by different
 * people: the caption names the screen in one line under the image, the alt
 * says what is on it for someone who never sees it. Repeating one as the other
 * would give a screen reader the same sentence twice.
 */
export interface Shot {
  webp: string;
  width: number;
  height: number;
  alt: L10n;
  caption: L10n;
}

export interface Project {
  slug: string;
  /**
   * The title split in two, so the second half can carry the accent colour.
   * Concatenated verbatim for <title>, JSON-LD and anywhere plain text is needed.
   */
  titleParts: [string, string];
  image: {
    webp: string;
    width: number;
    height: number;
    /**
     * Fraction of the 16:9 card frame the logo fills, along whichever side it
     * runs out of room on first. Omitted means the 0.68 default in globals.css,
     * which is what the two wide wordmarks use.
     *
     * A wide wordmark runs out of width first and reads light. A compact,
     * near-square mark runs out of height first, so it fills the frame top to
     * bottom and reads much heavier at the same fraction. Those are the ones
     * that carry their own value.
     */
    scale?: number;
  };
  /** Card frame tint and title accent, sampled from each logo. */
  accent: string;
  tint: string;
  /**
   * Colour of the first half of the title, where the ink default does not
   * separate it from the accent. Omitted, and it stays `--color-ink`, which is
   * what a coloured accent already sets it apart from.
   */
  accentLead?: string;
  /**
   * What kind of thing the project is, e.g. "Sito Vetrina". Read under the
   * title on the card and above it on the case study.
   *
   * It names no technology: a reader who wants that has the stack block on the
   * case study, and one who does not gets a line they can still parse.
   */
  type: L10n;
  /**
   * The year the project was finished, read after the type on the case study.
   * It is not on the home cards: five dates down a grid turn the work into a
   * list of dates, and the same fact is one click away.
   */
  year: number;
  /** One-sentence blurb, used on the card and in the meta description. */
  core: L10n;
  /** Opening line of the case study. */
  lead: L10n;
  /** What the project does, one paragraph per entry. */
  solution: L10n<string[]>;
  /**
   * Screenshots of the running product. Left out by a project that has none:
   * the section exists on the case study only where the pictures do.
   */
  shots?: Shot[];
  stack: string[];
  meta: {
    title: L10n;
    description: L10n;
    ogDescription: L10n;
  };
}

export const PROJECTS: Project[] = [
  {
    slug: "joedesign",
    titleParts: ["Joe", "Design"],
    image: {
      webp: "/assets/joedesign-logo.webp",
      width: 512,
      height: 512,
    },
    accent: "#14110F",
    accentLead: "#5A5A5A",
    tint: "#E9E7E3",
    type: {
      it: "Sito Portfolio",
      en: "Portfolio Website",
    },
    year: 2026,
    core: {
      it: "Sito portfolio per un designer, con archivio dei lavori.",
      en: "Portfolio site for a designer, with an archive of his work.",
    },
    lead: {
      it: "Un portfolio che si sfoglia come una rivista.",
      en: "A portfolio you leaf through like a magazine.",
    },
    solution: {
      it: [
        "Sito portfolio di Giovanni Sarchiolla, product designer di Reggio " +
          "Emilia. Pagina home, chi sono, archivio e per ogni progetto una " +
          "pagina dedicata.",
        "L'archivio raccoglie i progetti divisi tra Product Design e Graphic " +
          "Design. Ogni scheda tiene insieme le fotografie, i dettagli " +
          "(oggetto, contesto, materiale, colore) e il disegno tecnico con " +
          "le quote.",
        "Nella pagina “Chi sono” è presente anche lo sketchbook 3D " + "sfogliabile.",
      ],
      en: [
        "Giovanni Sarchiolla's portfolio site, a product designer from " +
          "Reggio Emilia. A home page, an about page, an archive, and a page " +
          "of its own for every project.",
        "The archive gathers the projects, split between Product Design and " +
          "Graphic Design. Each card holds the photographs together with the " +
          "details (object, context, material, colour) and the dimensioned " +
          "drawing.",
        "On the “About” page there is also the sketchbook, in 3D, with " +
          "pages that turn.",
      ],
    },
    stack: ["React", "Vite", "Tailwind CSS", "Three.js"],
    meta: {
      title: {
        it: "JoeDesign · Omar Bayadi",
        en: "JoeDesign · Omar Bayadi",
      },
      description: {
        it:
          "JoeDesign: sito portfolio per un designer, con archivio dei " +
          "lavori e una pagina per ogni progetto. Progetto di Omar Bayadi, " +
          "full-stack developer.",
        en:
          "JoeDesign: a portfolio website for a designer, with an archive " +
          "of his work and a page for each project. A project by Omar Bayadi, " +
          "full-stack " +
          "developer.",
      },
      ogDescription: {
        it:
          "Sito portfolio per un designer, con archivio dei lavori e una " +
          "pagina per ogni progetto.",
        en:
          "A portfolio website for a designer, with an archive of his work " +
          "and " +
          "a page for each project.",
      },
    },
  },
  {
    slug: "synapsi",
    titleParts: ["Syn", "apsi"],
    image: {
      webp: "/assets/synapsi-logo.webp",
      width: 340,
      height: 302,
      scale: 0.6,
    },
    accent: "#C4552C",
    tint: "#FBF0EA",
    type: {
      it: "App Desktop",
      en: "Desktop App",
    },
    year: 2026,
    core: {
      it: "Gestionale per freelance con integrazione AI su Telegram.",
      en: "Management suite for freelancers with AI integration on Telegram.",
    },
    lead: {
      it:
        "Un gestionale proattivo che si usa anche da Telegram grazie al suo " +
        "assistente AI.",
      en:
        "A proactive management suite that can also be used from Telegram, " +
        "through its AI assistant.",
    },
    solution: {
      it: [
        "Gestionale per freelancer che vogliono tracciare comodamente " +
          "l'andamento della propria attività lavorativa. Viene " +
          "distribuito come app desktop per Windows e macOS. Ogni " +
          "installazione gira interamente sul PC e tutti i dati sono salvati " +
          "in locale, sul proprio dispositivo.",
        "All'interno vengono salvati clienti, progetti, preventivi, " +
          "fatture, saldi, ore di lavoro, collaboratori, spese e pagamenti " +
          "incassati. Il ciclo di fatturazione è completo ed arriva fino " +
          "alla generazione del file XML per la fatturazione elettronica, " +
          "con ritenuta d'acconto ed eventuali ricorrenze che si emettono " +
          "automaticamente. L'AI è in grado di eseguire tutte le operazioni " +
          "possibili e può registrare una spesa fotografando lo scontrino. " +
          "Da questi dati Synapsi ricava il bilancio spese e l'andamento " +
          "generale dell'attività, fino a generare dei report dettagliati.",
        "Dal bot Telegram è quindi possibile gestire l'intera attività, " +
          "creando, modificando o eliminando qualunque tipo di informazione " +
          "presente nel gestionale, allegando uno screenshot che mostra " +
          "l'operazione effettuata, in modo da poterne verificare " +
          "immediatamente la correttezza. Una volta a settimana il bot " +
          "scrive di sua iniziativa, con il promemoria di quello che è " +
          "rimasto in sospeso.",
      ],
      en: [
        "A management suite for freelancers who want to follow " +
          "how their own work is going, comfortably. It ships as a desktop " +
          "app for Windows and macOS. Every installation runs entirely on " +
          "the computer, and all the data is saved locally on the device.",
        "Saved inside are clients, projects, quotes, invoices, balances, " +
          "hours worked, collaborators, expenses and payments received. The " +
          "invoicing cycle is complete and goes as far as generating the XML " +
          "file for electronic invoicing, with withholding tax and any " +
          "recurring invoices, which are issued automatically. The AI can " +
          "carry out every operation there is, and it can log an expense " +
          "from a photo of the receipt. From this data Synapsi works out the " +
          "balance of expenses and how the business is going overall, down " +
          "to detailed reports.",
        "From the Telegram bot, then, the whole business can be run, " +
          "creating, editing or deleting any kind of information held in " +
          "the suite, attaching a screenshot that shows the operation just " +
          "carried out, so it can be checked straight away. Once a week the " +
          "bot writes of its own accord, with a reminder of whatever has " +
          "been left pending.",
      ],
    },
    shots: [
      {
        webp: "/assets/synapsi-dashboard.webp",
        width: 1600,
        height: 547,
        alt: {
          it:
            "La dashboard di Synapsi: le fatture scadute in cima, e sotto " +
            "l'incassato del mese, il credito ancora aperto e le ore della " +
            "settimana.",
          en:
            "Synapsi's dashboard: overdue invoices at the top, and below them " +
            "the month's takings, the credit still open and the week's hours.",
        },
        caption: {
          it: "La dashboard, con le fatture in sospeso e i totali del mese.",
          en: "The dashboard, with the pending invoices and the month's totals.",
        },
      },
      {
        webp: "/assets/synapsi-agenda.webp",
        width: 1600,
        height: 839,
        alt: {
          it:
            "L'agenda di Synapsi, divisa in fatture da incassare, progetti in " +
            "scadenza, preventivi in attesa di risposta, preventivi accettati " +
            "da fatturare e progetti fermi.",
          en:
            "Synapsi's agenda, split into invoices to collect, projects coming " +
            "due, quotes awaiting an answer, accepted quotes still to invoice " +
            "and stalled projects.",
        },
        caption: {
          it:
            "L'agenda: fatture da incassare, preventivi in attesa, progetti " +
            "fermi.",
          en:
            "The agenda: invoices to collect, quotes awaiting an answer, " +
            "stalled projects.",
        },
      },
      {
        webp: "/assets/synapsi-bilancio.webp",
        width: 1600,
        height: 594,
        alt: {
          it:
            "Il bilancio di Synapsi: entrate, uscite, saldo e credito da " +
            "incassare, sopra la verifica dei conti, che elenca le fatture " +
            "emesse e non incassate, i preventivi mai fatturati e gli incassi " +
            "non collegati a nessuna fattura.",
          en:
            "Synapsi's books: income, expenses, balance and outstanding " +
            "credit, above the reconciliation, listing invoices issued but not " +
            "collected, quotes never invoiced and payments tied to no invoice.",
        },
        caption: {
          it: "Il bilancio, con la verifica dei conti.",
          en: "The books, with the reconciliation.",
        },
      },
      {
        webp: "/assets/synapsi-bilancio-grafici.webp",
        width: 1600,
        height: 714,
        alt: {
          it:
            "I grafici del bilancio di Synapsi: le spese per categoria in un " +
            "anello, entrate e uscite di due anni a confronto, i crediti " +
            "aperti cliente per cliente e le ore del mese divise per progetto.",
          en:
            "The charts in Synapsi's books: expenses by category in a ring, " +
            "two years of income and expenses side by side, open credit client " +
            "by client and the month's hours split by project.",
        },
        caption: {
          it:
            "I grafici del bilancio: spese per categoria, anni a confronto, " +
            "crediti e ore.",
          en:
            "The charts in the books: expenses by category, years side by " +
            "side, credit and hours.",
        },
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "SQLite",
      "JWT",
      "ReportLab",
      "FatturaPA XML",
      "APScheduler",
      "Playwright",
      "python-telegram-bot",
      "Gemini Flash Lite",
      "Gemini Vision",
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Recharts",
      "Electron",
    ],
    meta: {
      title: {
        it: "Synapsi · Omar Bayadi",
        en: "Synapsi · Omar Bayadi",
      },
      description: {
        it:
          "Synapsi: gestionale per freelance con bot Telegram e AI, dalla " +
          "fatturazione elettronica al bilancio. Progetto di Omar Bayadi, full-stack " +
          "developer.",
        en:
          "Synapsi: a management suite for freelancers with an AI Telegram bot, from " +
          "electronic invoicing to the books. A project by Omar Bayadi, full-stack " +
          "developer.",
      },
      ogDescription: {
        it:
          "Gestionale per freelance con bot Telegram e AI: promemoria settimanali, " +
          "fatturazione elettronica, spese e bilancio.",
        en:
          "A management suite for freelancers with an AI Telegram bot: weekly " +
          "reminders, electronic invoicing, expenses and the books.",
      },
    },
  },
  {
    slug: "askyvet",
    titleParts: ["Asky", "Vet"],
    image: {
      webp: "/assets/askyvet-logo.webp",
      width: 450,
      height: 512,
    },
    accent: "#0C82BF",
    tint: "#E9F8FF",
    type: {
      it: "Blog e Forum",
      en: "Blog and Forum",
    },
    year: 2026,
    core: {
      it: "Divulgazione veterinaria sugli animali domestici, con un forum.",
      en: "Veterinary writing about pets, with a forum.",
    },
    lead: {
      it:
        "Un blog di divulgazione veterinaria dove ogni articolo può diventare " +
        "una discussione.",
      en: "A veterinary blog where any article can turn into a discussion.",
    },
    solution: {
      it: [
        "Piattaforma di divulgazione veterinaria sugli animali domestici. Gli " +
          "articoli, con copertina, categoria e tag, vengono " +
          "pubblicati dalla redazione, ed è presente la sezione forum.",
        "Nel forum si aprono discussioni libere oppure collegate a un " +
          "articolo, con post, risposte a più livelli e like. Un articolo " +
          "porta con sé la discussione che lo riguarda, quando esiste. I " +
          "veterinari sono distinti dagli altri utenti.",
        "L'accesso è con email e password o con Google, e i token di sessione " +
          "ruotano a ogni rinnovo. La redazione gestisce gli articoli e la " +
          "moderazione degli utenti.",
      ],
      en: [
        "A platform of veterinary writing about pets. The articles, " +
          "each with a cover, a category and tags, are published by the " +
          "editors, and there is a forum section.",
        "In the forum, discussions are opened freely or attached to an " +
          "article, with posts, replies at several levels and likes. An " +
          "article carries the discussion about it, where there is one. Vets " +
          "are distinguished from the other users.",
        "Signing in works with an email and a password or with Google, and " +
          "the session tokens rotate at every renewal. The editors look after " +
          "the articles and the moderation of the users.",
      ],
    },
    stack: [
      "Django",
      "Django REST framework",
      "PostgreSQL",
      "JWT",
      "OAuth",
      "React",
      "Vite",
      "Tailwind CSS",
      "Docker",
    ],
    meta: {
      title: {
        it: "AskyVet · Omar Bayadi",
        en: "AskyVet · Omar Bayadi",
      },
      description: {
        it:
          "AskyVet: blog di divulgazione veterinaria sugli animali domestici, con " +
          "forum e moderazione. Progetto di Omar Bayadi, full-stack developer.",
        en:
          "AskyVet: a veterinary blog about pets, with a forum and moderation. " +
          "A project by Omar Bayadi, full-stack developer.",
      },
      ogDescription: {
        it:
          "Blog di divulgazione veterinaria sugli animali domestici, con forum e " +
          "moderazione.",
        en: "A veterinary blog about pets, with a forum and moderation.",
      },
    },
  },
  {
    slug: "apexgps",
    titleParts: ["Apex", "GPS"],
    image: {
      webp: "/assets/apexgps-logo.webp",
      width: 1400,
      height: 409,
    },
    accent: "#34718F",
    tint: "#EAF1F5",
    type: {
      it: "Web App",
      en: "Web App",
    },
    year: 2026,
    core: {
      it: "Pianificatore di percorsi panoramici, pensato per motociclisti.",
      en: "A scenic route planner made for motorcyclists.",
    },
    lead: {
      it:
        "Un servizio web di navigazione che calcola percorsi di guida " +
        "panoramici. Invece di trovare la strada più veloce, trova " +
        "quella più interessante da percorrere, senza che il viaggio duri " +
        "troppo a lungo.",
      en:
        "A web navigation service that plots scenic driving " +
        "routes. Instead of finding the fastest road, it finds the one that " +
        "is more interesting to ride, without letting the trip run too " +
        "long.",
    },
    solution: {
      it: [
        "Motore di routing che calcola percorsi panoramici e " +
          "sinuosi, pensati per il piacere di guidare più che per arrivare in " +
          "fretta. La parte principale del progetto è il servizio backend " +
          "API: calcola i percorsi, gestisce l'autenticazione con JWT e " +
          "Google e si occupa di salvare e sincronizzare i tracciati di ogni " +
          "utente. " +
          "Espone una sola interfaccia dati, usata sia dall'applicazione " +
          "mobile sia da quella web. I dati stradali vengono elaborati con " +
          "PostGIS, mentre il frontend in React mostra i percorsi sulla " +
          "mappa.",
      ],
      en: [
        "A routing engine that plots scenic, twisty routes, " +
          "meant for the pleasure of riding rather than for getting there " +
          "quickly. The main part of the project is the backend API service: " +
          "it works out the routes, handles authentication with JWT and " +
          "Google, and takes care of saving and syncing each user's tracks. " +
          "It exposes a single data interface, used by both the mobile and " +
          "the web application. Road data is processed with PostGIS, while " +
          "the React frontend shows the routes on the map.",
      ],
    },
    shots: [
      {
        webp: "/assets/apexgps-hero.webp",
        width: 1600,
        height: 770,
        alt: {
          it:
            "L'apertura del sito ApexGPS: una moto ripresa dall'alto su una " +
            "strada di montagna, e sopra il titolo “Scopri percorsi " +
            "panoramici” con i tasti per pianificare un percorso.",
          en:
            "ApexGPS's opening screen: a motorbike filmed from above on a " +
            "mountain road, with the heading “Scopri percorsi " +
            "panoramici” over it and the buttons to plan a route.",
        },
        caption: {
          it: "La prima schermata del sito.",
          en: "The site's opening screen.",
        },
      },
      {
        webp: "/assets/apexgps-mappa.webp",
        width: 1600,
        height: 686,
        alt: {
          it:
            "La mappa di ApexGPS con un percorso tracciato in arancione da " +
            "Terni verso Colle Mancino, e le puntine dei luoghi che incontra " +
            "lungo la strada.",
          en:
            "ApexGPS's map with a route traced in orange from Terni towards " +
            "Colle Mancino, and pins for the places it passes along the way.",
        },
        caption: {
          it: "Il planner, con il percorso calcolato sulla mappa.",
          en: "The planner, with the route plotted on the map.",
        },
      },
      {
        webp: "/assets/apexgps-mobile.webp",
        width: 1600,
        height: 652,
        alt: {
          it:
            "La sezione del sito che mostra un telefono con i percorsi salvati " +
            "dagli utenti, ognuno con la sua anteprima sulla mappa, la data e " +
            "i due estremi del giro.",
          en:
            "The part of the site showing a phone with the routes users have " +
            "saved, each with its own preview on the map, the date and the two " +
            "ends of the ride.",
        },
        caption: {
          it: "La sezione dei percorsi salvati, sul telefono.",
          en: "The saved routes section, on the phone.",
        },
      },
    ],
    stack: [
      "Django",
      "Django REST framework",
      "PostgreSQL",
      "PostGIS",
      "JWT",
      "OAuth",
      "React",
      "Tailwind CSS",
      "Docker",
      "Azure",
    ],
    meta: {
      title: {
        it: "ApexGPS · Omar Bayadi",
        en: "ApexGPS · Omar Bayadi",
      },
      description: {
        it:
          "ApexGPS: calcola percorsi panoramici per motociclisti, in base ai punti " +
          "di interesse e alla sinuosità delle strade. Progetto di Omar Bayadi, " +
          "full-stack developer.",
        en:
          "ApexGPS: plots scenic routes for motorcyclists, from points of " +
          "interest and how twisty the roads are. A project by Omar Bayadi, " +
          "full-stack developer.",
      },
      ogDescription: {
        it:
          "Calcola percorsi panoramici per motociclisti, in base ai punti di " +
          "interesse e alla sinuosità delle strade.",
        en:
          "Scenic routes for motorcyclists, worked out from points of interest and " +
          "how " +
          "twisty the roads are.",
      },
    },
  },
  {
    slug: "mbm-meccanica",
    titleParts: ["MBM ", "Meccanica"],
    image: {
      webp: "/assets/mbm-meccanica-logo.webp",
      width: 1258,
      height: 416,
    },
    accent: "#2A3480",
    tint: "#ECEEF8",
    type: {
      it: "Sito Vetrina",
      en: "Showcase Website",
    },
    year: 2026,
    core: {
      // Two lines is what the card gives it, and "metalmeccanica" is fourteen
      // letters: the longer version was cut mid sentence by the line clamp.
      it: "Servizi, lavorazioni e contatti di un'azienda metalmeccanica.",
      en: "Services, machining and contacts of a metalworking company.",
    },
    lead: {
      it:
        "Un sito vetrina in cui ogni macchina dell'officina ha la propria scheda " +
        "tecnica.",
      en:
        "A showcase site where every machine in the shop has a spec sheet of its " +
        "own.",
    },
    solution: {
      it: [
        "Sito vetrina per un'officina metalmeccanica di Castelvetro di " +
          "Modena. L'azienda si occupa di tornitura e fresatura CNC per il " +
          "packaging, l'automotive, il farmaceutico e l'automazione " +
          "industriale per conto terzi. Le sezioni della pagina sono " +
          "l'azienda, i servizi, il parco macchine e i contatti, con foto e " +
          "video dell'officina.",
        "Nella pagina “Parco macchine” vengono mostrate le attrezzature e " +
          "i macchinari dell'officina, ciascuno con la propria scheda " +
          "tecnica, riprese dettagliate e alcuni esempi dei prodotti " +
          "finiti.",
      ],
      en: [
        "A showcase site for a metalworking shop in Castelvetro di Modena. " +
          "The company does turning and CNC milling for packaging, " +
          "automotive, " +
          "pharmaceutical and industrial automation, as a subcontractor. The " +
          "sections of the page are the company, the services, the machines " +
          "and the contacts, with photographs and video of the shop.",
        "The “Parco macchine” page shows the shop's equipment and " +
          "machines, each with a spec sheet of its own, detailed footage " +
          "and a few examples of the finished parts.",
      ],
    },
    shots: [
      {
        webp: "/assets/mbm-meccanica-hero.webp",
        width: 1600,
        height: 833,
        alt: {
          it:
            "L'apertura del sito MBM Meccanica: il reparto macchine ripreso " +
            "dall'interno, e sopra il titolo “Precisione che si vede” con i " +
            "tasti per i servizi e per il preventivo.",
          en:
            "MBM Meccanica's opening screen: the machine shop filmed from " +
            "inside, with the heading “Precisione che si vede” over it and " +
            "the buttons for the services and for a quote.",
        },
        caption: {
          it: "La prima schermata del sito.",
          en: "The site's opening screen.",
        },
      },
      {
        webp: "/assets/mbm-meccanica-tornitura.webp",
        width: 1600,
        height: 840,
        alt: {
          it:
            "La scheda del tornio DMG Mori NLX 2000Y/500 nel parco macchine, " +
            "sopra la fotografia dell'utensile al lavoro, con diametro e " +
            "lunghezza massimi, capacità barra, corsa Y, giri del mandrino e " +
            "posizioni della torretta.",
          en:
            "The card for the DMG Mori NLX 2000Y/500 lathe, over a " +
            "photograph of the tool at work, with maximum " +
            "diameter and length, bar capacity, Y travel, spindle speed and " +
            "turret positions.",
        },
        caption: {
          it: "Il parco macchine: la scheda del tornio.",
          en: "The machines: the lathe's card.",
        },
      },
      {
        webp: "/assets/mbm-meccanica-fresatura.webp",
        width: 1600,
        height: 837,
        alt: {
          it:
            "La scheda della fresatrice Sigma Flexy, con le lunghezze massime " +
            "in X e in Y, le corse dei tre assi e l'asse C a 360 gradi " +
            "continui.",
          en:
            "The card for the Sigma Flexy milling machine, with maximum " +
            "lengths in X and Y, the travel of the three axes and a C axis at " +
            "a continuous 360 degrees.",
        },
        caption: {
          it: "Il parco macchine: la scheda della fresatrice a 5 assi.",
          en: "The machines: the 5 axis milling machine's card.",
        },
      },
    ],
    stack: ["React", "Tailwind CSS"],
    meta: {
      title: {
        it: "MBM Meccanica · Omar Bayadi",
        en: "MBM Meccanica · Omar Bayadi",
      },
      description: {
        it:
          "MBM Meccanica: sito vetrina per un'azienda metalmeccanica, con servizi, " +
          "lavorazioni e contatti. Progetto di Omar Bayadi, full-stack developer.",
        en:
          "MBM Meccanica: a showcase website for a metalworking company, with its " +
          "services, machining and contacts. A project by Omar Bayadi, full-stack " +
          "developer.",
      },
      ogDescription: {
        it:
          "Sito vetrina per un'azienda metalmeccanica: servizi, lavorazioni e " +
          "contatti.",
        en:
          "A showcase website for a metalworking company: services, machining and " +
          "contacts.",
      },
    },
  },
  {
    slug: "timesheet-manager",
    titleParts: ["Timesheet ", "Manager"],
    image: {
      webp: "/assets/timesheet-manager-logo.webp",
      width: 368,
      height: 364,
      scale: 0.67,
    },
    accent: "#1BA5D8",
    tint: "#E9F7FD",
    type: {
      it: "App Desktop e Mobile",
      en: "Desktop & Mobile App",
    },
    year: 2025,
    core: {
      it: "Registra le ore lavorate e stima lo stipendio netto.",
      en: "Logs hours worked and estimates the net pay.",
    },
    lead: {
      it: "Un gestionale personale per non perdere più il conto delle ore lavorate.",
      en: "A personal tool for not losing count of the hours worked.",
    },
    solution: {
      it: [
        "App desktop e mobile: registra le ore lavorate giorno per giorno, " +
          "genera resoconti mensili e annuali " +
          "con i grafici, e stima lo stipendio netto in base alle ore " +
          "effettive e alle detrazioni in busta paga.",
      ],
      en: [
        "A desktop and mobile app that logs hours day by day, generates " +
          "monthly and yearly reports with charts, and estimates net salary " +
          "from the actual hours worked and the payslip deductions.",
      ],
    },
    stack: ["Flutter", "Dart"],
    meta: {
      title: {
        it: "Timesheet Manager · Omar Bayadi",
        en: "Timesheet Manager · Omar Bayadi",
      },
      description: {
        it:
          "Timesheet Manager: app desktop e mobile per registrare le ore lavorate e " +
          "stimare lo stipendio netto. Progetto di Omar Bayadi, " +
          "full-stack developer.",
        en:
          "Timesheet Manager: a desktop and mobile app for logging hours worked " +
          "and estimating the net pay. A project by Omar Bayadi, full-stack " +
          "developer.",
      },
      ogDescription: {
        it:
          "App desktop e mobile per registrare le ore lavorate e stimare lo " +
          "stipendio netto.",
        en:
          "A desktop and mobile app for logging hours worked and estimating the " +
          "net pay.",
      },
    },
  },
];

export function projectTitle(project: Project): string {
  return project.titleParts.join("");
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/**
 * The picture a case study is shared with, described the way a crawler needs
 * it.
 *
 * There is no field for it. The path is the slug, so a project cannot be added
 * without one and cannot point at a file that was never drawn: `tools/cards.mjs`
 * reads this same name back out of the built page's `og:image` and writes the
 * picture there, and the tests check that the file is on disk. That is the
 * whole arrangement, and it exists because the earlier one, a hand written
 * path that three projects simply did not have, left half the work previewing
 * as the site card.
 *
 * The card shows the logo in its tinted frame and the title beside it, so that
 * is what the alt says. It says it in the language of the page doing the
 * sharing, which is also the language written on the card.
 *
 * @param project the project being shared
 * @param lang which language the page is in
 * @returns the social card for that project
 */
export function projectCard(
  project: Project,
  lang: Lang,
): { path: string; width: number; height: number; alt: string } {
  return {
    path: `/assets/${project.slug}-card-${lang}.png`,
    width: SITE.ogImageSize.width,
    height: SITE.ogImageSize.height,
    alt: `${projectTitle(project)} · ${project.type[lang]}`,
  };
}

/** All static params Next needs to pre-render the case studies. */
export function projectSlugs(): { slug: string }[] {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}
