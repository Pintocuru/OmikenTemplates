<!-- src/apps/maker/TotalCounter.vue -->
<template>
 <AnyGenerator
  :count="totalCount"
  :countMax="null"
  :counterConfig="totalCounterConfig"
  @click.prevent="noop"
  @contextmenu.prevent="noop"
 />
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

// No-operation function for click handlers
const noop = () => {};

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
  // Use countMax if available, otherwise use count
  const baseValue = counter.countMax.value !== null ? counter.countMax.value : counter.count.value;

  // Apply the multiplier from the counter's config
  const multipliedValue = baseValue * counter.counterConfig.MULTIPLIER;

  return total + multipliedValue;
 }, 0);
});
</script>
