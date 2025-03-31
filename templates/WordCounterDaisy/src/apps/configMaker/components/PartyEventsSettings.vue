<!-- src/apps/configMaker/components/PartyEventsSettings.vue -->
<template>
 <div class="space-y-4">
  <!-- イベント発火タイミング設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">WordParty発火タイミング</span>
   </label>
   <div class="overflow-x-auto">
    <table class="table table-compact w-full">
     <thead>
      <tr>
       <th>カウント数</th>
       <th>表示メッセージ</th>
       <th>操作</th>
      </tr>
     </thead>
     <tbody>
      <tr v-for="(message, countNum) in partyItems" :key="countNum">
       <td>
        <input
         type="number"
         :value="countNum"
         class="input input-bordered input-sm w-24"
         @change="updatePartyKey($event, countNum, message)"
        />
       </td>
       <td>
        <input
         type="text"
         :value="message"
         class="input input-bordered input-sm w-full"
         @input="updatePartyValue($event, countNum)"
        />
       </td>
       <td>
        <button class="btn btn-error btn-sm" @click="removeParty(countNum)">削除</button>
       </td>
      </tr>
      <tr>
       <td>
        <input
         type="number"
         v-model.number="newPartyCount"
         placeholder="カウント数"
         class="input input-bordered input-sm w-24"
        />
       </td>
       <td>
        <input
         type="text"
         v-model="newPartyMessage"
         placeholder="表示メッセージ"
         class="input input-bordered input-sm w-full"
        />
       </td>
       <td>
        <button class="btn btn-primary btn-sm" @click="addParty">追加</button>
       </td>
      </tr>
     </tbody>
    </table>
   </div>
  </div>

  <!-- カウント増加時イベント設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">カウント増加時のWordParty</span>
   </label>
   <input
    type="text"
    v-model="counter.PARTY_EVENT"
    placeholder="イベントメッセージ"
    class="input input-bordered w-full"
   />
   <label class="label">
    <span class="label-text-alt">カウントが増加するたびに表示されるメッセージ</span>
   </label>
  </div>

  <!-- 達成時イベント設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">目標達成時のWordParty</span>
   </label>
   <input
    type="text"
    v-model="counter.PARTY_SUCCESS"
    placeholder="達成メッセージ"
    class="input input-bordered w-full"
   />
   <label class="label">
    <span class="label-text-alt"
     >カウントダウンモードの場合、0に到達した時に表示されるメッセージ</span
    >
   </label>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import type { CounterConfig } from '@scripts/types';

const props = defineProps<{
 counter: CounterConfig;
}>();

// PARTY オブジェクトから項目を取得
const partyItems = computed(() => {
 return props.counter.PARTY || {};
});

// 新規入力用の変数
const newPartyCount = ref<number>(0);
const newPartyMessage = ref('');

// パーティイベントの追加
const addParty = () => {
 if (newPartyCount.value && newPartyMessage.value) {
  if (!props.counter.PARTY) {
   props.counter.PARTY = {};
  }
  props.counter.PARTY[newPartyCount.value] = newPartyMessage.value;
  newPartyCount.value = 0;
  newPartyMessage.value = '';
 }
};

// パーティイベントのキー（カウント数）を更新
const updatePartyKey = (event: Event, oldCount: number, message: string) => {
 const newCount = parseInt((event.target as HTMLInputElement).value);
 if (!isNaN(newCount) && newCount !== oldCount) {
  removeParty(oldCount);
  props.counter.PARTY[newCount] = message;
 }
};

// パーティイベントの値（メッセージ）を更新
const updatePartyValue = (event: Event, count: number) => {
 const newMessage = (event.target as HTMLInputElement).value;
 props.counter.PARTY[count] = newMessage;
};

// パーティイベントの削除
const removeParty = (count: number) => {
 if (props.counter.PARTY && count in props.counter.PARTY) {
  delete props.counter.PARTY[count];
 }
};
</script>
