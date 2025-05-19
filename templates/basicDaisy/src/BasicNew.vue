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
import { useCommentGuards } from '@common/subscribe/CommentGuards';

const props = defineProps<{ newComments: Comment[] }>();

const comments = computed(() => {
 return props.newComments;
});

// コンポーザブル
const { hasMembership, isModerator, isMember, hasPaidText } = useCommentGuards();
const getClassName = (index: any): string => {
 return parseInt(index, 10) % 2 === 0 ? 'comment even' : 'comment odd';
};
const getStyle = (comment: Comment) => OneSDK.getCommentStyle(comment);
</script>
