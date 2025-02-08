<!-- src/App.vue -->
<template>
 <VisitCounter :newComments="newComments || []" />
</template>

<script setup lang="ts">
import { CommentGet } from '@common/CommentGet';
import { ConfigType } from '@common/commonTypes';
import VisitCounter from './VisitCounter.vue';

// 定数
const config: ConfigType = {
 IS_DIFF_MODE: false, // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: window.CONFIG?.USER_ALLOWED_IDS || [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: window.CONFIG?.USER_DISALLOWED_IDS || [], // 通さないuserIDリスト
 USER_WORD_MATCH: [] // ワードによるフィルタリング
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
