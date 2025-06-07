<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="isInitialized">
  <ViewBotComment :botMessages="botMessages" />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <div v-else>
  <ErrorInitComponent :pluginUid="null" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BotMessage } from '@/types/types';
import { getAppConfig } from './utils/config';
import ViewBotComment from './components/ViewBotComment.vue';
import { CommentProcessor } from './utils/commentProcessor';
import { GetUserComments } from '@common/subscribe/GetUserComments';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';

// リアクティブ変数
const botMessages = ref<BotMessage[]>([]);
const isInitialized = ref(true);

// 設定の読み込み
const config = getAppConfig();

// GetUserVisitsコンポーザブルから取得
const { fetchComments } = GetUserComments(config);

// CommentProcessorインスタンスを作成
const processor = new CommentProcessor();

// 初期化処理
onMounted(async () => {
 try {
  const isInit = await fetchComments((comments) => {
   // コメントがリセットされたら、空にする
   if (!comments.length) {
    botMessages.value = [];
    return;
   }

   // コメントを抽選結果付きで処理
   const processedMessages = processor.processComments(comments);

   // BotMessage[] のうち、delaySeconds に従って同時に追加
   Promise.all(
    processedMessages.map((message) => {
     if (!message.delaySeconds) {
      botMessages.value = [...botMessages.value, message];
      return Promise.resolve();
     }

     const delay = message.delaySeconds * 1000;
     return new Promise<void>((resolve) => {
      setTimeout(() => {
       if (!botMessages.value.some((c) => c.id === message.id)) {
        botMessages.value = [...botMessages.value, message];
       }
       resolve();
      }, delay);
     });
    })
   );
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
