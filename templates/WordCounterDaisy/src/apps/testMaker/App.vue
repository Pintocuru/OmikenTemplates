<!-- src/apps/maker/App.vue -->
<template>
 <div class="flex flex-col items-center justify-center h-screen space-y-4">
  <AnyGenerator
   :count="counter1.count.value"
   :generator="counterSet.generator"
   @click.prevent="counter1.increment"
   @contextmenu.prevent="counter1.decrement"
  />
 </div>
</template>

<script setup lang="ts">
import { CounterSet } from '@/scripts/types';
import AnyGenerator from './BasicCounter.vue';
import { useWordCounter } from '@scripts/useWordCounter';

// testData
const counterSet: CounterSet = {
 id: 'test',
 userVisits: {
  IS_DIFF_MODE: false, // 差分モードにするか(true:'diff',false:'all')
  ENABLED_SERVICES: ['platforms'], // 'platforms' またはサービスリスト
  ALLOWED_IDS: [], // 通すユーザーIDリスト(!IDでネガティブ)
  ACCESS_LEVEL: 1, // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
  IS_GIFT: false, // ギフトで有効にするか
  KEYWORDS: [] // isGiftがfalseなら、このコメントで判定(正規表現)
 },
 generator: {
  title: '初見さん', // 項目名
  theme: 'dark', // テーマ
  colorMode: 'primary', // 色モード
  scale: 1 // 倍率
 },
 counter: {
  COUNT_MODE: 'comment',
  TARGET_DOWN: 0, // 1以上ある場合、カウントダウンモードになる
  MULTIPLIER: 1, // 振る舞いに掛け算を適用する場合の乗数
  PARTY: {}, // WordPartyの発火タイミング
  PARTY_EVENT: '', // カウント増加時に発火するWordParty
  PARTY_SUCCESS: '' // TARGET_COUNT達成時に発火するWordParty
 }
};

// useWordCounter
const counter1 = useWordCounter(counterSet);
</script>
