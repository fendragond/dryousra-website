/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: '#b86a85',
          light: '#c9879e',
          pale: '#f9f0f3',
          glow: '#fce4ec',
        },
        mauve: {
          DEFAULT: '#7b5ea7',
          light: '#9678be',
          pale: '#f3eef8',
        },
        champagne: '#faf8f5',
        cream: '#fdfbf9',
        gold: '#c9a96e',
        charcoal: '#2a2030',
        text: {
          DEFAULT: '#3a3040',
          mid: '#6e6478',
          light: '#a099a8',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Nunito Sans"', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        page: '1280px',
        content: '1100px',
        article: '880px',
        narrow: '680px',
      },
      backgroundImage: {
        grad: 'linear-gradient(135deg, #b86a85, #7b5ea7)',
        'grad-soft': 'linear-gradient(135deg, #f9f0f3, #f3eef8)',
      },
      screens: {
        nav: '900px',
      },
    },
  },
};
