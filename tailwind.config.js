/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        cream: '#F4EFE8',
        mute: '#8C857C',
        gold: '#C9A36A',
        amber: '#D9822B',
        cocoa: '#2A140C',
      },
      fontFamily: {
        // Имена ровно как в @font-face пакетов @fontsource-variable/*.
        display: ['"Montserrat Variable"', 'Montserrat', 'system-ui', 'sans-serif'],
        sans: ['"Inter Tight Variable"', '"Inter Tight"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
