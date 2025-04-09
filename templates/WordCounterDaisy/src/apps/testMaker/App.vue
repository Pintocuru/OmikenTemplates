<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen">
  <!-- Total counter component -->
  <TotalCounter
   v-if="componentConfig.totalCounterSet"
   :counters="counters"
   :totalCounterConfig="componentConfig.totalCounterSet"
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
    @click.prevent="counter.increment"
    @contextmenu.prevent="counter.decrement"
   />
  </div>
 </div>
</template>

<script setup lang="ts">
import { componentConfigSchema, counterSetSchema } from '@/scripts/schema';
import AnyGenerator from './BasicCounter.vue';
import TotalCounter from './TotalCounter.vue';
import { useWordCounter } from '@scripts/useWordCounter';

// アプリケーション設定
const {
 componentConfig = componentConfigSchema.parse(undefined),
 counterSets = [counterSetSchema.parse(undefined)]
} = window || {};

// 各カウンターセットに対してuseWordCounterを呼び出す
const counters = counterSets.map((counterSet) => useWordCounter(componentConfig, counterSet));
</script>
