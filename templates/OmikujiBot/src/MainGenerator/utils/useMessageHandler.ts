// src/composables/useMessageHandler.ts
import { ref, computed } from 'vue';
import { BotMessage } from '@/types/types';
import { CommentProcessor } from '../utils/commentProcessor';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function useMessageHandler(omikujiData: any) {
 const botMessages = ref<BotMessage[]>([]);
 const processor = new CommentProcessor(omikujiData);

 // メッセージを isToast で分離
 const normalMessages = computed(() => botMessages.value.filter((message) => !message.isToast));

 const toastMessages = computed(() => botMessages.value.filter((message) => message.isToast));

 // コメント処理
 const processComments = (comments: Comment[]) => {
  if (!comments.length) {
   botMessages.value = [];
   return;
  }

  const processedMessages = processor.processComments(comments);
  Promise.all(
   processedMessages.map((message) => {
    if (!message.delaySeconds) {
     botMessages.value = [...botMessages.value, message];
     return Promise.resolve();
    }

    const delay = message.delaySeconds * 1000;
    return new Promise<void>((resolve) => {
     setTimeout(() => {
      if (!botMessages.value.some((c) => c.id === message.id)) {
       botMessages.value = [...botMessages.value, message];
      }
      resolve();
     }, delay);
    });
   })
  );
 };

 // メッセージをクリア
 const clearMessages = () => {
  botMessages.value = [];
 };

 return {
  // 状態
  botMessages,
  normalMessages,
  toastMessages,
  processor,

  // アクション
  processComments,
  clearMessages
 };
}
