/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#0B1726',       // Deep Royal Navy
        navy: {
          DEFAULT: '#0B1726',
          50: '#F4F7FB',
          100: '#E6EDF5',
          200: '#C7D7E8',
          700: '#1C324E',
          800: '#13243A',
          850: '#0E1B2C',
          900: '#0A1320',
          950: '#060C14',
        },
        gold: '#D4AF37',      // Lustrous Champagne Gold
        golddark: '#B89025',  // Burnished Antique Gold
        goldlight: '#F5E6BE', // Warm Champagne Highlight
        mist: '#F1F4F8',      // Soft Architectural Slate-Mist
        ivory: '#FAF9F5',     // Warm Editorial Ivory
        tech: '#1D4ED8',      // Deep Cobalt Blue
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Archivo', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'ticker': 'ticker-scroll 55s linear infinite',
      },
      keyframes: {
        'ticker-scroll': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
