<!-- App.vue -->
<template>
 <div v-if="isInitFlag">
  <MessageMain :botComments="botCommentsMap.main || []" />
  <MessageToast :botComments="botCommentsMap.toast || []" />
 </div>
 <!-- App.vue -->
 <div v-else>
  <ErrorInitComponent :config="config" />
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommentGet } from '@common/CommentGet';
import { ConfigType } from '@common/commonTypes';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';
import MessageMain from './MessageMain.vue';
import MessageToast from './MessageToast.vue';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigType;
 }
}

// 定数
const config: ConfigType = {
 PLUGIN_UID: window.CONFIG?.PLUGIN_UID || 'OmikenPlugin01', // 使用しているプラグイン名
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 BOT_USER_ID: 'FirstCounter', // プラグインのuserId
 ALLOWED_USER_IDS: window.CONFIG?.ALLOWED_USER_IDS || [], // 通すuserIDリスト
 DISALLOWED_USER_IDS: window.CONFIG?.DISALLOWED_USER_IDS || [], // 通さないuserIDリスト
 FILTERS: [
  {
   // main
   id: 'main',
   POST_PARAM: [], // postが特定のparamのときに表示
   NON_POST_PARAM: ['toast'] // POST_PARAMが空の時、postが特定のparamではないときに表示
  },
  {
   // toast
   id: 'toast',
   POST_PARAM: ['toast'], // postが特定のparamのときに表示
   NON_POST_PARAM: [] // POST_PARAMが空の時、postが特定のparamではないときに表示
  }
 ]
};

// コンポーザブル
const { isInitFlag, initOneSDK, getBotComments, botCommentsMap } = CommentGet(config);

// 初期化
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 await initOneSDK(); // コメント初期化
 getBotComments(config.FILTERS); // Botコメントを抽出
});
</script>
