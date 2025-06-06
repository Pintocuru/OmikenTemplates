<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="isInitialized">
  <ViewBotComment :BotComments="BotComments" />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <div v-else>
  <ErrorInitComponent :pluginUid="null" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CommentBot } from '@/types/types';
import { getAppConfig } from './utils/config';
import ViewBotComment from './components/ViewBotComment.vue';
import { CommentProcessor } from './utils/commentProcessor';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';

// 外部スクリプト読み込み
import { omikujiSampleData } from '../omikujiSampleData';
import { BomberSpin } from './scriptGame/BomberSpin.js';
import { CommentRule } from '@/types/OmikujiTypes';
import { ScriptPreset } from '@/types/PresetTypes';

// リアクティブ変数
const BotComments = ref<CommentBot[]>([]);
const isInitialized = ref(true);

// 設定の読み込み
const config = getAppConfig();

// GetUserVisitsコンポーザブルから取得
const { fetchComments } = GetUserVisits(config);

// CommentProcessorインスタンスを作成
const processor = new CommentProcessor();

// 初期化処理
onMounted(async () => {
 try {
  const isInit = await fetchComments((userVisits, comments) => {
   // コメントがリセットされたら、空にする
   if (!comments.length) {
    BotComments.value = [];
    return;
   }

   // コメントを抽選結果付きで処理
   const processedComments = processor.processComments(userVisits, comments);

   // 既存のコメントに新しい処理済みコメントを追加
   BotComments.value = [...BotComments.value, ...processedComments];
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
