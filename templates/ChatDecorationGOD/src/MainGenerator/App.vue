<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="isInitialized">
  <BasicNew :newComments="userComments" :userVisits="processedUserVisits" />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <div v-else>
  <ErrorInitComponent :pluginUid="null" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GetUserVisits, ServiceVisitType } from '@common/subscribe/GetUserVisits';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import BasicNew from './components/BasicNew.vue';
import { processUserVisits, ExtendedServiceVisitType } from './utils/userVisitProcessor';
import { getAppConfig } from './utils/config';

// リアクティブ変数
const userComments = ref<Comment[]>([]);
const processedUserVisits = ref<Record<string, ExtendedServiceVisitType>>({});
const isInitialized = ref(false);

// 設定の読み込み
const config = getAppConfig();

// GetUserVisitsコンポーザブルから取得
const { fetchComments } = GetUserVisits(config);

// 初期化処理
onMounted(async () => {
 try {
  document.body.removeAttribute('hidden');

  const isInit = await fetchComments((userVisits, comments) => {
   // コメントが空の場合、userComments / UserVisits すべて空にする
   if (!comments.length) {
    userComments.value = [];
    processedUserVisits.value = {};
    return;
   }

   // 最新のコメントタイムスタンプを確認（5秒以内のコメントがあるか）
   const now = Date.now();
   const time = new Date(comments[0].data.timestamp).getTime();
   const recentCommentsOnly = comments.length > 0 && (now - time) / 1000 <= 5;

   // コメントをリアクティブ変数に保存
   userComments.value = comments;

   // ユーザー訪問データを処理（最新コメントが5秒以内の場合のみ処理）
   if (recentCommentsOnly) {
    const processed = processUserVisits(userVisits, comments);
    if (processed) {
     processedUserVisits.value = processed;
    }
   }
  });

  isInitialized.value = isInit;
 } catch (error) {
  console.error('初期化エラー:', error);
  isInitialized.value = false;
 }
});
</script>

<style>
/* ビューポート全体を占める */
#App {
 height: 100vh;
 display: flex;
}
</style>
