<template>
 <div class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
   <div class="form-control w-full">
    <label class="label">
     <span class="label-text">カウンター名</span>
    </label>
    <input
     type="text"
     v-model="localCounter.title"
     class="input input-bordered w-full"
     placeholder="カウンター"
     @input="updateCounter"
    />
   </div>

   <div class="form-control w-full">
    <label class="label">
     <span class="label-text">単位</span>
    </label>
    <input
     type="text"
     v-model="localCounter.unit"
     class="input input-bordered w-full"
     placeholder="pt"
     @input="updateCounter"
    />
   </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
   <div class="form-control w-full">
    <label class="label">
     <span class="label-text">カウントモード</span>
    </label>
    <select
     v-model="localCounter.countMode"
     class="select select-bordered w-full"
     @change="updateCounter"
    >
     <option value="none">手動カウント</option>
     <option value="comment">コメント数</option>
     <option value="user">ユーザー数</option>
     <option value="syoken">初見さん</option>
     <option value="upVote">高評価数</option>
     <option value="viewer">視聴者数</option>
    </select>
   </div>

   <div class="form-control w-full">
    <label class="label">
     <span class="label-text">倍率</span>
    </label>
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

  <div class="form-control w-full">
   <label class="label">
    <span class="label-text">カウントダウン目標値</span>
    <span class="label-text-alt">0の場合はカウントアップ</span>
   </label>
   <input
    type="number"
    v-model.number="localCounter.targetCountdown"
    class="input input-bordered w-full"
    min="0"
    @input="updateCounter"
   />
  </div>

  <!-- WordParty設定 -->
  <div class="mt-4">
   <h3 class="font-medium mb-2">WordParty設定</h3>

   <div class="form-control mb-4">
    <label class="label">
     <span class="label-text">WordPartyを発火させるワード</span>
    </label>
    <input
     type="text"
     v-model="localCounter.PARTY_EVENT"
     class="input input-bordered w-full"
     placeholder="例: 「おめでとう」「party」など"
     @input="updateCounter"
    />
   </div>

   <div class="form-control mb-4">
    <label class="label">
     <span class="label-text">WordParty 成功メッセージ</span>
    </label>
    <textarea
     v-model="localCounter.PARTY_SUCCESS"
     class="textarea textarea-bordered w-full h-24"
     placeholder="例: おめでとう！パーティの発生です！"
     @input="updateCounter"
    ></textarea>
   </div>

   <!-- WordParty キーと値のペア -->
   <div class="form-control">
    <label class="label">
     <span class="label-text">WordParty キーワードと応答</span>
    </label>

    <div class="space-y-2 mb-4">
     <div v-for="(value, key) in localCounter.PARTY" :key="key" class="flex gap-2">
      <input type="text" :value="key" class="input input-bordered flex-1" disabled />
      <input
       type="text"
       :value="value"
       class="input input-bordered flex-1"
       @input="(e) => updatePartyValue(key, (e.target as HTMLInputElement).value)"
      />
      <button @click="removePartyKey(key)" class="btn btn-error btn-sm">削除</button>
     </div>
    </div>

    <div class="flex gap-2">
     <input
      type="text"
      v-model="newPartyKey"
      class="input input-bordered flex-1"
      placeholder="キーワード"
     />
     <input
      type="text"
      v-model="newPartyValue"
      class="input input-bordered flex-1"
      placeholder="応答メッセージ"
     />
     <button @click="addPartyKey" class="btn btn-primary btn-sm">追加</button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CounterConfig } from '@scripts/schema';

const props = defineProps<{
 modelValue: CounterConfig;
}>();

const emit = defineEmits<{
 (e: 'update:modelValue', value: CounterConfig): void;
}>();

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
