import tailwind from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': tailwind(),
    autoprefixer: autoprefixer(),
  },
}

export default config
