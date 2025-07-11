<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
 <div class="toast-container fixed bottom-6 right-6 z-999">
  <transition-group name="toast" tag="div" appear>
   <div
    v-for="(message, index) in displayedComments.slice().reverse()"
    :key="message.id"
    class="toast-item flex items-start p-3 rounded-2xl shadow-lg backdrop-blur-sm mb-3"
    :style="{
     ...getCommentStyles(index, message),
     width: sizeConfig.width,
     maxWidth: sizeConfig.width,
     minWidth: sizeConfig.minWidth
    }"
   >
    <!-- アイコン -->
    <div
     v-if="message.profileImage"
     class="avatar flex-shrink-0 rounded-full overflow-hidden bg-gray-200 mr-3"
     :class="sizeConfig.avatar"
    >
     <img
      :src="getImagePath(message.profileImage)"
      :alt="`${message.name}のアバター`"
      @error="handleImageError(message)"
      class="w-full h-full object-cover"
     />
    </div>
    <!-- プロフィール画像がない場合の代替アイコン -->
    <div
     v-else
     class="avatar flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3"
     :class="sizeConfig.avatar"
    >
     <Info :size="24" />
    </div>

    <!-- メッセージ内容 -->
    <div class="flex-1 min-w-0 overflow-hidden">
     <div
      class="name font-bold mb-1"
      :class="[sizeConfig.text, sizeConfig.lineHeight]"
      :style="{ color: message.color?.nameColor || '#000000' }"
     >
      {{ message.name }}
     </div>
     <div
      class="comment-text"
      :class="[sizeConfig.text, sizeConfig.lineHeight]"
      :style="{ color: message.color?.textColor || '#000000' }"
     >
      {{ message.comment }}
     </div>
    </div>

    <!-- 閉じるボタン -->
    <button
     @click="removeItem(message.id)"
     class="flex-shrink-0 ml-2 px-3 py-1 rounded-full hover:bg-black/10 transition-colors self-start"
     :class="sizeConfig.text"
     :style="{ color: message.color?.textColor || '#666666' }"
    >
     ✕
    </button>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, toRef } from 'vue';
import { BotMessage, DisplaySize } from '@/types/types';
import { useBotCommentDisplay } from './useBotMessage';
import { Info } from 'lucide-vue-next';

// サイズ設定の定数
const SIZE_CONFIG = {
 xs: {
  text: 'text-sm',
  lineHeight: 'leading-5',
  avatar: 'w-8 h-8',
  width: '280px',
  minWidth: '220px'
 },
 sm: {
  text: 'text-base',
  lineHeight: 'leading-6',
  avatar: 'w-10 h-10',
  width: '340px',
  minWidth: '260px'
 },
 md: {
  text: 'text-lg',
  lineHeight: 'leading-7',
  avatar: 'w-12 h-12',
  width: '400px',
  minWidth: '300px'
 },
 lg: {
  text: 'text-xl',
  lineHeight: 'leading-8',
  avatar: 'w-14 h-14',
  width: '460px',
  minWidth: '340px'
 },
 xl: {
  text: 'text-2xl',
  lineHeight: 'leading-9',
  avatar: 'w-16 h-16',
  width: '520px',
  minWidth: '380px'
 }
} as const;

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

// サイズ設定の取得
const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize]);

onMounted(start);
onUnmounted(stop);
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
 transition: transform 0.2s ease;
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
</style>
