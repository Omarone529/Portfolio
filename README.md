# omar-portfolio

Portfolio personale di Omar Bayadi. Next.js 16 con export statico, Framer Motion per le animazioni, Lenis per lo scroll fluido.

```bash
npm run dev           # http://localhost:3000
npm run build         # scrive out/, l'intero sito statico
npm start             # serve out/ in locale, come in produzione
npm run lint          # ESLint con le regole Core Web Vitals di Next
npm run format        # Prettier su tutto il progetto
npm test              # Vitest
npm run check         # lint + formattazione + test + build, come la CI
```

Richiede Node 22 (`.nvmrc`).

## Struttura

```
src/
  app/                  layout, pagina, 404 e i file speciali di Next:
                        robots.js, sitemap.js, manifest.js, llms.txt/, icone, anteprima social
  content/              tutti i testi e i dati, nessun testo nei componenti
    site.js             nome, logo, dominio, luogo, profili, competenze, sezioni, menu
    seo.js              titolo, descrizione e sintesi per motori e assistenti AI
    desktop.js          i testi del portatile: app, menu, Spotlight, sfondi, terminale
    services.js         i servizi, letti solo da dati strutturati e llms.txt
    hero.js about.js projects.js footer.js notFound.js legal.js
  components/
    primitives/         i mattoncini animati riusati ovunque (+ primitives.css)
    layout/             Section, Container, Portal, JsonLd, Logo, LegalPage
    sections/<Nome>/    una cartella per sezione, ognuna con il suo CSS
    sections/Work/      la sezione Case study: Laptop.jsx è il portatile, ProjectMedia le demo
      desktop/          il sistema operativo del portatile (vedi "Il portatile" più sotto)
  hooks/                logica riusabile (hover, conteggi, video, misure)
  providers/            scroll fluido, link interni e tutto ciò che vive solo nel browser
  lib/                  animazioni, formattazione, scroll, SEO (JSON-LD) e llms.txt
  styles/               token di design, base e struttura della pagina
public/
  images/               foto della hero, logo.webp e wallpapers/ del portatile
  projects/             loghi, demo e poster dei progetti
docs/PERFORMANCE.md     la checklist di performance, con misure e motivazioni
```

## Come si fa

- **Aggiungere un progetto:** una voce in `PROJECTS` (`content/projects.js`) con `tag`, `description`, `logo` e `tint`. Compare nella cartella Progetti del portatile; con `video` e `poster` ha anche la sua app nel dock. Dati strutturati, sitemap e `llms.txt` si aggiornano da soli, e i test controllano che i file esistano.
- **Cambiare il logo:** un webp nero su trasparente in `public/images/logo.webp`, con le misure in `SITE.logo`. Il sito lo usa come maschera, quindi prende il colore del testo. Favicon (`app/favicon.ico`), `app/icon.png` e `app/apple-icon.png` vanno rigenerati dal logo, perché Next accetta solo `.ico`, `.png`, `.jpg` e `.svg` per le icone.
- **Cambiare la foto della hero:** `public/images/hero.webp` (1920×1080) con misure e testo alternativo in `content/hero.js`; la stessa foto fa da ritratto nell'About.
- **Aggiungere una sezione:** un id in `SECTION` (`content/site.js`), un componente in `components/sections/`, una riga in `app/page.jsx`. Per il bordo obliquo usa `<Section edge>`.
- **Cambiare colori, font e misure:** `styles/tokens.css`. La pendenza dei bordi obliqui è `--edge-angle`.
- **Pagine legali:** i testi sono in `content/legal.js` (`PRIVACY`, `COOKIES`), resi da `LegalPage`. Se il sito comincia a usare cookie, statistiche o contenuti di terzi, queste pagine vanno aggiornate prima di pubblicare, insieme alla CSP.
- **Email:** ogni link all'indirizzo (footer, pagine legali, app Mail del portatile) apre direttamente un nuovo messaggio in Gmail con `gmailCompose` (`lib/mail.js`). Solo i dati strutturati e `llms.txt` usano `mailto:`, che è lo standard per le macchine.
- **Cambiare dominio:** `NEXT_PUBLIC_SITE_URL` (default `https://omarbayadi.com`). Canonical, sitemap, robots, JSON-LD e `llms.txt` lo seguono.

## SEO, GEO e AEO

- **HTML prerenderizzato:** ogni testo è nell'HTML statico, quindi crawler e anteprime non devono eseguire JavaScript. Senza JS una regola `<noscript>` mostra anche i contenuti che entrano animati.
- **Metadati:** title e description entro i limiti dei risultati di ricerca (lo verificano i test), canonical, Open Graph `profile`, Twitter large card, robots con anteprime grandi.
- **Dati strutturati (`lib/seo.js`):** un unico `@graph` schema.org con Person, WebSite, ProfilePage e ItemList dei progetti, legati per `@id`. Person ha indirizzo, competenze, servizi offerti, il logo come `brand` e `sameAs` verso i profili pubblici. È serializzato con escape contro le iniezioni.
- **`/llms.txt`:** il sito in Markdown per gli assistenti AI (llmstxt.org), generato dagli stessi contenuti.
- **`robots.txt`:** autorizza tutti i crawler e nomina esplicitamente quelli degli assistenti AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...). Per escluderne uno basta modificare `app/robots.js`.
- **Titoli:** un `h1`, poi un `h2` per sezione e un `h3` per il progetto mostrato sotto il portatile.
- **Anteprima social:** `app/opengraph-image.jpg` (1200×630, sotto i 100KB perché WhatsApp scarta le immagini pesanti): la foto della hero con logo, nome e ruolo. Se cambiano nome, ruolo, logo o foto va rifatta.

