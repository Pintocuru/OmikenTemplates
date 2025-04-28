<!-- src/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen">
  <!-- 接続確認アイコン -->
  <div v-if="showConnectionIcon" class="absolute top-2 right-2 text-gray-400 text-xl">🔌</div>

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
   <component
    :is="getComponent(counter.counterConfig.component)"
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
import { onMounted, ref } from 'vue';
import { componentConfigSchema, counterSetSchema } from '@/scripts/schema';
import TotalCounter from './TotalCounter.vue';
import { useWordCounter } from '@scripts/useWordCounter';
import { getComponent } from '@scripts/CreateComponentMapping';
import { PingOneSDK } from '@common/api/PingOneSDK';

// わんコメ起動フラグ
const isInitApp = ref(false);
const showConnectionIcon = ref(false);

onMounted(async () => {
 isInitApp.value = await PingOneSDK();

 if (!isInitApp.value) {
  showConnectionIcon.value = true;
  setTimeout(() => {
   showConnectionIcon.value = false;
  }, 10000); // 10秒後に非表示
 }
});

// アプリケーション設定
const {
 componentConfig = componentConfigSchema.parse(undefined),
 counterSets = [counterSetSchema.parse(undefined)]
} = window || {};

// 各カウンターセットに対してuseWordCounterを呼び出す
const counters = counterSets.map((counterSet) => useWordCounter(counterSet));
</script>
