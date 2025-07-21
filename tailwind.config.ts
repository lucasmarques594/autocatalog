// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Nosso azul principal
          700: '#1d4ed8',
        },
        secondary: {
          700: '#334155',
          800: '#1e293b', // Nosso secundário principal
          900: '#0f172a',
        },
        accent: '#f59e0b',
      },
    },
  },
  plugins: [
      require('@tailwindcss/forms'), // Plugin oficial para estilizar formulários
  ],
}
export default config