<!-- src/commentCount.vue -->
<template>
 <div class="relative flex flex-col items-center">
  <!-- 数字表示 -->
  <div class="animated-number flex items-center justify-center mb-4">
   <component :is="digits[digit]" v-for="(digit, index) in countDigits" :key="index" />
  </div>

  <!-- パーティクルの親要素 -->
  <div ref="container" class="relative w-32 h-32 flex items-center justify-center overflow-hidden"></div>
 </div>
</template>

<script lang="ts" setup>
import anime from 'animejs';
// 数字コンポーネント
import Digit0 from './digits/0.vue';
import Digit1 from './digits/1.vue';
import Digit2 from './digits/2.vue';
import Digit3 from './digits/3.vue';
import Digit4 from './digits/4.vue';
import Digit5 from './digits/5.vue';
import Digit6 from './digits/6.vue';
import Digit7 from './digits/7.vue';
import Digit8 from './digits/8.vue';
import Digit9 from './digits/9.vue';

const props = defineProps<{
 commentCount: number;
}>();

const count = ref(0); // 表示する数字
const container = ref<HTMLDivElement | null>(null); // パーティクル用の親要素

// 数字コンポーネントのマッピング
const digits: { [key: string]: any } = {
 '0': Digit0,
 '1': Digit1,
 '2': Digit2,
 '3': Digit3,
 '4': Digit4,
 '5': Digit5,
 '6': Digit6,
 '7': Digit7,
 '8': Digit8,
 '9': Digit9
};

// カウンターの値を桁ごとに分割し、文字列として扱う
const countDigits = computed(() => String(count.value).split(''));

// props.commentCount の変化を監視
watch(
 () => props.commentCount,
 async (newVal) => {
  count.value = newVal;
  triggerParticles(); // パーティクルアニメーションをトリガー
  // 数字の激しい動きをトリガー
  await nextTick(); // Vue の DOM 更新後に実行
  animateBounce();
 }
);

// パーティクルを生成する関数
const triggerParticles = () => {
 if (!container.value) return;

 for (let i = 0; i < 15; i++) {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = '8px';
  particle.style.height = '8px';
  particle.style.borderRadius = '50%';
  particle.style.backgroundColor = getRandomColor();
  particle.style.pointerEvents = 'none';

  // ランダムな位置に表示
  const x = Math.random() * 80 - 40; // ±40px
  const y = Math.random() * 80 - 40;
  particle.style.transform = `translate(${x}px, ${y}px)`;
  container.value.appendChild(particle);

  // Anime.jsでパーティクルをアニメーション化
  anime({
   targets: particle,
   translateX: anime.random(-50, 50),
   translateY: anime.random(-50, 50),
   scale: [1, 0],
   opacity: [1, 0],
   duration: anime.random(800, 1500),
   easing: 'easeOutQuad',
   complete: () => particle.remove() // アニメーション終了後に削除
  });
 }
};

// 数字の激しい動きをトリガーする関数
const animateBounce = () => {
 const targets = document.querySelectorAll('.digit');
 if (!targets.length) return;

 anime({
  targets: targets,
  keyframes: [
   { scale: 1.5, duration: 100 },
   { scale: 0.6, duration: 100 },
   { scale: 1.2, duration: 70 },
   { scale: 0.9, duration: 70 },
   { scale: 1, duration: 50 }
  ],
  easing: 'linear'
 });
};

// ランダムな色を生成するヘルパー関数
const getRandomColor = () => {
 const colors = ['#FF5733', '#33FF57', '#3357FF', '#F7DC6F', '#E74C3C'];
 return colors[Math.floor(Math.random() * colors.length)];
};
</script>

<style scoped>
.animated-number {
 display: flex;
 gap: 4px; /* 数字間の間隔 */
}
</style>
