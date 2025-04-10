<!-- src/apps/configMaker/components/CounterConfigEditor.vue -->
<template>
 <div class="collapse-title text-lg font-semibold">カウンター設定</div>
 <div class="collapse-content">
  <div class="p-4 space-y-4">
   <div class="mb-4">
    <label class="block mb-2 font-medium">カウントモード</label>
    <div class="flex flex-wrap gap-2">
     <label
      v-for="mode in countModes"
      :key="mode.value"
      class="flex items-center gap-2 hover:bg-base-300 p-2 rounded"
     >
      <input
       type="radio"
       name="countMode"
       class="radio radio-xs"
       :value="mode.value"
       v-model="localCounter.countMode"
      />
      <span>{{ mode.label }}</span>
     </label>
    </div>
    <p v-if="selectedMode" class="mt-2 text-sm p-2 bg-base-300 rounded">
     {{ selectedMode.description }}
    </p>
   </div>

   <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div class="form-control">
     <label class="block mb-1 font-medium">カウント目標値</label>
     <div class="flex items-center">
      <input
       type="number"
       v-model.number="localCounter.targetCountdown"
       class="input input-bordered w-full"
       min="0"
       @input="updateCounter"
      />
      <span class="text-xs ml-2 text-gray-500">0でカウントアップ</span>
     </div>
    </div>

    <div class="form-control">
     <label class="block mb-1 font-medium">単位名</label>
     <input
      type="text"
      v-model="localCounter.unit"
      class="input input-bordered w-full"
      placeholder="単位名(空白も可)"
      @input="updateCounter"
     />
    </div>

    <div class="form-control">
     <label class="block mb-1 font-medium">倍率(合計カウンター使用時のみ適用)</label>
     <input
      type="number"
      v-model.number="localCounter.multiplier"
      class="input input-bordered w-full"
      min="0.1"
      step="0.1"
      @input="updateCounter"
     />
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { CounterConfig } from '@scripts/schema';

const props = defineProps<{
 modelValue: CounterConfig;
}>();

const emit = defineEmits<{
 (e: 'update:modelValue', value: CounterConfig): void;
}>();

// カウントモードの定義
const countModes = [
 {
  value: 'none',
  label: '手動カウント',
  description: '手動でカウンターを増減させるモード。'
 },
 {
  value: 'comment',
  label: 'コメント数',
  description: '「対象コメント設定」でフィルタリングしたコメント数をカウント。'
 },
 {
  value: 'user',
  label: 'ユーザー数',
  description: '「対象コメント設定」でフィルタリングしたコメントを発言したユーザー数をカウント。'
 },
 {
  value: 'syoken',
  label: '初見さん',
  description: '配信で初めてコメントをしたユーザー数をカウント。'
 },
 {
  value: 'upVote',
  label: '高評価数',
  description: '配信の高評価数をカウント。合計カウンター有効時は、最大値を参照します。'
 },
 {
  value: 'viewer',
  label: '視聴者数',
  description: '配信の視聴者数をカウント。合計カウンター有効時は、最大値を参照します。'
 }
];

// 選択されているモードの詳細情報を取得
const selectedMode = computed(() => {
 return countModes.find((mode) => mode.value === localCounter.value.countMode);
});

// ローカルの状態
const localCounter = ref<CounterConfig>({ ...props.modelValue });

// propsの変更を監視して、ローカルの状態を更新
watch(
 () => props.modelValue,
 (newValue) => {
  localCounter.value = { ...newValue };
 },
 { deep: true }
);

// カウンター設定の更新
const updateCounter = () => {
 emit('update:modelValue', { ...localCounter.value });
};
</script>
