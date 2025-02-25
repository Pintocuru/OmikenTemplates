// [root] tailwind.config.js
import daisyui from 'daisyui';

export default {
 theme: {
  extend: {}
 },
 plugins: [daisyui],
 daisyui: {
  themes: [
   {
    mytheme: {
     primary: '#3b82f6',
     secondary: '#ef4444',
     accent: '#f59e0b',
     neutral: '#1f2937',
     'base-100': '#ffffff',
     'background-color': 'transparent'
    }
   }
  ],
  theme: 'mytheme'
 }
};
