<!-- src/MainGenerator/components/BaseCommentCard.vue -->
<template>
 <div
  class="relative overflow-hidden rounded-lg border-2 shadow-2xl backdrop-blur-sm"
  :class="containerClasses"
  :style="colorStyles.backgroundStyle"
 >
  <!-- 装飾スロット（各エフェクトで自由にカスタマイズ） -->
  <slot name="decoration" />

  <div class="card-body relative z-10 p-2">
   <div class="flex items-start gap-1">
    <!-- アバター部分 -->
    <div class="relative">
     <div
      class="w-8 rounded-full border-2 shadow-lg overflow-hidden m-1"
      :class="avatarBorderClasses"
     >
      <img class="w-full h-full object-cover" :src="comment.data.profileImage" alt="" />
     </div>
    </div>

    <!-- コメント内容部分 -->
    <div class="flex-1">
     <!-- ユーザー名 -->
     <div class="flex items-center flex-wrap gap-2">
      <div class="relative">
       <h3
        class="font-bold drop-shadow-lg relative z-10"
        :class="usernameClasses"
        :style="colorStyles.textStyle"
       >
        {{ comment.data.displayName }}
        <span class="text-xs pl-2">( {{ comment.hitEntry.name }} )</span>
       </h3>
      </div>

      <div class="flex items-center space-x-1">
       <!-- 通常バッジ -->
       <span v-for="(badge, index) in comment.data.badges" :key="'normal-' + index">
        <img
         v-if="badge.url"
         :alt="badge.label"
         :src="badge.url"
         :title="badge.label"
         class="h-5"
        />
       </span>

       <!-- GOD用バッジ -->
       <span v-for="(badge, index) in comment.godStatus?.badges" :key="'god-' + index">
        <img
         v-if="badge.url"
         :alt="badge.label"
         :src="badge.url"
         :title="badge.label"
         class="h-3"
        />
       </span>
      </div>
     </div>

     <!-- 有料テキスト表示 -->
     <div
      v-if="hasPaidText(comment)"
      class="relative mb-2 p-2 mr-2 rounded-lg shadow-lg backdrop-blur-sm"
      :class="paidTextClasses"
     >
      <div class="absolute inset-0 rounded-lg" :class="paidTextBackgroundClasses"></div>
      <div
       class="relative z-10 font-bold drop-shadow-md"
       :class="paidTextContentClasses"
       :style="colorStyles.textStyle"
      >
       {{ comment.data.paidText }}
      </div>
     </div>

     <!-- メンバーシップ表示 -->
     <div
      v-if="hasMembership(comment)"
      class="relative mb-2 p-2 mr-2 rounded-lg shadow-lg backdrop-blur-sm"
      :class="membershipClasses"
     >
      <div class="absolute inset-0 rounded-lg" :class="membershipBackgroundClasses"></div>
      <div
       class="relative z-10 font-semibold drop-shadow-md"
       :class="membershipContentClasses"
       :style="colorStyles.textStyle"
      >
       {{ comment.data.membership.sub }} {{ comment.data.membership.primary }}
      </div>
     </div>

     <!-- コメント本文 -->
     <div class="relative">
      <div
       class="leading-relaxed drop-shadow-md"
       :class="commentTextClasses"
       :style="colorStyles.textStyle"
       v-html="comment.data.comment"
      ></div>
      <!-- コメント本文のシャドウ -->
      <div
       class="absolute inset-0 font-bold opacity-30 blur-sm"
       :class="commentShadowClasses"
       v-html="comment.data.comment"
      ></div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommentGuards } from '@common/subscribe/CommentGuards';
import { CommentBot } from '@/types';
import { getCommentColorStyles } from '../utils/cssToTailwind';

interface Props {
 comment: CommentBot;
 // テーマ設定（各エフェクトで上書き可能）
 theme?: {
  container?: string;
  avatarBorder?: string;
  username?: string;
  paidText?: string;
  paidTextBackground?: string;
  paidTextContent?: string;
  membership?: string;
  membershipBackground?: string;
  membershipContent?: string;
  commentText?: string;
  commentShadow?: string;
 };
}

const props = withDefaults(defineProps<Props>(), {
 theme: () => ({})
});

// コンポーザブル
const { hasMembership, hasPaidText } = useCommentGuards();

// 色情報を計算
const colorStyles = computed(() => getCommentColorStyles(props.comment));

// デフォルトテーマ（EffectDefault相当）
const defaultTheme = {
 container: 'border-primary bg-base-200',
 avatarBorder: 'border-primary',
 username: 'text-base-content',
 paidText: 'border border-secondary bg-secondary/20',
 paidTextBackground: 'bg-secondary/70',
 paidTextContent: 'text-secondary-content',
 membership: 'border border-accent bg-accent/20',
 membershipBackground: 'bg-accent/70',
 membershipContent: 'text-accent-content',
 commentText: 'text-base-content',
 commentShadow: 'text-base-content'
};

// 各要素のクラスを計算
const containerClasses = computed(() => {
 const baseClasses = props.theme.container || defaultTheme.container;
 return colorStyles.value.hasCustomBackground ? baseClasses.replace(/bg-\S+/, '') : baseClasses;
});

const avatarBorderClasses = computed(() => props.theme.avatarBorder || defaultTheme.avatarBorder);

const usernameClasses = computed(() => {
 const baseClasses = props.theme.username || defaultTheme.username;
 return colorStyles.value.hasCustomText ? '' : baseClasses;
});

const paidTextClasses = computed(() => props.theme.paidText || defaultTheme.paidText);
const paidTextBackgroundClasses = computed(
 () => props.theme.paidTextBackground || defaultTheme.paidTextBackground
);
const paidTextContentClasses = computed(() => {
 const baseClasses = props.theme.paidTextContent || defaultTheme.paidTextContent;
 return colorStyles.value.hasCustomText ? '' : baseClasses;
});

const membershipClasses = computed(() => props.theme.membership || defaultTheme.membership);
const membershipBackgroundClasses = computed(
 () => props.theme.membershipBackground || defaultTheme.membershipBackground
);
const membershipContentClasses = computed(() => {
 const baseClasses = props.theme.membershipContent || defaultTheme.membershipContent;
 return colorStyles.value.hasCustomText ? '' : baseClasses;
});

const commentTextClasses = computed(() => {
 const baseClasses = props.theme.commentText || defaultTheme.commentText;
 return colorStyles.value.hasCustomText ? '' : baseClasses;
});

const commentShadowClasses = computed(
 () => props.theme.commentShadow || defaultTheme.commentShadow
);
</script>
