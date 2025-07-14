<!-- src/MainGenerator/components/ViewBotMessage.vue -->
<template>
 <div class="relative w-full h-screen overflow-hidden">
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
    class="absolute w-full transition-all duration-300 ease-out"
    :style="{
     top: `${index * sizeConfig.spacing}px`,
     zIndex: displayedComments.length - index
    }"
   >
    <!-- コメント吹き出し -->
    <div
     class="absolute left-1/2 -translate-x-1/2 transform w-full max-w-3xl p-4 rounded-xl"
     :style="{
      backgroundColor: message.color?.backgroundColor || '#ffffff',
      filter: `brightness(${getBrightness(index)}%)`
     }"
    >
     <div
      v-if="message.name !== ''"
      class="mb-0"
      :class="sizeConfig.text"
      :style="{ color: message.color?.nameColor || '#000000' }"
     >
      {{ message.name }}
     </div>
     <div
      class="break-words"
      :class="sizeConfig.text"
      :style="{ color: message.color?.textColor || '#000000' }"
     >
      {{ message.comment }}
     </div>

     <!-- 吹き出しの矢印 -->
     <div
      class="absolute w-0 h-0 -bottom-5 left-1/2 -translate-x-1/2 transform"
      :style="{
       borderLeft: '20px solid transparent',
       borderRight: '20px solid transparent',
       borderTop: `20px solid ${message.color?.backgroundColor || '#ffffff'}`,
       filter: `brightness(${getBrightness(index)}%)`
      }"
     />
    </div>

    <!-- キャラクターアイコン -->
    <div
     v-if="message.profileImage"
     class="absolute left-1/2 -translate-x-1/2 transform rounded-full overflow-hidden z-40"
     :class="sizeConfig.avatar"
     :style="{
      opacity: index === 0 ? '100%' : '0%',
      top: sizeConfig.avatarTop,
      backgroundColor: message.color?.backgroundColor || '#ccc'
     }"
    >
     <img
      :src="getImagePath(message.profileImage)"
      :alt="`${message.name}のアバター`"
      @error="handleImageError(message)"
      class="w-full h-full object-cover"
     />
    </div>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, toRef } from 'vue';
import { BotMessage, DisplaySize } from '@type/';
import { useBotCommentDisplay } from './useBotMessage';

// サイズ設定の定数
const SIZE_CONFIG = {
 xs: { text: 'text-md', avatar: 'w-32 h-32', avatarTop: '160px', spacing: 20 },
 sm: { text: 'text-lg', avatar: 'w-48 h-48', avatarTop: '200px', spacing: 40 },
 md: { text: 'text-xl', avatar: 'w-64 h-64', avatarTop: '240px', spacing: 60 },
 lg: { text: 'text-2xl', avatar: 'w-80 h-80', avatarTop: '280px', spacing: 80 },
 xl: { text: 'text-3xl', avatar: 'w-96 h-96', avatarTop: '320px', spacing: 100 }
} as const;

const props = defineProps<{
 botMessages: BotMessage[];
 displaySize: DisplaySize;
}>();

const { displayedComments, getImagePath, handleImageError, start, stop } = useBotCommentDisplay(
 toRef(props, 'botMessages'),
 'comment'
);

// サイズ設定の取得
const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize]);

// brightness計算
const getBrightness = (index: number) => Math.max(100 - index * 15, 30);

onMounted(start);
onUnmounted(stop);
</script>

<style scoped>
.comment-enter-active {
 transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.comment-leave-active {
 transition: all 0.6s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.comment-enter-from {
 opacity: 0;
 transform: translateY(150px);
}

.comment-enter-to {
 opacity: 1;
 transform: translateY(0);
}

.comment-leave-from {
 opacity: 1;
 transform: translateY(0);
}

.comment-leave-to {
 opacity: 0;
 transform: translateY(-150px);
}

.avatar {
 will-change: transform, opacity;
 transition: opacity 0.4s ease-in-out;
}
</style>
