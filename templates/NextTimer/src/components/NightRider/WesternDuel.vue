<!-- NightRider/WesternDuel.vue -->
<template>
 <div
  class="font-western bg-western-paper relative p-8 rounded border border-western-dark shadow-lg transform rotate-1 transition-transform duration-300 max-w-lg"
  :class="{ 'shake-animation': timerState.isTimerRunning }"
 >
  <div class="paper-texture"></div>

  <div class="text-center mb-6 pb-4 border-b-2 border-dashed border-western-brown">
   <h1 class="text-5xl font-bold text-western-red m-0 font-rye tracking-wide text-shadow-western">
    WANTED
   </h1>
   <h2 class="text-2xl font-bold text-western-dark mt-2 mb-0 tracking-wide font-elite">
    SNIPE COUNTER
   </h2>
  </div>

  <div
   class="bg-western-tan relative p-6 mb-5 rounded border-2 border-western-brown overflow-hidden"
  >
   <!-- Dust particles container -->
   <div class="absolute inset-0 pointer-events-none z-10" v-if="timerState.isTimerRunning">
    <div v-for="i in 15" :key="i" :class="`dust-particle dust-${i}`"></div>
   </div>

   <div class="flex justify-center relative z-20">
    <div
     v-for="(digit, index) in countdownDigits"
     :key="index"
     class="w-14 h-24 mx-1 overflow-hidden relative bg-western-dark rounded border border-black shadow-inner"
    >
     <div
      class="absolute top-0 left-0 transition-transform duration-500 ease-out"
      :style="{ transform: `translateY(-${digit * 10}%)` }"
     >
      <span
       v-for="n in 10"
       :key="n"
       class="flex items-center justify-center pl-2 h-24 text-5xl font-bold text-white font-elite text-shadow"
      >
       {{ (n - 1 + 10) % 10 }}
      </span>
     </div>
     <!-- Overlay to create vintage digit effect -->
     <div class="absolute top-0 left-0 w-full h-0.5 bg-white bg-opacity-20"></div>
    </div>
   </div>

   <div class="text-center text-western-dark font-bold tracking-wide mt-3 text-shadow-light">
    TIME REMAINING
   </div>
  </div>

  <div
   class="text-center text-xl font-semibold text-western-dark relative py-2"
   :class="{ 'tumble-animation': timerState.isTimerRunning }"
  >
   <span>Next {{ timerState.displayTime }}</span>

   <!-- Rope decoration -->
   <div v-if="timerState.isTimerRunning" class="absolute -top-4 w-full h-5 overflow-hidden">
    <div class="absolute h-0.5 bg-western-brown top-2.5 left-8 w-20 transform rotate-12"></div>
    <div class="absolute h-0.5 bg-western-brown top-2.5 right-8 w-20 transform -rotate-12"></div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { TimerState } from '@/scripts/types';

const props = defineProps<{
 timerState: TimerState;
 countdownDigits: number[];
}>();
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rye&family=Special+Elite&display=swap');

/* Tailwind拡張カスタムクラス */
.font-western {
 font-family: 'Rye', 'Special Elite', cursive;
}

.font-rye {
 font-family: 'Rye', cursive;
}

.font-elite {
 font-family: 'Special Elite', cursive;
}

.bg-western-paper {
 background-color: #f5f5dc;
}

.bg-western-tan {
 background-color: #d2b48c;
}

.text-western-dark {
 color: #3c2415;
}

.text-western-red {
 color: #8b0000;
}

.border-western-dark {
 border-color: #3c2415;
}

.border-western-brown {
 border-color: #8b4513;
}

.text-shadow {
 text-shadow: 1px 1px 0 #000;
}

.text-shadow-western {
 text-shadow: 2px 2px 0 #3c2415;
}

