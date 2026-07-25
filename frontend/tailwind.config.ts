import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f11',
        surface: '#1a1a1f',
        'surface-elevated': '#222228',
        'border-subtle': '#2e2e36',
        accent: '#7c6af7',
        'accent-hover': '#9585f8',
        success: '#34d399',
        warning: '#f59e0b',
        error: '#f87171',
        'text-primary': '#f0f0f4',
        'text-secondary': '#8b8b9e',
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
