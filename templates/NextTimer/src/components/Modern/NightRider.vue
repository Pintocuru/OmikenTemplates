<!-- src/NextTimer.vue -->
<template>
 <div class="flex justify-center items-center">
  <transition
   name="zoom"
   enter-active-class="animated zoomInUp"
   leave-active-class="animated zoomOut"
  >
   <div v-show="isVisible" class="font-racing flex justify-center items-center">
    <div
     class="bg-gradient-to-br from-gray-950 to-gray-900 rounded-full shadow-2xl p-6 transform transition-all duration-500 hover:scale-105 border-4 border-gray-800 relative overflow-hidden"
    >
     <!-- グロウエフェクト背景 -->
     <div class="absolute inset-0 bg-blue-500/5 rounded-full"></div>
     <div
      class="absolute inset-4 bg-gradient-to-br from-gray-900 to-gray-950 rounded-full shadow-inner"
     ></div>

     <!-- 光の反射 -->
     <div
      class="absolute top-0 left-1/4 w-1/2 h-2 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent rounded-full"
     ></div>

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
      <!-- 光り輝くエフェクト -->
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
        class="w-14 h-20 mx-1 bg-black/80 rounded-lg overflow-hidden relative transform transition-transform duration-200 border border-gray-800 shadow-lg"
       >
        <div
         class="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
        ></div>
        <div
         class="absolute top-0 left-3 transition-all duration-300 ease-in-out"
         :style="{ transform: `translateY(-${digit * 10}%)` }"
        >
         <span
          v-for="n in 10"
          :key="n"
          class="flex items-center justify-center h-20 text-4xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
         >
          {{ (n - 1 + 10) % 10 }}
         </span>
        </div>
        <!-- ディジットの上下のグラデーション -->
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

     <!-- RPMメーターのような装飾 -->
     <div class="absolute -inset-1 rounded-full border-8 border-gray-800 opacity-50 z-0"></div>

     <!-- 次のカウントダウン時間 -->
     <div class="text-center text-xl font-semibold text-cyan-400 animate-pulse">
      <span class="uppercase tracking-wide">Next {{ displayTime }}</span>
     </div>

     <!-- ダッシュボードスタイルの装飾インジケーター -->
     <div class="flex justify-center gap-4 mt-3">
      <div
       class="w-4 h-4 rounded-full bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.7)] animate-pulse"
      ></div>
      <div
       class="w-4 h-4 rounded-full bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse delay-300"
      ></div>
      <div
       class="w-4 h-4 rounded-full bg-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.7)] animate-pulse delay-700"
      ></div>
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

const { displayTime, isVisible, isTimerRunning, countdownDigits, processComment } = useTimer(
 props.timeConfig,
 toRef(props, 'isInitFlag')
);

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
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');
/* フォント設定 */
.font-racing {
 font-family: 'Orbitron', sans-serif;
}

/* 追加アニメーション */
@keyframes glow {
 0%,
 100% {
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
 }
 50% {
  box-shadow: 0 0 25px rgba(34, 211, 238, 0.7);
 }
}

.glow-effect {
 animation: glow 2s infinite;
}

/* トランジション用のアニメーション */
@keyframes zoomInUp {
 from {
  opacity: 0;
  transform: scale(0.5) translateY(100%);
 }
 to {
  opacity: 1;
  transform: scale(1) translateY(0);
 }
}

@keyframes zoomOut {
 from {
  opacity: 1;
  transform: scale(1);
 }
 to {
  opacity: 0;
  transform: scale(0.5);
 }
}

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
</style>
