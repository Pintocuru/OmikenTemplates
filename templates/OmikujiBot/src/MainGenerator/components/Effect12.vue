<!-- src/MainGenerator/components/Effect12.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="hanaHanaTheme">
  <template #decoration>
   <!-- ハイビスカス装飾 -->
   <div class="absolute -top-2 -right-2 text-4xl animate-bounce">🌺</div>
   <div class="absolute -bottom-2 -left-2 text-3xl animate-bounce" style="animation-delay: 0.5s">
    🌸
   </div>

   <!-- ハナハナ風ドット装飾 -->
   <div class="absolute top-1 left-1 flex gap-1">
    <div class="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
    <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
    <div class="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
   </div>

   <!-- 花びら散り装飾 -->
   <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-0 left-1/4 text-pink-300 opacity-70 animate-bounce">🌸</div>
    <div
     class="absolute top-1/3 right-1/4 text-red-300 opacity-50 animate-bounce"
     style="animation-delay: 0.8s"
    >
     🌺
    </div>
   </div>
  </template>
 </BaseCommentCard>
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentBot } from '@/types';

const props = defineProps<{
 comment: CommentBot;
}>();

const hanaHanaTheme = {
 container: 'border-pink-400 bg-gradient-to-br from-pink-500 via-red-500 to-pink-600',
 avatarBorder: 'border-pink-400',
 username: 'text-pink-100',
 paidText: 'border border-pink-400/30 bg-gradient-to-r from-pink-500/20 to-red-500/20',
 paidTextBackground: 'bg-gradient-to-r from-pink-400/70 to-red-400/70',
 paidTextContent: 'text-pink-100',
 membership: 'border border-red-400 bg-gradient-to-r from-red-500/20 to-pink-500/20',
 membershipBackground: 'bg-gradient-to-r from-red-400/70 to-pink-400/70',
 membershipContent: 'text-pink-100',
 commentText: 'text-pink-100',
 commentShadow: 'text-pink-900'
};
</script>
