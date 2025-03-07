<!-- FallCrown.vue -->
<template>
 <div class="relative flex items-center justify-center">
  <!-- Background bubble with shadow effect -->
  <div
   class="relative flex flex-col items-center justify-center w-72 h-72 rounded-full shadow-xl transform transition-all duration-300"
   :class="[counterStyle.colorClass, { 'scale-110': isAnimating }]"
  >
   <!-- Crown icon that bounces on count change -->
   <div
    class="absolute top-0 transform -translate-y-12 transition-transform"
    :class="{ 'animate-bounce': isAnimating }"
   >
    <Crown :size="64" class="text-yellow-400 filter drop-shadow-lg" />
   </div>

   <div
    class="absolute inset-4 border-8 border-dashed border-white/40 rounded-full animate-spin-slow"
   ></div>

   <!-- Animated particles on count change -->
   <div v-if="isAnimating" class="absolute inset-0 w-full h-full">
    <div v-for="i in 8" :key="i" class="absolute confetti"></div>
   </div>

   <!-- Counter number with animation -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <TransitionGroup name="count">
     <div :key="count" class="text-9xl font-game text-white tracking-tight filter drop-shadow-md">
      {{ count }}
     </div>
    </TransitionGroup>

    <!-- Status text displayed in a fun bubble -->
    <div
     v-if="progressTexts.length > 0"
     class="status-bubble relative mt-4 px-6 py-2 font-game text-2xl font-bold tracking-wide rounded-full transform transition-all duration-300"
     :style="{ color: counterStyle.textColor, backgroundColor: 'white' }"
     :class="{ 'scale-110 rotate-2': isAnimating }"
    >
     {{ counterStyle.text }}

     <!-- Small decoration elements on the bubble -->
     <div class="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-pink-400"></div>
     <div class="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-blue-400"></div>
     <div class="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-yellow-400"></div>
     <div class="absolute -left-1 -bottom-1 w-4 h-4 rounded-full bg-green-400"></div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { Crown } from 'lucide-vue-next';
import { Props, useVictoryComponent } from '@/scripts/useVictoryComponent';

const props = withDefaults(defineProps<Props>(), {
 targetCount: 15,
 loopCount: false,
 // 進捗率に基づくテキスト設定
 progressTexts: () => [
  '勝利をつかめ！',
  'ナイスプレイ！',
  'ナイスプレイ！',
  'すごい！',
  'すごい！',
  '燃えてるぞ！',
  '燃えてるぞ！',
  '絶好調！',
  '絶好調！',
  '上位3位確定！',
  '上位3位確定！',
  'ハグ大好き卿！',
  'ハグ大好き卿！',
  '超のつく大ファン！',
  '超のつく大ファン！',
  '大好き！'
 ],
 // 進捗率に基づくスタイル設定
 progressStyles: () => [
  {
   textColor: '#06b6d4', // Cyan (最低ランク)
   colorClass: 'bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500'
  },
  {
   textColor: '#3b82f6', // Blue
   colorClass: 'bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500'
  },
  {
   textColor: '#10b981', // Emerald
   colorClass: 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500'
  },
  {
   textColor: '#eab308', // Amber
   colorClass: 'bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500'
  },
  {
   textColor: '#f97316', // Orange
   colorClass: 'bg-gradient-to-br from-orange-400 via-red-400 to-rose-500'
  },
  {
   textColor: '#ec4899', // Pink
   colorClass: 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-500'
  },
  {
   textColor: '#8b5cf6', // Purple
   colorClass: 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-500'
  },
  {
   textColor: '#d4af37', // Gold (最高ランク)
   colorClass: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600'
  }
 ]
});

// コンポーザブル
const { isAnimating, counterStyle } = useVictoryComponent(props, 1000);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

.font-game {
 font-family: 'Mochiy Pop One', sans-serif;
}

/* Count change animation */
.count-enter-active,
.count-leave-active {
 transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.count-enter-from {
 opacity: 0;
 transform: scale(0.5) translateY(20px) rotate(15deg);
}

.count-leave-to {
 opacity: 0;
 transform: scale(1.5) translateY(-20px) rotate(-15deg);
 position: absolute;
}

.count-leave-active {
 position: absolute;
}

/* Status bubble animation */
.status-bubble {
 box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.1),
  0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Confetti animation */
.confetti {
 position: absolute;
 width: 8px;
 height: 16px;
 opacity: 0;
 animation: confetti-fall 1s ease-out forwards;
}

.confetti:nth-child(1) {
 top: 20%;
 left: 20%;
 background-color: #ffeb3b;
 transform: rotate(15deg);
 animation-delay: 0.1s;
}

.confetti:nth-child(2) {
 top: 30%;
 left: 80%;
 background-color: #4fc3f7;
 transform: rotate(30deg);
 animation-delay: 0.2s;
}

.confetti:nth-child(3) {
 top: 60%;
 left: 15%;
 background-color: #ff9800;
 transform: rotate(-25deg);
 animation-delay: 0.15s;
}

.confetti:nth-child(4) {
 top: 70%;
 left: 75%;
 background-color: #ff4081;
 transform: rotate(20deg);
 animation-delay: 0.25s;
}

.confetti:nth-child(5) {
 top: 40%;
 left: 30%;
 background-color: #8bc34a;
 transform: rotate(-10deg);
 animation-delay: 0.3s;
}

.confetti:nth-child(6) {
 top: 35%;
 left: 65%;
 background-color: #9c27b0;
 transform: rotate(35deg);
 animation-delay: 0.1s;
}

.confetti:nth-child(7) {
 top: 65%;
 left: 40%;
 background-color: #f44336;
 transform: rotate(-30deg);
 animation-delay: 0.2s;
}

.confetti:nth-child(8) {
 top: 50%;
 left: 85%;
 background-color: #3f51b5;
 transform: rotate(25deg);
 animation-delay: 0.25s;
}

@keyframes confetti-fall {
 0% {
  opacity: 1;
  transform: translateY(0) rotate(0);
 }
 100% {
  opacity: 0;
  transform: translateY(100px) rotate(90deg);
 }
}
.animate-spin-slow {
 animation: spin 60s linear infinite;
}
@keyframes spin {
 from {
  transform: rotate(0deg);
 }
 to {
  transform: rotate(-360deg);
 }
}
</style>
