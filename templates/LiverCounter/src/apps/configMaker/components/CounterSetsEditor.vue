<!-- src/apps/configMaker/components/CounterSetsEditor.vue -->
<template>
 <div class="card bg-base-200 p-4">
  <div class="flex justify-between items-center mb-4">
   <h2 class="text-xl font-semibold">カウンターセット設定</h2>
   <button @click="addCounterSet" class="btn btn-sm btn-primary">
    <span class="mr-1">+</span> 新規カウンターセット
   </button>
  </div>

  <!-- サンプルコンポーネントの表示 -->
  <SampleComponent
   class="flex justify-between items-center mb-4"
   :counterSets="configStore.counterSets"
   :activeTabIndex="activeTabIndex"
  />

  <!-- タブナビゲーション部分をコンポーネント化 -->
  <CounterSetTabs
   :counterSets="configStore.counterSets"
   :activeTabIndex="activeTabIndex"
   @update:activeTabIndex="activeTabIndex = $event"
   @moveSet="moveSet"
   @duplicateSet="duplicateSet"
   @removeSet="removeSet"
  />

  <div v-if="activeSet" class="space-y-6">
   <div class="form-control w-full">
    <label class="block mb-1 font-medium">カウンター名</label>
    <div class="flex gap-2">
     <input type="text" v-model="activeSet.counter.title" class="input input-bordered w-full" />
     <button
      v-if="configStore.counterSets.length > 1"
      @click="removeCurrentSet"
      class="btn btn-error"
     >
      削除
     </button>
    </div>
   </div>

   <!-- カウンター設定 -->
   <div class="collapse collapse-arrow bg-base-300">
    <input type="checkbox" class="peer" checked />
    <CounterConfigEditor v-model="activeSet.counter" />
   </div>

   <!-- 対象コメント設定 -->
   <transition
    enter-active-class="transition-all duration-300 ease-in-out"
    enter-from-class="max-h-0 opacity-0"
    enter-to-class="max-h-96 opacity-100"
    leave-active-class="transition-all duration-300 ease-in-out"
    leave-from-class="max-h-96 opacity-100"
    leave-to-class="max-h-0 opacity-0"
   >
    <div
     v-if="
      activeSet.counter.countMode !== 'none' &&
      activeSet.counter.countMode !== 'viewer' &&
      activeSet.counter.countMode !== 'upVote'
     "
     class="overflow-hidden collapse collapse-arrow bg-base-300"
    >
     <input type="checkbox" class="peer" checked />
     <UserVisitsEditor v-model="activeSet.userVisits" :counter="activeSet.counter" />
    </div>
   </transition>

   <!-- WordParty/BOT設定 -->
   <div class="collapse collapse-arrow bg-base-300">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold">WordParty/BOT設定</div>
    <div class="collapse-content flex flex-col gap-4">
     <PartyEventsSettings v-model="activeSet.counter" />
     <BotEventsSettings v-model="activeSet.counter" />
    </div>
   </div>
  </div>

  <div v-else class="alert alert-error">
   カウンターセットが選択されていません (上記のタブを選択してください)
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConfigMaker } from './useConfigMaker';
import SampleComponent from './SampleComponent.vue';
import CounterConfigEditor from './CounterConfigEditor.vue';
import UserVisitsEditor from './UserVisitsEditor.vue';
import PartyEventsSettings from './PartyEventsSettings.vue';
import BotEventsSettings from './BotEventsSettings.vue';
import CounterSetTabs from './CounterSetTabs.vue';

import { createDefaultCounterSet } from '@/scripts/schema';

const configStore = useConfigMaker();
const activeTabIndex = ref(0);

const activeSet = computed(() => {
 return activeTabIndex.value >= 0 && activeTabIndex.value < configStore.counterSets.length
  ? configStore.counterSets[activeTabIndex.value]
  : null;
});

const addCounterSet = () => {
 const newSet = createDefaultCounterSet();
 configStore.counterSets.push(newSet);
 activeTabIndex.value = configStore.counterSets.length - 1;
};

const removeCurrentSet = () => {
 if (configStore.counterSets.length <= 1) return;
 configStore.counterSets.splice(activeTabIndex.value, 1);
 if (activeTabIndex.value >= configStore.counterSets.length) {
  activeTabIndex.value = configStore.counterSets.length - 1;
 }
};

// セットの移動機能
const moveSet = (index: number, direction: 'left' | 'right') => {
 if (direction === 'left' && index > 0) {
  const temp = configStore.counterSets[index];
  configStore.counterSets[index] = configStore.counterSets[index - 1];
  configStore.counterSets[index - 1] = temp;

  // アクティブなタブが移動対象なら、選択位置も更新
  if (activeTabIndex.value === index) {
   activeTabIndex.value = index - 1;
  } else if (activeTabIndex.value === index - 1) {
   activeTabIndex.value = index;
  }
 } else if (direction === 'right' && index < configStore.counterSets.length - 1) {
  const temp = configStore.counterSets[index];
  configStore.counterSets[index] = configStore.counterSets[index + 1];
  configStore.counterSets[index + 1] = temp;

  // アクティブなタブが移動対象なら、選択位置も更新
  if (activeTabIndex.value === index) {
   activeTabIndex.value = index + 1;
  } else if (activeTabIndex.value === index + 1) {
   activeTabIndex.value = index;
  }
 }
};

// セットの複製機能
const duplicateSet = (index: number) => {
 const originalSet = configStore.counterSets[index];
 const newSet = JSON.parse(JSON.stringify(originalSet)); // ディープコピー

 // タイトルに「のコピー」を追加
 newSet.counter.title = `${originalSet.counter.title}のコピー`;

 // 複製したセットを元のセットの後ろに挿入
 configStore.counterSets.splice(index + 1, 0, newSet);
 activeTabIndex.value = index + 1; // 複製したセットを選択
};

// インデックスを指定してセットを削除
const removeSet = (index: number) => {
 if (configStore.counterSets.length <= 1) return;

 configStore.counterSets.splice(index, 1);

 // 削除後にアクティブタブの位置を調整
 if (activeTabIndex.value >= configStore.counterSets.length) {
  activeTabIndex.value = configStore.counterSets.length - 1;
 }
};
</script>
