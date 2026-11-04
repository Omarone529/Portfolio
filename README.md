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
    site.js             nome, dominio, luogo, profili, competenze, sezioni, menu
    seo.js              titolo, descrizione e sintesi per motori e assistenti AI
    hero.js about.js projects.js services.js footer.js notFound.js
  components/
    primitives/         i mattoncini animati riusati ovunque (+ primitives.css)
    layout/             Section, Container, Portal, JsonLd
    sections/<Nome>/    una cartella per sezione, ognuna con il suo CSS
  hooks/                logica riusabile (hover, conteggi, video, misure)
  providers/            scroll fluido, link interni e tutto ciò che vive solo nel browser
  lib/                  animazioni, formattazione, scroll, SEO (JSON-LD) e llms.txt
  styles/               token di design, base e struttura della pagina
```

## Come si fa

- **Aggiungere un progetto:** una voce in `PROJECTS` (`content/projects.js`) con `tag`, `description`, `logo` e `tint`. Con `video` e `poster` la demo compare in "Guarda tutti". Pila, dati strutturati, sitemap e `llms.txt` si aggiornano da soli, e i test controllano che i file esistano.
- **Aggiungere una sezione:** un id in `SECTION` (`content/site.js`), un componente in `components/sections/`, una riga in `app/page.jsx`. Per il bordo obliquo usa `<Section edge>`.
- **Cambiare colori, font e misure:** `styles/tokens.css`. La pendenza dei bordi obliqui è `--edge-angle`.
- **Cambiare dominio:** `NEXT_PUBLIC_SITE_URL` (default `https://omarbayadi.com`). Canonical, sitemap, robots, JSON-LD e `llms.txt` lo seguono.

## SEO, GEO e AEO

- **HTML prerenderizzato:** ogni testo è nell'HTML statico, quindi crawler e anteprime non devono eseguire JavaScript. Senza JS una regola `<noscript>` mostra anche i contenuti che entrano animati.
- **Metadati:** title e description entro i limiti dei risultati di ricerca (lo verificano i test), canonical, Open Graph `profile`, Twitter large card, robots con anteprime grandi.
- **Dati strutturati (`lib/seo.js`):** un unico `@graph` schema.org con Person, WebSite, ProfilePage e ItemList dei progetti, legati per `@id`. Person ha indirizzo, competenze, servizi offerti e `sameAs` verso i profili pubblici. È serializzato con escape contro le iniezioni.
- **`/llms.txt`:** il sito in Markdown per gli assistenti AI (llmstxt.org), generato dagli stessi contenuti.
- **`robots.txt`:** autorizza tutti i crawler e nomina esplicitamente quelli degli assistenti AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended...). Per escluderne uno basta modificare `app/robots.js`.
- **Titoli:** un `h1`, poi un `h2` per sezione e un `h3` per ogni servizio.
- **Anteprima social:** `app/opengraph-image.jpg` (1200×630, sotto i 100KB perché WhatsApp scarta le immagini pesanti). Se cambiano nome o foto va rifatta.

Lighthouse (mobile): SEO, accessibilità, best practices e agentic browsing a 100. LCP 2.0s su telefono simulato lento (CPU 4x, 4G lento).

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
- **Prima schermata:** la hero entra con animazioni solo CSS (`IntroLines`, `.intro-fade`), così non aspetta JavaScript. Il resto usa Framer Motion quando entra in vista.
- **Hover:** le animazioni partono con `.is-hovering` (`useHoverPlay`) e arrivano sempre in fondo. La durata del hook deve coprire l'animazione più lunga in `primitives.css`.
- **Footer:** resta fisso sotto la pagina e viene scoperto solo se entra nello schermo. Su schermi bassi resta nel flusso normale.
- **Animazioni ridotte:** chi le ha disattivate nel sistema non ha scroll fluido, video in loop, ingressi animati né conteggi.
