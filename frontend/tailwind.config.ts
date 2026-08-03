import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0c0e',
        surface: '#17171b',
        'surface-elevated': '#1f1f24',
        border: '#2a2a30',
        'border-strong': '#3a3a42',
        accent: '#d4a574',
        'accent-hover': '#e0b688',
        success: '#6ee7a3',
        warning: '#f5c46d',
        error: '#f47272',
        'text-primary': '#ececf0',
        'text-secondary': '#8e8e98',
        'text-muted': '#55555f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
