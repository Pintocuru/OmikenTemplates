<!-- src/App.vue -->
<template>
 <div
  class="flex flex-col items-center justify-center h-screen space-y-4"
  @click="startActionInput()"
 >
  <transition
   name="zoom"
   enter-active-class="animated zoomInUp"
   leave-active-class="animated zoomOut"
  >
   <AnyGenerator
    v-show="timerState.isVisible"
    :timerState="timerState"
    :countdownDigits="countdownDigits"
    @contextmenu.prevent="resetAction"
   />
  </transition>
 </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useNextTimer } from '@/scripts/useNextTimer';

const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

// useNextTimer
const {
 timerState,
 countdownDigits,

 // Actions
 startActionInput,
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
