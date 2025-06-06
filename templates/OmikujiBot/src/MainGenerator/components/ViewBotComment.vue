<!-- src/MainGenerator/components/ViewBotComment.vue -->
<template>
 <div class="px-1">
  <!-- BOTコメント(main) -->
  <transition-group class="flex flex-col gap-1" name="comment" tag="div">
   <div v-for="(comment, index) in displayedComments" :key="comment.data.id">
    <div
     class="comment-block relative p-6 rounded-3xl"
     :class="getCommentClasses(index)"
     :style="getCommentStyles(index)"
    >
     <div class="name text-3xl font-bold text-black mb-2">
      {{ comment.data.name }}
     </div>
     <div class="comment-text text-black break-words">
      {{ comment.data.comment }}
     </div>
     <!-- コメントの吹き出しの矢印 -->
     <div
      class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-0 h-0"
      :style="getArrowStyles(index)"
     ></div>
    </div>
    <div
     class="avatar absolute w-96 h-96 rounded-full overflow-hidden bg-gray-200"
     :class="getAvatarClasses(index)"
     :style="getAvatarStyles(index)"
     v-show="comment.data.profileImage"
    >
     <img
      alt=""
      v-if="comment.data.profileImage"
      :src="comment.data.profileImage"
      class="block w-full h-full relative z-10"
     />
    </div>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { CommentBot } from '@/types/types';

const props = defineProps<{
 BotComments: CommentBot[];
}>();

const displayedComments = ref<CommentBot[]>([]);
const animationFrameId = ref<number>();

const comments = computed(() => props.BotComments);

// コメントのスタイルを取得（indexは表示順序、0が最新）
const getCommentClasses = (displayIndex: number) => {
 const reverseIndex = displayedComments.value.length - displayIndex - 1;
 return {
  'opacity-100': reverseIndex === 0,
  'opacity-0': reverseIndex !== 0
 };
};

const getCommentStyles = (displayIndex: number) => {
 const reverseIndex = displayedComments.value.length - displayIndex - 1;
 const brightness = Math.max(100 - reverseIndex * 20, 20);
 return {
  backgroundColor: '#ffffff',
  filter: `brightness(${brightness}%)`
 };
};

const getArrowStyles = (displayIndex: number) => {
 const reverseIndex = displayedComments.value.length - displayIndex - 1;
 const brightness = Math.max(100 - reverseIndex * 20, 20);
 return {
  borderLeft: '20px solid transparent',
  borderRight: '20px solid transparent',
  borderTop: '20px solid #ffffff',
  filter: `brightness(${brightness}%)`
 };
};

const getAvatarClasses = (displayIndex: number) => {
 const reverseIndex = displayedComments.value.length - displayIndex - 1;
 return {
  'opacity-100': reverseIndex === 0,
  'opacity-0': reverseIndex !== 0
 };
};

const getAvatarStyles = (displayIndex: number) => {
 const reverseIndex = displayedComments.value.length - displayIndex - 1;
 const opacity = reverseIndex === 0 ? 100 : 0;
 return {
  top: '400px',
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: `${opacity}%`,
  backgroundColor: '#ffffff'
 };
};

// コメント表示制御（簡略化版）
const commentDisplay = () => {
 const INTERVAL = 250; // 基本遅延
 const LIFE_TIME = 10000; // 表示時間
 const THRESHOLD = 30; // この文字数以上であれば、表示時間を延長する
 let lastTime = 0;
 let lastProcessedIndex = -1;
 const commentTimers = new Map();

 const update = (now = Date.now()) => {
  // 新しいコメントの追加
  if (now - lastTime > INTERVAL && comments.value.length > lastProcessedIndex + 1) {
   lastTime = now;
   const nextComment = comments.value[lastProcessedIndex + 1];

   if (nextComment) {
    const extraTime = Math.max((nextComment.data.comment?.length ?? 0) - THRESHOLD, 0) * 100;
    const totalLifeTime = LIFE_TIME + extraTime;

    displayedComments.value.push(nextComment);
    commentTimers.set(nextComment.data.id, now + totalLifeTime);
    lastProcessedIndex++;
   }
  }

  // 表示時間が過ぎたコメントを削除
  displayedComments.value = displayedComments.value.filter((comment) => {
   if (commentTimers.has(comment.data.id) && now > commentTimers.get(comment.data.id)) {
    commentTimers.delete(comment.data.id);
    return false;
   }
   return true;
  });

  animationFrameId.value = requestAnimationFrame(update);
 };

 update();
};

// ライフサイクル
onMounted(() => {
 commentDisplay();
});

onUnmounted(() => {
 if (animationFrameId.value) {
  cancelAnimationFrame(animationFrameId.value);
 }
});

// propsの変更を監視（新しいコメントが追加された場合の対応）
watch(
 () => props.BotComments.length,
 () => {
  // 新しいコメントが追加された場合、次回のupdateで処理される
 }
);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@900&display=swap');

/* Vue transition のみ使用 */
.comment-enter-active {
 transition: all 0.3s ease-out;
}
.comment-leave-active {
 transition: all 0.3s ease-in;
}
.comment-enter-from {
 opacity: 0;
 transform: translateY(30px) scale(0.9);
}
.comment-leave-to {
 opacity: 0;
 transform: translateY(-30px) scale(0.9);
}

body {
 background-color: rgba(0, 0, 0, 0);
 font-family: 'Zen Maru Gothic', serif;
}

/* コメントブロックの配置 */
.comment-block {
 position: fixed;
 top: var(--bot-comments-offset-top, 20px);
 right: var(--bot-comments-offset, 20px);
 width: var(--bot-comments-width, 600px);
 min-width: 400px;
 max-width: 800px;
}
</style>
