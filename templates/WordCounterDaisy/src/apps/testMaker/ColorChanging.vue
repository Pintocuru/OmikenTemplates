<!-- ColorChanging.vue -->
<!--
 Color Changin'
 https://codepen.io/alexzaworski/pen/mEZvrG
-->
<template>
 <div class="relative w-screen h-screen">
  <canvas ref="canvasRef" class="fullscreen-canvas"></canvas>
  <div class="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-10"></div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import anime from 'animejs';

// Props with default values
const props = defineProps<{
 count: number;
}>();

// 型定義
interface Circle {
 x: number;
 y: number;
 r: number;
 fill?: string;
 stroke?: {
  width: number;
  color: string;
 };
 opacity?: number;
 draw: () => void;
}

interface AnimationConfig {
 colors: string[];
 particleCount: number;
 particleSizeMin: number;
 particleSizeMax: number;
 animationDurationMin: number;
 animationDurationMax: number;
 rippleSize: number;
}

// Animation config
const config: AnimationConfig = {
 colors: ['#FF6138', '#FFBE53', '#2980B9', '#282741'],
 particleCount: 32,
 particleSizeMin: 24,
 particleSizeMax: 48,
 animationDurationMin: 1000,
 animationDurationMax: 1300,
 rippleSize: 200
};

// State
const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const cH = ref<number>(0);
const cW = ref<number>(0);
const bgColor = ref<string>('#FF6138');
const animations = ref<anime.AnimeInstance[]>([]);
const currentColorIndex = ref<number>(0);

// Watch for count changes
watch(
 () => props.count,
 () => {
  triggerAnimation();
 }
);

// Color management
const getNextColor = (): string => {
 currentColorIndex.value =
  currentColorIndex.value + 1 < config.colors.length ? currentColorIndex.value + 1 : 0;
 return config.colors[currentColorIndex.value];
};

const getCurrentColor = (): string => config.colors[currentColorIndex.value];

// Animation utilities
const removeAnimation = (animation: anime.AnimeInstance): void => {
 const index = animations.value.indexOf(animation);
 if (index > -1) animations.value.splice(index, 1);
};

const calcPageFillRadius = (x: number, y: number): number => {
 const l = Math.max(x - 0, cW.value - x);
 const h = Math.max(y - 0, cH.value - y);
 return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
};

// Circle creation and drawing
const createCircle = (opts: Partial<Circle>): Circle => {
 const circle: Circle = {
  x: opts.x || 0,
  y: opts.y || 0,
  r: opts.r || 0,
  fill: opts.fill,
  stroke: opts.stroke,
  opacity: opts.opacity,
  draw: function () {
   if (!ctx.value) return;

   ctx.value.globalAlpha = this.opacity || 1;
   ctx.value.beginPath();
   ctx.value.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
   if (this.stroke) {
    ctx.value.strokeStyle = this.stroke.color;
    ctx.value.lineWidth = this.stroke.width;
    ctx.value.stroke();
   }
   if (this.fill) {
    ctx.value.fillStyle = this.fill;
    ctx.value.fill();
   }
   ctx.value.closePath();
   ctx.value.globalAlpha = 1;
  }
 };
 return circle;
};

// Main animation trigger
const triggerAnimation = (): void => {
 if (!ctx.value) return;

 const x = anime.random(cW.value * 0.2, cW.value * 0.8);
 const y = anime.random(cH.value * 0.2, cH.value * 0.8);

 const currentColor = getCurrentColor();
 const nextColor = getNextColor();
 const targetR = calcPageFillRadius(x, y);
 const rippleSize = Math.min(config.rippleSize, cW.value * 0.4);

 // Background fill animation
 const pageFill = createCircle({
  x,
  y,
  r: 0,
  fill: nextColor
 });

 const fillAnimation = anime({
  targets: pageFill,
  r: targetR,
  duration: Math.max(targetR / 2, 750),
  easing: 'easeOutQuart',
  complete: () => {
   bgColor.value = pageFill.fill || '';
   removeAnimation(fillAnimation);
  },
  update: function () {
   pageFill.draw();
  }
 });

 // Ripple animation
 const ripple = createCircle({
  x,
  y,
  r: 0,
  fill: currentColor,
  stroke: {
   width: 3,
   color: currentColor
  },
  opacity: 1
 });

 const rippleAnimation = anime({
  targets: ripple,
  r: rippleSize,
  opacity: 0.01,
  easing: 'easeOutExpo',
  duration: 1000,
  complete: () => removeAnimation(rippleAnimation),
  update: function () {
   ripple.draw();
  }
 });

 // Particles animation
 const particles: Circle[] = [];
 for (let i = 0; i < config.particleCount; i++) {
  const particle = createCircle({
   x,
   y,
   fill: currentColor,
   r: anime.random(config.particleSizeMin, config.particleSizeMax)
  });
  particles.push(particle);
 }

 const particlesAnimation = anime({
  targets: particles,
  x: function (particle: Circle) {
   return particle.x + anime.random(rippleSize, -rippleSize);
  },
  y: function (particle: Circle) {
   return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
  },
  r: 0,
  easing: 'easeOutExpo',
  duration: anime.random(config.animationDurationMin, config.animationDurationMax),
  complete: () => removeAnimation(particlesAnimation),
  update: function () {
   particles.forEach((particle) => particle.draw());
  }
 });

 animations.value.push(fillAnimation, rippleAnimation, particlesAnimation);
};

// Animation loop
const startAnimation = (): void => {
 if (!ctx.value) return;

 const animate = () => {
  if (!ctx.value) return;

  ctx.value.fillStyle = bgColor.value;
  ctx.value.fillRect(0, 0, cW.value, cH.value);
  requestAnimationFrame(animate);
 };

 animate();
};

// Canvas setup
const resizeCanvas = (): void => {
 if (!canvasRef.value || !ctx.value) return;

 cW.value = window.innerWidth;
 cH.value = window.innerHeight;
 canvasRef.value.width = cW.value * devicePixelRatio;
 canvasRef.value.height = cH.value * devicePixelRatio;
 ctx.value.scale(devicePixelRatio, devicePixelRatio);
};

// Lifecycle hooks
onMounted(() => {
 if (!canvasRef.value) return;
 ctx.value = canvasRef.value.getContext('2d');
 resizeCanvas();
 window.addEventListener('resize', resizeCanvas);
 startAnimation();
});
</script>

<style scoped>
.fullscreen-canvas {
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
}
</style>
