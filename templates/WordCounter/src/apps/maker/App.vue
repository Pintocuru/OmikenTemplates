<!-- src/App.vue -->
<template>
 <AnyGenerator :isInitFlag="isInitFlag" :count="count" />
</template>

<script setup lang="ts">
import { useWordCounter } from '@/scripts/useWordCounter';
import AnyGenerator from '@/components/BasicCounter.vue';

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
