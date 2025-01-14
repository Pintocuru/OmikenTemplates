<template>
 <div id="container">
  <TransitionGroup
   class="fixed flex flex-col-reverse min-w-[400px] max-w-[600px]"
   enter-from-class="opacity-0 translate-y-full"
   enter-to-class="opacity-100 translate-y-0"
   enter-active-class="transform transition-all duration-500 ease-out"
   leave-from-class="opacity-100 translate-y-0"
   leave-to-class="opacity-0 -translate-y-full"
   leave-active-class="transform transition-all duration-500 ease-in"
   tag="div"
  >
   <div
    v-for="(comment, index) in commentDisplays"
    :key="comment.data.id"
    class="relative p-6 pb-9 rounded-xl animate-fadeInUp"
    :style="getCommentStyles(comment, commentDisplays.length - 1 - index)"
   >
    <div class="relative">
     <div class="text-4xl font-zen-maru font-bold" :style="{ color: getStyleValue(comment.css, '--lcv-name-color') }">
      {{ comment.data.name }}
     </div>
     <div class="text-4xl font-zen-maru mt-2" :style="{ color: getStyleValue(comment.css, '--lcv-text-color') }">
      {{ comment.data.comment }}
     </div>
    </div>
    <div
     class="absolute left-1/2 -translate-x-1/2 -bottom-4 w-0 h-0"
     :style="{
      borderLeft: '16px solid transparent',
      borderRight: '16px solid transparent',
      borderTop: `16px solid ${getStyleValue(comment.css, '--lcv-background-color')}`
     }"
    ></div>

    <div
     class="fixed top-80 inset-x-0 m-auto w-96 h-96 min-w-[400px] rounded-full overflow-hidden"
     :style="getAvatarStyles(comment, commentDisplays.length - 1 - index)"
    >
     <img
      v-if="comment.data.profileImage"
      :src="comment.data.profileImage"
      alt=""
      class="block w-full h-full object-cover"
     />
    </div>
   </div>
  </TransitionGroup>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { CommentTemp } from '@composables/CommentGet';

const props = defineProps<{ botComments: CommentTemp[] }>();

const commentDisplays = ref<CommentTemp[]>([]);
const commentTimers = new Map<string, NodeJS.Timeout>();
const commentCompIds = new Set<string>();

// スタイル値を安全に取得する関数
const getStyleValue = (css: any, property: string) => {
 return css && css[property] ? css[property] : undefined;
};

// コメントのスタイルを取得する関数
const getCommentStyles = (comment: CommentTemp, index: number) => {
 const css = comment.css || {};
 const brightness = 1 - index * 0.2; // インデックスが大きいほど暗く

 return {
  backgroundColor: getStyleValue(css, '--lcv-background-color'),
  filter: `brightness(${Math.max(brightness, 0.2)})` // 最小値を0.2に制限
 };
};

// アバターのスタイルを取得する関数
const getAvatarStyles = (comment: CommentTemp, index: number) => {
 const css = comment.css || {};

 return {
  backgroundColor: getStyleValue(css, '--lcv-background-color'),
  opacity: index === 0 ? '1' : '0' // インデックス0（最新）のみ表示
 };
};

const addComment = (comment: CommentTemp) => {
 if (commentCompIds.has(comment.data.id)) return;
 if (commentTimers.has(comment.data.id)) {
  clearTimeout(commentTimers.get(comment.data.id));
  commentTimers.delete(comment.data.id);
 }

 commentDisplays.value.push(comment);
 commentCompIds.add(comment.data.id);

 const timer = setTimeout(() => {
  commentDisplays.value = commentDisplays.value.filter((c) => c.data.id !== comment.data.id);
  commentCompIds.delete(comment.data.id);
  commentTimers.delete(comment.data.id);
 }, 15000);

 commentTimers.set(comment.data.id, timer);
};

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

const clearAllTimers = () => {
 commentTimers.forEach((timer) => clearTimeout(timer));
 commentTimers.clear();
 commentCompIds.clear();
 commentDisplays.value = [];
};

onUnmounted(clearAllTimers);
</script>
