<!-- src/MainGenerator/components/Effect21.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="poseidonTheme">
  <template #decoration>
   <!-- 波装飾 -->
   <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
     class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-600/40 to-transparent animate-pulse"
    ></div>
    <div
     class="absolute bottom-2 left-0 right-0 h-4 bg-gradient-to-t from-cyan-500/30 to-transparent animate-pulse"
     style="animation-delay: 0.5s"
    ></div>
   </div>

   <!-- 青7シンボル -->
   <div
    class="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-cyan-400 animate-spin"
    style="animation-duration: 3s"
   >
    7
   </div>

   <!-- 海神装飾 -->
   <div class="absolute top-2 left-2 text-2xl animate-bounce">🔱</div>
   <div class="absolute bottom-2 right-2 text-cyan-400 opacity-70">🌊</div>

   <!-- 青い稲妻 -->
   <div class="absolute top-1/2 left-1 text-cyan-300 animate-pulse">⚡</div>
  </template>
 </BaseCommentCard>
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentBot } from '@/types';

const props = defineProps<{
 comment: CommentBot;
}>();

const poseidonTheme = {
 container: 'border-blue-400 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-800',
 avatarBorder: 'border-cyan-400',
 username: 'text-cyan-100',
 paidText: 'border border-blue-400/30 bg-gradient-to-r from-blue-600/20 to-cyan-600/20',
 paidTextBackground: 'bg-gradient-to-r from-blue-400/70 to-cyan-400/70',
 paidTextContent: 'text-cyan-100',
 membership: 'border border-cyan-400 bg-gradient-to-r from-cyan-600/20 to-blue-600/20',
 membershipBackground: 'bg-gradient-to-r from-cyan-400/70 to-blue-400/70',
 membershipContent: 'text-cyan-100',
 commentText: 'text-cyan-100',
 commentShadow: 'text-blue-900'
};
</script>
