// src/MainGenerator/utils/processors/CommentRuleProcessor.ts
import { CommentRuleType, PostActionType, validateOmikujiData } from '@/types/OmikujiTypesSchema';
import { BotMessage } from '@/types/types';
import { checkThresholdComment } from './ThresholdCommentChecker';
import { SETTINGS } from '@common/settings';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// omikujiData (元データが深すぎるのでwindowから引っ張る)
const omikujiData = validateOmikujiData(window.omikujiData);
const characters = omikujiData.characters;

/**
 * コメント重複時のPostAction調整
 * 重複コメントの場合、メッセージ内容をトーストに移動し、コンテンツとパーティーワードをクリア
 */
export function sanitizePostActionsForDuplicate(postActions: PostActionType[]): PostActionType[] {
 return postActions.map((action) => ({
  ...action,
  wordParty: '',
  messageToast: action.messageContent,
  messageContent: ''
 }));
}

/**
 * クールダウン中のトーストメッセージを生成
 */
function createProcessingCooldownToast(ruleName: string): PostActionType[] {
 const firstCharacter = Object.values(characters)[0];

 return [
  {
   characterKey: firstCharacter?.id,
   iconKey: 'default',
   delaySeconds: 0,
   wordParty: '',
   messageContent: '',
   messageToast: `コメントが被って、「${ruleName}」ができなかったよ。またコメントしてね。`
  }
 ];
}

/**
 * コメントルール処理関数
 * コメントが指定されたルールの条件を満たすかどうかを判定し、必要に応じてトーストアクションを生成
 */
export function processCommentRule(
 comment: Comment,
 rule: CommentRuleType,
 isDuplicateComment: boolean,
 cannotProcess = false
): { success: boolean; toastActions?: PostActionType[] } {
 try {
  // 閾値チェック
  if (!checkThresholdComment(comment, rule.threshold)) {
   return { success: false };
  }

  // 処理できない場合（クールダウン中など）
  if (cannotProcess) {
   return {
    success: true,
    toastActions: createProcessingCooldownToast(rule.name)
   };
  }

  // 重複コメントで、かつコメント条件を含む場合はスキップ
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
 * キャラクター情報の取得
 * 指定されたキャラクターキーに対応するキャラクターデータを取得
 */
function getCharacterInfo(characterKey: string) {
 return characters[characterKey];
}

/**
 * キャラクターアイコンの取得
 * 指定されたアイコンキーに対応するアイコンを取得し、存在しない場合はデフォルトアイコンを返す
 */
function getCharacterIcon(character: any, iconKey: string): string {
 const iconMap = character?.image;

 if (!iconMap) {
  return '';
 }

 // 指定されたアイコンキーが存在する場合
 if (iconMap[iconKey]) {
  return iconMap[iconKey];
 }

 // デフォルトアイコンにフォールバック
 return iconMap['default'] || '';
}

/**
 * 一意のIDを生成
 */
function generateUniqueId(): string {
 return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * 単一のPostActionからBotMessageを生成
 */
export function generateToastFromAction(PostActionType: PostActionType): BotMessage {
 const character = getCharacterInfo(PostActionType.characterKey);
 const profileImage = getCharacterIcon(character, PostActionType.iconKey);

 return {
  id: generateUniqueId(),
  name: character?.name ?? '',
  profileImage,
  timestamp: new Date().toISOString(),
  comment: PostActionType.messageToast,
  isToast: true,
  color: character?.color ?? '#000000',
  delaySeconds: PostActionType.delaySeconds + SETTINGS.basicDelaySeconds
 };
}

/**
 * 有効なトーストメッセージを持つPostActionをフィルタリング
 */
function filterValidToastActions(postActions: PostActionType[]): PostActionType[] {
 return postActions.filter((action) => action.messageToast?.trim());
}

/**
 * 複数のPostActionからBotMessageの配列を生成
 */
export function generateToastsFromActions(postActions: PostActionType[]): BotMessage[] {
 const validToastActions = filterValidToastActions(postActions);

 if (validToastActions.length === 0) {
  return [];
 }

 return validToastActions.map((action) => generateToastFromAction(action));
}
