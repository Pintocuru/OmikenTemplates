<template>
 <div id="container">
  <TransitionGroup class="comments" name="comment" tag="div">
   <div v-for="comment in commentDisplays" :key="comment.data.id" class="comment" :style="comment.css">
    <div class="comment-text">{{ comment.data.comment }}</div>
    <img
     v-show="comment.data.profileImage"
     :src="comment.data.profileImage"
     class="avatar"
     :alt="comment.data.name"
    />
   </div>
  </TransitionGroup>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { CommentTemp } from './commentTypes';

// props
const props = defineProps<{ botComments: CommentTemp[] }>();

// コメント管理用のリアクティブ変数
const commentDisplays = ref<CommentTemp[]>([]);
const commentTimers = new Map<string, NodeJS.Timeout>();
const commentCompIds = new Set<string>();

// コメントを追加し、15秒後に自動削除
const addComment = (comment: CommentTemp) => {
 if (commentCompIds.has(comment.data.id)) return;

 commentDisplays.value.push(comment);
 commentCompIds.add(comment.data.id);

 const timer = setTimeout(() => {
  commentDisplays.value = commentDisplays.value.filter((c) => c.data.id !== comment.data.id);
  commentTimers.delete(comment.data.id);
 }, 15000);

 commentTimers.set(comment.data.id, timer);
};

// Propsの変更を監視
watch(
 () => props.botComments,
 (newComments) => {
  newComments.forEach(addComment);
 },
 { deep: true }
);

// タイマーをクリーンアップ
const clearAllTimers = () => {
 commentTimers.forEach((timer) => clearTimeout(timer));
 commentTimers.clear();
};

onUnmounted(clearAllTimers);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@900&display=swap');

#container {
 position: fixed;
 bottom: 20px;
 right: 20px;
 z-index: 5000;
 display: flex;
 flex-direction: column;
 align-items: flex-end;
}

.comments {
 display: flex;
 flex-direction: column;
}

.comment {
 font-family: 'Zen Maru Gothic', serif;
 display: flex;
 align-items: center;
 padding: 5px 5px 5px 25px;
 border-radius: 995px;
 font-size: 22px;
 margin-top: 10px;
 max-width: 600px;
 box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
 user-select: none;
 background-color: var(--lcv-background-color);
 color: var(--lcv-text-color);
}

.comment-text {
 flex-grow: 1;
 word-wrap: break-word;
 overflow-wrap: break-word;
}

.avatar {
 width: 50px;
 height: 50px;
 margin-left: 5px;
 object-fit: cover;
 border-radius: 25px;
}

/* トランジションアニメーション */
.comment-enter-active,
.comment-leave-active {
 transition: all 0.5s ease;
}

.comment-enter-from {
 opacity: 0;
 transform: translateY(50px); /* 下から表示 */
}

.comment-leave-to {
 opacity: 0;
 transform: translateY(-50px); /* 上に消える */
}
</style>
