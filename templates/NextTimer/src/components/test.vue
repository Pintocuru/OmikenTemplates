<!-- src/BasicNew.vue -->
<template>
 <div class="container">
  <transition-group class="comments" name="comment" tag="div">
   <div
    v-for="(comment, index) in comments"
    :class="getClassName(index)"
    :key="comment.data.id"
    :style="getStyle(comment)"
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
   >
    <div class="avatar">
     <img alt="" v-if="comment.data.profileImage" :src="comment.data.profileImage" />
    </div>
    <div class="comment-block">
     <div class="name">
      {{ comment.data.displayName }}
      <div class="badge" v-for="(badge, index) in comment.data.badges" :key="index">
       <img v-if="badge.url" :alt="badge.label" :src="badge.url" :title="badge.label" />
       <span v-if="!badge.url">{{ badge.label }}</span>
      </div>
     </div>
     <div class="comment-body">
      <!-- paidText 表示 -->
      <div v-if="hasPaidText(comment)" class="paid-text">
       <strong>{{ comment.data.paidText }}</strong>
      </div>
      <!-- membership 表示 -->
      <div v-if="hasMembership(comment)" class="paid-text">
       {{ comment.data.membership.sub }} {{ comment.data.membership.primary }}
      </div>
      <!-- 通常のコメント -->
      <div class="comment-text" v-html="comment.data.comment"></div>
     </div>
    </div>
   </div>
  </transition-group>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { CommentChara } from '@public/common/commonTypes';
import { NextTimerConfigType } from '@/scripts/types';

const props = defineProps<{
 isInitFlag: boolean;
 nextTimer: CommentChara[];
 timeConfig: NextTimerConfigType;
}>();

// コメント監視とクリーンアップ
const comments = computed(() => {
 console.log(props.nextTimer);
 return props.nextTimer; // そのまま newComments を返す
});

// getClassName は index を引数にして偶数・奇数でクラスを返す
const getClassName = (index: any) => (index % 2 === 0 ? 'comment even' : 'comment odd');
const getStyle = (comment: Comment) => OneSDK.getCommentStyle(comment);

// 共通の型ガード関数
function hasProperty<T extends keyof any, V>(
 comment: Comment,
 key: T,
 typeGuard: (value: any) => value is V
): comment is Comment & { data: { [K in T]: V } } {
 return key in comment.data && typeGuard((comment.data as any)[key]);
}

// 型ガード: membership を持つか
const hasMembership = (comment: Comment) =>
 hasProperty(
  comment,
  'membership',
  (value): value is { sub: string; primary: string } =>
   typeof value === 'object' &&
   value !== null &&
   typeof value.sub === 'string' &&
   typeof value.primary === 'string'
 );

// 型ガード: isModerator を持つか
function isModerator(comment: Comment): comment is Comment & { data: { isModerator: boolean } } {
 return hasProperty(
  comment,
  'isModerator',
  (value): value is boolean => typeof value === 'boolean'
 );
}

// 型ガード: isMember を持つか
function isMember(comment: Comment): comment is Comment & { data: { isMember: boolean } } {
 return hasProperty(comment, 'isMember', (value): value is boolean => typeof value === 'boolean');
}

// 型ガード: paidText を持つか
function hasPaidText(comment: Comment): comment is Comment & { data: { paidText: string } } {
 return hasProperty(
  comment,
  'paidText',
  (value): value is string => typeof value === 'string' && value.trim() !== ''
 );
}
</script>
