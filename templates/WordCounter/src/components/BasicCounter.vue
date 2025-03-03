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
import { watch } from 'vue';
import { useWordCounter } from '@/scripts/useWordCounter';
import { ServiceVisitType } from '@public/common/subscribe/GetUserVisits';
import { WordCounterConfig } from '@/scripts/types';

const props = defineProps<{
 wordCounter: Record<string, ServiceVisitType>;
 config: WordCounterConfig;
}>();

// useWordCounterから必要な値を取得 (isUserCountは使用しない)
const { count, processComment } = useWordCounter(props.config);

// wordCounterの変更を監視して処理
watch(
 () => props.wordCounter,
 (visits: Record<string, ServiceVisitType>) => {
  processComment(visits);
 },
 { immediate: true }
);
</script>

<style lang="scss" scoped>
/* OBSで透過背景を使用するために追加 */
:root {
 background-color: rgba(0, 0, 0, 0);
}
</style>
