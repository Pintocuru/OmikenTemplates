<!-- src/apps/configMaker/components/CounterConfigEditor.vue -->
<template>
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

  <!-- WordParty設定 -->
  <div class="bg-base-200 p-3 rounded-lg">
   <h3 class="font-medium mb-2 text-lg">WordParty設定</h3>

   <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
    <div class="form-control">
     <label class="block mb-1 font-medium">カウント毎に発火するWordParty</label>
     <input
      type="text"
      v-model="localCounter.PARTY_EVENT"
      class="input input-bordered w-full"
      placeholder="発火ワード"
      @input="updateCounter"
     />
    </div>

    <div class="form-control">
     <label class="block mb-1 font-medium">目標達成時に発火するWordParty</label>
     <input
      type="text"
      v-model="localCounter.PARTY_SUCCESS"
      class="input input-bordered w-full"
      placeholder="発火ワード"
      @input="updateCounter"
     />
    </div>
   </div>

   <div class="form-control mt-4">
    <label class="block mb-1 font-medium">特定カウント時に発火するWordParty</label>

    <div class="space-y-2 mb-3">
     <div
      v-for="(value, key) in localCounter.PARTY"
      :key="key"
      class="flex gap-2 items-center bg-base-300 p-2 rounded shadow-sm"
     >
      <span class="text-sm font-medium w-20">{{ key }}:</span>
      <input
       type="text"
       :value="value"
       class="input input-bordered input-sm flex-1"
       @input="(e) => updatePartyValue(key, (e.target as HTMLInputElement).value)"
      />
      <button @click="removePartyKey(key)" class="btn btn-error btn-xs">削除</button>
     </div>
    </div>

    <div class="flex gap-2 items-center bg-base-300 p-2 rounded shadow-sm">
     <input
      type="number"
      :min="0"
      v-model="newPartyKey"
      class="input input-bordered input-sm flex-1"
      placeholder="カウント値"
     />
     <input
      type="text"
      v-model="newPartyValue"
      class="input input-bordered input-sm flex-1"
      placeholder="発火ワード"
     />
     <button @click="addPartyKey" class="btn btn-primary btn-xs">追加</button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { CounterConfig, CountType } from '@scripts/schema';

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

// WordParty追加用の一時変数
const newPartyKey = ref('');
const newPartyValue = ref('');

// propsの変更を監視して、ローカルの状態を更新
watch(
 () => props.modelValue,
 (newValue) => {
  localCounter.value = { ...newValue };
 },
 { deep: true }
);

// カウントモード選択
const selectCountMode = (mode: CountType) => {
 localCounter.value.countMode = mode;
 updateCounter();
};

// カウンター設定の更新
const updateCounter = () => {
 emit('update:modelValue', { ...localCounter.value });
};

// WordPartyキーの追加
const addPartyKey = () => {
 if (newPartyKey.value && newPartyValue.value) {
  localCounter.value.PARTY = {
   ...localCounter.value.PARTY,
   [newPartyKey.value]: newPartyValue.value
  };

  newPartyKey.value = '';
  newPartyValue.value = '';

  updateCounter();
 }
};

// WordPartyキーの値を更新
const updatePartyValue = (key: string, value: string) => {
 localCounter.value.PARTY = {
  ...localCounter.value.PARTY,
  [key]: value
 };

 updateCounter();
};

// WordPartyキーの削除
const removePartyKey = (key: string) => {
 const newParty = { ...localCounter.value.PARTY };
 delete newParty[key];

 localCounter.value.PARTY = newParty;
 updateCounter();
};
</script>
