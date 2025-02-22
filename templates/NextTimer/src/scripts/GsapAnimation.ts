// src/scripts/GsapAnimation.ts
import gsap from 'gsap';

// GSAP 出現時・消失時のアニメーション
const beforeEnter = (el: Element): void => {
 gsap.set(el, {
  scale: 0.8,
  opacity: 0
 });
};

const enter = (el: Element, done: () => void): void => {
 gsap.to(el, {
  duration: 0.5,
  scale: 1,
  opacity: 1,
  ease: 'back.out(1.7)',
  onComplete: done
 });
};

const leave = (el: Element, done: () => void): void => {
 gsap.to(el, {
  duration: 0.5,
  scale: 0.8,
  opacity: 0,
  ease: 'back.in(1.7)',
  onComplete: done
 });
};

export { beforeEnter, enter, leave };
