/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        md: {
          bg:                '#0F0F1A',
          surface:           '#1C1C2E',
          'surface-high':    '#252538',
          'surface-variant': '#2E2E4A',
          primary:           '#BB86FC',
          'primary-dim':     '#9B6BD4',
          secondary:         '#03DAC6',
          outline:           '#6B688A',
          'on-bg':           '#E6E1E5',
          'on-surface':      '#CAC4D0',
        },
      },
      boxShadow: {
        'elevation-1': '0px 1px 2px rgba(0,0,0,0.5), 0px 1px 3px 1px rgba(0,0,0,0.3)',
        'elevation-2': '0px 1px 2px rgba(0,0,0,0.5), 0px 2px 6px 2px rgba(0,0,0,0.3)',
        'elevation-3': '0px 1px 3px rgba(0,0,0,0.5), 0px 4px 8px 3px rgba(0,0,0,0.3)',
        'elevation-4': '0px 2px 3px rgba(0,0,0,0.5), 0px 6px 10px 4px rgba(0,0,0,0.3)',
        'elevation-5': '0px 4px 4px rgba(0,0,0,0.5), 0px 8px 12px 6px rgba(0,0,0,0.3)',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
