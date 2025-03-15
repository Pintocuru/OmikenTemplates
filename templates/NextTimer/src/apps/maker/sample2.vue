<!-- sample2.vue -->
<template>
 <div class="inline-block rounded-2xl bg-purple-300 p-5 shadow-lg">
  <div class="text-center text-5xl font-bold text-white drop-shadow-md">
   <span v-for="(digit, index) in countdownDigits" :key="index" class="mx-1">{{ digit }}</span>
  </div>
  <div
   class="mt-2 text-xl text-white transition-transform duration-300 ease-in-out"
   :class="{ 'translate-y-[-5px]': timerState.isTimerRunning }"
  >
   Next <span class="text-pink-400">♥</span> {{ timerState.displayTime }}
  </div>
 </div>
</template>

<script setup lang="ts">
import { TimerState } from '@/scripts/types';

defineProps<{
 timerState: TimerState;
 countdownDigits: number[];
}>();
</script>
