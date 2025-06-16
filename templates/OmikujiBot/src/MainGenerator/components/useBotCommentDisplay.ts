// composables/useBotCommentDisplay.ts
import { ref, computed, type Ref } from 'vue';
import { BotMessage } from '@/types/types';

const DISPLAY_CONFIG = {
 INTERVAL: 250,
 BASE_LIFE_TIME: 10000,
 THRESHOLD: 30,
 EXTRA_TIME_PER_CHAR: 100 // 文字数が多い場合は表示時間を延長
} as const;

export type DisplayMode = 'comment' | 'toast';

export const useBotCommentDisplay = (
 botMessages: Ref<BotMessage[]>,
 mode: DisplayMode = 'comment'
) => {
 const displayedComments = ref<BotMessage[]>([]);
 const animationFrameId = ref<number>();

 const comments = computed(() => {
  const allMessages = botMessages.value;
  return allMessages.filter((message) => (mode === 'comment' ? !message.isToast : message.isToast));
 });

 // スタイル計算を統一
 const getCommentStyles = (displayIndex: number, message: BotMessage) => {
  const backgroundColor = message.color?.backgroundColor || '#ffffff';

  if (mode === 'toast') {
   return { backgroundColor };
  }

  const brightness = Math.max(100 - displayIndex * 15, 30);
  return {
   backgroundColor,
   filter: `brightness(${brightness}%)`
  };
 };

 const getAvatarStyles = (displayIndex: number) => {
  if (mode === 'toast') return {};

  return {
   opacity: displayIndex === 0 ? '100%' : '0%'
  };
 };

 const getImagePath = (profileImage: string): string => {
  return profileImage.startsWith('http') || profileImage.startsWith('/')
   ? profileImage
   : `/${profileImage}`;
 };

 const handleImageError = (message: BotMessage) => {
  console.error(`画像が読み込めません: ${message.profileImage}`, {
   name: message.name,
   id: message.id,
   originalPath: message.profileImage,
   processedPath: getImagePath(message.profileImage ?? '')
  });
 };

 // トースト用の手動削除機能
 const removeItem = (messageId: string) => {
  const index = displayedComments.value.findIndex((item) => item.id === messageId);
  if (index > -1) {
   displayedComments.value.splice(index, 1);
  }
 };

 // 表示制御ロジック
 const useCommentDisplayControl = () => {
  let lastTime = 0;
  let processedMessageIds = new Set<string>();
  const commentTimers = new Map<string, number>();

  const processNewComments = (now: number) => {
   if (now - lastTime <= DISPLAY_CONFIG.INTERVAL) return;
   const newComments = comments.value.filter((comment) => !processedMessageIds.has(comment.id));
   if (newComments.length === 0) return;

   lastTime = now;

   // 新しいコメントを処理
   newComments.forEach((nextComment) => {
    // 表示時間の計算（現在時刻を基準に設定）
    let totalLifeTime: number;

    const commentLength = nextComment.comment?.length ?? 0;
    const extraTime =
     Math.max(commentLength - DISPLAY_CONFIG.THRESHOLD, 0) * DISPLAY_CONFIG.EXTRA_TIME_PER_CHAR;
    totalLifeTime = DISPLAY_CONFIG.BASE_LIFE_TIME + extraTime;

    displayedComments.value.unshift(nextComment);
    commentTimers.set(nextComment.id, Date.now() + totalLifeTime);
    processedMessageIds.add(nextComment.id);
   });
  };

  const removeExpiredComments = (now: number) => {
   displayedComments.value = displayedComments.value.filter((comment) => {
    const expireTime = commentTimers.get(comment.id);
    if (expireTime && now > expireTime) {
     commentTimers.delete(comment.id);
     return false;
    }
    return true;
   });
  };

  const update = () => {
   const now = Date.now();
   processNewComments(now);
   removeExpiredComments(now);
   animationFrameId.value = requestAnimationFrame(update);
  };

  const start = () => {
   processedMessageIds.clear();
   commentTimers.clear();
   displayedComments.value = [];
   update();
  };

  const stop = () => {
   if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
   }
   commentTimers.clear();
   processedMessageIds.clear();
  };

  return { start, stop };
 };

 const displayControl = useCommentDisplayControl();

 return {
  displayedComments,
  getCommentStyles,
  getAvatarStyles,
  getImagePath,
  handleImageError,
  removeItem,
  start: displayControl.start,
  stop: displayControl.stop
 };
};
