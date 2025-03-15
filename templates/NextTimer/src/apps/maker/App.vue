<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen space-y-4">
  <AnyGenerator :timerState="timerState" :countdownDigits="countdownDigits" />

  <!-- アクションボタン -->
  <div class="flex space-x-4">
   <button @click="startActionTest(15)" class="px-4 py-2 bg-blue-500 text-white rounded">
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
 startActionTest,
 pauseAction,
 resetAction
} = useNextTimer();
</script>
