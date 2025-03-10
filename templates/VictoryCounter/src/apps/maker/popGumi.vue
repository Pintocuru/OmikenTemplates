<!-- SimpleCounter.vue -->
<template>
 <div class="flex items-center justify-center">
  <!-- カラフルなパステル背景 -->
  <div
   class="relative w-80 h-80 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl overflow-hidden shadow-xl border-8 border-white"
  >
   <!-- 装飾的な泡の背景 -->
   <div
    v-for="n in 12"
    :key="`bubble-${n}`"
    class="absolute rounded-full bg-white opacity-40"
    :class="[
     n % 3 === 0
      ? 'animate-float-slow'
      : n % 3 === 1
        ? 'animate-float-medium'
        : 'animate-float-fast',
     n % 5 === 0
      ? 'bg-pink-200'
      : n % 4 === 0
        ? 'bg-purple-200'
        : n % 3 === 0
          ? 'bg-blue-200'
          : 'bg-white'
    ]"
    :style="{
     width: `${Math.random() * 30 + 10}px`,
     height: `${Math.random() * 30 + 10}px`,
     left: `${Math.random() * 80 + 10}%`,
     top: `${Math.random() * 80 + 10}%`,
     opacity: Math.random() * 0.3 + 0.1
    }"
   ></div>

   <!-- キラキラの装飾 -->
   <div
    v-for="n in 8"
    :key="`sparkle-${n}`"
    class="absolute"
    :class="[`animate-sparkle-${(n % 4) + 1}`]"
    :style="{
     left: `${Math.random() * 90 + 5}%`,
     top: `${Math.random() * 90 + 5}%`
    }"
   >
    <div class="text-xl text-yellow-400">✦</div>
   </div>

   <!-- メインカウンター部分 -->
   <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <!-- ジェリーのような円形エリア -->
    <div
     class="relative flex items-center justify-center w-56 h-56 rounded-full bg-gradient-to-br from-pink-300/80 to-purple-300/80 backdrop-blur-sm"
     :class="[isAnimating ? 'animate-jelly-bounce' : randomAnimation ? 'animate-jelly-idle' : '']"
    >
     <!-- 内側の光沢効果 -->
     <div class="absolute top-4 left-4 w-12 h-12 bg-white rounded-full opacity-40"></div>
     <div class="absolute bottom-8 right-8 w-16 h-16 bg-pink-200 rounded-full opacity-30"></div>

     <!-- カウンター数値 -->
     <div class="relative z-10">
      <TransitionGroup name="jelly">
       <div
        :key="count"
        class="text-8xl font-bubble text-white drop-shadow-pastel tracking-wide"
        :class="{ 'animate-pulse-gentle': pulseIntensity > 0.7 }"
       >
        {{ count }}
       </div>
      </TransitionGroup>
     </div>
    </div>

    <!-- ステータステキスト -->
    <div
     v-if="generator.TEXTS && generator.TEXTS.length > 0"
     class="mt-6 px-6 py-2 bg-white/70 backdrop-blur-sm text-2xl font-bubble rounded-full text-center shadow-md"
     :style="{ color: counterStyle.textColor || '#d946ef' }"
     :class="[
      isAnimating ? 'animate-bounce-gentle' : pulseIntensity > 0.5 ? 'animate-pulse-text' : ''
     ]"
    >
     <span class="relative whitespace-nowrap">
      {{ counterStyle.text }}
     </span>
    </div>
   </div>

   <!-- 装飾的なストライプ -->
   <div
    class="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-50"
   ></div>
   <div
    class="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full opacity-50"
   ></div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { WordCounterConfig } from '@/scripts/types';
import { Props, useWordComponent } from '@/scripts/useWordComponent';
import { ref, onMounted, onUnmounted } from 'vue';

const defaultGenerator: WordCounterConfig['generator'] = {
 IS_LOOP: true,
 TARGET: 15,
 TEXTS_FIRST: null,
 STYLES_FIRST: null,
 TEXTS: ['かわいい！', 'すごーい！', 'キラキラ✨', 'ラブリー💕', 'ドキドキ！'],
 TEXTS_AFTER: null,
 STYLES: [
  {
   textColor: '#be185d',
   colorClass: 'bg-gradient-to-br from-pink-300 to-pink-400'
  },
  {
   textColor: '#7e22ce',
   colorClass: 'bg-gradient-to-br from-purple-300 to-purple-400'
  },
  {
   textColor: '#db2777',
   colorClass: 'bg-gradient-to-br from-pink-400 to-purple-300'
  }
 ],
 EASTER_DATA: undefined
};

const props = withDefaults(defineProps<Props>(), {
 generator: () => defaultGenerator
});

// コンポーザブル
const { isAnimating, pulseIntensity, counterStyle } = useWordComponent(props, 1200);

// ランダムアニメーション状態
const randomAnimation = ref(false);
let animationInterval: any;

// ランダムなタイミングでアニメーションを実行
onMounted(() => {
 animationInterval = setInterval(
  () => {
   if (!isAnimating.value) {
    randomAnimation.value = true;
    setTimeout(() => {
     randomAnimation.value = false;
    }, 1000);
   }
  },
  5000 + Math.random() * 5000
 ); // 5-10秒間隔でランダムアニメーション
});

