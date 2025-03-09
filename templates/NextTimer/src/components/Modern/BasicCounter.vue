<!-- src/BasicCounter.vue -->
<template>
 <div class="flex justify-center items-center">
  <transition name="custom-transition" mode="out-in">
   <div v-show="isVisible" class="font-mono">
    <div
     class="w-80 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4"
    >
     <!-- カードヘッダー -->
     <div class="flex justify-center mt-4 text-blue-600">
      <h1 class="uppercase tracking-wider text-xl font-bold">Countdown</h1>
     </div>

     <!-- カウントダウン表示 -->
     <div class="px-4 py-2">
      <div class="rounded-xl bg-gray-100 p-4 mb-2 relative overflow-hidden">
       <!-- パルスエフェクト（タイマー実行中のみ） -->
       <div v-if="isTimerRunning" class="absolute inset-0 bg-blue-50 animate-pulse"></div>

       <!-- カウントダウン数字 -->
       <div class="flex justify-center z-10 relative">
        <div
         v-for="(digit, index) in countdownDigits"
         :key="index"
         class="w-12 h-16 mx-1 bg-white rounded-lg overflow-hidden relative shadow-inner border border-gray-200"
        >
         <!-- オドメーターアニメーション -->
         <div
          class="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out"
          :style="{ transform: `translateY(-${digit * 10}%)` }"
         >
          <span
           v-for="n in 10"
           :key="n"
           class="flex items-center justify-center h-16 text-3xl font-bold text-blue-600 w-full"
          >
           {{ (n - 1 + 10) % 10 }}
          </span>
         </div>

         <!-- グラデーションオーバーレイ -->
         <div
          class="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent z-20"
         ></div>
         <div
          class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent z-20"
         ></div>
        </div>
       </div>
      </div>

      <!-- 次のカウントダウン時間 -->
      <div class="text-center font-semibold text-blue-600">
       <span class="uppercase tracking-wide" :class="{ 'animate-pulse': isTimerRunning }">
        Next {{ displayTime }}
       </span>
      </div>

      <!-- ステータスインジケーター -->
      <div class="flex justify-center gap-3 mt-2 mb-1">
       <div
        class="w-3 h-3 rounded-full"
        :class="isTimerRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'"
       ></div>
       <div
        class="w-3 h-3 rounded-full"
        :class="isTimerRunning ? 'bg-blue-500 animate-pulse delay-300' : 'bg-gray-300'"
       ></div>
       <div
        class="w-3 h-3 rounded-full"
        :class="isTimerRunning ? 'bg-purple-500 animate-pulse delay-700' : 'bg-gray-300'"
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
</style>