Lighthouse (mobile e desktop): SEO, accessibilità, best practices e agentic browsing a 100. LCP 1.90s su telefono simulato lento (CPU 4x, 4G lento), CLS 0. Misurato il 7 novembre 2026. La checklist di performance di roadmap.sh, voce per voce, è in [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md).

## Il portatile

La sezione Case study è un piccolo sistema operativo dentro un portatile. `Laptop.jsx` tiene lo stato e compone i pezzi di `Work/desktop/`:

- **Stato delle finestre:** `useDesktop.js`, un reducer puro (apri, chiudi, riduci, ingrandisci, affianca, ridimensiona) con i suoi test. Posizioni e misure sono in percentuale del display, così valgono anche a schermo intero.
- **Finestre e dock:** `AppWindow.jsx` (trascinamento, ridimensionamento da tutti i lati, aggancio ai bordi) e `Dock.jsx` (lente che allarga davvero le icone, rimbalzo all'apertura). `genie.js` disegna l'effetto genio su un canvas.
- **Sistema:** `MenuBar.jsx`, `PopMenu.jsx` (menu e tasto destro), `Spotlight.jsx`, `PowerScreen.jsx` (stop, blocco, riavvio), `DesktopIcons.jsx`, `overview.js` (Mission Control).
- **App:** `apps.jsx` elenca le app del dock e ne disegna le icone; `Finder.jsx` e `SystemApps.jsx` (Note, Mail, Terminale, Calcolatrice, Impostazioni) le rendono. La logica pura di calcolatrice e terminale sta in `calculator.js` e `terminal.js`, con i test.

Sotto i 560px di larghezza (telefoni e tablet) il display è un'anteprima: i comandi sono fermi (`inert`) perché sarebbero troppo piccoli da toccare, e un tocco lo apre a schermo intero. Lì, se lo schermo è più stretto di 600px o più basso di 500px (un telefono, in verticale o in orizzontale), ogni app riempie lo spazio tra barra e dock come su iPhone, e il dock ridimensiona le icone sul numero di app. Da desktop i pallini e i menu hanno un'area cliccabile di almeno 24px.

Per aggiungere uno sfondo basta un webp 1920×1200 in `public/images/wallpapers/` e una voce in `DESKTOP.settings.wallpapers`; un test controlla file e misure. Le scorciatoie usano ⌥ e si attivano solo dopo aver cliccato il portatile, perché ⌘W, ⌘M e ⌘Q appartengono al browser.

## Deploy (Netlify)

`netlify.toml` fa la build e pubblica `out/`. Contiene anche:

- **Header di sicurezza:** CSP limitata al dominio stesso, HSTS, nosniff, niente iframe, niente accesso a fotocamera, microfono e posizione. `'unsafe-inline'` resta per script e stili, perché un export statico non può generare nonce.
- **Cache:** un anno per i file di Next con hash, una settimana per foto e video.
- **Redirect 301 dal sito precedente:** pagine dei progetti, pagine in inglese, `.html` e informativa privacy portano alla home, per conservare il posizionamento.

`public/.well-known/security.txt` indica dove segnalare un problema di sicurezza. Va rinnovato prima della data `Expires`.

La CI di GitHub (`.github/workflows/ci.yml`) esegue audit delle dipendenze, lint, formattazione, test e build a ogni push e pull request. Dependabot apre gli aggiornamenti delle dipendenze.

## Scelte da sapere

- **Mobile first:** gli stili di base sono quelli del telefono e si ampliano con due soli breakpoint, `(width >= 48rem)` per il tablet e `(width > 64rem)` per il desktop. Niente `max-width` nelle media query. Ciò che si tocca è alto almeno `--tap` (44px), e le griglie usano `minmax(0, ...)` per non uscire dallo schermo. Verificato senza scroll orizzontale da 320 a 1440px.
- **Componenti client:** solo le parti animate sono `'use client'`. Il resto viene reso durante la build. `window` e `document` si leggono solo dopo il montaggio (`useIsClient`, `useViewportHeight`, `Portal`).
- **Link interni:** li gestisce `SmoothScrollProvider`, che scorre fino alla sezione senza lasciare `#` nell'indirizzo. Un'ancora deve puntare a un elemento nel flusso della pagina, non fisso: per questo `#top` è su `<main>` e `#contact` è sullo slot del footer.
- **Refresh:** ogni ricarica riparte dalla hero (`resetScrollOnLoad`).
- **Prima schermata:** la hero entra con animazioni solo CSS (`IntroLines`, `.intro-fade`), così non aspetta JavaScript. Il resto usa Framer Motion e si ripete ogni volta che l'elemento rientra nello schermo, da sotto o da sopra (`IN_VIEW` in `lib/motion.js`).
- **Hover:** le animazioni partono con `.is-hovering` (`useHoverPlay`) e arrivano sempre in fondo. La durata del hook deve coprire l'animazione più lunga in `primitives.css`.
- **Footer:** resta fisso sotto la pagina e viene scoperto solo se entra nello schermo. Su schermi bassi resta nel flusso normale.
- **Animazioni ridotte:** chi le ha disattivate nel sistema non ha scroll fluido, video in loop, ingressi animati né conteggi.
