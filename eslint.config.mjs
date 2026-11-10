import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // le immagini sono già ottimizzate e l'export statico non ha l'ottimizzatore di next/image
      '@next/next/no-img-element': 'off',
      // import e variabili rimasti senza uso: in JavaScript nessun compilatore li segnala
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }],
      // i componenti usati solo in JSX contano come usati
      'react/jsx-uses-vars': 'error',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
])
