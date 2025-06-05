<!-- src/MainGenerator/components/Effect23.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="hadesKingTheme">
  <template #decoration>
   <!-- 冥王の威圧装飾 -->
   <div
    class="absolute inset-0 border-4 border-purple-500 rounded-lg animate-pulse shadow-2xl shadow-purple-500/50"
   ></div>

   <!-- 冥界の炎が舞い上がる -->
   <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute bottom-0 left-1/4 text-purple-400 animate-bounce">🔥</div>
    <div
     class="absolute bottom-0 right-1/4 text-purple-500 animate-bounce"
     style="animation-delay: 0.3s"
    >
     🔥
    </div>
    <div
     class="absolute bottom-0 left-3/4 text-purple-600 animate-bounce"
     style="animation-delay: 0.6s"
    >
     🔥
    </div>
   </div>

   <!-- 冥王シンボル -->
   <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
    <div
     class="bg-black text-purple-400 px-2 py-1 rounded-full text-xs font-bold border-2 border-purple-500 animate-pulse shadow-lg"
    >
     冥王
    </div>
   </div>

   <!-- 髑髏装飾 -->
   <div class="absolute top-1 left-1 text-xl animate-spin" style="animation-duration: 4s">💀</div>
   <div
    class="absolute top-1 right-1 text-xl animate-spin"
    style="animation-duration: 4s; animation-direction: reverse"
   >
    💀
   </div>

   <!-- 紫の稲妻群 -->
   <div class="absolute top-1/4 left-2 text-purple-300 animate-pulse">⚡</div>
   <div
    class="absolute top-3/4 right-2 text-purple-300 animate-pulse"
    style="animation-delay: 0.4s"
   >
    ⚡
   </div>
   <div
    class="absolute top-1/2 left-1/4 text-purple-400 animate-pulse"
    style="animation-delay: 0.8s"
   >
    ⚡
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

const hadesKingTheme = {
 container: 'border-purple-500 bg-gradient-to-br from-purple-800 via-black to-purple-900',
 avatarBorder: 'border-purple-500',
 username: 'text-purple-200',
 paidText: 'border border-purple-500/50 bg-gradient-to-r from-purple-800/30 to-black/30',
 paidTextBackground: 'bg-gradient-to-r from-purple-500/80 to-purple-700/80',
 paidTextContent: 'text-purple-100',
 membership: 'border border-purple-600 bg-gradient-to-r from-black/30 to-purple-800/30',
 membershipBackground: 'bg-gradient-to-r from-purple-600/80 to-purple-500/80',
 membershipContent: 'text-purple-100',
 commentText: 'text-purple-200',
 commentShadow: 'text-purple-950'
};
</script>
