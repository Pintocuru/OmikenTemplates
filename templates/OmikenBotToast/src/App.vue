<!-- App.vue -->
<template>
 <div class="app-container">
  <ToastMessage :botComments="botComments" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { FunkCommentGetting } from './FunkCommentGetting';
import ToastMessage from './ToastMessage.vue';
import { CharaType, DataType } from '@/../../public/types';
import { CommentTemp } from './commentTypes';

// 定数
const PLUGIN_UID = 'OmikenPlugin01'; // 使用しているプラグイン名
const BOT_USER_ID = 'FirstCounter'; // プラグインのcomment.data.userId
const POST_PARAM = 'toast' // postが特定のparamのときに表示

// ref
const botComments = ref<CommentTemp[]>([]);
const Charas = ref<Record<string, CharaType>>({});

// コンポーザブル
const { newComments, initOneSDK, fetchDatas } = FunkCommentGetting(PLUGIN_UID, 'diff');

onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 Charas.value = await fetchDatas(DataType.Charas); // Charasの取得
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
   const commentPlus = commentCssPlus(comment);
   if (commentPlus) botComments.value.unshift(commentPlus);
  });
}

// コメント処理(CSSの付与等)
function commentCssPlus(comment: CommentTemp): CommentTemp | null {
 const chara = Object.values(Charas.value).find((c) => c.name === comment.data.name);
 // 万が一キャラクターデータがなければnull
 if (!chara) {
  console.warn(`キャラクターが見つかりません: ${comment.data.name}`);
  return null;
 }
 comment.css = chara.color; // コメントの色を付与
 return comment;
}

// newComments の変更を監視
watch(
 newComments,
 (newVal) => {
  if (newVal && Array.isArray(newVal)) {
   commentListener(newVal);
  }
 },
 { deep: true }
);
</script>

<style scoped>
.app-container {
 width: 100%;
 height: 100%;
}
</style>
