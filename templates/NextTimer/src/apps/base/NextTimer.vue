<!-- src/NextTimer.vue -->
<template>
 <div class="flex justify-center items-center">
  <transition name="fade">
   <div v-show="isVisible" class="font-archivo flex justify-center items-center">
    <div
     class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 transform transition-all duration-500 hover:rotate-1 hover:scale-105"
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
         class="absolute top-0 left-3 transition-transform duration-300"
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
     <div class="text-center text-2xl font-semibold text-yellow-400 animate-pulse">
      <span>Next {{ displayTime }}</span>
     </div>
    </div>
   </div>
  </transition>
 </div>
</template>

<script setup lang="ts">
import { toRef, watch } from 'vue';
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
/* フェードイン・アウト */
.fade-enter-active,
.fade-leave-active {
 transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
 opacity: 0;
}

.font-archivo {
 font-family: 'Archivo Black', sans-serif;
}

@keyframes float {
 0%,
 100% {
  transform: translateY(0);
 }
 50% {
  transform: translateY(5px);
 }
}
</style>
