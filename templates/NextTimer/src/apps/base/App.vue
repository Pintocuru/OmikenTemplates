<!-- src/App.vue -->
<template>
 <NextTimer :nextTimer="userCommentsMap.nextTimer || []" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommentGet } from '@common/CommentGet';
import { ConfigNoPlugin, ConfigType } from '@common/commonTypes';
import NextTimer from './NextTimer.vue';
import { TIME_PATTERNS } from '@/scripts/constants';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigNoPlugin;
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
