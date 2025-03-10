<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen space-y-4">
  <AnyGenerator :count="count" @click.prevent="increment" @contextmenu.prevent="decrement" />
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AnyGenerator from '@/apps/maker/MarioCoin.vue';

const count = ref<number>(0);

const increment = () => {
 count.value++;
};
const decrement = () => {
 if (count.value <= 0) return;
 count.value--;
};
</script>
