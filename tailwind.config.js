/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        vercel: {
          ink: '#171717',
          canvas: '#ffffff',
          soft: '#fafafa',
          soft2: '#f5f5f5',
          hairline: '#ebebeb',
          hairlineStrong: '#a1a1a1',
          mute: '#888888',
          body: '#4d4d4d',
          blue: '#0070f3',
          violet: '#7928ca',
          cyan: '#50e3c2',
          magenta: '#eb367f',
          amber: '#f5a623',
        }
      },
      borderRadius: {
        'v-sm': '6px',
        'v-md': '8px',
        'v-lg': '12px',
        'v-xl': '16px',
      }
    },
  },
  plugins: [],
}
