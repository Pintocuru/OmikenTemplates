<!-- src/apps/configMaker/components/PartyEventsSettings.vue -->
<template>
 <div class="collapse bg-base-200">
  <div class="collapse-title text-lg font-semibold">WordParty設定</div>
  <!-- カウント増加時イベント設定 -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
   <div class="card shadow-md p-2 bg-base-200">
    <label class="block mb-1 font-medium">カウント毎に発火するWordParty</label>
    <input
     type="text"
     v-model="modelValue.PARTY_EVENT"
     placeholder="発火ワード"
     class="input input-bordered w-full"
    />
    <label class="label"> カウントが増加するたびに発火されるWordParty </label>
   </div>

   <!-- 達成時イベント設定 -->
   <div class="card shadow-md p-2">
    <label class="block mb-1 font-medium">目標達成時のWordParty</label>
    <input
     type="text"
     v-model="modelValue.PARTY_SUCCESS"
     placeholder="発火ワード"
     class="input input-bordered w-full"
    />
    <label class="label"> カウントダウンモードの場合、0に到達した時に発火されるWordParty</label>
   </div>
  </div>

  <!-- イベント発火タイミング設定 -->
  <div class="card shadow-md p-2 bg-base-200">
   <label class="block mb-1 font-medium">特定カウント時に発火するWordParty</label>
   <div class="space-y-2 mb-3">
    <div
     v-for="(message, countNum) in modelValue.PARTY"
     :key="countNum"
     class="flex gap-2 items-center p-2 rounded shadow-sm"
    >
     <input
      type="number"
      :value="countNum"
      class="input input-bordered w-24"
      min="0"
      @change="updatePartyKey($event, countNum, message)"
     />
     <input
      type="text"
      :value="message"
      class="input input-bordered w-full"
      @input="updatePartyValue($event, countNum)"
     />
     <button class="btn btn-error btn-sm" @click="removeParty(countNum)">削除</button>
    </div>

    <!-- 新規WordParty -->
    <div class="flex gap-2 items-center p-2 rounded shadow-sm">
     <input
      type="number"
      v-model.number="newPartyCount"
      placeholder="カウント数"
      class="input input-bordered w-24"
     />
     <input
      type="text"
      v-model="newPartyMessage"
      placeholder="発火ワード"
      class="input input-bordered w-full"
     />
     <button class="btn btn-primary btn-sm" @click="addParty">追加</button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { CounterConfig } from '@scripts/schema';

const props = defineProps<{
 modelValue: CounterConfig;
}>();

// 新規入力用の変数
const newPartyCount = ref<number>(0);
const newPartyMessage = ref('');

// パーティイベントの追加
const addParty = () => {
 if (newPartyCount.value && newPartyMessage.value) {
  if (!props.modelValue.PARTY) {
   props.modelValue.PARTY = {};
  }
  props.modelValue.PARTY[newPartyCount.value] = newPartyMessage.value;
  newPartyCount.value = 0;
  newPartyMessage.value = '';
 }
};

// パーティイベントのキー（カウント数）を更新
const updatePartyKey = (event: Event, oldCount: string, message: string) => {
 const newCount = parseInt((event.target as HTMLInputElement).value);
 if (!isNaN(newCount) && newCount.toString() !== oldCount) {
  removeParty(oldCount);
  props.modelValue.PARTY[newCount] = message;
 }
};

// パーティイベントの値（メッセージ）を更新
const updatePartyValue = (event: Event, count: string) => {
 const newMessage = (event.target as HTMLInputElement).value;
 props.modelValue.PARTY[count] = newMessage;
};

// パーティイベントの削除
const removeParty = (count: string) => {
 if (props.modelValue.PARTY && count in props.modelValue.PARTY) {
  delete props.modelValue.PARTY[count];
 }
};
</script>
