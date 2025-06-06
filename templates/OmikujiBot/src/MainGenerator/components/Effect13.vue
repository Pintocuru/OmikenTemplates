<!-- src/MainGenerator/components/Effect13.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="juglerTheme">
  <template #decoration>
   <!-- GOGO装飾 -->
   <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <div
     class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse border-2 border-green-300"
    >
     GOGO!
    </div>
   </div>

   <!-- ジャグラー風ランプ -->
   <div class="absolute top-2 left-2 flex gap-1">
    <div class="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
    <div class="w-3 h-3 bg-green-500 rounded-full animate-ping" style="animation-delay: 0.3s"></div>
    <div class="w-3 h-3 bg-blue-500 rounded-full animate-ping" style="animation-delay: 0.6s"></div>
   </div>

   <!-- チェリー装飾 -->
   <div class="absolute bottom-2 right-2 text-2xl animate-bounce">🍒</div>

   <!-- レインボー風ボーダー -->
   <div
    class="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-red-400 via-green-400 to-blue-400 rounded-lg opacity-60 pointer-events-none"
    style="background-clip: padding-box"
   ></div>
  </template>
 </BaseCommentCard>
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentBot } from '@/types/types';

const props = defineProps<{
 comment: CommentBot;
}>();

const juglerTheme = {
 container: 'border-green-400 bg-gradient-to-br from-green-500 via-blue-500 to-green-600',
 avatarBorder: 'border-green-400',
 username: 'text-green-100',
 paidText: 'border border-green-400/30 bg-gradient-to-r from-green-500/20 to-blue-500/20',
 paidTextBackground: 'bg-gradient-to-r from-green-400/70 to-blue-400/70',
 paidTextContent: 'text-green-100',
 membership: 'border border-blue-400 bg-gradient-to-r from-blue-500/20 to-green-500/20',
 membershipBackground: 'bg-gradient-to-r from-blue-400/70 to-green-400/70',
 membershipContent: 'text-green-100',
 commentText: 'text-green-100',
 commentShadow: 'text-green-900'
};
</script>
