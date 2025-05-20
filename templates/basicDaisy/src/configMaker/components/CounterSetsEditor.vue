<!-- src/apps/configMaker/components/CounterSetsEditor.vue -->
<template>
 <div class="card bg-base-200 p-4">
  <!-- ヘッダー部分 -->
  <div class="flex justify-between items-center mb-4">
   <h2 class="text-xl font-semibold">🔢カウンターセット設定 (Counter Set Settings)</h2>
   <div class="flex gap-2">
    <button v-if="isDevelopmentMode" @click="test" class="btn btn-sm btn-primary">
     test:コンソール出力
    </button>
    <button @click="addCounterSet" class="btn btn-sm btn-primary">
     <span class="mr-1">+</span> 新規カウンターセット
    </button>
   </div>
  </div>

  <!-- サンプルコンポーネントの表示 -->
  <SampleComponent
   class="flex justify-between items-center mb-4"
   :counterSets="configStore.counterSets"
   :activeTabIndex="activeTabIndex"
  />

  <!-- タブナビゲーション -->
  <CounterSetTabs
   :counterSets="configStore.counterSets"
   :activeTabIndex="activeTabIndex"
   @update:activeTabIndex="activeTabIndex = $event"
   @moveSet="moveSet"
   @duplicateSet="duplicateSet"
   @removeSet="removeSet"
  />

  <div v-if="activeSet" class="space-y-6">
   <!-- カウンター名 -->
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

   <!-- 対象コメント設定 (条件付き表示) -->
   <transition
    enter-active-class="transition-all duration-300 ease-in-out"
    enter-from-class="max-h-0 opacity-0"
    enter-to-class="max-h-96 opacity-100"
    leave-active-class="transition-all duration-300 ease-in-out"
    leave-from-class="max-h-96 opacity-100"
    leave-to-class="max-h-0 opacity-0"
   >
    <div v-if="shouldShowUserVisits" class="overflow-hidden collapse collapse-arrow bg-base-300">
     <input type="checkbox" class="peer" checked />
     <UserVisitsEditor v-model="activeSet.userVisits" :counter="activeSet.counter" />
    </div>
   </transition>

   <!-- WordParty/BOT設定 -->
   <div class="collapse collapse-arrow bg-base-300">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold">
     🎉WordParty/BOT 設定 (WordParty & BOT Settings)
    </div>
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
import { createDefaultCounterSet } from '@/schema';
import { useConfigMaker } from '../script/useConfigMaker';
import SampleComponent from './SampleComponent.vue';
import CounterConfigEditor from './CounterConfigEditor.vue';
import UserVisitsEditor from './UserVisitsEditor.vue';
import PartyEventsSettings from './PartyEventsSettings.vue';
import BotEventsSettings from './BotEventsSettings.vue';
import CounterSetTabs from './CounterSetTabs.vue';

// 開発モードかどうか
const isDevelopmentMode = ref(true);

// pinia
const configStore = useConfigMaker();
const activeTabIndex = ref(0);

// 算出プロパティ
const activeSet = computed(() =>
 activeTabIndex.value >= 0 && activeTabIndex.value < configStore.counterSets.length
  ? configStore.counterSets[activeTabIndex.value]
  : null
);

const shouldShowUserVisits = computed(() => {
 if (!activeSet.value) return false;
 const { countMode } = activeSet.value.counter;
 return !['none', 'viewer', 'upVote'].includes(countMode);
});

// メソッド
const test = () => console.log(configStore.counterSets);

const addCounterSet = () => {
 configStore.counterSets.push(createDefaultCounterSet());
 activeTabIndex.value = configStore.counterSets.length - 1;
};

const removeCurrentSet = () => {
 if (configStore.counterSets.length <= 1) return;

 configStore.counterSets.splice(activeTabIndex.value, 1);
 if (activeTabIndex.value >= configStore.counterSets.length) {
  activeTabIndex.value = configStore.counterSets.length - 1;
 }
};

const moveSet = (index: number, direction: 'left' | 'right') => {
 const isMovingLeft = direction === 'left' && index > 0;
 const isMovingRight = direction === 'right' && index < configStore.counterSets.length - 1;

 if (!isMovingLeft && !isMovingRight) return;

 const newIndex = isMovingLeft ? index - 1 : index + 1;

 // 配列の要素を交換
 const temp = configStore.counterSets[index];
 configStore.counterSets[index] = configStore.counterSets[newIndex];
 configStore.counterSets[newIndex] = temp;

 // アクティブタブの更新
 if (activeTabIndex.value === index) {
  activeTabIndex.value = newIndex;
 } else if (activeTabIndex.value === newIndex) {
  activeTabIndex.value = index;
 }
};

const duplicateSet = (index: number) => {
 const originalSet = configStore.counterSets[index];
 // ディープコピーを作成
 const newSet = JSON.parse(JSON.stringify(originalSet));
 newSet.counter.title = `${originalSet.counter.title}のコピー`;

 // 複製したセットを挿入して選択
 configStore.counterSets.splice(index + 1, 0, newSet);
 activeTabIndex.value = index + 1;
};

const removeSet = (index: number) => {
 if (configStore.counterSets.length <= 1) return;

 configStore.counterSets.splice(index, 1);
 if (activeTabIndex.value >= configStore.counterSets.length) {
  activeTabIndex.value = configStore.counterSets.length - 1;
 }
};
</script>
