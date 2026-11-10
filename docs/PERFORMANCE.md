# Performance

Lo stato del sito rispetto alla checklist [Frontend Performance Best Practices](https://roadmap.sh/frontend-performance-best-practices) di roadmap.sh, voce per voce.

## Misure (home, build di produzione)

| Misura                                                   | Prima | Ora     | Soglia della checklist |
| -------------------------------------------------------- | ----- | ------- | ---------------------- |
| Richieste al primo caricamento                           | 19    | 17      | il meno possibile      |
| Peso trasferito                                          | 387KB | 330KB   | < 1500KB               |
| CSS che blocca il primo disegno                          | 4     | 0       | nessuno                |
| JavaScript (brotli)                                      | 210KB | 181KB   |                        |
| LCP su telefono lento simulato (CPU 4x, 4G lento)        | 5.7s  | 1.90s   | < 2.5s ("buono")       |
| CLS (telefono e desktop)                                 | 0     | 0       | < 0.1                  |
| Font scaricati                                           |       | 2, 76KB | < 300KB                |
| Cookie / dati salvati nel browser                        |       | 0 / 0   | < 20, < 4096 byte      |
| Risposte 4xx/5xx                                         |       | 0       | nessuna                |
| Lighthouse mobile e desktop (accessibilità, BP, SEO, AI) |       | 100 ×4  |                        |

Misurate il 7 novembre 2026 in locale servendo `out/`, dopo l'arrivo del portatile. TTFB e compressione reali dipendono dal CDN (Netlify).

## Voce per voce

### HTML

- **Minify HTML:** sì. Next esporta HTML compatto (20KB compressi, CSS compreso).
- **Avoid 404 files:** sì. Nessuna risposta in errore al caricamento, la favicon c'è anche in `/favicon.ico`.

### CSS

- **Minify CSS:** sì, fatto da Next in produzione.
- **Concatenate CSS into a single file:** sì. Il CSS è tutto dentro l'HTML (`experimental.inlineCss`), quindi zero file.
- **Make CSS files non-blocking / Inline critical CSS:** sì. Con il CSS dentro l'HTML non resta nessun foglio di stile che blocchi il disegno. Tutto il CSS pesa circa 9KB compressi, quindi lo è anche quello critico.
- **Avoid inline CSS:** scelta consapevole contraria. La voce vale per stili sparsi negli attributi. Qui è un unico blocco nell'`<head>`, che è proprio ciò che chiede la voce sul CSS critico. Gli stili negli attributi li scrivono solo le animazioni.
- **Remove unused CSS:** sì. Il CSS è scritto a mano per sezione: ogni classe ha un componente che la usa.
- **Analyse stylesheets complexity:** sì. Selettori di una o due classi, niente framework, due soli breakpoint.

### JavaScript

- **Minify your JavaScript:** sì, fatto da Next in produzione.
- **Use non-blocking JavaScript:** sì. Next carica gli script in modo asincrono, e la prima schermata entra con animazioni solo CSS (`IntroLines`, `.intro-fade`), senza aspettare JavaScript.
- **Avoid multiple inline JS snippets:** limite del framework. Gli script inline sono i dati di idratazione di Next, che non si possono accorpare.
- **Check dependency size / Bundlephobia / Analyze JS:** fatto. Framer Motion era la dipendenza più pesante: ora carica solo `domAnimation` (`LazyMotion`, `strict`). Lenis pesa pochi KB. I 13.9KB di "legacy JavaScript" che segnala Chrome vengono dal runtime di Next: i target (`browserslist`) sono già i più moderni supportati.
- **Keep dependencies up to date:** sì. `npm outdated` è pulito, salvo ESLint 10 che `eslint-config-next` non supporta ancora del tutto. Dependabot apre gli aggiornamenti ogni settimana e `npm audit` riporta 0 vulnerabilità.

### Immagini

- **Choose image format appropriately / Compress your images:** sì. Webp ovunque. Il logo di JoeDesign è stato ripulito e salvato lossless (da 31.9 a 7.8KB), quelli di ApexGPS e MBM ridimensionati.
- **Serve exact size images:** sì, al doppio della misura massima a cui compaiono, per gli schermi retina. La foto della hero resta 1920px perché sul telefono viene tagliata in verticale e serve tutta la sua altezza.
- **Set width and height attributes on images:** sì, su ogni immagine e video. Un test legge l'intestazione di ogni webp e fallisce se le misure dichiarate non coincidono con il file.
- **Load offscreen images lazily:** sì (`loading="lazy"`, `decoding="async"`). Solo la foto della hero arriva subito, con `fetchpriority="high"`. Le demo video hanno `preload="none"` e partono solo quando sono a schermo. Lo sfondo del portatile e le anteprime che servono all'effetto genio arrivano quando il portatile è a meno di uno schermo, non al primo caricamento.
- **Prefer vector images:** dove c'è un originale vettoriale. Il logo, le icone (ricavate dal logo) e le foto sono raster perché lo sono gli originali.
- **Avoid base64 images:** sì, nessuna.

### Font

- **Use WOFF2 font format:** sì (next/font).
- **Keep web font size under 300KB:** sì. Al caricamento si scaricano 2 file per 77KB, gli altri solo se servono i loro caratteri.
- **Prevent flash or invisible text:** sì. `font-display: swap` e un font di riserva con le stesse metriche, generato da next/font. Il footer fisso resta invisibile finché è coperto dalla pagina: altrimenti il passaggio a fisso conterebbe come salto (CLS) e il suo nome grande diventerebbe l'LCP a caricamento finito.
- **Use preconnect to load your fonts:** non serve. I font sono serviti dal dominio stesso, quindi non c'è un'altra origine a cui collegarsi.

### Rete e server

- **Minimize HTTP requests:** sì. Da 19 a 15 richieste, niente file CSS, solo 2 font e 1 immagine al primo caricamento.
- **Pre-load URLs where possible:** sì. Next aggiunge il preload per la foto della hero e per i due font usati subito.
- **Use HTTPS / Use same protocol:** sì. Netlify serve solo HTTPS, con HSTS e `upgrade-insecure-requests` in `netlify.toml`.
- **Enable compression:** sì, automatica su Netlify (brotli e gzip).
- **Use HTTP cache headers:** sì, in `netlify.toml`: un anno `immutable` per i file di Next con hash, una settimana per foto e video.
- **Use a CDN:** sì. Netlify distribuisce `out/` sulla sua rete edge.
- **Keep TTFB < 1.3s / Page load time < 3s / Page weight < 1500KB:** sì, vedi la tabella sopra.
- **Minimize iframe count:** sì, nessun iframe.
- **Cookie size < 4096 bytes / Keep cookie count below 20:** sì, il sito non usa cookie.
- **Use service workers for caching:** non adottato, di proposito. Dopo la prima visita le cache HTTP coprono già quasi tutto (i file di Next sono `immutable`). Un service worker aggiungerebbe un livello che può servire contenuti vecchi dopo un aggiornamento, per un guadagno minimo su un sito di una pagina. Da riconsiderare se il sito dovesse funzionare offline.

### Strumenti

Lighthouse, Chrome DevTools (tracce di performance), WebPageTest, PageSpeed Insights, Squoosh e Bundlephobia sono le voci-strumento della checklist. Le misure qui sopra vengono da Lighthouse e dalle tracce di DevTools. Dopo il deploy conviene ripeterle con PageSpeed Insights sull'indirizzo pubblico, che aggiunge i dati di visitatori reali.
