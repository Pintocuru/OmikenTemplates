<!-- src/NextTimer.vue -->
<template>
 <div class="flex justify-center items-center">
  <transition
   name="zoom"
   enter-active-class="animate__animated animate__fadeIn"
   leave-active-class="animate__animated animate__fadeOut"
  >
   <div v-show="isVisible" class="font-mono">
    <div class="card w-80 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
     <!-- カードヘッダー -->
     <div class="card-title justify-center mt-4 text-primary">
      <h1 class="uppercase tracking-wider text-xl font-bold">Countdown</h1>
     </div>

     <!-- カウントダウン表示 -->
     <div class="card-body pb-2 pt-0">
      <div class="rounded-xl bg-base-300 p-4 mb-2 relative overflow-hidden">
       <!-- パルスエフェクト（タイマー実行中のみ） -->
       <div v-if="isTimerRunning" class="absolute inset-0 bg-primary/5 animate-pulse"></div>

       <!-- カウントダウン数字 -->
       <div class="flex justify-center z-10 relative">
        <div
         v-for="(digit, index) in countdownDigits"
         :key="index"
         class="w-12 h-16 mx-1 bg-base-100 rounded-lg overflow-hidden relative shadow-inner border border-base-200"
        >
         <!-- オドメーターアニメーション -->
         <div
          class="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out"
          :style="{ transform: `translateY(-${digit * 10}%)` }"
         >
          <span
           v-for="n in 10"
           :key="n"
           class="flex items-center justify-center h-16 text-3xl font-bold text-primary w-full"
          >
           {{ (n - 1 + 10) % 10 }}
          </span>
         </div>

         <!-- グラデーションオーバーレイ -->
         <div
          class="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-base-100 to-transparent z-20"
         ></div>
         <div
          class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-base-100 to-transparent z-20"
         ></div>
        </div>
       </div>
      </div>

      <!-- 次のカウントダウン時間 -->
      <div class="text-center font-semibold text-primary">
       <span class="uppercase tracking-wide" :class="{ 'animate-pulse': isTimerRunning }">
        Next {{ displayTime }}
       </span>
      </div>

      <!-- ステータスインジケーター -->
      <div class="flex justify-center gap-3 mt-2 mb-1">
       <div
        class="indicator size-3 rounded-full"
        :class="isTimerRunning ? 'bg-success animate-pulse' : 'bg-base-300'"
       ></div>
       <div
        class="indicator size-3 rounded-full"
        :class="isTimerRunning ? 'bg-primary animate-pulse delay-300' : 'bg-base-300'"
       ></div>
       <div
        class="indicator size-3 rounded-full"
        :class="isTimerRunning ? 'bg-secondary animate-pulse delay-700' : 'bg-base-300'"
       ></div>
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
