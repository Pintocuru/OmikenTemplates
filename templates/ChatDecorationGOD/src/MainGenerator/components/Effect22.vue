<!-- src/MainGenerator/components/Effect22.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="hadesTheme">
  <template #decoration>
   <!-- 冥界の炎装飾 -->
   <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
     class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-purple-600/40 to-transparent animate-pulse"
    ></div>
    <div
     class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-purple-800/40 to-transparent animate-pulse"
     style="animation-delay: 0.3s"
    ></div>
   </div>

   <!-- 紫7シンボル -->
   <div
    class="absolute -top-2 -right-2 bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-purple-400 animate-pulse shadow-lg shadow-purple-500/50"
   >
    7
   </div>

   <!-- ハーデス装飾 -->
   <div class="absolute top-2 left-2 text-2xl animate-bounce">💀</div>
   <div class="absolute bottom-2 left-2 text-purple-400 opacity-70">🔥</div>

   <!-- 紫の稲妻 -->
   <div class="absolute top-1/3 right-1 text-purple-300 animate-pulse">⚡</div>
   <div
    class="absolute bottom-1/3 left-1 text-purple-300 animate-pulse"
    style="animation-delay: 0.5s"
   >
    ⚡
   </div>
  </template>
 </BaseCommentCard>
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentGod } from '@/types';

const props = defineProps<{
 comment: CommentGod;
}>();

const hadesTheme = {
 container: 'border-purple-400 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900',
 avatarBorder: 'border-purple-400',
 username: 'text-purple-100',
 paidText: 'border border-purple-400/30 bg-gradient-to-r from-purple-700/20 to-indigo-700/20',
 paidTextBackground: 'bg-gradient-to-r from-purple-400/70 to-indigo-400/70',
 paidTextContent: 'text-purple-100',
 membership: 'border border-indigo-400 bg-gradient-to-r from-indigo-700/20 to-purple-700/20',
 membershipBackground: 'bg-gradient-to-r from-indigo-400/70 to-purple-400/70',
 membershipContent: 'text-purple-100',
 commentText: 'text-purple-100',
 commentShadow: 'text-purple-900'
};
</script>
