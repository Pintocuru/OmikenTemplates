<!-- SimpleWhite/CubicPink.vue -->
<template>
 <div class="inline-block rounded-2xl bg-purple-300 p-5 shadow-lg">
  <div class="text-center text-5xl font-bold text-white drop-shadow-md relative">
   <!-- 親要素を相対配置にして、絶対配置の基準点を作成 -->
   <div class="relative w-full h-full">
    <!-- 左の羽 -->
    <div v-if="timerState.isTimerRunning" class="absolute top-0 z-0" style="left: -120px">
     <img src="./wing.svg" alt="Left Wing" class="w-24 h-24 wing-left opacity-70" />
    </div>

    <!-- 右の羽 -->
    <div v-if="timerState.isTimerRunning" class="absolute top-0 z-0" style="right: -120px">
     <img src="./wing.svg" alt="Right Wing" class="w-24 h-24 wing-right opacity-70" />
    </div>
   </div>

   <span v-for="(digit, index) in countdownDigits" :key="index" class="mx-1">{{ digit }}</span>
  </div>
  <div
   class="mt-2 text-xl text-white transition-transform duration-300 ease-in-out flex items-center justify-center"
   :class="{ 'translate-y-[-5px]': timerState.isTimerRunning }"
  >
   Next
   <!-- Animated heart that rotates when timer is running -->
   <div class="mx-1 inline-block" :class="{ 'heart-rotate': timerState.isTimerRunning }">
    <span class="text-pink-400">♥</span>
   </div>
   {{ timerState.displayTime }}
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

<style scoped>
.heart-rotate {
 animation: heartbeat 1.5s infinite;
 transform-origin: center;
 display: inline-block;
}

@keyframes heartbeat {
 0% {
  transform: rotateY(0deg) scale(1);
 }
 25% {
  transform: rotateY(90deg) scale(1.1);
 }
 50% {
  transform: rotateY(180deg) scale(1);
 }
 75% {
  transform: rotateY(270deg) scale(1.1);
 }
 100% {
  transform: rotateY(360deg) scale(1);
 }
}

/* 左の羽のアニメーション */
.wing-left {
 transform-origin: center;
 animation: wingFlapLeft 2s ease-in-out infinite;
 transform: scaleX(-1);
}

/* 右の羽のアニメーション */
.wing-right {
 transform-origin: center;
 animation: wingFlapRight 2s ease-in-out infinite;
}

@keyframes wingFlapLeft {
 0% {
  transform: scaleX(-1) rotate(0deg);
 }
 50% {
  transform: scaleX(-1) rotate(15deg);
 }
 100% {
  transform: scaleX(-1) rotate(0deg);
 }
}

@keyframes wingFlapRight {
 0% {
  transform: rotate(0deg);
 }
 50% {
  transform: rotate(15deg);
 }
 100% {
  transform: rotate(0deg);
 }
}
</style>
