<!-- NightRider/NightRider.vue -->
<template>
 <div
  class="font-racing bg-gradient-to-br from-gray-950 to-gray-900 rounded-full shadow-2xl p-6 transform transition-all duration-500 border-4 border-gray-800 relative overflow-hidden"
 >
  <!-- 背景エフェクト -->
  <div class="absolute inset-0 bg-blue-500/5 rounded-full"></div>
  <div
   class="absolute inset-4 bg-gradient-to-br from-gray-900 to-gray-950 rounded-full shadow-inner"
  ></div>
  <div
   class="absolute top-0 left-1/4 w-1/2 h-2 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent rounded-full"
  ></div>
  <div class="absolute -inset-1 rounded-full border-8 border-gray-800 opacity-50 z-0"></div>

  <!-- ヘッダー -->
  <div class="relative flex justify-center items-center mt-6 mb-4">
   <h1
    class="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider"
   >
    <<< COUNTDOWN >>>
   </h1>
  </div>

  <!-- カウントダウン表示 -->
  <div
   class="bg-gradient-to-r from-gray-900 to-gray-950 rounded-full p-5 mb-4 shadow-inner relative border-2 border-gray-800"
  >
   <div
    class="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-md"
   ></div>
   <div
    class="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-ping opacity-75 duration-1000"
   ></div>

   <div class="flex justify-center relative z-10">
    <div
     v-for="(digit, index) in countdownDigits"
     :key="index"
     class="w-14 h-20 mx-1 bg-black/80 rounded-lg overflow-hidden relative border border-gray-800 shadow-lg"
    >
     <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
     ></div>
     <div
      class="absolute top-0 left-3 transition-all duration-300 ease-in-out"
      :style="getDigitStyle(digit)"
     >
      <span
       v-for="n in 10"
       :key="n"
       class="flex items-center justify-center h-20 text-4xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
      >
       {{ (n - 1 + 10) % 10 }}
      </span>
     </div>
     <div
      class="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black to-transparent z-20"
     ></div>
     <div
      class="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black to-transparent z-20"
     ></div>
    </div>
   </div>
   <div class="text-center text-cyan-400 font-medium text-sm mt-3 tracking-widest uppercase">
    Time Remaining
   </div>
  </div>

  <!-- 次のカウントダウン時間 -->
  <div class="text-center text-xl font-semibold text-cyan-400 animate-pulse">
   <span class="uppercase tracking-wide">Next {{ timerState.displayTime }}</span>
  </div>

  <!-- インジケーター -->
  <div class="flex justify-center gap-4 mt-3">
   <div
    v-for="(color, index) in indicatorColors"
    :key="index"
    class="w-4 h-4 rounded-full"
    :class="[
     color.bg,
     color.shadow,
     {
      'animate-pulse': timerState.isTimerRunning,
      [`delay-${index * 300}`]: timerState.isTimerRunning
     }
    ]"
   ></div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { TimerState } from '@/scripts/types';

const props = defineProps<{
 timerState: TimerState;
 countdownDigits: number[];
}>();

// インジケーターの色設定を配列化
const indicatorColors = [
 { bg: 'bg-cyan-500/50', shadow: 'shadow-[0_0_10px_rgba(6,182,212,0.7)]' },
 { bg: 'bg-emerald-500/50', shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.7)]' },
 { bg: 'bg-indigo-500/50', shadow: 'shadow-[0_0_10px_rgba(99,102,241,0.7)]' }
];

// 数字の位置スタイルを計算するメソッド
const getDigitStyle = (digit: number) => {
 return { transform: `translateY(-${digit * 10}%)` };
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');

/* フォント設定 */
.font-racing {
 font-family: 'Orbitron', sans-serif;
}

/* Tailwindの遅延クラス */
.delay-0 {
 animation-delay: 0ms;
}
.delay-300 {
 animation-delay: 300ms;
}
.delay-600 {
 animation-delay: 600ms;
}
</style>
