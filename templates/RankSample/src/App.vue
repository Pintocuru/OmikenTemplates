<!-- App.vue -->
<template>
 <div class="app-container">
  <ToastMessage v-if="gameData" :rankings="gameData.rankings" :current-user-id="gameData.currentUserId" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { DataType } from '@type/index';
import { ConfigType } from '@common/commonTypes';
import { CommentTemp, GameDataType } from './types';
import { FunkCommentGetting } from './FunkCommentGetting';
import ToastMessage from './ToastMessage.vue';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigType;
 }
}

// 定数
const PLUGIN_UID = 'OmikenPlugin01'; // 使用しているプラグイン名
const BOT_USER_ID = 'FirstCounter'; // プラグインのcomment.data.userId
const POST_PARAM = 'honda'; // postが特定のparamのときに表示
const RULE_ID = 'HondaJanken'; // 取得する Games[rule.id]

// ref
const gameData = ref<GameDataType | null>(null);

// コンポーザブル
const { newComments, initOneSDK, fetchDatas } = FunkCommentGetting(PLUGIN_UID, 'diff');

onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 getData();
 await initOneSDK(); // 初期化
});

// コメントの購読
function commentListener(comments: CommentTemp[]) {
 comments
  .filter((comment) => {
   // 5秒以上経過したコメントは無視
   const isRecent = Date.now() < new Date(comment.data.timestamp).getTime() + 5000;
   // プラグインのコメントのみ適用
   const isBotComment = comment.data.userId === BOT_USER_ID;
   // 引数が'toast'のみ適用
   const isParam = comment.data.liveId === POST_PARAM;
   return isRecent && isBotComment && isParam;
  })
  .forEach((comment) => {
   getData();
  });
}

// newComments の変更を監視
watch(
 newComments,
 (newVal) => {
  if (newVal && Array.isArray(newVal)) commentListener(newVal);
 },
 { deep: true }
);

// APIを叩いてデータを取得
const getData = async () => {
 gameData.value = JSON.parse(await fetchDatas(DataType.Games))[RULE_ID];
 console.log(gameData.value?.rankings);
};
</script>

<style scoped>
.app-container {
 width: 100%;
 height: 100%;
}
</style>
