<!-- src/MainGenerator/components/Effect41.vue -->
<template>
 <div class="golden-comment card relative overflow-hidden">
  <!-- ゴールドエフェクト用の背景レイヤー -->
  <div class="absolute inset-0 golden-bg"></div>

  <!-- キラキラエフェクト -->
  <div class="sparkles absolute inset-0 pointer-events-none z-10"></div>

  <div class="card-body p-4 relative z-20">
   <!-- 豪華な装飾フレーム -->
   <div class="golden-frame absolute inset-0"></div>

   <!-- コンテンツ -->
   <div class="flex items-start gap-3 relative z-30">
    <!-- アバター部分 -->
    <div class="avatar">
     <div class="w-14 h-14 rounded-full ring-4 ring-yellow-300 shadow-lg golden-avatar">
      <img :src="comment.data.profileImage" alt="" />
     </div>
    </div>

    <!-- コメント内容部分 -->
    <div class="flex-1">
     <!-- ユーザー名とバッジ -->
     <div class="flex items-center flex-wrap gap-1 mb-2">
      <h3 class="font-bold text-xl text-yellow-100 golden-text">
       {{ comment.data.displayName }}
      </h3>

      <!-- その他のバッジ -->
      <div
       v-for="(badge, index) in comment.data.badges"
       :key="index"
       class="badge badge-sm bg-yellow-500"
      >
       <img v-if="badge.url" :alt="badge.label" :src="badge.url" :title="badge.label" class="h-4" />
       <span v-else>{{ badge.label }}</span>
      </div>
     </div>

     <!-- 有料テキスト表示 -->
     <div
      v-if="hasPaidText(comment)"
      class="alert bg-yellow-400 text-yellow-900 mb-2 py-2 border border-yellow-500"
     >
      <div class="font-bold">{{ comment.data.paidText }}</div>
     </div>

     <!-- メンバーシップ表示 -->
     <div
      v-if="hasMembership(comment)"
      class="alert bg-yellow-500 text-yellow-900 mb-2 py-2 border border-yellow-600"
     >
      <div>{{ comment.data.membership.sub }} {{ comment.data.membership.primary }}</div>
     </div>

     <!-- コメント本文 -->
     <div
      class="comment-text prose prose-yellow text-yellow-100 prose-headings:text-yellow-200 prose-strong:text-yellow-200"
     >
      <div v-html="comment.data.comment"></div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCommentGuards } from '@common/subscribe/CommentGuards';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

const props = defineProps<{
 comment: Comment;
}>();

// コンポーザブル
const { hasMembership, hasPaidText } = useCommentGuards();

// マウント時にキラキラエフェクトを作成
onMounted(() => {
 createSparkles();
});

// キラキラエフェクトの作成
const createSparkles = () => {
 const sparkleContainer = document.querySelector('.sparkles');
 if (!sparkleContainer) return;

 for (let i = 0; i < 15; i++) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.animationDelay = `${Math.random() * 5}s`;
  sparkle.style.animationDuration = `${1 + Math.random() * 3}s`;
  sparkleContainer.appendChild(sparkle);
 }
};
</script>

<style scoped>
.golden-comment {
 background: linear-gradient(
  135deg,
  #462523 0%,
  #cb9b51 22%,
  #f6e27a 45%,
  #f6f2c0 50%,
  #f6e27a 55%,
  #cb9b51 78%,
  #462523 100%
 );
 transform-style: preserve-3d;
 transition: all 0.3s ease;
 box-shadow: 0 10px 30px rgba(203, 155, 81, 0.6);
}

.golden-comment:hover {
 transform: translateY(-5px) scale(1.01);
 box-shadow: 0 15px 35px rgba(203, 155, 81, 0.8);
}

.golden-bg {
 background: linear-gradient(45deg, #000000, #1a1000);
 opacity: 0.9;
}

.golden-frame {
 border: 4px solid transparent;
 border-image: linear-gradient(to bottom right, #f6e27a, #cb9b51, #f6e27a, #cb9b51) 1;
 box-shadow: inset 0 0 20px rgba(246, 226, 122, 0.5);
 pointer-events: none;
}

.golden-text {
 text-shadow:
  0 0 5px #f6e27a,
  0 0 10px #cb9b51;
}

.golden-avatar {
 box-shadow: 0 0 15px #f6e27a;
}

.sparkle {
 position: absolute;
 width: 8px;
 height: 8px;
 background-color: #ffffff;
 border-radius: 50%;
 opacity: 0;
 animation: sparkle-animation ease-in-out infinite;
 box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
}

@keyframes sparkle-animation {
 0% {
  opacity: 0;
  transform: scale(0.2);
 }
 50% {
  opacity: 1;
  transform: scale(1);
 }
 100% {
  opacity: 0;
  transform: scale(0.2);
 }
}
</style>
