<!-- src/App.vue -->
<template>
 <BasicNew :newComments="newComments || []" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommentGet } from '@common/CommentGet';
import { ConfigType } from '@common/commonTypes';
import BasicNew from './BasicNew.vue';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigType;
 }
}

// 定数
const config: ConfigType = {
 PLUGIN_UID: null, // 使用しているプラグイン名
 IS_DIFF_MODE: false, // 差分モードにするか(true:'diff',false:'all')
 BOT_USER_ID: null, // プラグインのuserId
 ALLOWED_USER_IDS: window.CONFIG?.ALLOWED_USER_IDS || [], // 通すuserIDリスト
 DISALLOWED_USER_IDS: window.CONFIG?.DISALLOWED_USER_IDS || [], // 通さないuserIDリスト
 FILTERS: []
};

// コンポーザブル
const { initOneSDK, newComments } = CommentGet(config);

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
