<!-- src/apps/maker/TotalCounter.vue -->
<template>
 <AnyGenerator :count="totalCount" :countMax="null" :counterConfig="totalCounterConfig" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AnyGenerator from './BasicCounter.vue';
import { CounterConfig } from '@/scripts/schema';

interface Counter {
 count: { value: number };
 countMax: { value: number | null };
 counterConfig: CounterConfig;
}

const props = defineProps<{
 counters: Counter[];
}>();

// Create a counter config for the total counter
const totalCounterConfig = ref<CounterConfig>({
 title: '合計',
 COUNT_MODE: 'comment',
 TARGET_DOWN: 0,
 MULTIPLIER: 1,
 PARTY: {},
 PARTY_EVENT: '',
 PARTY_SUCCESS: ''
});

// Calculate the total count based on all counters
const totalCount = computed(() => {
 return props.counters.reduce((total, counter) => {
  const { count, countMax, counterConfig } = counter;

  const isCountdownMode = counterConfig.TARGET_DOWN > 0;

  // 実際の加算対象となる値
  const baseValue = isCountdownMode
   ? counterConfig.TARGET_DOWN - count.value
   : countMax.value !== null
     ? countMax.value
     : count.value;

  const multipliedValue = baseValue * counterConfig.MULTIPLIER;

  return total + multipliedValue;
 }, 0);
});
</script>
