<!-- src/MainGenerator/components/ViewBotComment.vue -->
<template>
 <div class="px-1 relative w-full h-screen overflow-hidden">
  <!-- BOTコメント(main) -->
  <transition-group
   class="comment-container"
   name="comment"
   tag="div"
   appear
   move-class="comment-move"
  >
   <div
    v-for="(message, index) in displayedComments"
    :key="message.id"
    class="comment-item absolute w-full transition-all duration-300 ease-out"
    :style="{
     top: `${5 + index * 120}px`,
     zIndex: displayedComments.length - index
    }"
   >
    <!-- コメント吹き出し -->
    <div
     class="comment-block p-6 rounded-3xl absolute left-1/2 transform -translate-x-1/2 w-[600px] min-w-[400px] max-w-[800px] opacity-100"
     :style="getCommentStyles(index, message)"
    >
     <div class="name text-3xl mb-3" :style="{ color: message.color?.nameColor || '#000000' }">
      {{ message.name }}
     </div>
     <div
      class="comment-text text-2xl break-words leading-relaxed"
      :style="{ color: message.color?.textColor || '#000000' }"
     >
      {{ message.comment }}
     </div>
     <!-- 吹き出しの矢印 -->
     <div
      class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-0 h-0"
      :style="getArrowStyles(index, message)"
     ></div>
    </div>

    <!-- キャラクターアイコン -->
    <div
     v-if="message.profileImage"
     class="avatar absolute w-96 h-96 rounded-full overflow-hidden bg-gray-200 left-1/2 transform -translate-x-1/2"
     :style="getAvatarStyles(index)"
    >
     <img
      :src="getImagePath(message.profileImage)"
      :alt="`${message.name}のアバター`"
      @error="handleImageError(message)"
      class="block w-full h-full object-cover relative z-999"
     />
    </div>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, toRef } from 'vue';
import { BotMessage } from '@/types/types';
import { useBotCommentDisplay } from './useBotCommentDisplay';

const props = defineProps<{
 botMessages: BotMessage[];
}>();

const botMessagesRef = toRef(props, 'botMessages');

const {
 displayedComments,
 getCommentStyles,
 getArrowStyles,
 getAvatarStyles,
 getImagePath,
 handleImageError,
 start,
 stop
} = useBotCommentDisplay(botMessagesRef, 5);

onMounted(() => {
 start();
});

onUnmounted(() => {
 stop();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@900&display=swap');

/* Vue transition - 下から上へのフェードイン、上へのフェードアウト */
.comment-enter-active {
 transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.comment-leave-active {
 transition: all 0.6s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

/* 表示時: 下からフェードイン */
.comment-enter-from {
 opacity: 0;
 transform: translateY(150px);
}

.comment-enter-to {
 opacity: 1;
 transform: translateY(0);
}

/* 非表示時: 上へフェードアウト */
.comment-leave-from {
 opacity: 1;
 transform: translateY(0);
}

.comment-leave-to {
 opacity: 0;
 transform: translateY(-150px);
}

/* フォント設定 */
.name,
.comment-text {
 font-family: 'Zen Maru Gothic', sans-serif;
}

/* アバター表示の最適化 */
.avatar {
 will-change: transform, opacity;
 transition: opacity 0.4s ease-in-out;
}

/* アニメーション最適化 */
* {
 backface-visibility: hidden;
 -webkit-backface-visibility: hidden;
}
</style>
