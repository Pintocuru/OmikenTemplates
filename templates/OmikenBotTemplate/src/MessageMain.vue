<!-- src/ToastMessage.vue -->
<template>
 <TransitionGroup
  class="fixed flex flex-col-reverse items-center w-full"
  enter-from-class="opacity-0 translate-y-full"
  enter-to-class="opacity-100 translate-y-0"
  enter-active-class="transform transition-all duration-500 ease-out"
  leave-from-class="opacity-100 translate-y-0"
  leave-to-class="opacity-0 -translate-y-full"
  leave-active-class="transform transition-all duration-500 ease-in"
  tag="div"
 >
  <!-- コメント枠 -->
  <div
   v-for="(comment, index) in commentDisplays"
   :key="comment.data.id"
   class="relative p-6 pb-9 rounded-xl animate-fadeInUp w-full"
   :style="getCommentStyles(comment, commentDisplays.length - 1 - index)"
  >
   <div class="relative">
    <!-- 名前 -->
    <div
     class="text-4xl font-zen-maru font-bold"
     :style="{ color: getStyleValue(comment.chara?.color, '--lcv-name-color') }"
    >
     {{ comment.chara?.displayName }}
    </div>
    <!-- message -->
    <div
     class="text-4xl font-zen-maru mt-2"
     :style="{ color: getStyleValue(comment.chara?.color, '--lcv-text-color') }"
    >
     {{ comment.data.comment }}
    </div>
   </div>
   <!-- コメント枠のかぎ -->
   <div
    class="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-0 h-0"
    :style="{
     borderLeft: '16px solid transparent',
     borderRight: '16px solid transparent',
     borderTop: `16px solid ${getStyleValue(comment.chara?.color, '--lcv-background-color')}`
    }"
   ></div>
   <!-- キャラクター背景 -->
   <div
    v-if="comment.chara?.isIconDisplay"
    class="fixed top-80 inset-x-0 m-auto w-96 h-96 min-w-[400px] rounded-full overflow-hidden"
    :style="getAvatarStyles(comment, commentDisplays.length - 1 - index)"
   >
    <!-- アイコン -->
    <img :src="comment.data.profileImage" alt="" class="block w-full h-full object-cover" />
   </div>
  </div>
 </TransitionGroup>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { CommentTemp } from '@common/CommentGet';
import { CharaType } from '@type/index';

const props = defineProps<{ botComments: CommentTemp[] }>();

const commentDisplays = ref<CommentTemp[]>([]);
const commentTimers = new Map<string, NodeJS.Timeout>();
const commentCompIds = new Set<string>();

// コメント表示の定数
const COMMENT_DISPLAY_DURATION = 15000; // コメント表示時間（ミリ秒）
const MIN_BRIGHTNESS = 0.2; // 最小明度
const BRIGHTNESS_STEP = 0.2; // 明度の減少ステップ

// スタイル計算用のユーティリティ関数
const getStyleValue = (css: CharaType['color'] | undefined, property: keyof CharaType['color']) => css?.[property];

const getCommentStyles = (comment: CommentTemp, index: number) => {
 const brightness = Math.max(1 - index * BRIGHTNESS_STEP, MIN_BRIGHTNESS);
 return {
  backgroundColor: comment.chara?.color['--lcv-background-color'] || '',
  filter: `brightness(${brightness})`
 };
};

// アバターのスタイルを取得する関数
const getAvatarStyles = (comment: CommentTemp, index: number) => {
 return {
  backgroundColor: comment.chara?.color['--lcv-background-color'],
  opacity: index === 0 ? '1' : '0' // インデックス0（最新）のみ表示
 };
};

// コメント管理ロジック
const addComment = (comment: CommentTemp) => {
 if (commentCompIds.has(comment.data.id)) return;

 // 既存のタイマーをクリア
 if (commentTimers.has(comment.data.id)) {
  clearTimeout(commentTimers.get(comment.data.id));
  commentTimers.delete(comment.data.id);
 }

 // 新しいコメントを追加
 commentDisplays.value.push(comment);
 commentCompIds.add(comment.data.id);

 // 自動削除タイマーを設定
 const timer = setTimeout(() => {
  commentDisplays.value = commentDisplays.value.filter((c) => c.data.id !== comment.data.id);
  commentCompIds.delete(comment.data.id);
  commentTimers.delete(comment.data.id);
 }, COMMENT_DISPLAY_DURATION);

 commentTimers.set(comment.data.id, timer);
};

// コメント監視とクリーンアップ
watch(
 () => props.botComments,
 (newComments, oldComments) => {
  const oldIds = new Set((oldComments || []).map((c) => c.data.id));
  newComments.forEach((comment) => {
   if (!oldIds.has(comment.data.id)) {
    addComment(comment);
   }
  });
 },
 { deep: true }
);

// コンポーネントのクリーンアップ
const clearAllTimers = () => {
 commentTimers.forEach((timer) => clearTimeout(timer));
 commentTimers.clear();
 commentCompIds.clear();
 commentDisplays.value = [];
};

onUnmounted(clearAllTimers);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@900&display=swap');

* {
 font-family: 'Zen Maru Gothic', sans-serif;
}
</style>
