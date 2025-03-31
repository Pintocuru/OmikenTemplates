<!-- src/apps/configMaker/components/CounterSettings.vue -->
<template>
 <div class="space-y-4">
  <!-- カウントモード選択 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">カウントモード</span>
   </label>
   <select
    v-model="counter.COUNT_MODE"
    class="select select-bordered w-full bg-white text-gray-800"
   >
    <option value="comment">コメント数をカウント</option>
    <option value="user">ユーザー数をカウント</option>
    <option value="syoken">初見さんをカウント</option>
    <option value="total">カウンターすべての合計値</option>
   </select>
   <label class="label">
    <span class="label-text-alt">カウント対象を選択してください</span>
   </label>
  </div>

  <!-- カウントダウン設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">カウントダウン目標値</span>
   </label>
   <input
    type="number"
    v-model.number="counter.TARGET_DOWN"
    placeholder="0"
    class="input input-bordered w-full"
   />
   <label class="label">
    <span class="label-text-alt"
     >1以上に設定するとカウントダウンモードになります。0の場合はカウントアップです。</span
    >
   </label>
  </div>

  <!-- 乗数設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">カウント乗数</span>
   </label>
   <input
    type="number"
    v-model.number="counter.MULTIPLIER"
    placeholder="1"
    min="1"
    step="1"
    class="input input-bordered w-full"
   />
   <label class="label">
    <span class="label-text-alt">カウント増加時に適用される掛け算の係数です</span>
   </label>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { CounterConfig } from '@scripts/types';

const props = defineProps<{
 counter: CounterConfig;
}>();
</script>
