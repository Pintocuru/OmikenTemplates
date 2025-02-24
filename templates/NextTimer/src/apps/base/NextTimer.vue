<!-- src/BasicNew.vue -->
<template>
 <div v-if="isVisible" class="flex justify-center items-center">
  <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
   <div class="font-archivo flex justify-center items-center">
    <div
     class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 rotate-3 transition-transform duration-300"
    >
     <!-- ヘッダー -->
     <div class="flex justify-between items-center mb-6">
      <h1
       class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent"
      >
       snipe counter
      </h1>
     </div>

     <!-- カウントダウン表示 -->
     <div class="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg p-6 mb-4 shadow-inner">
      <div class="flex justify-center">
       <div
        v-for="(digit, index) in countdownDigits"
        :key="index"
        class="w-14 h-24 mx-1 bg-black/20 rounded-lg overflow-hidden relative transform hover:scale-105 transition-transform duration-200"
       >
        <div
         class="absolute top-0 left-0 transition-transform duration-300"
         :style="{ transform: `translateY(-${digit * 10}%)` }"
        >
         <span
          v-for="n in 10"
          :key="n"
          class="flex items-center justify-center h-24 text-5xl font-bold text-white drop-shadow-lg"
         >
          {{ (n - 1 + 10) % 10 }}
         </span>
        </div>
       </div>
      </div>
      <div class="text-center text-gray-900 font-semibold text-base mt-2">Time Remaining</div>
     </div>

     <!-- 次のカウントダウン時間 -->
     <div
      class="text-center text-2xl font-semibold text-yellow-400"
      :class="{ 'animate-float': isTimerRunning }"
     >
      <span>Next {{ displayTime }}</span>
     </div>
    </div>
   </div>
  </transition>
 </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useTimer } from '@scripts/useTimer';
import { beforeEnter, enter, leave } from '@/scripts/AnimeJsAnimation';
import { CommentChara } from '@common/commonTypes';
import { NextTimerConfigType } from '@/scripts/types';

const props = defineProps<{
 isInitFlag: boolean;
 nextTimer: CommentChara[];
 timeConfig: NextTimerConfigType;
}>();

const { displayTime, isVisible, isTimerRunning, countdownDigits, processComment } = useTimer(
 props.timeConfig,
 props.isInitFlag
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');

.font-archivo {
 font-family: 'Archivo Black', sans-serif;
}

@keyframes float {
 0%,
 100% {
  transform: translateY(0) rotate(3deg);
 }
 50% {
  transform: translateY(-10px) rotate(3deg);
 }
}

.animate-float {
 animation: float 4s ease-in-out infinite;
}

/* 数字のホバーエフェクト */
.hover\:scale-105:hover {
 transform: scale(1.05);
 transition: transform 0.2s ease-in-out;
}
</style>
