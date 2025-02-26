<!-- src/NextTemplateSimple.vue -->
<template>
 <div class="flex justify-center items-center min-h-screen bg-base-200">
  <div v-show="isVisible" class="font-mono animate-fade-up">
   <!-- カウントダウン表示 -->
   <div class="card bg-base-300 p-8 relative shadow-xl animate-zoom-in">
    <div v-if="isTimerRunning" class="absolute inset-0 bg-primary/5 animate-pulse"></div>
    <div class="text-7xl font-extrabold text-primary text-center relative z-10">
     {{ countdown }}
    </div>
   </div>
   <!-- 次のカウントダウン時間 -->
   <div class="text-center font-semibold text-primary mt-4 animate-flash">
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

<style lang="scss" scoped></style>
