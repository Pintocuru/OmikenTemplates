<!-- SimpleCounter.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative w-96 h-80 bg-black rounded-lg overflow-hidden shadow-2xl border border-cyan-500"
  >
   <!-- サイバーグリッド背景 -->
   <div class="absolute inset-0 perspective-1000">
    <div class="absolute inset-0 grid-bg animate-grid-move"></div>

    <!-- ネオンライン装飾 -->
    <div
     v-for="n in 5"
     :key="`neon-line-${n}`"
     class="absolute h-px animate-neon-pulse"
     :style="{
      left: 0,
      right: 0,
      top: `${n * 20}%`,
      backgroundColor: n % 2 === 0 ? '#ec4899' : '#06b6d4',
      height: `${n % 3 === 0 ? 2 : 1}px`,
      opacity: 0.8,
      animationDelay: `${n * 0.2}s`
     }"
    ></div>
   </div>

   <!-- サイドネオンライト -->
   <div
    class="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500 animate-neon-pulse-slow"
   ></div>
   <div
    class="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 animate-neon-pulse-slow"
   ></div>

   <!-- トップヘッダー -->
   <div
    class="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-black via-gray-900 to-black border-b border-cyan-600 flex items-center justify-between px-4"
   >
    <div class="text-xs font-cyber text-cyan-400">CYBER.COUNT_SYS v2.5</div>
    <div class="text-xs font-cyber text-pink-400">
     {{ new Date().toISOString().slice(0, 19).replace('T', ' ') }}
    </div>
   </div>

   <!-- メインカウンターエリア -->
   <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
    <!-- カウンターディスプレイ -->
    <div class="relative flex flex-col items-center justify-center mb-2">
     <div
      class="w-48 h-36 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-600 rounded-md overflow-hidden glow-container"
     >
      <!-- スキャンライン効果 -->
      <div class="absolute inset-0 scanlines pointer-events-none"></div>

      <!-- グリッチエフェクト -->
      <div class="absolute inset-0 glitch-effect" :class="{ 'animate-glitch': isAnimating }"></div>

      <!-- 数値表示 -->
      <div class="relative h-full flex items-center justify-center">
       <TransitionGroup name="cyber-count">
        <div
         :key="count"
         class="text-8xl font-cyber text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-pink-500"
         :class="{ 'animate-count-zoom': isAnimating }"
        >
         {{ count }}
        </div>
       </TransitionGroup>
      </div>
     </div>

     <!-- 評価表示 (beatmania風) -->
     <div
      v-if="isAnimating"
      class="absolute -top-12 font-cyber text-3xl tracking-widest animate-rating-appear"
      :class="getRatingClass()"
     >
      {{ getRating() }}
     </div>
    </div>

    <!-- ステータステキスト -->
    <div
     v-if="generator.TEXTS && generator.TEXTS.length > 0"
     class="w-56 flex items-center justify-center"
    >
     <div
      class="relative px-4 py-1 bg-black/60 backdrop-blur-sm border border-pink-500 text-xl font-cyber text-center"
      :class="{ 'animate-pulse-neon': pulseIntensity > 0.5 && !isAnimating }"
     >
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
       {{ counterStyle.text }}
      </span>
     </div>
    </div>
   </div>

   <!-- 奥行き演出用の走る光線 -->
   <div
    v-for="n in 8"
    :key="`speed-line-${n}`"
    class="absolute speed-line"
    :style="{
     width: '2px',
     height: '2px',
     backgroundColor: n % 2 === 0 ? '#ec4899' : '#06b6d4',
     boxShadow: n % 2 === 0 ? '0 0 8px #ec4899' : '0 0 8px #06b6d4',
     left: `${Math.random() * 100}%`,
     animationDuration: `${Math.random() * 2 + 1}s`,
     animationDelay: `${Math.random() * 1}s`
    }"
   ></div>

   <!-- 装飾用のホログラフィックサークル -->
   <div
    class="absolute bottom-4 right-4 w-16 h-16 rounded-full border border-pink-500/30 animate-pulse-slow"
   ></div>
   <div
    class="absolute top-16 left-6 w-10 h-10 rounded-full border border-cyan-500/30 animate-pulse-slow"
   ></div>

   <!-- 左下のミニ情報パネル -->
   <div class="absolute bottom-2 left-2 text-xs font-cyber text-pink-400 flex flex-col">
    <div>LEVEL: {{ Math.floor(count / 5) + 1 }}</div>
    <div>SYNC: {{ Math.floor(pulseIntensity * 100) }}%</div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { WordCounterConfig } from '@/scripts/types';
import { Props, useWordComponent } from '@/scripts/useWordComponent';

const defaultGenerator: WordCounterConfig['generator'] = {
 IS_LOOP: true,
 TARGET: 15,
 TEXTS_FIRST: null,
 STYLES_FIRST: null,
 TEXTS: ['CYBER_SYNC', 'NEURO_LINK', 'HYPER_DRIVE', 'ULTRA_BOOST', 'MAX_LEVEL'],
 TEXTS_AFTER: null,
 STYLES: [
  {
   textColor: '#06b6d4',
   colorClass: 'bg-gradient-to-br from-cyan-900 to-black'
  },
  {
   textColor: '#d946ef',
   colorClass: 'bg-gradient-to-br from-pink-900 to-black'
  },
  {
   textColor: '#ec4899',
   colorClass: 'bg-gradient-to-br from-purple-900 to-black'
  }
 ],
 EASTER_DATA: undefined
};

const props = withDefaults(defineProps<Props>(), {
 generator: () => defaultGenerator
});

