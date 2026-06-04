import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c0d2ff',
          300: '#93b2ff',
          400: '#6088ff',
          500: '#3a5fff',
          600: '#1e3ff5',
          700: '#1630e0',
          800: '#1828b5',
          900: '#1a278e',
          950: '#111660',
        },
        gold: {
          400: '#f5c842',
          500: '#e8b400',
          600: '#c49700',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
