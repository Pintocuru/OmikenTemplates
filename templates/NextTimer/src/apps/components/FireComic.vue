<!-- src/NextTimer.vue -->
<template>
 <div class="flex justify-center items-center">
  <transition
   name="zoom"
   enter-active-class="animate__animated animate__bounceIn"
   leave-active-class="animate__animated animate__bounceOut"
  >
   <div v-show="isVisible" class="font-digital">
    <div class="torch-container w-96 relative">
     <!-- Flame Background -->
     <div class="flame-bg absolute -top-28 w-full h-64 z-0">
      <div class="flame-main"></div>
      <div class="flame-secondary"></div>
      <div class="flame-tertiary"></div>
     </div>

     <!-- Comic-Style Card -->
     <div
      class="card w-full bg-black border-4 border-yellow-500 rounded-2xl shadow-[0_0_30px_#FF6D00] relative z-10 pb-4"
     >
      <!-- Comic-Style Header -->
      <div class="card-title justify-center mt-6 mb-2">
       <h1
        class="comic-title uppercase tracking-wider text-3xl font-extrabold text-yellow-400 rotate-2 tracking-widest"
       >
        FIRE<span class="text-red-600">COUNT</span>
       </h1>
      </div>

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
        <div v-if="isTimerRunning" class="absolute inset-0 animated-flash"></div>

        <!-- 3D Countdown Number -->
        <div class="flex justify-center z-10 relative">
         <div class="countdown-3d text-center">
          <span class="text-7xl font-black text-yellow-400 countdown-value">
           {{ countdown }}
          </span>
          <div class="countdown-shadow" aria-hidden="true">
           {{ countdown }}
          </div>
         </div>
        </div>
       </div>

       <!-- Next Countdown Time -->
       <div class="text-center font-bold mt-2">
        <span
         class="comic-bubble uppercase tracking-wide text-white"
         :class="{ 'animate-pulse': isTimerRunning }"
        >
         Next {{ displayTime }}
        </span>
       </div>

       <!-- Status Indicators -->
       <div class="flex justify-center gap-3 mt-4">
        <div
         v-for="i in 3"
         :key="i"
         class="indicator size-4 border-2 border-yellow-500"
         :class="
          isTimerRunning
           ? `bg-${i === 1 ? 'red' : i === 2 ? 'orange' : 'yellow'}-500 flame-pulse delay-${(i - 1) * 300}`
           : 'bg-gray-800'
         "
        ></div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </transition>
 </div>
</template>

<script setup lang="ts">
import { toRef, watch } from 'vue';
import { useTimer } from '@scripts/useTimer';
import { CommentChara } from '@common/commonTypes';
import { NextTimerConfigType } from '@/scripts/types';

const props = defineProps<{
 isInitFlag: boolean;
 nextTimer: CommentChara[];
 timeConfig: NextTimerConfigType;
}>();

const { displayTime, isVisible, isTimerRunning, countdown, countdownDigits, processComment } =
 useTimer(props.timeConfig, toRef(props, 'isInitFlag'));

watch(
 () => props.nextTimer,
 (comments: CommentChara[]) => {
  comments.forEach((comment) => {
   processComment(comment.data.comment);
  });
 },
 { deep: true, immediate: true }
);
</script>

<style scoped>
/* Comic-Style Typography */
.font-digital {
 font-family: 'Impact', 'Arial Black', sans-serif;
}

.comic-title {
 text-shadow:
  4px 4px 0px #000,
  -2px -2px 0px #ff6d00,
  2px -2px 0px #ff6d00,
  -2px 2px 0px #ff6d00,
  2px 2px 0px #ff6d00;
 transform: skew(-5deg);
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
 margin: 10px 0;
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

/* Flame Animations */
.flame-bg {
 transform-origin: center bottom;
 animation: flame-wobble 3s ease-in-out infinite alternate;
}

.flame-main {
 position: absolute;
 bottom: 0;
 left: 50%;
 width: 80%;
 height: 80%;
 transform: translateX(-50%) scale(1.5, 1);
 border-radius: 50% 50% 20% 20% / 40% 40% 60% 60%;
 background: linear-gradient(to top, #ff6d00, #ff0000);
 box-shadow: 0 0 80px 20px #ff6d00;
 animation: flame-up 4s ease-in infinite alternate;
}

.flame-secondary {
 position: absolute;
 bottom: 0;
 left: 50%;
 width: 90%;
 height: 75%;
 transform: translateX(-50%) scale(1.2, 1);
 border-radius: 50% 50% 30% 30% / 40% 40% 60% 60%;
 background: linear-gradient(to top, #ff9900, #ff6d00);
 box-shadow: 0 0 50px 10px #ff6d00;
 animation: flame-up 3s ease-in-out infinite alternate;
 animation-delay: 0.2s;
}

.flame-tertiary {
 position: absolute;
 bottom: 0;
 left: 50%;
 width: 65%;
 height: 70%;
 transform: translateX(-50%) scale(0.9, 1);
 border-radius: 50% 50% 40% 40% / 40% 40% 60% 60%;
 background: linear-gradient(to top, #ffdd00, #ff9900);
 box-shadow: 0 0 30px 5px #ff9900;
 animation: flame-up 2.5s ease-in-out infinite alternate;
 animation-delay: 0.4s;
}

.flame-pulse {
 animation: pulse 1.5s ease-in-out infinite;
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
@keyframes flame-up {
 0%,
 100% {
  height: 65%;
 }
 50% {
  height: 80%;
 }
}

@keyframes flame-wobble {
 0%,
 100% {
  transform: translateX(-5px) scale(1.05);
 }
 50% {
  transform: translateX(5px) scale(0.95);
 }
}

@keyframes bounce-text {
 0% {
  transform: rotateX(20deg) translateY(0);
 }
 100% {
  transform: rotateX(20deg) translateY(-10px);
 }
}

@keyframes pulse {
 0%,
 100% {
  opacity: 1;
  transform: scale(1);
 }
 50% {
  opacity: 0.7;
  transform: scale(1.3);
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

/* Responsive adjustments */
@media (max-width: 640px) {
 .torch-container {
  width: 90vw;
 }

 .flame-bg {
  transform: scale(0.8);
 }

 .comic-title {
  font-size: 1.5rem;
 }

 .countdown-value {
  font-size: 3rem;
 }
}
</style>
