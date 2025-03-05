<!-- src/App.vue -->
<template>
 <AnyGenerator :isInitFlag="isInitFlag" :count="count" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useWordCounter } from '@/scripts/useWordCounter';

// windowに設置したコンポーネントを読む
const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

// useWordCounter
const { isInitFlag, count } = useWordCounter();
</script>

<style>
/* ビューポート全体を占める */
#App {
 height: 100vh;
 display: flex;
 flex-direction: column;
}
</style>
