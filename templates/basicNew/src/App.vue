<!-- src/App.vue -->
<template>
 <BasicNew :newComments="newComments || []" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { GetComments } from '@common/comment/GetComments';
import { ConfigNoPlugin } from '@common/commonTypes';
import BasicNew from './BasicNew.vue';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigNoPlugin;
 }
}

// 定数
const config: ConfigNoPlugin = {
 PLUGIN_UID: null,
 IS_DIFF_MODE: false, // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: window.CONFIG?.USER_ALLOWED_IDS || [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: window.CONFIG?.USER_DISALLOWED_IDS || [], // 通さないuserIDリスト
 USER_ACCESS_LEVEL: window.CONFIG?.USER_ACCESS_LEVEL || 1,
 USER_WORD_MATCH: [] // ワードによるフィルタリング
};

// コンポーザブル
const { initOneSDK, newComments } = GetComments();

// 初期化
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 await initOneSDK(config.IS_DIFF_MODE); // コメント初期化
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
