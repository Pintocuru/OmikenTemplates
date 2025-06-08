// src/MainGenerator/utils/processors/CommentRuleProcessor.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { CommentRule, PostAction } from '@/types/OmikujiTypes';
import { checkThresholdComment } from './ThresholdCommentChecker';
import { charasSampleData } from '@/omikujiSampleData';
import { BotMessage } from '@/types/types';

/**
 * コメント重複時のPostAction調整
 */
export function sanitizePostActionsForDuplicate(postActions: PostAction[]): PostAction[] {
 return postActions.map((action) => ({
  ...action,
  wordParty: '',
  messageToast: action.messageContent,
  messageContent: ''
 }));
}

/**
 * クールダウン中のトースト
 */
function createProcessingCooldownToast(ruleName: string): PostAction[] {
 return [
  {
   characterKey: Object.values(charasSampleData)[0]?.id,
   iconKey: 'Default',
   delaySeconds: 0,
   wordParty: '',
   messageContent: '',
   messageToast: `コメントが被って、「${ruleName}」ができなかったよ。またコメントしてね。`
  }
 ];
}

/**
 * コメントルール処理関数
 */
export function processCommentRule(
 comment: Comment,
 rule: CommentRule,
 isDuplicateComment: boolean,
 cannotProcess = false
): { success: boolean; toastActions?: PostAction[] } {
 try {
  if (!checkThresholdComment(comment, rule.threshold)) {
   return { success: false };
  }

  if (cannotProcess) {
   return {
    success: true,
    toastActions: createProcessingCooldownToast(rule.name)
   };
  }

  // isDuplicateComment=true(おみくじ完了後)、キーワード処理がある場合はスキップする
  if (isDuplicateComment && rule.threshold.conditions.includes('comment')) {
   return { success: false };
  }

  return { success: true };
 } catch (error) {
  console.error('コメントルール処理エラー:', error);
  return { success: false };
 }
}

/**
 * 単一のPostActionからBotMessageを生成
 */
export function generateToastFromAction(postAction: PostAction): BotMessage {
 const characterKey = postAction.characterKey;

 return {
  id: crypto.randomUUID(),
  name: charasSampleData[characterKey]?.name ?? '',
  profileImage: charasSampleData[characterKey]?.image[postAction.iconKey] ?? '',
  timestamp: new Date().toISOString(),
  comment: postAction.messageToast,
  isToast: true,
  color: charasSampleData[characterKey]?.color ?? '#000000',
  delaySeconds: postAction.delaySeconds
 };
}

/**
 * 複数のPostActionからBotMessageの配列を生成
 */
export function generateToastsFromActions(postActions: PostAction[]): BotMessage[] {
 const toastActions = postActions.filter((action) => action.messageToast?.trim());

 if (toastActions.length === 0) return [];

 const botMessages = toastActions.map((action) => generateToastFromAction(action));

 return botMessages;
}
