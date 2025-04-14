<!-- src/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen">
  <!-- Total counter component -->
  <TotalCounter
   v-if="componentConfig.totalCounterSet"
   :counters="counters"
   :totalCounterConfig="componentConfig.totalCounterSet"
   :colorScheme="componentConfig.color"
  />
  <hr class="mb-4" />
  <div
   :class="[
    componentConfig.isHorizontalLayout ? 'flex flex-row space-x-4' : 'flex flex-col space-y-4'
   ]"
  >
   <AnyGenerator
    v-for="(counter, index) in counters"
    :key="index"
    :count="counter.count.value"
    :countMax="counter.countMax.value"
    :counterConfig="counter.counterConfig"
    :colorScheme="componentConfig.color"
    @click.prevent="counter.increment"
    @contextmenu.prevent="counter.decrement"
   />
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { componentConfigSchema, counterSetSchema } from '@/scripts/schema';
import TotalCounter from './TotalCounter.vue';
import { useWordCounter } from '@scripts/useWordCounter';

// windowに設置したコンポーネントを読む
const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

// アプリケーション設定
const {
 componentConfig = componentConfigSchema.parse(undefined),
 counterSets = [counterSetSchema.parse(undefined)]
} = window || {};

// 各カウンターセットに対してuseWordCounterを呼び出す
const counters = counterSets.map((counterSet) => useWordCounter(componentConfig, counterSet));
</script>
