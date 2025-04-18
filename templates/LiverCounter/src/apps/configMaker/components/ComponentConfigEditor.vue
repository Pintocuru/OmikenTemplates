<template>
 <div class="card bg-base-200 p-4">
  <h2 class="text-xl font-semibold mb-4">コンポーネント設定</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
   <!-- カラー選択 -->
   <div class="form-control w-full">
    <label class="block mb-1 font-medium">メインカラー</label>
    <select v-model="configStore.componentConfig.color" class="select select-bordered w-full">
     <option v-for="color in TAILWIND_COLORS" :key="color" :value="color">
      {{ color }}
     </option>
    </select>
   </div>

   <!-- レイアウト設定 -->
   <div class="form-control w-full">
    <label class="block mb-1 font-medium">レイアウト</label>
    <div class="flex items-center gap-4">
     <label class="flex items-center cursor-pointer">
      <input
       type="radio"
       class="radio radio-primary"
       :value="true"
       v-model="configStore.componentConfig.isHorizontalLayout"
      />
      <span class="ml-2">横並び</span>
     </label>
     <label class="flex items-center cursor-pointer">
      <input
       type="radio"
       class="radio radio-primary"
       :value="false"
       v-model="configStore.componentConfig.isHorizontalLayout"
      />
      <span class="ml-2">縦並び</span>
     </label>
    </div>
   </div>
  </div>

  <!-- 合計カウンター設定 -->
  <div class="mt-4">
   <div class="form-control">
    <label class="label font-medium cursor-pointer justify-start gap-4">
     <span class="label-text">合計カウンターを表示</span>
     <input
      type="checkbox"
      class="toggle toggle-primary"
      v-model="showTotalCounter"
      @change="updateTotalCounter"
     />
    </label>
   </div>

   <div v-if="showTotalCounter" class="mt-4 p-4 bg-base-100 rounded-lg">
    <h3 class="font-medium mb-2">合計カウンター設定</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
     <div class="form-control w-full">
      <label class="label">
       <span class="label-text">タイトル</span>
      </label>
      <input
       type="text"
       v-model="totalCounter.title"
       class="input input-bordered w-full"
       placeholder="合計"
       @input="updateTotalCounter"
      />
     </div>

     <div class="form-control w-full">
      <label class="label">
       <span class="label-text">単位</span>
      </label>
      <input
       type="text"
       v-model="totalCounter.unit"
       class="input input-bordered w-full"
       placeholder="単位名(空白も可)"
       @input="updateTotalCounter"
      />
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CounterConfig, TAILWIND_COLORS } from '@scripts/schema';
import { useConfigMaker } from './useConfigMaker';

// ストア全体を参照
const configStore = useConfigMaker();

// 合計カウンター設定
const totalCounter = ref<CounterConfig>({
 title: '合計',
 unit: 'pt',
 countMode: 'none',
 targetCountdown: 0,
 multiplier: 1,
 PARTY: {},
 PARTY_EVENT: '',
 PARTY_SUCCESS: ''
});

// 初期値の設定
if (configStore.componentConfig.totalCounterSet) {
 totalCounter.value = { ...configStore.componentConfig.totalCounterSet };
}

// 合計カウンターの表示切替
const showTotalCounter = computed({
 get: () => !!configStore.componentConfig.totalCounterSet,
 set: (value) => {
  if (value) {
   configStore.componentConfig.totalCounterSet = { ...totalCounter.value };
  } else {
   configStore.componentConfig.totalCounterSet = null;
  }
 }
});

// 合計カウンターを更新
const updateTotalCounter = () => {
 if (showTotalCounter.value) {
  configStore.componentConfig.totalCounterSet = { ...totalCounter.value };
 } else {
  configStore.componentConfig.totalCounterSet = null;
 }
};
</script>
