<!-- src/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen gap-4">
  <AnyGenerator
   v-for="(counterSet, index) in displayedCounterSets"
   :key="index"
   :count="counters[index].count"
   @click.prevent="counters[index].increment"
   @contextmenu.prevent="counters[index].decrement"
  />
 </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { useWordCounter } from '@scripts/useWordCounter';

// windowに設置したコンポーネントを読む
const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

// 表示するcounterSetsの取得（最大3つまで）
const displayedCounterSets = computed(() => {
 // 配列でない場合は、単一の要素を配列に変換
 const counterSetsArray = Array.isArray(window.counterSets)
  ? window.counterSets
  : [window.counterSets];
 // 最大3つまでに制限
 return counterSetsArray.slice(0, 3);
});

// 各counterSetに対応するuseWordCounterのインスタンスを作成
const counters = computed(() => displayedCounterSets.value.map(useWordCounter));
</script>
