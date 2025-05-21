<!-- src/MainGenerator/components/EffectDefault.vue -->
<template>
 <div class="card shadow-md bg-base-100">
  <div class="card-body p-3">
   <div class="flex items-start gap-3">
    <!-- アバター部分 -->
    <div class="avatar">
     <div class="w-12 h-12 mask mask-squircle">
      <img class="rounded-full" :src="comment.data.profileImage" alt="" />
     </div>
    </div>

    <!-- コメント内容部分 -->
    <div class="flex-1">
     <!-- ユーザー名とバッジ -->
     <div class="flex items-center flex-wrap gap-1 mb-1">
      <h3 class="font-bold text-lg">{{ comment.data.displayName }}</h3>

      <!-- その他のバッジ -->
      <div v-for="(badge, index) in comment.data.badges" :key="index" class="badge badge-sm">
       <img v-if="badge.url" :alt="badge.label" :src="badge.url" :title="badge.label" class="h-4" />
       <span v-else>{{ badge.label }}</span>
      </div>
     </div>

     <!-- 有料テキスト表示 -->
     <div v-if="hasPaidText(comment)" class="alert alert-success mb-2 py-2">
      <div class="font-bold">{{ comment.data.paidText }}</div>
     </div>

     <!-- メンバーシップ表示 -->
     <div v-if="hasMembership(comment)" class="alert alert-info mb-2 py-2">
      <div>{{ comment.data.membership.sub }} {{ comment.data.membership.primary }}</div>
     </div>

     <!-- コメント本文 -->
     <div class="comment-text prose" v-html="comment.data.comment"></div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useCommentGuards } from '@common/subscribe/CommentGuards';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

const props = defineProps<{
 comment: Comment;
}>();

// コンポーザブル
const { hasMembership, hasPaidText } = useCommentGuards();
</script>
