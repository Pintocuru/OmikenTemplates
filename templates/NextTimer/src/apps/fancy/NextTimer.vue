<!-- src/SimpleCounter.vue -->
<template>
 <div class="flex justify-center items-center min-h-screen">
  <div v-show="isVisible" class="font-mono animate-fade-up">
   <!-- カウントダウン表示 -->
   <div
    class="bg-gradient-to-bl from-red-600 to-orange-500 p-8 relative shadow-2xl transform -rotate-x-20 rotate-y-20 skew-x-8 -skew-y-8 animate-float rounded-full w-40 h-40 flex items-center justify-center"
   >
    <div
     v-if="isTimerRunning"
     class="absolute inset-0 bg-black/10 animate-pulse rounded-full"
    ></div>
    <div class="text-9xl font-extrabold text-white text-center relative z-10">
     {{ countdown }}
    </div>
   </div>
   <!-- 次のカウントダウン時間 -->
   <div class="text-center font-semibold text-orange-400 mt-4 animate-flash">
    Next {{ displayTime }}
   </div>
  </div>
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

const { displayTime, isVisible, isTimerRunning, countdown, processComment } = useTimer(
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
@keyframes float {
 0%,
 100% {
  transform: translateY(0) rotateX(-20deg) rotateY(-20deg) skewX(-12deg) skewY(-12deg);
 }
 50% {
  transform: translateY(-20px) rotateX(-20deg) rotateY(-20deg) skewX(-12deg) skewY(-12deg);
 }
}

.animate-float {
 animation: float 3s ease-in-out infinite;
}

.perspective-1000 {
 perspective: 1000px;
}

.rotate-x-20 {
 transform: rotateX(-20deg);
}

.rotate-y-20 {
 transform: rotateY(-20deg);
}

.skew-x-12 {
 transform: skewX(-12deg);
}

.skew-y-12 {
 transform: skewY(-12deg);
}
</style>
