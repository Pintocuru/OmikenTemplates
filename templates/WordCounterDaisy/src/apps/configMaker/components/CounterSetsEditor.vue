<!-- src/apps/configMaker/components/CounterSetsEditor.vue -->
<template>
 <div class="bg-base-200 p-4 rounded-lg">
  <div class="flex justify-between items-center mb-4">
   <h2 class="text-xl font-semibold">カウンターセット設定</h2>
   <button @click="addCounterSet" class="btn btn-sm btn-primary">
    <span class="mr-1">+</span> 新規カウンターセット
   </button>
  </div>

  <div class="mb-4">
   <div class="flex gap-4">
    <button
     v-for="(set, index) in localCounterSets"
     :key="`random-${index}`"
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
     <button v-if="localCounterSets.length > 1" @click="removeCurrentSet" class="btn btn-error">
      削除
     </button>
    </div>
   </div>

   <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" class="peer" checked />
    <div class="collapse-title text-lg font-semibold">カウンター設定</div>
    <div class="collapse-content">
     <CounterConfigEditor v-model="activeSet.counter" />
    </div>
   </div>

   <div class="collapse collapse-arrow bg-base-100">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold">対象コメント設定</div>
    <div class="collapse-content">
     <UserVisitsEditor v-model="activeSet.userVisits" />
    </div>
   </div>
  </div>

  <div v-else class="alert alert-error">カウンターセットが選択されていません</div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConfigMaker } from './useConfigMaker';
import CounterConfigEditor from './CounterConfigEditor.vue';
import UserVisitsEditor from './UserVisitsEditor.vue';
import { CounterSet, createDefaultCounterSet } from '@/scripts/schema';

const configStore = useConfigMaker();
const localCounterSets = configStore.counterSets;

const activeTabIndex = ref(0);

const activeSet = computed(() => {
 return activeTabIndex.value >= 0 && activeTabIndex.value < localCounterSets.length
  ? localCounterSets[activeTabIndex.value]
  : null;
});

const addCounterSet = () => {
 const newSet: CounterSet = createDefaultCounterSet();

 localCounterSets.push(newSet);
 activeTabIndex.value = localCounterSets.length - 1;
};

const removeCurrentSet = () => {
 if (localCounterSets.length <= 1) return;
 localCounterSets.splice(activeTabIndex.value, 1);
 if (activeTabIndex.value >= localCounterSets.length) {
  activeTabIndex.value = localCounterSets.length - 1;
 }
};
</script>
