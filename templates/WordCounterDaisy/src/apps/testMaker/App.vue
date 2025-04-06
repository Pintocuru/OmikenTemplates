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
import { ComponentConfig, CounterSet } from '@/scripts/schema';
import AnyGenerator from './BasicCounter.vue';
import TotalCounter from './TotalCounter.vue';
import { useWordCounter } from '@scripts/useWordCounter';

// testData
const componentConfig: ComponentConfig = {
 theme: 'dark',
 isTotalCounter: true, // Enable the total counter
 isHorizontalLayout: true
};

// 複数のカウンターセットがある前提
const counterSets: CounterSet[] = [
 {
  id: 'test3',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   title: '目標コメントまで',
   COUNT_MODE: 'comment',
   TARGET_DOWN: 100,
   MULTIPLIER: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 },
 {
  id: 'test1',
  userVisits: {
   IS_DIFF_MODE: false,
   ENABLED_SERVICES: 'platforms',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   title: '閲覧数',
   COUNT_MODE: 'viewer',
   TARGET_DOWN: 0,
   MULTIPLIER: 1,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 },
 {
  id: 'test2',
  userVisits: {
   IS_DIFF_MODE: true,
   ENABLED_SERVICES: 'all',
   ALLOWED_IDS: [],
   ACCESS_LEVEL: 1,
   IS_GIFT: false,
   KEYWORDS: []
  },
  counter: {
   title: 'いいね！',
   COUNT_MODE: 'upVote',
   TARGET_DOWN: 0,
   MULTIPLIER: 3,
   PARTY: {},
   PARTY_EVENT: '',
   PARTY_SUCCESS: ''
  }
 }
];

// 各カウンターセットに対してuseWordCounterを呼び出す
const counters = counterSets.map((counterSet) => useWordCounter(componentConfig, counterSet));
</script>
