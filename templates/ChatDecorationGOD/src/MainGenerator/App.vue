<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="isInitialized">
  <BasicNew :GodComments="GodComments" />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <div v-else>
  <ErrorInitComponent :pluginUid="null" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { CommentGod } from '@/types';
import { getAppConfig } from './utils/config';
import BasicNew from './components/BasicNew.vue';
import { CommentProcessor } from './utils/commentProcessor';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';
import { ThemeType } from '@common/DaisyUi/DaisyUiTheme';

// リアクティブ変数
const GodComments = ref<CommentGod[]>([]);
const isInitialized = ref(true);
const theme: Ref<ThemeType> = ref('light');

// 設定の読み込み
const config = getAppConfig();

// GetUserVisitsコンポーザブルから取得
const { fetchComments } = GetUserVisits(config);

// CommentProcessorインスタンスを作成（一度だけ）
const processor = new CommentProcessor();

// 初期化処理
onMounted(async () => {
 try {
  // 初期テーマを手動で設定
  document.documentElement.setAttribute('data-theme', theme.value);

  const isInit = await fetchComments((userVisits, comments) => {
   if (!comments.length) {
    GodComments.value = [];
    return;
   }

   // コメントを抽選結果付きで処理
   const processedComments = processor.processComments(userVisits, comments);

   // 既存のコメントに新しい処理済みコメントを追加
   GodComments.value = [...GodComments.value, ...processedComments];
  });

  isInitialized.value = isInit;
 } catch (error) {
  console.error('初期化エラー:', error);
  isInitialized.value = false;
 }
});
</script>

<style>
html,
body {
 height: 100%;
 width: 100%;
 margin: 0;
 padding: 0;
 overflow: hidden;
}
#App {
 height: 100%;
 width: 100%;
 flex-direction: column;
 display: flex;
 justify-content: flex-end;
}
</style>
