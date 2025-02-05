<!-- src/App.vue -->
<template>
 <SuikaRanking :filterComments="filterComments || []" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommentGet } from '@common/CommentGet';
import { ConfigType } from '@common/commonTypes';
import SuikaRanking from './SuikaRanking.vue';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigType;
 }
}

// 定数
const config: ConfigType = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: window.CONFIG?.USER_ALLOWED_IDS || [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: window.CONFIG?.USER_DISALLOWED_IDS || ['FirstCounter'], // 通さないuserIDリスト
 USER_WORD_MATCH: [
  {
   id: 'suika', // スイカジェネレーター
   isGift: false, // ギフトで有効にするか
   startsWith: ['西瓜', 'すいか', 'スイカ', 'suika', 'suica', 'watermelon', '合成大西瓜']
  }
 ]
};

// コンポーザブル
const { initOneSDK, filterComments } = CommentGet(config);

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
