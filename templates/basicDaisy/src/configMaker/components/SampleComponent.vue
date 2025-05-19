<!-- src/apps/configMaker/components/SampleComponent.vue -->
<template>
 <component
  :is="getComponent(counter.counterConfig.component)"
  :count="counter.count.value"
  :countMax="counter.countMax.value"
  :counterConfig="counter.counterConfig"
  :state="counter.state"
  @click.prevent="counter.increment"
  @contextmenu.prevent="counter.decrement"
 />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CounterSet } from '@/scripts/schema';
import { getComponent } from '@scripts/CreateComponentMapping';
import { useWordCounter } from '@/scripts/useWordCounter';

// Props
const props = defineProps<{
 counterSets: CounterSet[];
 activeTabIndex: number;
}>();

// コンポーザブル:useWordCounter
const counter = computed(() => useWordCounter(props.counterSets[props.activeTabIndex]));
</script>
