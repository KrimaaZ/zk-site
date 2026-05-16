import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zk: {
          bg:    '#eef8ee',
          dark:  '#1e3829',
          green: '#22c55e',
          beige: '#f4efe6',
          'beige-hover': '#ede7db',
        },
      },
    },
  },
  plugins: [],
}

export default config
