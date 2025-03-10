<!-- src/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen">
  <AnyGenerator :count="count" @click.prevent="increment" @contextmenu.prevent="decrement" />
 </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useWordCounter } from '@/scripts/useWordCounter';

// windowに設置したコンポーネントを読む
const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

// useWordCounter
const { count, increment, decrement } = useWordCounter();
</script>

<style>
/* ビューポート全体を占める */
#App {
 height: 100vh;
 display: flex;
 flex-direction: column;
}
</style>
