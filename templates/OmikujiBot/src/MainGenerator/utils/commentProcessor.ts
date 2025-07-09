// src/MainGenerator/utils/CommentProcessor.ts
import { BotMessage } from '@/types/types';
import { CommentRuleType, OmikujiDataType, OmikujiSetType } from '@/types/OmikujiTypesSchema';
import { PostMessage } from './PostMessage2';
import { PlaceProcess } from './PlaceProcess2';
import { ScriptManager } from './ScriptManager';
import {
 generateToastsFromActions,
 processCommentRule,
 sanitizePostActionsForDuplicate
} from './CommentRuleProcessor';
import { drawOmikuji } from './PlayOmikuji';
import { SETTINGS } from '@public/common/settings';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { PostAction, PostActionWordParty } from '@/types/OmikujiTypes';

export class CommentProcessor {
 private readonly timeThreshold = 5; // これ以上経過した古いコメントは判定しない(秒)
 private readonly processingCooldownSeconds = 3; // 処理クールダウン時間
 private lastProcessedTime: number = 0;

 // 依存関係
 public readonly PostMessage: PostMessage;
 public readonly placeProcess: PlaceProcess;
 private readonly scriptManager: ScriptManager;
 omikujiData: OmikujiDataType;

 constructor(omikujiData: OmikujiDataType) {
  this.omikujiData = omikujiData;
  this.PostMessage = new PostMessage(omikujiData.characters);
  this.placeProcess = new PlaceProcess(omikujiData.placeholders);
  this.scriptManager = new ScriptManager(omikujiData);
 }

 /**
  * メイン処理: コメントを処理して拡張コメントを作成
  */
 processComments(comments: Comment[]): BotMessage[] {
  if (!comments.length) return [];

  const currentTime = Date.now();
  const botMessages: BotMessage[] = [];

  for (const comment of comments) {
   // 古いコメントをスキップ
   if (!this.isWithinTimeThreshold(comment, currentTime)) continue;

   const processedMessages =
    comment.data.userId === SETTINGS.BOT_USER_ID
     ? this.processBotComment(comment)
     : this.processUserComment(comment, currentTime);

   if (processedMessages) {
    botMessages.push(
     ...(Array.isArray(processedMessages) ? processedMessages : [processedMessages])
    );
   }
  }

  return botMessages;
 }

 /**
  * 時間閾値内かどうかをチェック
  */
 private isWithinTimeThreshold(comment: Comment, currentTime: number): boolean {
  const secondsSinceComment = (currentTime - new Date(comment.data.timestamp).getTime()) / 1000;
  return secondsSinceComment <= this.timeThreshold;
 }

 /**
  * 処理のクールダウン時間内かどうかをチェック
  */
 private isWithinProcessingCooldown(currentTime: number): boolean {
  return (currentTime - this.lastProcessedTime) / 1000 < this.processingCooldownSeconds;
 }

 /**
  * BOTコメントの処理
  */
 private processBotComment(comment: Comment): BotMessage | null {
  const character = Object.values(this.omikujiData.characters).find((char) =>
   comment.data.id.includes(char.id)
  );

  if (!character) return null;

  return {
   id: comment.data.id,
   name: comment.data.name,
   profileImage: comment.data.profileImage,
   timestamp: comment.data.timestamp,
   comment: comment.data.comment,
   isToast: false,
   color: character.color
  };
 }

