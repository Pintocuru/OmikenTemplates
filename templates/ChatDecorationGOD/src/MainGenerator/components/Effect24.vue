<!-- src/MainGenerator/components/Effect24.vue -->
<template>
 <BaseCommentCard :comment="comment" :theme="millionGodTheme">
  <template #decoration>
   <!-- 宇宙背景装飾 -->
   <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-ping"></div>
    <div
     class="absolute top-3 right-2 w-1 h-1 bg-white rounded-full animate-ping"
     style="animation-delay: 0.5s"
    ></div>
    <div
     class="absolute bottom-2 left-3 w-1 h-1 bg-white rounded-full animate-ping"
     style="animation-delay: 1s"
    ></div>
    <div
     class="absolute bottom-4 right-1 w-1 h-1 bg-white rounded-full animate-ping"
     style="animation-delay: 1.5s"
    ></div>
   </div>

   <!-- 赤7シンボル -->
   <div
    class="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg border-3 border-gold animate-pulse shadow-2xl shadow-red-500/50"
   >
    7
   </div>

   <!-- ミリオンゴッド装飾 */
     <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
       <div class="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold border border-yellow-300 animate-pulse shadow-lg">
         MILLION
       </div>
     </div>
     
     <!-- 宇宙の稲妻 -->
   <div class="absolute top-1/4 left-1 text-yellow-300 animate-pulse">✨</div>
   <div
    class="absolute bottom-1/4 right-1 text-yellow-300 animate-pulse"
    style="animation-delay: 0.7s"
   >
    ✨
   </div>

   <!-- 黄金オーラ -->
   <div
    class="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse shadow-xl shadow-yellow-400/30"
   ></div>
  </template>
 </BaseCommentCard>
</template>

<script setup lang="ts">
import BaseCommentCard from './BaseCommentCard.vue';
import { CommentGod } from '@/types';

const props = defineProps<{
 comment: CommentGod;
}>();

const millionGodTheme = {
 container: 'border-red-500 bg-gradient-to-br from-red-700 via-black to-red-900',
 avatarBorder: 'border-yellow-400',
 username: 'text-yellow-100',
 paidText: 'border border-red-400/30 bg-gradient-to-r from-red-700/20 to-yellow-600/20',
 paidTextBackground: 'bg-gradient-to-r from-red-500/70 to-yellow-500/70',
 paidTextContent: 'text-yellow-100',
 membership: 'border border-yellow-400 bg-gradient-to-r from-yellow-600/20 to-red-600/20',
 membershipBackground: 'bg-gradient-to-r from-yellow-400/70 to-red-400/70',
 membershipContent: 'text-yellow-100',
 commentText: 'text-yellow-100',
 commentShadow: 'text-red-900'
};
</script>
