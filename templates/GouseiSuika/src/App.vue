<!-- src/App.vue -->
<template>
 <div v-if="isInitFlag">
  <SuikaRanking :filterComments="filterComments || []" :config="isPlugin ? config2 : config" />
 </div>
 <!-- App.vue -->
 <div v-else>
  <ErrorInitComponent :config="isPlugin ? config2 : config" />
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommentGet } from '@common/CommentGet';
import { ConfigType } from '@common/commonTypes';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';
import SuikaRanking from './SuikaRanking.vue';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigType;
 }
}

// プラグインスイッチ
const isPlugin = true;

// 定数
const config: ConfigType = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: window.CONFIG?.USER_ALLOWED_IDS || [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: window.CONFIG?.USER_DISALLOWED_IDS || ['FirstCounter'], // 通さないuserIDリスト
 USER_WORD_MATCH: [
  {
   id: 'suika', // スイカジェネレーター
   isGift: false, // ギフトで有効にするか
   keywords: ['西瓜', 'すいか', 'スイカ', 'suika', 'suica', 'watermelon', '合成大西瓜']
  }
 ]
};

// プラグイン併用の場合
const config2: ConfigType = {
 PLUGIN_UID: window.CONFIG?.PLUGIN_UID || 'OmikenPlugin02', // 使用しているプラグイン名
 PLUGIN_RULE_ID: window.CONFIG?.PLUGIN_RULE_ID || 'GouseiSuika', // 該当するRulesのid
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 BOT_USER_ID: 'FirstCounter', // プラグインのuserId
 BOT_PARAM_FILTERS: [
  {
   // main
   id: 'suika',
   POST_PARAM: ['suika'], // postが特定のparamのときに表示
   NON_POST_PARAM: [] // POST_PARAMが空の時、postが特定のparamではないときに表示
  }
 ],
 USER_STATUS_FILTERS: []
};

// コンポーザブル
const { isInitFlag, initOneSDK, filterComments } = CommentGet(isPlugin ? config2 : config);

// 初期化
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 await initOneSDK(); // コメント初期化
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
