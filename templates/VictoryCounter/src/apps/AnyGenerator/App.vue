<!-- src/App.vue -->
<template>
 <AnyGenerator
  :count="simpleCount"
  :loopCount="WordConfig.LOOP_COUNT"
  :targetCount="WordConfig.TARGET_COUNT"
  :progressTexts="WordConfig.PROGRESS_TEXTS"
  @click.prevent="increment"
  @contextmenu.prevent="decrement"
 />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useWordCounter } from '@/scripts/useWordCounter';

// windowに設置したコンポーネントを読む
const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

// useWordCounter
const { simpleCount, WordConfig } = useWordCounter();

const increment = () => {
 simpleCount.value++;
};
const decrement = () => {
 if (simpleCount.value <= 0) return;
 simpleCount.value--;
};
</script>

<style>
/* ビューポート全体を占める */
#App {
 height: 100vh;
 display: flex;
 flex-direction: column;
}
</style>
