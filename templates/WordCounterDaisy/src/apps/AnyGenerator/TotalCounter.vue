<!-- src/apps/maker/TotalCounter.vue -->
<template>
 <AnyGenerator
  v-if="totalCounterConfig"
  :count="totalCount"
  :countMax="null"
  :counterConfig="totalCounterConfig"
  :colorScheme="colorScheme"
 />
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { ColorType, CounterConfig } from '@/scripts/schema';

// windowに設置したコンポーネントを読む
const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

interface Counter {
 count: { value: number };
 countMax: { value: number | null };
 counterConfig: CounterConfig;
}

const props = defineProps<{
 counters: Counter[];
 totalCounterConfig: CounterConfig | null;
 colorScheme: ColorType;
}>();

// Calculate the total count based on all counters
const totalCount = computed(() => {
 return props.counters.reduce((total, counter) => {
  const { count, countMax, counterConfig } = counter;

  const isCountdownMode = counterConfig.targetCountdown > 0;

  // 実際の加算対象となる値
  const baseValue = isCountdownMode
   ? counterConfig.targetCountdown - count.value
   : countMax.value !== null
     ? countMax.value
     : count.value;

  const multipliedValue = baseValue * counterConfig.multiplier;

  return total + multipliedValue;
 }, 0);
});
</script>
