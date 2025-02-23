<!-- src/BasicNew.vue -->
<template>
 <div id="container">
  <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
   <div
    v-if="isVisible"
    id="clock-container"
    class="font-['Archivo_Black'] flex justify-center items-center"
   >
    <div
     class="bg-white rounded-xl shadow-lg p-8 transform rotate-3 transition-transform duration-300 ease-in-out"
    >
     <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800 m-0">snipe counter</h1>
     </div>

     <div id="countdown" class="bg-amber-400 rounded-lg p-6 mb-4">
      <div class="flex justify-center">
       <div
        v-for="(digit, index) in countdownDigits"
        :key="index"
        class="w-[58px] h-[90px] mx-1 overflow-hidden relative bg-white/20 rounded-lg"
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
      <div class="text-center text-white text-base mt-2">Time Remaining</div>
     </div>

     <div
      id="next-clock"
      :class="['text-center text-2xl font-semibold text-gray-600', { 'animate-float': isHuwahuwa }]"
     >
      <span id="next-time">Next {{ displayTime }}</span>
     </div>
    </div>
   </div>
  </transition>
 </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useTimer } from '@scripts/useTimer';
import { beforeEnter, enter, leave } from '@/scripts/AnimeJsAnimation';
import { CommentChara } from '@common/commonTypes';

const props = defineProps<{ nextTimer: CommentChara[] }>();

const { displayTime, isVisible, isHuwahuwa, countdownDigits, processComment } = useTimer();

// コメント監視とクリーンアップ
watch(
 props.nextTimer,
 (comments: CommentChara[]) => {
  console.log('watch triggered', comments);
  comments.forEach((comment) => {
   processComment(comment.data.comment);
  });
 },
 { deep: true }
);

onMounted(() => {
 console.log('Initial nextTimer:', props.nextTimer);
});
</script>

<style>
@keyframes float {
 0%,
 100% {
  transform: translateY(0);
 }
 50% {
  transform: translateY(-15px);
 }
}

.animate-float {
 animation: float 4s ease-in-out infinite;
}
</style>
