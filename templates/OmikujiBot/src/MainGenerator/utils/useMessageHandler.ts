// src/composables/useMessageHandler.ts
import { ref, onUnmounted } from 'vue';
import { BotMessage } from '@type/';
import { OmikujiDataType, PostActionType } from '@type/';
import { ScriptManager } from '@/MainGenerator/utils/ScriptManager';
import { CommentProcessor } from '@/MainGenerator/utils/CommentProcessor';
import { TimerProcessor } from '@/MainGenerator/utils/timerProcessor';
import { CharacterCollector } from '@/MainGenerator/utils/CharacterCollector';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function useMessageHandler(omikujiData: OmikujiDataType) {
 const botMessages = ref<BotMessage[]>([]);
 const scriptManager = new ScriptManager(omikujiData);
 const commentProcessor = new CommentProcessor(omikujiData, scriptManager);
 const timerProcessor = new TimerProcessor(omikujiData);
 const characterCollector = new CharacterCollector(omikujiData);

 // メッセージ処理の共通ロジック
 const processMessages = (processedMessages: BotMessage[]) => {
  if (!processedMessages.length) return;

  Promise.all(
   processedMessages.map((message) => {
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

 // コメント処理
 const processComments = (comments: Comment[]) => {
  if (!comments.length) {
   botMessages.value = [];
   return;
  }

  const processedMessages = commentProcessor.processComments(comments);
  processMessages(processedMessages);
 };

 // タイマーベースのメッセージ処理
 const processTimerMessages = (processedMessages: BotMessage[]) => {
  processMessages(processedMessages);
 };

 // タイマー開始
 const startTimers = () => {
  timerProcessor.startTimers(processTimerMessages);
 };

 // タイマー停止
 const stopTimers = () => {
  timerProcessor.stopTimers();
 };

 // メッセージをクリア
 const clearMessages = () => {
  botMessages.value = [];
 };

 // コンポーネントアンマウント時にタイマーを停止
 onUnmounted(() => {
  stopTimers();
 });

 return {
  // 状態
  botMessages,
  scriptManager,
  characterCollector,

  // アクション
  processComments,
  processTimerMessages,
  startTimers,
  stopTimers,
  clearMessages
 };
}
