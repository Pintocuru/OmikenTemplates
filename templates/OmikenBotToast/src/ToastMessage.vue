<template>
  <div id="message-container">
    <TransitionGroup name="message-fade" tag="div">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message"
        :style="{
          color: message.textColor,
          backgroundColor: message.backgroundColor
        }"
      >
        <div class="message-content">{{ message.content }}</div>
        <img 
          v-if="message.profileImage" 
          :src="message.profileImage" 
          class="message-image" 
          :alt="message.name" 
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ProcessedComment } from './commentTypes';

export default defineComponent({
  props: {
    processedComments: {
      type: Array as () => ProcessedComment[],
      default: () => []
    }
  },
  setup(props) {
    const messages = ref<ProcessedComment[]>([]);

    // プロップスの変更を監視して自動的にメッセージを追加
    watch(() => props.processedComments, (newComments) => {
      // 新しいコメントがあれば追加
      newComments.forEach(comment => {
        console.log(comment);
        if (!messages.value.some(msg => msg.id === comment.id)) {
          messages.value.unshift(comment);
        }
      });

      // 古いメッセージを削除
      messages.value = messages.value.filter(msg => 
        props.processedComments.some(comment => comment.id === msg.id)
      );
    }, { immediate: true });

    // 旧来のAPIとの互換性のため
    function showComment(comment: ProcessedComment) {
      if (!messages.value.some(msg => msg.id === comment.id)) {
        messages.value.unshift(comment);
      }
    }

    return {
      messages,
      showComment
    };
  }
});
</script>

<style scoped>
/* 以前のスタイルをそのまま保持 */
#message-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 5000;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
}

.message {
  display: flex;
  align-items: center;
  padding: 5px 5px 5px 25px;
  border-radius: 995px;
  font-size: 28px;
  margin-top: 10px;
  max-width: 600px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  user-select: none;
}

.message-content {
  flex-grow: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.message-image {
  width: 50px;
  height: 50px;
  margin-left: 5px;
  object-fit: cover;
  border-radius: 25px;
}
</style>