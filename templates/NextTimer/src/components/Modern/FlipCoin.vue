<!-- any/FlipCoin.vue -->
<template>
 <div class="font-mono animate-fade-up relative">
  <!-- 波紋アニメーション -->
  <div v-if="timerState.isTimerRunning" class="ripple-container">
   <div v-for="i in 3" :key="i" class="ripple" :style="{ animationDelay: `${i * 0.3}s` }"></div>
  </div>

  <!-- パーティクル -->
  <div v-if="timerState.countdown <= 3 && timerState.isTimerRunning" class="particles-container">
   <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)"></div>
  </div>

  <!-- カウントダウン表示（コイン風） -->
  <div
   class="coin relative shadow-2xl rounded-full w-48 h-48 flex items-center justify-center overflow-hidden"
   :class="{
    'animate-coin': timerState.isTimerRunning,
    'animate-pulse': timerState.countdown <= 3 && timerState.isTimerRunning
   }"
  >
   <!-- コインの縁 -->
   <div class="absolute inset-0 rounded-full border-8 border-yellow-300 shadow-inner"></div>

   <!-- グラデーションの背景 -->
   <div class="absolute inset-4 rounded-full bg-gradient-to-bl from-yellow-500 to-amber-600"></div>

   <!-- 数字と内側の円 -->
   <div
    class="absolute inset-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center"
   >
    <div
     class="text-8xl font-extrabold text-white text-center drop-shadow-lg"
     :class="{ 'animate-wiggle': timerState.countdown <= 5 && timerState.isTimerRunning }"
    >
     {{ timerState.countdown }}
    </div>
   </div>
  </div>

  <!-- 次のカウントダウン時間 -->
  <div class="text-center font-semibold text-amber-300 mt-6 animate-flash text-xl">
   Next {{ timerState.displayTime }}
  </div>
 </div>
</template>

<script setup lang="ts">
import { TimerState } from '@/scripts/types';

const props = defineProps<{
 timerState: TimerState;
 countdownDigits: number[];
}>();

// パーティクルのランダムスタイル生成
const getParticleStyle = (index: number) => {
 const speed = Math.random() * 3 + 1;
 const size = Math.random() * 10 + 5;
 const delay = (index * 0.07) % 1;
 const rotation = Math.random() * 360;
 const x = (Math.random() - 0.5) * 80;
 const y = (Math.random() - 0.5) * 80;

 return {
  '--size': `${size}px`,
  '--speed': `${speed}s`,
  '--delay': `${delay}s`,
  '--rotation': `${rotation}deg`,
  '--x': `${x}px`,
  '--y': `${y}px`
 };
};
</script>

<style scoped>
.custom-transition-enter-active,
.custom-transition-leave-active {
 transition: all 0.5s ease;
}

.custom-transition-enter-from,
.custom-transition-leave-to {
 opacity: 0;
 transform: translateY(20px);
}

/* コインのアニメーション */
@keyframes coin {
 0%,
 100% {
  transform: rotateX(-15deg) rotateY(15deg) translateY(0);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
 }
 50% {
  transform: rotateX(-25deg) rotateY(5deg) translateY(-15px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
 }
}

.animate-coin {
 animation: coin 3s ease-in-out infinite;
 transform-style: preserve-3d;
}

/* 波紋アニメーション */
.ripple-container {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 100%;
 height: 100%;
}

.ripple {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 10px;
 height: 10px;
 border-radius: 50%;
 background: rgba(255, 215, 0, 0.2);
 border: 2px solid rgba(255, 215, 0, 0.6);
 animation: ripple 3s ease-out infinite;
}

@keyframes ripple {
 0% {
  width: 0;
  height: 0;
  opacity: 1;
 }
 100% {
  width: 300px;
  height: 300px;
  opacity: 0;
 }
}

/* パーティクルアニメーション */
.particles-container {
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 width: 100%;
 height: 100%;
 pointer-events: none;
}

.particle {
 position: absolute;
 top: 50%;
 left: 50%;
 width: var(--size);
 height: var(--size);
 background: linear-gradient(135deg, #ffd700, #ffa500);
 border-radius: 50%;
 transform: translate(-50%, -50%);
 animation: particle var(--speed) ease-out forwards var(--delay);
 opacity: 0;
}

@keyframes particle {
 0% {
  transform: translate(-50%, -50%) rotate(0deg);
  opacity: 1;
 }
 100% {
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--rotation));
  opacity: 0;
 }
}

/* 数字が揺れるアニメーション */
@keyframes wiggle {
 0%,
 100% {
  transform: rotate(0deg) scale(1);
 }
 25% {
  transform: rotate(-2deg) scale(1.1);
 }
 50% {
  transform: rotate(0deg) scale(1);
 }
 75% {
  transform: rotate(2deg) scale(1.1);
 }
}

.animate-wiggle {
 animation: wiggle 0.5s linear infinite;
}

/* フラッシュアニメーション */
@keyframes flash {
 0%,
 100% {
  opacity: 1;
 }
 50% {
  opacity: 0.5;
 }
}

.animate-flash {
 animation: flash 2s linear infinite;
}
</style>
