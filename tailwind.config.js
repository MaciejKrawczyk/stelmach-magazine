/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      inset: {
        '0.25': '0.25rem',
        '0.75': '0.75rem'
      },
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
      },
      width: {
        '120': '40rem'
      }
    },
  },
  plugins: [],
  corePlugins: {
    // ...
    transitionProperty: true,
    transitionDuration: true,
    transitionTimingFunction: true,
    transitionDelay: true,
  },
}
