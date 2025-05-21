<!-- src/MainGenerator/components/BasicNew.vue -->
<template>
 <div class="container p-4">
  <transition-group class="comments flex flex-col gap-3" name="comment" tag="div">
   <div
    v-for="(comment, index) in comments"
    :key="comment.data.id"
    :data-service="comment.service"
    :data-user="comment.data.name"
    :data-gift="comment.data.hasGift"
    :data-owner="comment.data.isOwner"
    :data-moderator="isModerator(comment)"
    :data-member="isMember(comment)"
    :data-is-new="comment.data.isFirstTime"
    :data-service-name="comment.name"
    :data-service-id="comment.id"
    :data-paid="hasPaidText(comment)"
    :data-rank="getUserRank(comment)"
    :data-effect-id="getUserEffectId(comment)"
   >
    <!-- コメントの動的コンポーネント選択 -->
    <component :is="getCommentComponent(comment)" :comment="comment" />
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { useCommentGuards } from '@common/subscribe/CommentGuards';
import { ExtendedServiceVisitType } from '../utils/userVisitProcessor';

// 基本のコメントコンポーネント
import EffectDefault from './EffectDefault.vue';

// エフェクトコンポーネントを遅延ロード
const Effect41 = defineAsyncComponent(() => import('./Effect41.vue'));
const Effect31 = defineAsyncComponent(() => import('./Effect31.vue'));
const Effect24 = defineAsyncComponent(() => import('./Effect24.vue'));
const Effect23 = defineAsyncComponent(() => import('./Effect23.vue'));
const Effect22 = defineAsyncComponent(() => import('./Effect22.vue'));
const Effect21 = defineAsyncComponent(() => import('./Effect21.vue'));
const Effect13 = defineAsyncComponent(() => import('./Effect13.vue'));
const Effect12 = defineAsyncComponent(() => import('./Effect12.vue'));
const Effect11 = defineAsyncComponent(() => import('./Effect11.vue'));

const props = defineProps<{
 newComments: Comment[];
 userVisits: Record<string, ExtendedServiceVisitType>;
}>();

const comments = computed(() => {
 return props.newComments;
});

// コンポーザブル
const { hasMembership, isModerator, isMember, hasPaidText } = useCommentGuards();

/**
 * ユーザーのランクを取得
 */
const getUserRank = (comment: Comment): number => {
 const userId = comment.data.userId;
 const serviceId = comment.id;

 // userVisits からユーザーのランクを取得
 if (
  props.userVisits &&
  props.userVisits[serviceId] &&
  props.userVisits[serviceId].user &&
  props.userVisits[serviceId].user[userId]
 ) {
  return props.userVisits[serviceId].user[userId].rank || 0;
 }

 return 0;
};

/**
 * ユーザーのエフェクトIDを取得
 */
const getUserEffectId = (comment: Comment): number | null => {
 const userId = comment.data.userId;
 const serviceId = comment.id;

 // userVisits からユーザーのエフェクトIDを取得
 if (
  props.userVisits &&
  props.userVisits[serviceId] &&
  props.userVisits[serviceId].user &&
  props.userVisits[serviceId].user[userId]
 ) {
  return props.userVisits[serviceId].user[userId].effectId;
 }

 return null;
};

/**
 * ユーザーのエフェクトIDに基づいてコンポーネントを決定
 */
const getCommentComponent = (comment: Comment) => {
 const effectId = getUserEffectId(comment);

 // effectIdに基づいて適切なコンポーネントを返す
 switch (effectId) {
  case 41: // 全回転GOD
   return Effect41;
  case 31: // GOD
   return Effect31;
  case 24: // 赤7揃い - 宇宙背景
   return Effect24;
  case 23: // 冥王揃い
   return Effect23;
  case 22: // 紫7揃い
   return Effect22;
  case 21: // 青7揃い
   return Effect21;
  case 13: // GOGO
   return Effect13;
  case 12: // ハイビスカス
   return Effect12;
  case 11: // パトランプ
   return Effect11;
  default:
   return EffectDefault;
 }
};
</script>

<style scoped>
.comment-enter-active,
.comment-leave-active {
 transition: all var(--lcv-enter-duration) var(--lcv-enter-easing);
}
.comment-enter-from {
 transform: translateY(100%) !important;
}
.comment-leave-to {
 transform: translateY(-100%) !important;
}
</style>
