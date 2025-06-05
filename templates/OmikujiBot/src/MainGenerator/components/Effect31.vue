<!-- src/MainGenerator/components/Effect31.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="godTheme">
  <template #decoration>
   <!-- 装飾的なコーナー -->
   <div class="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-yellow-300"></div>
   <div class="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-yellow-300"></div>
   <div class="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-yellow-300"></div>
   <div class="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-yellow-300"></div>

   <!-- 上部装飾ライン -->
   <div
    class="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
   ></div>
   <div
    class="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
   ></div>

   <!-- 左右装飾ライン -->
   <div
    class="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
   ></div>
   <div
    class="absolute right-0 top-6 bottom-6 w-1 bg-gradient-to-b from-transparent via-yellow-400 to-transparent"
   ></div>
  </template>
 </BaseCommentCard>
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentBot } from '@/types';

const props = defineProps<{
 comment: CommentBot;
}>();

// GODエフェクト用のテーマ設定
const godTheme = {
 container: 'border-yellow-400 bg-gradient-to-br from-yellow-500 via-yellow-700 to-yellow-500',
 avatarBorder: 'border-yellow-400',
 username: 'text-yellow-100',
 paidText: 'border border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-yellow-300/20',
 paidTextBackground: 'bg-gradient-to-r from-yellow-400/70 to-yellow-200/70',
 paidTextContent: 'text-yellow-200',
 membership: 'border border-yellow-400 bg-gradient-to-r from-purple-500/20 to-blue-500/20',
 membershipBackground: 'bg-gradient-to-r from-purple-400/70 to-blue-400/70',
 membershipContent: 'text-yellow-200',
 commentText: 'text-yellow-100',
 commentShadow: 'text-yellow-900'
};
</script>