// コンポーザブル
const { isAnimating, pulseIntensity, counterStyle } = useWordComponent(props, 1000);

// ビートマニア風の評価を取得
const getRating = () => {
 const ratings = ['COOL', 'GREAT', 'GOOD', 'PERFECT', 'EXCELLENT'];
 // countに基づいた評価 (countが大きいほど良い評価に)
 const baseIndex = Math.min(Math.floor(props.count / 5), ratings.length - 1);
 // pulseIntensityが高いほど良い評価を返す
 return ratings[Math.min(baseIndex + Math.floor(pulseIntensity.value * 2), ratings.length - 1)];
};

// 評価に応じたクラスを取得
const getRatingClass = () => {
 const rating = getRating();
 switch (rating) {
  case 'COOL':
   return 'text-cyan-400';
  case 'GREAT':
   return 'text-green-400';
  case 'GOOD':
   return 'text-yellow-400';
  case 'PERFECT':
   return 'text-pink-400';
  case 'EXCELLENT':
   return 'text-purple-400';
  default:
   return 'text-white';
 }
};
</script>

<style scoped>
/* サイバーパンクフォント */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');

.font-cyber {
 font-family: 'Orbitron', sans-serif;
}

/* 奥行きのある地面グリッド */
.grid-bg {
 background-image: linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px);
 background-size: 40px 40px;
 transform-origin: center;
 transform: rotateX(60deg);
}

/* グリッド奥行きアニメーション */
@keyframes grid-move {
 0% {
  background-position: 0 0;
 }
 100% {
  background-position: 0 40px;
 }
}

.animate-grid-move {
 animation: grid-move 1s linear infinite;
}

/* サイバーカウントトランジション */
.cyber-count-enter-active {
 transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.cyber-count-leave-active {
 transition: all 0.3s cubic-bezier(0.8, 0.2, 0.2, 1);
 position: absolute;
}

.cyber-count-enter-from {
 opacity: 0;
 transform: translateZ(-100px) scale(1.2);
}

.cyber-count-leave-to {
 opacity: 0;
 transform: translateZ(100px) scale(0.8);
}

/* カウント拡大アニメーション */
@keyframes count-zoom {
 0% {
  transform: scale(1);
 }
 50% {
  transform: scale(1.15);
 }
 100% {
  transform: scale(1);
 }
}

.animate-count-zoom {
 animation: count-zoom 0.8s ease-out;
}

/* ネオンパルスアニメーション */
@keyframes neon-pulse {
 0%,
 100% {
  opacity: 0.6;
 }
 50% {
  opacity: 1;
 }
}

.animate-neon-pulse {
 animation: neon-pulse 2s infinite;
}

.animate-neon-pulse-slow {
 animation: neon-pulse 4s infinite;
}

/* スキャンライン効果 */
.scanlines::before {
 content: '';
 position: absolute;
 width: 100%;
 height: 100%;
 top: 0;
 left: 0;
 background: repeating-linear-gradient(
  to bottom,
  transparent 0%,
  rgba(255, 255, 255, 0.05) 0.5%,
  transparent 1%
 );
 animation: scanline 6s linear infinite;
}

@keyframes scanline {
 0% {
  transform: translateY(0);
 }
 100% {
  transform: translateY(100%);
 }
}

/* グリッチエフェクト */
@keyframes glitch {
 0% {
  transform: translate(0);
 }
 20% {
  transform: translate(-2px, 2px);
 }
 40% {
  transform: translate(-2px, -2px);
 }
 60% {
  transform: translate(2px, 2px);
 }
 80% {
  transform: translate(2px, -2px);
 }
 100% {
  transform: translate(0);
 }
}

.animate-glitch {
 animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* 評価表示アニメーション */
@keyframes rating-appear {
 0% {
  transform: translateY(-10px);
  opacity: 0;
 }
 10% {
  transform: translateY(0);
  opacity: 1;
 }
 80% {
  transform: translateY(0);
  opacity: 1;
 }
 100% {
  transform: translateY(-10px);
  opacity: 0;
 }
}

.animate-rating-appear {
 animation: rating-appear 1.2s ease-out forwards;
}

/* グロー効果 */
.glow-container {
 box-shadow:
  0 0 15px rgba(6, 182, 212, 0.5),
  0 0 30px rgba(236, 72, 153, 0.3);
}

/* ネオンパルス */
@keyframes pulse-neon {
 0%,
 100% {
  box-shadow:
   0 0 5px rgba(236, 72, 153, 0.7),
   0 0 10px rgba(6, 182, 212, 0.5);
 }
 50% {
  box-shadow:
   0 0 20px rgba(236, 72, 153, 0.9),
   0 0 30px rgba(6, 182, 212, 0.7);
 }
}

.animate-pulse-neon {
 animation: pulse-neon 2s infinite;
}

/* ゆっくりパルス */
@keyframes pulse-slow {
 0%,
 100% {
  transform: scale(1);
  opacity: 0.3;
 }
 50% {
  transform: scale(1.1);
  opacity: 0.7;
 }
}

.animate-pulse-slow {
 animation: pulse-slow 4s infinite;
}

/* 奥から手前へのスピードライン */
.speed-line {
 position: absolute;
 top: 100%;
 transform-origin: center;
 animation: speed-through 2s linear infinite;
}

@keyframes speed-through {
 0% {
  top: 100%;
  height: 2px;
  opacity: 0;
 }
 30% {
  opacity: 1;
 }
 100% {
  top: -10%;
  height: 50px;
  opacity: 0;
 }
}

/* パースペクティブ設定 */
.perspective-1000 {
 perspective: 1000px;
}
</style>
