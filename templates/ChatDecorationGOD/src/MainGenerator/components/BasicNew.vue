<!-- src/MainGenerator/components/BasicNew.vue -->
<template>
 <div class="px-1">
  <transition-group class="flex flex-col gap-1" name="comment" tag="div">
   <div v-for="comment in comments" :key="comment.data.id" v-bind="getCommentAttributes(comment)">
    <component :is="getCommentComponent(comment)" :comment="comment" />
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { useCommentGuards } from '@common/subscribe/CommentGuards';
import EffectDefault from './EffectDefault.vue';
import { CommentGod } from '@/types';

// エフェクトコンポーネントマップ（遅延ロード）
const EFFECT_COMPONENTS = {
 41: defineAsyncComponent(() => import('./Effect41.vue')), // 全回転GOD
 31: defineAsyncComponent(() => import('./Effect31.vue')), // GOD
 24: defineAsyncComponent(() => import('./Effect24.vue')), // 赤7揃い - 宇宙背景
 23: defineAsyncComponent(() => import('./Effect23.vue')), // 冥王揃い
 22: defineAsyncComponent(() => import('./Effect22.vue')), // 紫7揃い
 21: defineAsyncComponent(() => import('./Effect21.vue')), // 青7揃い
 13: defineAsyncComponent(() => import('./Effect13.vue')), // GOGO
 12: defineAsyncComponent(() => import('./Effect12.vue')), // ハイビスカス
 11: defineAsyncComponent(() => import('./Effect11.vue')) // パトランプ
} as const;

const props = defineProps<{
 GodComments: CommentGod[];
}>();

const comments = computed(() => props.GodComments);
const { isModerator, isMember, hasPaidText } = useCommentGuards();

/**
 * コメントの属性を取得
 */
const getCommentAttributes = (comment: CommentGod) => {
 return {
  'data-service': comment.service,
  'data-user': comment.data.name,
  'data-gift': comment.data.hasGift,
  'data-owner': comment.data.isOwner,
  'data-moderator': isModerator(comment as Comment),
  'data-member': isMember(comment as Comment),
  'data-is-new': comment.data.isFirstTime,
  'data-service-name': comment.name,
  'data-service-id': comment.id,
  'data-paid': hasPaidText(comment as Comment),
  'data-rank': comment.godStatus?.rank || 0,
  'data-effect-id': comment.godStatus?.effectId || null
 };
};

/**
 * エフェクトIDに基づいてコンポーネントを決定
 */
const getCommentComponent = (comment: CommentGod) => {
 const effectId = comment.godStatus?.effectId;

 return EFFECT_COMPONENTS[effectId as keyof typeof EFFECT_COMPONENTS] || EffectDefault;
};
</script>

<style scoped>
.comment-enter-active,
.comment-leave-active {
 transition: all 1s 0s;
}

.comment-enter-from {
 transform: translateY(100%) !important;
}

.comment-leave-to {
 transform: translateY(-100%) !important;
}
</style>
