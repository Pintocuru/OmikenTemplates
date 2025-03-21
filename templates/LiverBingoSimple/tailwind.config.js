// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
 darkMode: 'class',
 content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
 theme: {
  extend: {
   colors: {
    transparent: 'transparent'
   }
  }
 },
 plugins: [import('daisyui')],
 daisyui: {
  themes: ['cupcake', 'light', 'dark']
 }
};
