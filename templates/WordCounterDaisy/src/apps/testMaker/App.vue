<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen">
  <!-- Total counter component -->
  <TotalCounter v-if="componentConfig.isTotalCounter" :counters="counters" class="mb-4" />

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
import { ComponentConfig } from '@/scripts/schema';
import AnyGenerator from './BasicCounter.vue';
import TotalCounter from './TotalCounter.vue';
import { useWordCounter } from '@scripts/useWordCounter';
// TODO window のconfigから取得できるようにする
import { counterSets } from './counterSets';

// testData
const componentConfig: ComponentConfig = {
 theme: 'light',
 isTotalCounter: true, // Enable the total counter
 isHorizontalLayout: true
};

// 各カウンターセットに対してuseWordCounterを呼び出す
const counters = counterSets.map((counterSet) => useWordCounter(componentConfig, counterSet));
</script>
