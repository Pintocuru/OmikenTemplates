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
  scale: [0.8, 1],
  opacity: [0, 1],
  translateY: [20, 0],
  duration: 800,
  easing: 'cubicBezier(.4,0,.2,1)', // Material Design標準イージング
  complete: () => {
   bounceAnimation(el);
   done();
  }
 });
};

const leave = (el: Element, done: () => void): void => {
 anime({
  targets: el,
  scale: [1, 0.8],
  opacity: [1, 0],
  translateY: [0, -20],
  duration: 600,
  easing: 'cubicBezier(.4,0,.2,1)',
  complete: done
 });
};

// バウンスするようなアニメーション
const bounceAnimation = (el: Element): void => {
 anime({
  targets: el,
  translateY: [0, -10],
  scale: [1, 1.05],
  duration: 2000,
  easing: 'easeInOutQuad',
  direction: 'alternate',
  loop: true
 });
};

export { beforeEnter, enter, leave, bounceAnimation };
