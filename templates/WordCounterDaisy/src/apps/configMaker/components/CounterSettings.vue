<!-- src/apps/configMaker/components/CounterSettings.vue -->
<template>
 <div class="space-y-6">
  <!-- カウントモード選択 -->
  <div class="card shadow-md p-2">
   <label class="label font-medium pb-1">カウントモード </label>
   <div class="flex flex-row space-x-4">
    <label
     v-for="(label, mode) in countModes"
     :key="mode"
     class="flex items-center space-x-2"
     :class="{ 'text-primary': counter.COUNT_MODE === mode }"
    >
     <input type="radio" :value="mode" v-model="counter.COUNT_MODE" class="radio radio-bordered" />
     <span class="text-sm">{{ label }}</span>
    </label>
   </div>
  </div>

  <!-- カウントダウン設定と乗数設定を横並びに -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
   <!-- カウントダウン設定 -->
   <div class="card shadow-md p-2">
    <label class="label font-medium pb-1"> カウントダウン目標値 </label>
    <input
     type="number"
     v-model.number="counter.TARGET_DOWN"
     placeholder="0"
     min="0"
     class="input input-bordered w-full"
    />
    <label class="label py-1 text-sm"> 1以上でカウントダウン、0でカウントアップ </label>
   </div>

   <!-- 乗数設定 -->
   <div class="card shadow-md p-2">
    <label class="label font-medium pb-1"> カウント乗数 </label>
    <input
     type="number"
     v-model.number="counter.MULTIPLIER"
     placeholder="1"
     min="1"
     step="1"
     class="input input-bordered w-full"
    />
    <label class="label py-1 text-sm">カウント増加時の掛け算係数 </label>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { CounterConfig } from '@scripts/types';

const props = defineProps<{
 counter: CounterConfig;
}>();

const countModes = {
 comment: 'コメント数',
 user: 'ユーザー数',
 syoken: '初見さん',
 total: 'カウンター合計値'
};
</script>
