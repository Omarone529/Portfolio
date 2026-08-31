# omarbayadi.com

Portfolio in Next.js 16 (App Router) + TypeScript + Tailwind v4, esportato come
sito statico e servito da Netlify.

Il linguaggio visivo segue [adhamdannaway.com](https://www.adhamdannaway.com/):
hero a volto diviso, card bianche con ombra che si alza, reveal in scroll.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera out/
npx serve out    # prova il sito statico esattamente com'è in produzione
npm test         # vitest: invarianti di contenuto e SEO
npm run format   # prettier
```

Le convenzioni di sviluppo stanno in `CLAUDE.md`.

## Struttura

```
content/projects.ts   i 5 case study, campi it+en, unica fonte di verità
content/site.ts       nome, claim, hero, stack, social, rotte, ancore
lib/seo.ts            costruisce title/description/canonical/hreflang/OG/Twitter
components/pages/     HomePage e ProjectPage, il corpo di ogni rotta
components/chrome/    la cornice: shell, header, footer, banner
components/hero/      SplitFace e il suo foglio di stile
components/project/   la card e la cornice del logo
components/*.tsx      Icons, Reveal, JsonLd, usati da tutti e quattro
app/(it)/             italiano, alla radice          →  /  e  /progetti/<slug>/
app/(en)/             inglese                        →  /en/  e  /en/projects/<slug>/
```

Due root layout separati sono l'unico modo perché `<html lang>` sia corretto in
entrambe le lingue senza toccarlo da JavaScript.

## Aggiungere un progetto

Aggiungere una voce a `PROJECTS` in `content/projects.ts` e mettere il logo in
`public/assets/`, in webp, chiamato `<slug>-logo.webp` come gli altri: il nome
del file si ritrova così dall'indirizzo della pagina. Pagina italiana, pagina
inglese, card in home, JSON-LD, sitemap e navigazione precedente/successivo si
generano da lì. Non c'è nessuna seconda lista da aggiornare.

## L'hero

La costruzione è quella di adhamdannaway.com. Non sono due mezze facce: è la
stessa composizione disegnata due volte a piena larghezza, una dipinta e una
fotografica, con due finestre che scorrono e si ridimensionano sopra. Le due
finestre combaciano sempre senza spazio in mezzo, quindi la giuntura è
semplicemente dove si incontrano, e viaggia sul volto seguendo il puntatore:
puntando a sinistra prende il sopravvento il dipinto, a destra la fotografia.

Le finestre non scalano il contenuto, ne scoprono di più. È per questo che la
giuntura può muoversi mentre il volto resta fermo.

Sotto i 71.25rem non c'è puntatore da seguire: al posto della coppia scorrevole
va una sola immagine piatta, la posizione di riposo già fusa.

- `public/assets/omar-paint.webp` la composizione dipinta, 1680x1200
- `public/assets/omar-photo.webp` la stessa composizione fotografica, stessa
  dimensione e stesso allineamento, altrimenti la giuntura non tiene
- `public/assets/omar-face.webp` la posizione di riposo in una sola immagine,
  dipinta a sinistra della giuntura e fotografica a destra
- `public/assets/omar-strokes.webp` le pennellate sciolte sotto il lato
  dipinto, 840x400

Tutte su sfondo trasparente e solo in webp. I `.png` che escono da hero.swift
sono un passaggio intermedio: si convertono e si cancellano, perché li avrebbe
chiesti solo un browser precedente a Safari 14.

`tools/hero.swift` le produce da una foto di gruppo. Isola il soggetto con la
segmentazione per singola persona di Vision
(`VNGeneratePersonInstanceMaskRequest`), così chi sta dietro sparisce e il
fondo resta trasparente, poi:

- dipinge con pennellate vere, disegnate una alla volta sulla sagoma: inizio,
  direzione, lunghezza, rastremazione ai due capi e una grana mangiata lungo il
  tratto come fa un pennello asciutto. Due passate, una lunga sul corpo e una
  più corta e fitta sulla testa
- lascia respirare la carta: la vernice è opaca e il bianco si vede nei vuoti
  fra una pennellata e l'altra, non attraverso il colore
- riempie d'inchiostro i capelli, con una chiusura morfologica che salda i
  riccioli in una massa sola. La soglia sta a 0.28 perché in questa foto
  capelli e pupille stanno a 0.21 e la pelle, in luce o in ombra, non scende
  sotto 0.36, e vale solo sopra il collo perché la camicia sta a 0.17
- disegna sopracciglia, occhi, naso e bocca dai landmark di Vision, come forme
  piene: una virgola grassa per ogni sopracciglio, l'occhio riempito, un
  batuffolo alla narice, la bocca ristretta verso il centro prima di riempirla
- strappa il bordo di ogni forma d'inchiostro con un rumore allungato nella
  direzione del pennello, altrimenti le sagome tengono il profilo pulito del
  poligono da cui vengono e si vede che sono vettoriali
- strappa allo stesso modo il ritaglio della sagoma. Le pennellate possono
  uscire fino a una quindicina di pixel oltre il profilo, con una frangia che
  si dirada man mano: tagliate esatte sulla maschera, una spalla diventa un
  taglio dritto come una lama in mezzo a dieci pennellate, e altrove le code
  tranciate lasciano un filo di colore lungo il bordo che legge come il
  contorno che questo stile non ha. I capelli escono in punte, ma solo oltre la
  sagoma: dilatati in tutte le direzioni scendono anche sulla fronte, e
  l'attaccatura è l'unico bordo dei capelli che deve restare dove l'ha messo la
  fotografia
- deriva la composizione fotografica e quella dipinta dallo stesso ritaglio,
  quindi non possono divergere di un pixel

Due cose sono state provate e non funzionano. La prima: ricavare le pennellate
soglinando un campo di rumore allungato. Un campo copre il piano, quindi a una
copertura utile i segni si saldano capo a capo e il viso esce a righe come una
tapparella. Una pennellata ha due estremi e una vicina che non tocca. La
seconda: guidare la vernice dal tono assoluto. Qui il viso è la cosa più chiara
dell'inquadratura e la camicia è quasi nera, quindi ogni pennellata finisce
sulla camicia e il viso resta carta bianca.

Nemmeno il tono locale basta da solo: l'anello di capelli scuri attorno al viso
tira giù la media locale finché tutta la pelle conta come alta luce. Per questo
la vernice ha un fondo di densità che non scende sotto una certa soglia, e il
tono decide quanta ne cade, non quanto è trasparente.

```bash
swiftc -O tools/hero.swift -o /tmp/hero
/tmp/hero <foto.jpg> public/assets/omar 2 497 25 700 500 300 1680
for f in face paint photo strokes; do
  cwebp -q 88 -alpha_q 95 -m 6 public/assets/omar-$f.png -o public/assets/omar-$f.webp
  rm public/assets/omar-$f.png
done
```

Gli argomenti dopo il prefisso sono: indice della persona, x del naso (dove
cade la giuntura), prima riga del ritaglio, larghezza e altezza del ritaglio,
riga in cui finisce la testa, larghezza in uscita.

Larghezza e altezza del ritaglio devono stare in proporzione 840:600, che è
quella della composizione. Il ritaglio è centrato sul naso, non sulla persona,
perché la giuntura cade al centro della composizione: se il naso non è al
centro del corpo, da un lato resta dello spazio vuoto, ed è corretto così.

Quanto stringere è un compromesso, non una preferenza. Più il ritaglio è
stretto più il volto è grande, ed è sul volto che corre la giuntura: è tutto il
meccanismo dell'hero. Ma il naso sta molto più a destra del centro del corpo,
quindi ogni ritaglio centrato sul naso taglia prima il braccio sinistro. Sotto
le 590 righe il gomito esce dal quadro. 700x500 tiene il volto a circa 200px
sui 600 dello stage e lascia scorrere l'avambraccio fuori dall'angolo in basso
a sinistra.

Le coordinate del viso non vanno stimate a occhio:

```bash
# stampa riquadro del volto, centro del naso e posizione degli occhi
swiftc -O tools/faces.swift -o /tmp/faces && /tmp/faces <foto.jpg>
```

L'immagine piatta è `SITE.portrait`, in `content/site.ts`, che serve anche da
ritratto nei dati strutturati. Le tre usate come sfondo stanno in
`components/hero/SplitFace.module.css`.

L'originale usato è 1086x724 e il ritaglio ne prende 700x500, quindi le parti
vengono ingrandite due volte e mezza. Il dipinto regge bene perché è fatto di
forme piatte; la parte fotografica risulta morbida. Con l'export a piena
risoluzione dalla libreria foto l'hero sarebbe nitido.

## Deploy

Netlify legge `netlify.toml`: build `npm run build`, publish `out`.

Lì dentro ci sono anche i redirect 301 dai vecchi indirizzi
(`/progetti/synapsi.html`, `/?lang=en`, …) verso i nuovi, che servono a non
perdere il posizionamento già ottenuto dalle pagine indicizzate.
