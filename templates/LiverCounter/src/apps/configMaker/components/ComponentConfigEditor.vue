<!-- src/apps/configMaker/components/ComponentConfigEditor.vue -->
<template>
 <div class="card bg-base-200 p-4">
  <h2 class="text-xl font-semibold mb-4">コンポーネント設定</h2>

  <!-- レイアウト設定 -->
  <div class="mb-4">
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
     <input type="checkbox" class="toggle toggle-primary" v-model="showTotalCounter" />
    </label>
   </div>

   <div v-if="showTotalCounter" class="mt-4 p-4 bg-base-100 rounded-lg">
    <h3 class="font-medium mb-2">合計カウンター設定</h3>

    <!-- サンプルコンポーネントの表示 -->
    <component
     v-if="configStore.componentConfig.totalCounterSet"
     :is="getComponent(counterConfig.component)"
     :count="0"
     :countMax="null"
     :counterConfig="counterConfig"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
     <!-- タイトル入力 -->
     <div class="form-control w-full">
      <label class="label">
       <span class="label-text">タイトル</span>
      </label>
      <input
       type="text"
       v-model="counterConfig.title"
       class="input input-bordered w-full"
       placeholder="合計"
      />
     </div>

     <!-- 単位入力 -->
     <div class="form-control w-full">
      <label class="label">
       <span class="label-text">単位</span>
      </label>
      <input
       type="text"
       v-model="counterConfig.unit"
       class="input input-bordered w-full"
       placeholder="単位名(空白も可)"
      />
     </div>
    </div>

    <!-- カウンタースタイル選択 -->
    <div class="card bg-base-100 p-2 mt-2">
     <label class="block mb-2 font-medium">カウンタースタイル</label>
     <div class="flex flex-wrap gap-1">
      <label
       v-for="mode in componentMap"
       :key="mode"
       class="flex items-center gap-2 hover:bg-primary p-2 rounded"
      >
       <input
        type="radio"
        name="componentTotal"
        class="radio radio-xs"
        :value="mode"
        v-model="counterConfig.component"
       />
       <span>{{ mode }}</span>
      </label>
     </div>
    </div>

    <!-- カウンターカラー選択 -->
    <div class="card bg-base-100 p-2 mt-2">
     <label class="block mb-2 font-medium">カウンターカラー</label>
     <div class="flex flex-wrap gap-1">
      <label
       v-for="mode in TAILWIND_COLORS"
       :key="mode"
       class="flex items-center gap-2 hover:bg-primary p-2 rounded"
      >
       <input
        type="radio"
        name="typeColorTotal"
        class="radio radio-xs"
        :value="mode"
        v-model="counterConfig.typeColor"
       />
       <span>{{ mode }}</span>
      </label>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CounterConfig, TAILWIND_COLORS, createDefaultCounterSet } from '@scripts/schema';
import { getComponent } from '@scripts/CreateComponentMapping';
import { componentMap } from '@scripts/schema';
import { useConfigMaker } from './useConfigMaker';

// ストア全体を参照
const configStore = useConfigMaker();

// 合計カウンター設定の操作用変数
const counterConfig = ref<CounterConfig>(
 configStore.componentConfig.totalCounterSet || createDefaultCounterSet().counter
);

// 合計カウンターの表示切替 (null許容の型対応)
const showTotalCounter = computed({
 get: () => !!configStore.componentConfig.totalCounterSet,
 set: (value) => {
  if (value) {
   // チェックされたときは、現在の counterConfig の値でストアを更新
   configStore.componentConfig.totalCounterSet = { ...counterConfig.value };
  } else {
   // チェックが外されたときは null に設定
   configStore.componentConfig.totalCounterSet = null;
  }
 }
});

// 設定変更時にストアを更新
watch(
 counterConfig,
 () => {
  if (showTotalCounter.value) {
   configStore.componentConfig.totalCounterSet = { ...counterConfig.value };
  }
 },
 { deep: true }
);

// 逆方向の同期: ストアの値が変わったときに counterConfig を更新
watch(
 () => configStore.componentConfig.totalCounterSet,
 (newValue) => {
  if (newValue) {
   // 新しい値でcounterConfigを更新（ただしnullの場合は更新しない）
   Object.assign(counterConfig.value, newValue);
  }
 },
 { deep: true }
);
</script>
