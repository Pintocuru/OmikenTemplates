<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
 <div class="toast-container fixed bottom-4 right-4 z-999">
  <transition-group name="toast" tag="div" appear>
   <div
    v-for="(message, index) in displayedComments"
    :key="message.id"
    class="toast-item flex items-start p-4 rounded-2xl shadow-lg backdrop-blur-sm mb-3"
    :style="{
     ...getCommentStyles(index, message),
     width: '400px',
     maxWidth: '400px',
     minWidth: '300px'
    }"
   >
    <!-- アイコン -->
    <div
     v-if="message.profileImage"
     class="avatar flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3"
    >
     <img
      :src="getImagePath(message.profileImage)"
      :alt="`${message.name}のアバター`"
      @error="handleImageError(message)"
      class="w-full h-full object-cover"
     />
    </div>

    <!-- メッセージ内容 -->
    <div class="flex-1 min-w-0 overflow-hidden">
     <div
      class="name text-sm font-bold mb-1"
      :style="{ color: message.color?.nameColor || '#000000' }"
     >
      {{ message.name }}
     </div>
     <div
      class="comment-text text-sm leading-relaxed word-wrap"
      :style="{ color: message.color?.textColor || '#000000' }"
     >
      {{ message.comment }}
     </div>
    </div>

    <!-- 閉じるボタン -->
    <button
     @click="removeItem(message.id)"
     class="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors self-start"
     :style="{ color: message.color?.textColor || '#666666' }"
    >
     ✕
    </button>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, toRef } from 'vue';
import { BotMessage, DisplaySize } from '@/types/types';
import { useBotCommentDisplay } from './useBotCommentDisplay';

const props = defineProps<{
 botMessages: BotMessage[];
 displaySize: DisplaySize;
}>();

const {
 displayedComments,
 getCommentStyles,
 getImagePath,
 handleImageError,
 removeItem,
 start,
 stop
} = useBotCommentDisplay(toRef(props, 'botMessages'), toRef(props, 'displaySize'), 'toast');

onMounted(() => {
 start();
});

onUnmounted(() => {
 stop();
});
</script>

<style scoped>
/* トーストアニメーション */
.toast-container {
 display: flex;
 flex-direction: column-reverse; /* 新しいトーストを下に表示 */
 max-height: calc(100vh - 8rem);
 pointer-events: none; /* コンテナ自体はクリックを無効化 */
}

.toast-item {
 pointer-events: all; /* トーストアイテムはクリック可能 */
 transform-origin: right center;
}

.toast-enter-active {
 transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.toast-leave-active {
 transition: all 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.toast-move {
 transition: transform 0.4s ease;
}

/* 右からスライドイン */
.toast-enter-from {
 opacity: 0;
 transform: translateX(100%) scale(0.9);
}

.toast-enter-to {
 opacity: 1;
 transform: translateX(0) scale(1);
}

/* 右へスライドアウト */
.toast-leave-from {
 opacity: 1;
 transform: translateX(0) scale(1);
}

.toast-leave-to {
 opacity: 0;
 transform: translateX(100%) scale(0.9);
}

/* テキストの折り返し制御 */
.word-wrap {
 word-wrap: break-word;
 overflow-wrap: break-word;
 hyphens: auto;
}
</style>
