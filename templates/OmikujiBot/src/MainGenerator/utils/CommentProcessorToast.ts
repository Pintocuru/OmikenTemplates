// src/MainGenerator/utils/CommentProcessorToast.ts
import { BotMessage } from '@/types/types';
import { CommentRuleType, PostActionType } from '@type/';
import { checkThresholdComment } from './ThresholdCommentChecker';
import { SETTINGS } from '@public/common/settings';
import { Comment } from '@onecomme.com/onesdk';
import { CharacterEmotionType, CharacterType } from '@type/';

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
 * コメントルール処理関数
 * コメントが指定されたルールの条件を満たすかどうかを判定し、必要に応じてトーストアクションを生成
 */
export function processCommentRule(
 comment: Comment,
 rule: CommentRuleType,
 firstCharacterId: string,
 isDuplicateComment: boolean,
 cannotProcess = false
): { success: boolean; toastActions?: PostActionType[] } {
 try {
  // 条件チェック 当てはまらないならfalseを返す
  if (!checkThresholdComment(comment, rule.threshold)) {
   return { success: false };
  }

  // 処理できない場合、クールダウン中のトーストメッセージを生成
  if (cannotProcess) {
   return {
    success: true,
    toastActions: [
     {
      characterKey: firstCharacterId,
      iconKey: 'default',
      delaySeconds: 0,
      wordParty: '',
      messageContent: '',
      messageToast: `コメントが被って、「${rule.name}」ができなかったよ。またコメントしてね。`
     }
    ]
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

export class BotMessageGenerator {
 private characters: Record<string, CharacterType>;

 constructor(characters: Record<string, CharacterType>) {
  this.characters = characters;
 }

 /**
  * BOTコメントの処理
  */
 processBotComment(comment: Comment): BotMessage | null {
  const character = Object.values(this.characters).find((char) =>
   comment.data.id.includes(char.id)
  );
  if (!character) return null;

  return {
   id: comment.data.id,
   name: comment.data.name,
   profileImage: character.isIconDisplay ? comment.data.profileImage : null,
   timestamp: comment.data.timestamp,
   comment: comment.data.comment,
   isToast: false,
   color: character.color,
   delaySeconds: 0
  };
 }

 /**
  * 単一のPostActionからBotMessageを生成します。
  * @param postAction 処理する単一のPostAction
  * @returns 生成されたBotMessage
  */
 generateToast(postAction: PostActionType): BotMessage {
  const character = this.characters[postAction.characterKey];

  return {
   id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
   name: character?.name ?? '',
   profileImage: character.isIconDisplay
    ? this.getCharacterIcon(character, postAction.iconKey)
    : null,
   timestamp: new Date().toISOString(),
   comment: postAction.messageToast,
   isToast: true,
   color: character?.color ?? '#000000',
   delaySeconds: postAction.delaySeconds + SETTINGS.basicDelaySeconds
  };
 }

 /**
  * キャラクターアイコンの取得
  * 指定されたアイコンキーに対応するアイコンを取得し、存在しない場合はデフォルトアイコンを返す
  */
 private getCharacterIcon(character: CharacterType, iconKey: CharacterEmotionType): string | null {
  const iconMap = character?.image;
  if (!iconMap) return null;

  const iconValue = iconMap[iconKey];
  if (iconValue && iconValue !== '') return iconValue;

  const defaultIcon = iconMap['default'];
  return defaultIcon && defaultIcon !== '' ? defaultIcon : null;
 }

 /**
  * 複数のPostActionからBotMessageの配列を生成します。
  * @param postActions 処理するPostActionの配列
  * @returns 生成されたBotMessageの配列
  */
 generateToasts(postActions: PostActionType[]): BotMessage[] {
  // messageToast が空でない有効なアクションのみをフィルタリング
  const validActions = postActions.filter((action) => action.messageToast?.trim());

  if (validActions.length === 0) {
   return [];
  }

  // 各有効なアクションに対して generateToastFromAction を呼び出す
  return validActions.map((action) => this.generateToast(action));
 }
}
