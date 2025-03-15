<!-- src/FireComic.vue -->
<template>
 <div class="font-digital w-60 relative">
  <!-- Comic-Style Card -->
  <div
   class="card w-full bg-black border-4 border-yellow-500 rounded-2xl shadow-[0_0_30px_#FF6D00] relative z-10 pb-4"
  >
   <!-- Comic-Style Header -->
   <div class="card-title justify-center mt-6 mb-2"></div>

   <!-- Comic-Style Pattern -->
   <div class="comic-dots absolute top-0 right-0 w-20 h-20 opacity-30"></div>
   <div class="comic-dots absolute bottom-0 left-0 w-16 h-16 opacity-20"></div>

   <!-- Countdown Display -->
   <div class="card-body pb-2 pt-0">
    <div
     class="rounded-xl bg-gradient-to-r from-red-900 to-red-950 p-6 mb-4 relative overflow-hidden"
    >
     <!-- Animated Background Effects -->
     <div class="absolute inset-0 bg-dot-pattern opacity-20"></div>
     <div v-if="timerState.isTimerRunning" class="absolute inset-0 animated-flash"></div>

     <!-- 3D Countdown Number -->
     <div class="flex justify-center z-10 relative">
      <div class="countdown-3d text-center">
       <span class="text-8xl font-black text-yellow-400 countdown-value">
        {{ timerState.countdown }}
       </span>
       <div class="countdown-shadow" aria-hidden="true">
        {{ timerState.countdown }}
       </div>
      </div>
     </div>
    </div>

    <!-- Next Countdown Time -->
    <div class="text-center font-bold mt-2">
     <span
      class="comic-bubble uppercase tracking-wide text-white"
      :class="{ 'animate-pulse': timerState.isTimerRunning }"
     >
      Next {{ timerState.displayTime }}
     </span>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { TimerState } from '@/scripts/types';

const props = defineProps<{
 timerState: TimerState;
}>();
</script>

<style scoped>
/* Comic-Style Typography */
.font-digital {
 font-family: 'Impact', 'Arial Black', sans-serif;
}

.comic-bubble {
 position: relative;
 background: #ff6d00;
 color: #000;
 font-weight: 900;
 padding: 8px 16px;
 border-radius: 12px;
 border: 2px solid #000;
 box-shadow: 3px 3px 0 #000;
}

/* Dot Pattern for Comic Style */
.comic-dots {
 background-image: radial-gradient(#fff 15%, transparent 16%),
  radial-gradient(#fff 15%, transparent 16%);
 background-size: 12px 12px;
 background-position:
  0 0,
  6px 6px;
}

.bg-dot-pattern {
 background-image: radial-gradient(#fff 5%, transparent 6%),
  radial-gradient(#fff 5%, transparent 6%);
 background-size: 30px 30px;
 background-position:
  0 0,
  15px 15px;
}

/* 3D Countdown Effect */
.countdown-3d {
 position: relative;
 perspective: 400px;
 margin: 0;
}

.countdown-value {
 position: relative;
 display: inline-block;
 transform: rotateX(20deg);
 text-shadow:
  0 2px 0 #ffb700,
  0 4px 0 #ffb700,
  0 6px 0 #b76e00,
  0 8px 0 #b76e00,
  0 10px 20px rgba(0, 0, 0, 0.8);
 animation: bounce-text 0.4s ease infinite alternate;
}

.countdown-shadow {
 position: absolute;
 top: 100%;
 left: 0;
 right: 0;
 color: transparent;
 transform: rotateX(80deg) translateY(-20px) scale(1, 0.35);
 filter: blur(4px);
 background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%);
 opacity: 0.6;
}

.animated-flash {
 background: linear-gradient(
  135deg,
  transparent 0%,
  rgba(255, 255, 255, 0.2) 50%,
  transparent 100%
 );
 background-size: 300% 300%;
 animation: flash-animation 2s ease infinite;
}

/* Keyframe Animations */
@keyframes bounce-text {
 0% {
  transform: rotateX(20deg) translateY(0);
 }
 100% {
  transform: rotateX(20deg) translateY(-10px);
 }
}

@keyframes flash-animation {
 0% {
  background-position: 0% 50%;
 }
 50% {
  background-position: 100% 50%;
 }
 100% {
  background-position: 0% 50%;
 }
}
</style>
