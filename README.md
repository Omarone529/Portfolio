# omar-portfolio

Portfolio personale in React (Vite), con scroll fluido (Lenis) e animazioni (Framer Motion).

```bash
npm run dev      # http://localhost:5173
npm run build    # scrive dist/
npm run lint     # oxlint
```

## Struttura

```
src/
  content/              tutti i testi e i dati, nessun testo nei componenti
    site.js             nome, email, id delle sezioni, menu
    hero.js about.js projects.js services.js footer.js
  components/
    primitives/         i mattoncini animati riusati ovunque (+ primitives.css)
    layout/Section.jsx  sezione con tono di colore e bordo obliquo, Container
    sections/<Nome>/    una cartella per sezione, ognuna con il suo CSS
  hooks/                logica riusabile (hover, conteggi, video, misure)
  providers/            scroll fluido e gestione dei link interni
  lib/                  costanti di animazione, formattazione, utilità di scroll
  styles/               token di design, base e struttura della pagina
```

## Come si fa

- **Aggiungere un progetto:** una voce in `PROJECTS` (`content/projects.js`) con `logo` e `tint`, mostrati nella pila. Con `video` e `poster` la demo compare nella vista "Guarda tutti". La pila mostra i primi `WORK.featured` progetti.
- **Aggiungere una sezione:** un id in `SECTION` (`content/site.js`), un componente in `components/sections/`, una riga in `App.jsx`. Per il bordo obliquo usa `<Section edge>`.
- **Cambiare colori, font e misure:** `styles/tokens.css`. La pendenza dei bordi obliqui è `--edge-angle`.

## Scelte da sapere

- **Link interni:** li gestisce `SmoothScrollProvider`, che scorre fino alla sezione senza lasciare `#` nell'indirizzo. Un'ancora deve puntare a un elemento nel flusso della pagina, non fisso. Per questo `#top` è su `<main>` e `#contact` è sullo slot del footer.
- **Refresh:** ogni ricarica riparte dalla hero (`resetScrollOnLoad` in `lib/scroll.js`).
- **Hover:** le animazioni partono con la classe `.is-hovering` (`hooks/useHoverPlay.js`) e arrivano sempre in fondo. La durata del hook deve coprire l'animazione più lunga in `primitives.css`.
- **Footer:** resta fisso sotto la pagina e viene scoperto solo se entra nello schermo. Su schermi bassi resta nel flusso normale.
- **Animazioni ridotte:** chi le ha disattivate nel sistema non ha scroll fluido, video in loop né conteggi animati.
