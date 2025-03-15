<!-- SimpleWhite/SimplePink.vue -->
<template>
 <div class="rounded-2xl bg-pink-300 px-2 py-4 border-4 border-white shadow-lg text-center">
  <!-- カウントダウン -->
  <div class="flex justify-center items-center text-4xl font-bold text-pink-500 space-x-2 mb-4">
   <span
    v-for="(digit, index) in countdownDigits"
    :key="index"
    class="bg-white rounded-lg px-3 py-2"
   >
    {{ digit }}
   </span>
  </div>
  <!-- 次回の時間表示 -->
  <div
   class="flex items-center justify-center text-brown-700 bg-[#ffdab9] px-4 py-1 rounded-xl text-lg transition-transform duration-300 ease-in-out"
   :class="{ 'animate-float': timerState.isTimerRunning }"
  >
   Next <span class="text-pink-500 mx-2 animate-heartbeat">♥</span> {{ timerState.displayTime }}
  </div>
 </div>
</template>

<script setup lang="ts">
import { TimerState } from '@/scripts/types';

defineProps<{
 timerState: TimerState;
 countdownDigits: number[];
}>();
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
 @keyframes float {
  0%,
  100% {
   transform: translateY(0);
  }
  50% {
   transform: translateY(-5px);
  }
 }
 .animate-float {
  animation: float 3s ease-in-out infinite;
 }

 @keyframes heartbeat {
  0%,
  100% {
   transform: scale(1);
  }
  50% {
   transform: scale(1.2);
  }
 }
 .animate-heartbeat {
  animation: heartbeat 3s ease-in-out infinite;
 }
}
</style>
