<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen space-y-4">
  <AnyGenerator :timerState="timerState" :countdownDigits="countdownDigits" />
 </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useNextTimer } from '@/scripts/useNextTimer';

const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));
const { timerState, countdownDigits } = useNextTimer();
</script>

<style>
#App {
 height: 100vh;
 display: flex;
 flex-direction: column;
}
</style>
