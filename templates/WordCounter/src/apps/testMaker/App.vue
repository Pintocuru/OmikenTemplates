<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen space-y-4">
  <AnyGenerator :count="count" @click.prevent="increment" @contextmenu.prevent="decrement" />
 </div>
</template>

<script setup lang="ts">
import AnyGenerator from './ColorChanging.vue';
import { useWordCounter } from '@scripts/useWordCounter';

// useWordCounter
const { count, increment, decrement } = useWordCounter();
</script>
