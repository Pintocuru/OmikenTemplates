<!-- src/OhayouCounter.vue -->
<template>
 <div
  class="flex flex-col items-center justify-center w-full h-full min-h-[120px] bg-green-500/80 rounded-lg p-4 transition-all duration-300"
 >
  <div class="text-7xl font-bold text-white text-center">
   {{ count }}
  </div>
  <div class="text-2xl text-white mt-2 font-medium">おは！</div>
 </div>
</template>

<script setup lang="ts">
defineProps<{
 isInitFlag: boolean;
 count: number;
}>();
</script>

<style lang="scss" scoped>
/* OBSで透過背景を使用するために追加 */
:root {
 background-color: rgba(0, 0, 0, 0);
}
</style>
