// tailwind.config.js
module.exports = {
 theme: {
  extend: {
   animation: {
    'fade-in-up': 'fadeInUp 0.5s ease-out forwards'
   },
   keyframes: {
    fadeInUp: {
     '0%': {
      opacity: '0',
      transform: 'translateY(100%)'
     },
     '100%': {
      opacity: '1',
      transform: 'translateY(0)'
     }
    }
   }
  }
 }
};
