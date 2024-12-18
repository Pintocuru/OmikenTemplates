<template>
 <div id="container">
  <TransitionGroup class="comments" name="comment" tag="div">
   <div v-for="comment in displayComments" :key="comment.data.id" class="comment" :style="comment.css">
    <div class="comment-text">{{ comment.data.comment }}</div>
    <img v-if="comment.data.profileImage" :src="comment.data.profileImage" class="avatar" :alt="comment.name" />
   </div>
  </TransitionGroup>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { CommentTemp } from './commentTypes';

// props
const props = defineProps<{ botComments: CommentTemp[] }>();

// コメント表示用のリアクティブ配列
const displayComments = ref<CommentTemp[]>([]);

// タイマーを管理するためのマップ
const commentTimers = new Map<string, NodeJS.Timeout>();

// コメントを追加し、15秒後に自動削除
const addComment = (comment: CommentTemp) => {
  // 新しいコメントを先頭に追加
  displayComments.value.push(comment);

  // 15秒後に削除するタイマーをセット
  const timer = setTimeout(() => {
    const index = displayComments.value.findIndex(msg => msg.data.id === comment.data.id);
    if (index !== -1) {
      displayComments.value.splice(index, 1);
    }
    commentTimers.delete(comment.data.id);
  }, 15000);

  // タイマーを保存
  commentTimers.set(comment.data.id, timer);
};

// プロパティの変更を監視
watch(
  () => props.botComments, 
  (newComments) => {
    // 重複を避けつつ、新しいコメントを追加
    newComments.forEach(comment => {
      // すでに表示されているコメントは追加しない
      if (!displayComments.value.some(c => c.data.id === comment.data.id)) {
        addComment(comment);
      }
    });
  }, 
  { immediate: true, deep: true }
);

// コンポーネントがアンマウントされたときにタイマーをクリーンアップ
onUnmounted(() => {
  commentTimers.forEach(timer => clearTimeout(timer));
});
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