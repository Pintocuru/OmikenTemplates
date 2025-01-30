<template>
 <div class="relative w-screen h-screen">
  <canvas ref="canvasRef" class="fullscreen-canvas"></canvas>
  <div class="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
   <button @click="triggerAnimation" class="control-button">Trigger Animation</button>
   <button @click="autoPlayToggle" class="control-button" :class="{ active: isAutoPlaying }">
    {{ isAutoPlaying ? 'Stop Auto' : 'Start Auto' }}
   </button>
  </div>
 </div>
</template>

<script setup>
import anime from 'animejs';

// Props with default values
const props = defineProps({
 commentCount: {
  type: Number,
  required: true
 },
 config: {
  type: Object,
  default: () => ({
   colors: ['#FF6138', '#FFBE53', '#2980B9', '#282741'],
   particleCount: 32,
   particleSizeMin: 24,
   particleSizeMax: 48,
   animationDurationMin: 1000,
   animationDurationMax: 1300,
   rippleSize: 200
  })
 }
});

// State
const canvasRef = ref(null);
const ctx = ref(null);
const cH = ref(0);
const cW = ref(0);
const bgColor = ref('#FF6138');
const animations = ref([]);
const isAutoPlaying = ref(false);
const autoPlayInterval = ref(null);
const currentColorIndex = ref(0);

// Watch for config changes
watch(
 () => props.commentCount,
 (count) => {
  triggerAnimation();
 },
 { deep: true }
);

// Color management
const getNextColor = () => {
 currentColorIndex.value = currentColorIndex.value + 1 < props.config.colors.length ? currentColorIndex.value + 1 : 0;
 return props.config.colors[currentColorIndex.value];
};

const getCurrentColor = () => props.config.colors[currentColorIndex.value];

// Animation utilities
const removeAnimation = (animation) => {
 const index = animations.value.indexOf(animation);
 if (index > -1) animations.value.splice(index, 1);
};

const calcPageFillRadius = (x, y) => {
 const l = Math.max(x - 0, cW.value - x);
 const h = Math.max(y - 0, cH.value - y);
 return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
};

// Circle creation and drawing
const createCircle = (opts) => {
 const circle = {
  ...opts,
  draw: function () {
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
const triggerAnimation = () => {
 if (!ctx.value) return;

 const x = anime.random(cW.value * 0.2, cW.value * 0.8);
 const y = anime.random(cH.value * 0.2, cH.value * 0.8);

 const currentColor = getCurrentColor();
 const nextColor = getNextColor();
 const targetR = calcPageFillRadius(x, y);
 const rippleSize = Math.min(props.config.rippleSize, cW.value * 0.4);

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
   bgColor.value = pageFill.fill;
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
  opacity: 0,
  easing: 'easeOutExpo',
  duration: 900,
  complete: () => removeAnimation(rippleAnimation),
  update: function () {
   ripple.draw();
  }
 });

 // Particles animation
 const particles = [];
 for (let i = 0; i < props.config.particleCount; i++) {
  const particle = createCircle({
   x,
   y,
   fill: currentColor,
   r: anime.random(props.config.particleSizeMin, props.config.particleSizeMax)
  });
  particles.push(particle);
 }

 const particlesAnimation = anime({
  targets: particles,
  x: function (particle) {
   return particle.x + anime.random(rippleSize, -rippleSize);
  },
  y: function (particle) {
   return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
  },
  r: 0,
  easing: 'easeOutExpo',
  duration: anime.random(props.config.animationDurationMin, props.config.animationDurationMax),
  complete: () => removeAnimation(particlesAnimation),
  update: function () {
   particles.forEach((particle) => particle.draw());
  }
 });

 animations.value.push(fillAnimation, rippleAnimation, particlesAnimation);
};

// Animation loop
const startAnimation = () => {
 if (!ctx.value) return;

 const animate = () => {
  ctx.value.fillStyle = bgColor.value;
  ctx.value.fillRect(0, 0, cW.value, cH.value);
  requestAnimationFrame(animate);
 };

 animate();
};

// Auto play control
const autoPlayToggle = () => {
 if (isAutoPlaying.value) {
  if (autoPlayInterval.value) clearInterval(autoPlayInterval.value);
 } else {
  autoPlayInterval.value = window.setInterval(
   () => {
    triggerAnimation();
   },
   anime.random(200, 900)
  );
 }
 isAutoPlaying.value = !isAutoPlaying.value;
};

// Canvas setup
const resizeCanvas = () => {
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

onBeforeUnmount(() => {
 window.removeEventListener('resize', resizeCanvas);
 if (autoPlayInterval.value) {
  clearInterval(autoPlayInterval.value);
 }
});
</script>

<style lang="scss" scoped>
.fullscreen-canvas {
 position: fixed; /* 親のスタイルに関係なく画面全体に配置 */
 top: 0;
 left: 0;
 width: 100vw; /* ビューポート全体をカバー */
 height: 100vh;
 z-index: 0; /* 背景として最背面に配置 */
 pointer-events: none; /* クリックを透過させる（ボタン操作を邪魔しない） */
}
.control-button {
 @apply px-5 py-3 rounded-lg bg-white/90 cursor-pointer text-base transition-all duration-300;

 &:hover {
  @apply bg-white transform -translate-y-0.5 shadow-lg;
 }

 &.active {
  @apply bg-[#FF6138] text-white;
 }
}
</style>
