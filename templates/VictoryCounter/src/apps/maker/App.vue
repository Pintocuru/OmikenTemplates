<!-- src/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen space-y-4">
  <AnyGenerator
   :isInitFlag="isInitFlag"
   :count="simpleCount"
   @click.prevent="increment"
   @contextmenu.prevent="decrement"
  />
  <div class="flex space-x-4">
   <button
    @click="increment"
    class="px-6 py-3 text-xl font-bold text-white bg-blue-500 rounded-2xl shadow-lg hover:bg-blue-600"
   >
    Increment
   </button>
   <button
    @click="reset"
    class="px-6 py-3 text-xl font-bold text-white bg-red-500 rounded-2xl shadow-lg hover:bg-red-600"
   >
    Reset
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AnyGenerator from '@/components/VictoryCounter/KillingSpree.vue';

const isInitFlag = ref<boolean>(true);
const simpleCount = ref<number>(0);

const increment = () => {
 simpleCount.value++;
};
const decrement = () => {
 if (simpleCount.value <= 0) return;
 simpleCount.value--;
};
const reset = () => {
 simpleCount.value = 0;
};
</script>
