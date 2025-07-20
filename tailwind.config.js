/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#E0ECF0',
          2: '#B3D4DD',
          3: '#A4CAD8',
          4: '#7D9FAC',
          5: '#566F7B',
          DEFAULT: '#A4CAD8',
          active: '#7D9FAC',
        },
        secondary: {
          1: '#FFF8E1',
          2: '#FFD54F',
          3: '#FFC107',
          4: '#E0A800',
          5: '#C29300',
          DEFAULT: '#FFC107',
          active: '#E0A800',
        },
        black: {
          1: '#0A0A0A',
          2: '#1A1A1A',
          3: '#333333',
          4: '#555555',
          5: '#777777',
        },
        white: {
          1: '#FFFFFF',
          2: '#F5F5F5',
          3: '#E0E0E0',
          4: '#C0C0C0',
          5: '#A0A0A0',
        },
        gray: {
          1: '#F0F0F0',
          2: '#C8C8C8',
          3: '#808080',
          4: '#585858',
          5: '#303030',
        },
        sky: {
          1: '#E0F2F7',
          2: '#B2EBF2',
          3: '#80DEEA',
          4: '#42A5F5',
          5: '#2196F3',
        },
      },
      fontFamily: {
        'ibm-plex-serif': ['"IBM Plex Serif"', 'serif'],
        'bangers': ['"Bangers"', 'cursive'],
        'luckiest-guy': ['"Luckiest Guy"', 'cursive'],
      },
    },
  },
  plugins: [],
}; 