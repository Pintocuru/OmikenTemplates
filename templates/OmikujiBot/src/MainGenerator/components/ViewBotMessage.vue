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
     top: `${index * getSpacing()}px`,
     zIndex: displayedComments.length - index
    }"
   >
    <!-- コメント吹き出し -->
    <div
     class="absolute left-1/2 -translate-x-1/2 transform w-full max-w-3xl min-w-md p-6 rounded-xl"
     :style="getCommentStyles(index, message)"
    >
     <div
      class="mb-3"
      :class="getTextSizeClasses().name"
      :style="{ color: message.color?.nameColor || '#000000' }"
     >
      {{ message.name }}
     </div>
     <div
      class="break-words"
      :class="[getTextSizeClasses().comment, getTextSizeClasses().lineHeight]"
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
       filter: `brightness(${Math.max(100 - index * 15, 30)}%)`
      }"
     />
    </div>

    <!-- キャラクターアイコン -->
    <div
     v-if="message.profileImage"
     class="absolute left-1/2 -translate-x-1/2 transform rounded-full overflow-hidden bg-gray-200 z-40"
     :class="getIconSizeClasses().size"
     :style="{
      ...getAvatarStyles(index),
      top: getIconSizeClasses().top
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
import { onMounted, onUnmounted, toRef } from 'vue';
import { BotMessage, DisplaySize } from '@/types/types';
import { useBotCommentDisplay } from './useBotMessage';

const props = defineProps<{
 botMessages: BotMessage[];
 displaySize: DisplaySize;
}>();

const {
 displayedComments,
 getCommentStyles,
 getAvatarStyles,
 getTextSizeClasses,
 getIconSizeClasses,
 getSpacing,
 getImagePath,
 handleImageError,
 start,
 stop
} = useBotCommentDisplay(toRef(props, 'botMessages'), toRef(props, 'displaySize'));

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

* {
 backface-visibility: hidden;
 -webkit-backface-visibility: hidden;
}
</style>
