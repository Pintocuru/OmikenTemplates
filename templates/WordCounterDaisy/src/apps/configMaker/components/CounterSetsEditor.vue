<!-- src/apps/configMaker/components/CounterSetsEditor.vue -->
<template>
 <div class="card bg-base-200 p-4">
  <div class="flex justify-between items-center mb-4">
   <h2 class="text-xl font-semibold">カウンターセット設定</h2>
   <button @click="addCounterSet" class="btn btn-sm btn-primary">
    <span class="mr-1">+</span> 新規カウンターセット
   </button>
  </div>

  <div class="mb-4">
   <div class="flex gap-4">
    <button
     v-for="(set, index) in configStore.counterSets"
     :key="`counter-set-${index}`"
     :class="['btn btn-lg ', activeTabIndex === index ? 'btn-primary' : 'btn-outline']"
     @click="activeTabIndex = index"
    >
     {{ index + 1 }}: {{ set.counter.title }}
    </button>
   </div>
  </div>

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

   <div class="collapse collapse-arrow bg-base-300">
    <input type="checkbox" class="peer" />
    <UserVisitsEditor v-model="activeSet.userVisits" />
   </div>

   <div class="collapse collapse-arrow bg-base-300">
    <input type="checkbox" class="peer" />
    <PartyEventsSettings v-model="activeSet.counter" />
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
import CounterConfigEditor from './CounterConfigEditor.vue';
import UserVisitsEditor from './UserVisitsEditor.vue';
import PartyEventsSettings from './PartyEventsSettings.vue';

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
</script>
