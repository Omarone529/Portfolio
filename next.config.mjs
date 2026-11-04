/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statico: in produzione ci sono solo file in out/, nessun server da tenere vivo o da attaccare.
  output: 'export',
  // /pagina/ -> /pagina/index.html: gli indirizzi pubblicati e le cartelle esportate coincidono.
  trailingSlash: true,
  images: {
    // l'ottimizzatore di next/image richiede un server; le immagini sono già webp della misura giusta
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    // il CSS (~9KB compressi) arriva dentro l'HTML invece che in file separati che bloccano il primo disegno:
    // conviene per chi apre il sito la prima volta, cioè quasi tutti i visitatori di un portfolio
    inlineCss: true,
  },
  // in sviluppo il server accetta solo la propria origine: così si apre anche da un telefono in rete locale
  allowedDevOrigins: ['192.168.*.*'],
}

export default nextConfig