onUnmounted(() => {
 clearInterval(animationInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');

.font-bubble {
 font-family: 'Bubblegum Sans', cursive;
}

/* ジェリーバウンスアニメーション */
@keyframes jelly-bounce {
 0%,
 100% {
  transform: scale(1);
 }
 30% {
  transform: scale(1.1, 0.9);
 }
 40% {
  transform: scale(0.9, 1.1);
 }
 50% {
  transform: scale(1.05, 0.95);
 }
 60% {
  transform: scale(0.98, 1.02);
 }
 70% {
  transform: scale(1.02, 0.98);
 }
 80%,
 90% {
  transform: scale(1);
 }
}

.animate-jelly-bounce {
 animation: jelly-bounce 1.2s ease;
}

/* アイドル時の小さなゆらゆら動き */
@keyframes jelly-idle {
 0%,
 100% {
  transform: scale(1);
 }
 30% {
  transform: scale(1.03, 0.97);
 }
 60% {
  transform: scale(0.98, 1.02);
 }
 80% {
  transform: scale(1.01, 0.99);
 }
}

.animate-jelly-idle {
 animation: jelly-idle 1s ease;
}

/* ジェリー数字トランジション */
.jelly-enter-active {
 animation: jelly-bounce 1.2s ease;
}

.jelly-leave-active {
 position: absolute;
 animation: jelly-leave 0.6s ease;
}

@keyframes jelly-leave {
 0% {
  transform: scale(1);
  opacity: 1;
 }
 100% {
  transform: scale(0.5);
  opacity: 0;
 }
}

.jelly-enter-from {
 opacity: 0;
 transform: scale(0.5);
}

.jelly-leave-to {
 opacity: 0;
 transform: scale(0.5);
 position: absolute;
}

/* 泡の浮遊アニメーション */
@keyframes float-slow {
 0%,
 100% {
  transform: translateY(0) translateX(0);
 }
 50% {
  transform: translateY(-10px) translateX(5px);
 }
}

@keyframes float-medium {
 0%,
 100% {
  transform: translateY(0) translateX(0);
 }
 33% {
  transform: translateY(-8px) translateX(-5px);
 }
 66% {
  transform: translateY(5px) translateX(8px);
 }
}

@keyframes float-fast {
 0%,
 100% {
  transform: translateY(0) translateX(0);
 }
 25% {
  transform: translateY(8px) translateX(-3px);
 }
 50% {
  transform: translateY(0) translateX(5px);
 }
 75% {
  transform: translateY(-5px) translateX(0);
 }
}

.animate-float-slow {
 animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
 animation: float-medium 6s ease-in-out infinite;
}

.animate-float-fast {
 animation: float-fast 4s ease-in-out infinite;
}

/* キラキラアニメーション */
@keyframes sparkle-1 {
 0%,
 100% {
  opacity: 0;
  transform: scale(0.5);
 }
 50% {
  opacity: 1;
  transform: scale(1.2);
 }
}

@keyframes sparkle-2 {
 0%,
 100% {
  opacity: 0;
  transform: scale(0.5);
 }
 50% {
  opacity: 0.8;
  transform: scale(1);
 }
}

@keyframes sparkle-3 {
 0%,
 100% {
  opacity: 0;
  transform: scale(0.7);
 }
 40%,
 60% {
  opacity: 1;
  transform: scale(1.3);
 }
}

@keyframes sparkle-4 {
 0%,
 100% {
  opacity: 0;
  transform: scale(0.5) rotate(0deg);
 }
 50% {
  opacity: 1;
  transform: scale(1.2) rotate(360deg);
 }
}

.animate-sparkle-1 {
 animation: sparkle-1 4s ease-in-out infinite;
}

.animate-sparkle-2 {
 animation: sparkle-2 6s ease-in-out infinite;
}

.animate-sparkle-3 {
 animation: sparkle-3 5s ease-in-out infinite;
}

.animate-sparkle-4 {
 animation: sparkle-4 7s ease-in-out infinite;
}

/* パステルドロップシャドウ */
.drop-shadow-pastel {
 text-shadow:
  2px 2px 4px rgba(219, 39, 119, 0.3),
  -2px -2px 4px rgba(124, 58, 237, 0.3),
  0px 4px 8px rgba(255, 255, 255, 0.5);
}

/* 優しいパルスアニメーション */
@keyframes pulse-gentle {
 0%,
 100% {
  transform: scale(1);
 }
 50% {
  transform: scale(1.05);
 }
}

.animate-pulse-gentle {
 animation: pulse-gentle 1.5s infinite;
}

/* テキストのパルスアニメーション */
@keyframes pulse-text {
 0%,
 100% {
  transform: scale(1);
 }
 50% {
  transform: scale(1.03);
 }
}

.animate-pulse-text {
 animation: pulse-text 2s infinite;
}

/* 優しいバウンスアニメーション */
@keyframes bounce-gentle {
 0%,
 100% {
  transform: translateY(0);
 }
 50% {
  transform: translateY(-5px);
 }
}

.animate-bounce-gentle {
 animation: bounce-gentle 1s ease;
}
</style>
