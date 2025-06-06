<!-- src/MainGenerator/components/Effect11.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="nangokuTheme">
  <template #decoration>
   <!-- パトランプ装飾 -->
   <div class="absolute -top-1 left-2 right-2 flex justify-between">
    <div class="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
    <div
     class="w-4 h-4 bg-orange-500 rounded-full animate-pulse shadow-lg"
     style="animation-delay: 0.3s"
    ></div>
    <div
     class="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"
     style="animation-delay: 0.6s"
    ></div>
   </div>

   <!-- ヤシの木風装飾 -->
   <div class="absolute top-2 right-2 text-green-400 opacity-60">🌴</div>
   <div class="absolute bottom-2 left-2 text-yellow-400 opacity-60">☀️</div>

   <!-- 南国風ボーダー -->
   <div class="absolute inset-0 border-2 border-orange-400 rounded-lg pointer-events-none"></div>
  </template>
 </BaseCommentCard>
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentBot } from '@/types/types';

const props = defineProps<{
 comment: CommentBot;
}>();

const nangokuTheme = {
 container: 'border-orange-400 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500',
 avatarBorder: 'border-orange-400',
 username: 'text-orange-100',
 paidText: 'border border-orange-400/30 bg-gradient-to-r from-orange-500/20 to-red-500/20',
 paidTextBackground: 'bg-gradient-to-r from-orange-400/70 to-red-400/70',
 paidTextContent: 'text-orange-100',
 membership: 'border border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
 membershipBackground: 'bg-gradient-to-r from-yellow-400/70 to-orange-400/70',
 membershipContent: 'text-orange-100',
 commentText: 'text-orange-100',
 commentShadow: 'text-orange-900'
};
</script>