.text-shadow-light {
 text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.shadow-inner {
 box-shadow:
  inset 0 2px 4px rgba(0, 0, 0, 0.7),
  0 2px 2px rgba(255, 255, 255, 0.2);
}

/* Paper texture background */
.paper-texture {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23935E3E' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
 opacity: 0.6;
 z-index: 0;
 pointer-events: none;
}

/* Animation classes */
.shake-animation {
 animation: shake 1.5s ease-in-out infinite;
 animation-play-state: running;
}

@keyframes shake {
 0%,
 100% {
  transform: rotate(1deg);
 }
 25% {
  transform: rotate(0deg);
 }
 50% {
  transform: rotate(2deg);
 }
 75% {
  transform: rotate(1deg);
 }
}

.tumble-animation {
 animation: tumble 4s ease-in-out infinite;
}

@keyframes tumble {
 0%,
 100% {
  transform: translateY(0) rotate(0deg);
 }
 25% {
  transform: translateY(-5px) rotate(-1deg);
 }
 50% {
  transform: translateY(-10px) rotate(1deg);
 }
 75% {
  transform: translateY(-5px) rotate(0deg);
 }
}

/* Fix for spinning animation - 一の位表示の問題修正 */
.spinning {
 animation: spinDigit 0.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spinDigit {
 0% {
  transform: translateY(0%);
 }
 100% {
  transform: translateY(-900%);
 }
}

/* Dust particles */
.dust-particle {
 position: absolute;
 width: 5px;
 height: 5px;
 background-color: rgba(139, 69, 19, 0.2);
 border-radius: 50%;
 animation: dust 5s infinite linear;
}

@keyframes dust {
 0% {
  transform: translate(0, 0) rotate(0deg);
  opacity: 0;
 }
 10% {
  opacity: 0.6;
 }
 90% {
  opacity: 0.1;
 }
 100% {
  transform: translate(var(--tx), var(--ty)) rotate(360deg);
  opacity: 0;
 }
}

/* Generate random positions for dust particles */
.dust-1 {
 --tx: -30px;
 --ty: 40px;
 top: 20%;
 left: 10%;
 animation-duration: 6s;
}
.dust-2 {
 --tx: 35px;
 --ty: 30px;
 top: 30%;
 left: 20%;
 animation-duration: 7s;
}
.dust-3 {
 --tx: -25px;
 --ty: -45px;
 top: 40%;
 left: 80%;
 animation-duration: 5s;
}
.dust-4 {
 --tx: 40px;
 --ty: -30px;
 top: 70%;
 left: 40%;
 animation-duration: 9s;
}
.dust-5 {
 --tx: -40px;
 --ty: -25px;
 top: 60%;
 left: 70%;
 animation-duration: 8s;
}
.dust-6 {
 --tx: 30px;
 --ty: 40px;
 top: 80%;
 left: 20%;
 animation-duration: 10s;
}
.dust-7 {
 --tx: -20px;
 --ty: 30px;
 top: 50%;
 left: 60%;
 animation-duration: 7s;
}
.dust-8 {
 --tx: 25px;
 --ty: -35px;
 top: 20%;
 left: 40%;
 animation-duration: 6s;
}
.dust-9 {
 --tx: -30px;
 --ty: -20px;
 top: 30%;
 left: 50%;
 animation-duration: 8s;
}
.dust-10 {
 --tx: 35px;
 --ty: 25px;
 top: 75%;
 left: 85%;
 animation-duration: 9s;
}
.dust-11 {
 --tx: -25px;
 --ty: 30px;
 top: 45%;
 left: 15%;
 animation-duration: 7s;
}
.dust-12 {
 --tx: 30px;
 --ty: -35px;
 top: 15%;
 left: 75%;
 animation-duration: 6s;
}
.dust-13 {
 --tx: -35px;
 --ty: -25px;
 top: 85%;
 left: 35%;
 animation-duration: 8s;
}
.dust-14 {
 --tx: 20px;
 --ty: 30px;
 top: 65%;
 left: 90%;
 animation-duration: 7s;
}
.dust-15 {
 --tx: -30px;
 --ty: -35px;
 top: 55%;
 left: 30%;
 animation-duration: 9s;
}

/* Animation classes for transition */
.animated {
 animation-duration: 0.5s;
 animation-fill-mode: both;
}

.zoomInUp {
 animation-name: zoomInUp;
}

.zoomOut {
 animation-name: zoomOut;
}

@keyframes zoomInUp {
 from {
  opacity: 0;
  transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
  animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
 }

 60% {
  opacity: 1;
  transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
  animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
 }
}

@keyframes zoomOut {
 from {
  opacity: 1;
 }

 50% {
  opacity: 0;
  transform: scale3d(0.3, 0.3, 0.3);
 }

 to {
  opacity: 0;
 }
}
</style>