 /**
  * ユーザーコメントの処理
  */
 private processUserComment(comment: Comment, currentTime: number): BotMessage[] {
  const botMessages: BotMessage[] = [];
  let isDuplicateComment = false;
  let hasCommentBasedRule = false; // コメント条件を含むルールがあるかどうか

  try {
   const commentRules = this.omikujiData.comments;

   for (const rule of Object.values(commentRules)) {
    const isCommentBased = rule.threshold.conditions.includes('comment');
    const isWithinCooldown = this.isWithinProcessingCooldown(currentTime);

    // コメント条件を含むルールの場合のクールダウン処理
    if (isCommentBased && isWithinCooldown) {
     const result = processCommentRule(comment, rule, isDuplicateComment, true);
     if (result.success && result.toastActions) {
      const toastBotMessages = generateToastsFromActions(result.toastActions);
      botMessages.push(...toastBotMessages);
      isDuplicateComment = true;
     }
     continue;
    }

    // 通常のルール処理
    const result = processCommentRule(comment, rule, isDuplicateComment, false);
    if (!result.success) continue;

    // Toast専用の処理（クールダウン中やその他の理由）
    if (result.toastActions) {
     const toastBotMessages = generateToastsFromActions(result.toastActions);
     botMessages.push(...toastBotMessages);
     isDuplicateComment = true;
     continue;
    }

    // 通常のおみくじ処理
    const omikujiItem = drawOmikuji(rule.omikuji) as OmikujiSetType;
    if (!omikujiItem) continue;

    const omikujiBotMessages = this.executeOmikujiProcess(
     comment,
     rule,
     omikujiItem,
     isDuplicateComment
    );
    botMessages.push(...omikujiBotMessages);
    isDuplicateComment = true;

    // コメント条件を含むルールが処理された場合のみクールダウンを更新
    if (isCommentBased) {
     hasCommentBasedRule = true;
    }
   }

   // コメント条件を含むルールが処理された場合のみクールダウンを更新
   if (hasCommentBasedRule) {
    this.lastProcessedTime = currentTime;
   }
  } catch (error) {
   console.error('ユーザーコメント処理エラー:', error);
  }

  return botMessages;
 }

 /**
  * おみくじプロセスの実行
  */
 private executeOmikujiProcess(
  comment: Comment,
  rule: CommentRuleType,
  omikujiItem: OmikujiSetType,
  isDuplicateComment: boolean
 ): BotMessage[] {
  try {
   // デフォルトのプレースホルダー情報を設定
   this.setupDefaultPlaceholders(comment);

   // スクリプト実行
   const scriptResult = this.scriptManager.executeScript(comment, rule);

   return scriptResult
    ? this.processPlaceholdersWithScript(
       scriptResult.placeholders,
       omikujiItem,
       scriptResult.postActions
      )
    : this.processOmikujiOnly(omikujiItem, isDuplicateComment);
  } catch (error) {
   console.error('おみくじプロセス実行エラー:', error);
   // エラー時もおみくじ処理は続行
   return this.processOmikujiOnly(omikujiItem, isDuplicateComment);
  }
 }

 /**
  * デフォルトのプレースホルダー情報を設定
  */
 private setupDefaultPlaceholders(comment: Comment): void {
  const hoggMap: Record<string, string | number> = {
   user: comment.data.displayName || comment.data.name,
   lc: comment.meta?.lc ?? 0,
   tc: comment.meta?.tc ?? 0
  };
  this.placeProcess.updateResolvedValues(hoggMap);
 }

 /**
  * プレースホルダー処理（スクリプト結果付き）
  */
 private processPlaceholdersWithScript(
  scriptPlaceholders: Record<string, string> | undefined,
  omikujiItem: OmikujiSetType,
  postActions: (PostAction | PostActionWordParty)[]
 ): BotMessage[] {
  try {
   // スクリプトのプレースホルダーを更新
   if (scriptPlaceholders) {
    this.placeProcess.updateResolvedValues(scriptPlaceholders);
   }

   // スクリプトの投稿アクション実行
   if (postActions?.length > 0) {
    this.PostMessage.post(postActions);
   }

   // おみくじのプレースホルダーを解決し、わんコメに投稿
   const omikujiPostActions = this.placeProcess.processOmikuji(omikujiItem);
   this.PostMessage.post(omikujiPostActions);

   // Toast処理とBotMessage取得
   return generateToastsFromActions(omikujiPostActions);
  } finally {
   // プレースホルダーをクリア（必ずクリアする）
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * おみくじのみ処理（スクリプトなし）
  */
 private processOmikujiOnly(
  omikujiItem: OmikujiSetType,
  isDuplicateComment: boolean
 ): BotMessage[] {
  try {
   const postActions = this.placeProcess.processOmikuji(omikujiItem);

   if (isDuplicateComment) {
    // コメント重複時はToastで表示
    const modifiedPostActions = sanitizePostActionsForDuplicate(postActions);
    this.PostMessage.post(modifiedPostActions);
   } else {
    // 通常の投稿
    this.PostMessage.post(postActions);
   }

   // Toast処理とBotMessage取得
   return generateToastsFromActions(postActions);
  } finally {
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * スクリプトの再初期化
  */
 public reinitializeScripts(): void {
  this.scriptManager.reinitializeScripts();
 }

 /**
  * ランキングデータ取得
  */
 getRankingData(scriptId: string) {
  return this.scriptManager.getRankingData(scriptId);
 }
}
