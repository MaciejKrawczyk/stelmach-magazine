/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
            'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'item': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
      },
      gridTemplateColumns: {
        '5': 'repeat(5, minmax(0, 1fr))', // Added this line for 5 columns
      },
      gridTemplateRows: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
