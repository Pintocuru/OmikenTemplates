// src/scripts/AnimeJsAnimation.ts
import anime from 'animejs';

// anime.js 出現時・消失時のアニメーション
const beforeEnter = (el: Element): void => {
 anime.set(el, {
  scale: 0.8,
  opacity: 0
 });
};

const enter = (el: Element, done: () => void): void => {
 anime({
  targets: el,
  scale: 1,
  opacity: 1,
  duration: 500,
  easing: 'easeOutBack',
  complete: done
 });
};

const leave = (el: Element, done: () => void): void => {
 anime({
  targets: el,
  scale: 0.8,
  opacity: 0,
  duration: 500,
  easing: 'easeInBack',
  complete: done
 });
};

export { beforeEnter, enter, leave };
