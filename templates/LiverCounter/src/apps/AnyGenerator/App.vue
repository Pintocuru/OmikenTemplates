<!-- src/App.vue -->
<template>
 <div class="relative flex flex-col items-center justify-center h-screen">
  <!-- 接続モードバッジ -->
  <div
   v-if="connectionStatus"
   class="absolute top-4 left-4 transition-opacity duration-1000"
   :class="[
    showBadge ? 'opacity-100' : 'opacity-0',
    'bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm shadow-md'
   ]"
  >
   <span v-if="connectionStatus === 'standalone'">🚫 わんコメなしモード</span>
   <span v-else-if="connectionStatus === 'onecomme'">🐶 わんコメありモード</span>
  </div>

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

// わんコメ接続状態
const connectionStatus = ref<'onecomme' | 'standalone' | null>(null);
const showBadge = ref(false);

onMounted(async () => {
 const result = await PingOneSDK();
 connectionStatus.value = result ? 'onecomme' : 'standalone';

 showBadge.value = true;
 setTimeout(() => {
  showBadge.value = false;
 }, 10000); // 10秒間だけ表示

 // すべてのカウンターの初期化関数を実行
 counters.forEach((counter) => {
  if (counter.initialize) {
   counter.initialize();
  }
 });
});

// アプリケーション設定
const {
 componentConfig = componentConfigSchema.parse(undefined),
 counterSets = [counterSetSchema.parse(undefined)]
} = window || {};

// 各カウンターセットに対してuseWordCounterを呼び出す
const counters = counterSets.map((counterSet) => useWordCounter(counterSet));
</script>
