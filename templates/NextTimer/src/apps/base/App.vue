<!-- src/App.vue -->
<template>
 <NextTimer :nextTimer="userCommentsMap.nextTimer || []" :timeConfig="timeConfig" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommentGet } from '@common/CommentGet';
import { ConfigNoPlugin, ConfigType } from '@common/commonTypes';
import NextTimer from './NextTimer.vue';
import { TIME_PATTERNS } from '@/scripts/constants';
import { NextTimerConfigType } from '@/scripts/types';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigNoPlugin;
  TIME_CONFIG?: NextTimerConfigType;
 }
}

// 定数
const config: ConfigType = {
 PLUGIN_UID: null, // プラグインなし
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: window.CONFIG?.USER_ALLOWED_IDS || [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: window.CONFIG?.USER_DISALLOWED_IDS || [], // 通さないuserIDリスト
 USER_ACCESS_LEVEL: window.CONFIG?.USER_ACCESS_LEVEL || 1, // アクセスレベル
 USER_WORD_MATCH: [
  {
   id: 'nextTimer',
   isGift: false,
   keywords: [],
   regex: [TIME_PATTERNS.absolute, TIME_PATTERNS.relative]
  }
 ]
};

// スナイプタイマー用設定
const timeConfig: NextTimerConfigType = {
 ALWAYS_VISIBLE: window.TIME_CONFIG?.ALWAYS_VISIBLE || false, // 常時表示させるか
 AFTER_SHOW: window.TIME_CONFIG?.AFTER_SHOW || 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: window.TIME_CONFIG?.SECOND_ADJUST || 10, // 秒数を丸める(default=10秒単位)
 COUNT_PARTY: window.TIME_CONFIG?.COUNT_PARTY || {}, // WordPartyの発火タイミング
 COUNT_PARTY_START: window.TIME_CONFIG?.COUNT_PARTY_START || '', // タイマー起動時に発火するWordParty
 COUNT_PARTY_FINISH: window.TIME_CONFIG?.COUNT_PARTY_FINISH || '' // タイマー0で発火するWordParty
};

// コンポーザブル
const { initOneSDK, userCommentsMap } = CommentGet();

// 初期化
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 await initOneSDK(config); // コメント初期化
});
</script>

<style>
/* ビューポート全体を占める */
#App {
 height: 100vh;
 display: flex;
 flex-direction: column;
}
</style>
