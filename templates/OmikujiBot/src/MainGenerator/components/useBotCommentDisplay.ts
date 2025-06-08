// composables/useBotCommentDisplay.ts
import { ref, computed, type Ref } from 'vue';
import { BotMessage } from '@/types/types';

const DISPLAY_CONFIG = {
 INTERVAL: 250,
 BASE_LIFE_TIME: 10000,
 THRESHOLD: 30,
 EXTRA_TIME_PER_CHAR: 100
} as const;

export const useBotCommentDisplay = (botMessages: Ref<BotMessage[]>, maxDisplayedComments = 5) => {
 const displayedComments = ref<BotMessage[]>([]);
 const animationFrameId = ref<number>();

 const comments = computed(() => {
  return Array.isArray(botMessages) ? botMessages : botMessages.value;
 });

 // スタイル計算の最適化
 const getCommentStyles = (displayIndex: number, message: BotMessage) => {
  const brightness = Math.max(100 - displayIndex * 15, 30);
  const backgroundColor = message.color?.backgroundColor || '#ffffff';

  return {
   backgroundColor,
   filter: `brightness(${brightness}%)`
  };
 };

 const getArrowStyles = (displayIndex: number, message: BotMessage) => {
  const brightness = Math.max(100 - displayIndex * 15, 30);
  const backgroundColor = message.color?.backgroundColor || '#ffffff';

  return {
   borderLeft: '20px solid transparent',
   borderRight: '20px solid transparent',
   borderTop: `20px solid ${backgroundColor}`,
   filter: `brightness(${brightness}%)`
  };
 };

 const getAvatarStyles = (displayIndex: number) => {
  const isLatest = displayIndex === 0;

  return {
   top: '400px',
   opacity: isLatest ? '100%' : '0%',
   zIndex: 9999
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

 // コメント表示制御の最適化
 const useCommentDisplayControl = () => {
  let lastTime = 0;
  let processedMessageIds = new Set<string>();
  const commentTimers = new Map<string, number>();

  const processNewComments = (now: number) => {
   if (now - lastTime <= DISPLAY_CONFIG.INTERVAL) return;

   const newComments = comments.value.filter((comment) => !processedMessageIds.has(comment.id));
   if (newComments.length === 0) return;

   lastTime = now;
   const nextComment = newComments[0];

   // 表示時間の計算
   const commentLength = nextComment.comment?.length ?? 0;
   const extraTime =
    Math.max(commentLength - DISPLAY_CONFIG.THRESHOLD, 0) * DISPLAY_CONFIG.EXTRA_TIME_PER_CHAR;
   const totalLifeTime = DISPLAY_CONFIG.BASE_LIFE_TIME + extraTime;

   // コメント追加
   displayedComments.value.unshift(nextComment);
   commentTimers.set(nextComment.id, now + totalLifeTime);
   processedMessageIds.add(nextComment.id);

   // 表示数制限
   if (displayedComments.value.length > maxDisplayedComments) {
    const removedComment = displayedComments.value.pop();
    if (removedComment) {
     commentTimers.delete(removedComment.id);
    }
   }
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

  const update = (now = Date.now()) => {
   processNewComments(now);
   removeExpiredComments(now);
   animationFrameId.value = requestAnimationFrame(update);
  };

  const start = () => {
   update();
  };

  const stop = () => {
   if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
   }
   commentTimers.clear();
  };

  return { start, stop };
 };

 const displayControl = useCommentDisplayControl();

 return {
  displayedComments,
  getCommentStyles,
  getArrowStyles,
  getAvatarStyles,
  getImagePath,
  handleImageError,
  start: displayControl.start,
  stop: displayControl.stop
 };
};
