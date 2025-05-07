<!-- src/apps/maker/TotalCounter.vue -->
<template>
 <component
  v-if="totalCounterConfig"
  :is="getComponent(totalCounterConfig.component)"
  :count="totalCount"
  :counterConfig="totalCounterConfig"
 />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getComponent } from '@scripts/CreateComponentMapping';
import { CounterConfig } from '@/scripts/schema';

interface Counter {
 count: { value: number };
 countMax: { value: number | null };
 counterConfig: CounterConfig;
}

const props = defineProps<{
 counters: Counter[];
 totalCounterConfig: CounterConfig | null;
}>();

// Calculate the total count based on all counters
const totalCount = computed(() => {
 const total = props.counters.reduce((sum, counter) => {
  const { count, countMax, counterConfig } = counter;

  const isCountdownMode = counterConfig.targetCountdown > 0;

  const baseValue = isCountdownMode
   ? counterConfig.targetCountdown - count.value
   : countMax.value !== null
     ? countMax.value
     : count.value;

  const multipliedValue = baseValue * counterConfig.multiplier;

  return sum + multipliedValue;
 }, 0);

 return Math.floor(total); // 小数点以下を切り捨て
});
</script>
