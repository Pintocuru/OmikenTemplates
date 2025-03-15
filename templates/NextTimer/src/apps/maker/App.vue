<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen space-y-4">
  <transition
   name="zoom"
   enter-active-class="animated zoomInUp"
   leave-active-class="animated zoomOut"
  >
   <AnyGenerator
    v-show="timerState.isVisible"
    :timerState="timerState"
    :countdownDigits="countdownDigits"
    @click.prevent="startActionInput(999)"
    @contextmenu.prevent="resetAction"
   />
  </transition>
  <!-- アクションボタン -->
  <div class="flex space-x-4">
   <button @click="startActionInput(15)" class="px-4 py-2 bg-blue-500 text-white rounded">
    Start
   </button>
   <button @click="pauseAction" class="px-4 py-2 bg-yellow-500 text-white rounded">Pause</button>
   <button @click="resetAction" class="px-4 py-2 bg-red-500 text-white rounded">Reset</button>
  </div>
 </div>
</template>

<script setup lang="ts">
import AnyGenerator from './BasicCounter.vue';
import { useNextTimer } from '@/scripts/useNextTimer';

// useNextTimer
const {
 timerState,
 countdownDigits,

 // Actions
 startActionInput,
 pauseAction,
 resetAction
} = useNextTimer();
</script>

<style scoped>
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
