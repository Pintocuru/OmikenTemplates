// src/MainGenerator/utils/UserCommentProcessor.ts
import { BotMessage, DefaultPlaceholders, ScriptResult } from '@type/'; // スクリプト結果型
import { CommentRuleType, OmikujiDataType, OmikujiSetType } from '@type/';
import { CommentProcessorCooldown } from './CommentProcessorCooldown'; // 既存のヘルパー関数
import { PostMessage } from './PostMessage2'; // 依存オブジェクト
import { PlaceProcess } from './PlaceProcess2'; // 依存オブジェクト
import { ScriptManager } from './ScriptManager'; // 依存オブジェクト
import {
 BotMessageGenerator,
 processCommentRule,
 sanitizePostActionsForDuplicate
} from './CommentProcessorToast'; // 依存オブジェクト & ヘルパー関数
import { drawOmikuji } from './PlayOmikuji'; // ヘルパー関数
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';

export class UserCommentProcessor {
 private serviceMeta: ServiceMeta | null = null; // Metaデータ管理
 // 依存関係
 private readonly cooldownClass: CommentProcessorCooldown;
 private readonly PostMessage: PostMessage;
 private readonly placeProcess: PlaceProcess;
 private readonly scriptManager: ScriptManager;
 private readonly omikujiData: OmikujiDataType;
 private readonly BotMessageGenerator: BotMessageGenerator;

 constructor(omikujiData: OmikujiDataType, scriptManager: ScriptManager) {
  this.omikujiData = omikujiData;
  this.cooldownClass = new CommentProcessorCooldown();
  this.PostMessage = new PostMessage(omikujiData.characters);
  this.placeProcess = new PlaceProcess(omikujiData.placeholders);
  this.scriptManager = scriptManager;
  this.BotMessageGenerator = new BotMessageGenerator(omikujiData.characters);
 }

 /**
  * ユーザーコメントの処理
  */
 processUserComment(
  comment: Comment,
  currentTime: number,
  serviceMeta: ServiceMeta | null
 ): BotMessage[] {
  this.serviceMeta = serviceMeta;
  const botMessages: BotMessage[] = [];
  let isDuplicateComment = false;
  let hasCommentBasedRule = false;
  const firstCharacterId = Object.keys(this.omikujiData.characters)[0];

  try {
   // 有効なルールのみ処理
   const sortedRules = Object.values(this.omikujiData.comments)
    .filter((rule) => rule.isEnabled)
    .sort((a, b) => a.order - b.order);

   for (const rule of sortedRules) {
    const isCommentBased = rule.threshold.conditions.includes('comment');
    const isWithCooldown = this.cooldownClass.isWithinCooldown(currentTime);

    if (isCommentBased && isWithCooldown) {
     const result = processCommentRule(comment, rule, firstCharacterId, isDuplicateComment, true);
     if (result.success && result.toastActions) {
      const toast = this.BotMessageGenerator.generateToasts(result.toastActions);
      botMessages.push(...toast);
      isDuplicateComment = true;
     }
     continue;
    }

    const result = processCommentRule(comment, rule, firstCharacterId, isDuplicateComment, false);
    if (!result.success) continue;

    if (result.toastActions) {
     const toast = this.BotMessageGenerator.generateToasts(result.toastActions);
     botMessages.push(...toast);
     isDuplicateComment = true;
     continue;
    }

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

    if (isCommentBased) hasCommentBasedRule = true;
   }
   if (hasCommentBasedRule) this.cooldownClass.updateLastProcessedTime(currentTime);
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
   this.setupDefaultPlaceholders(comment);

   const scriptResult = this.scriptManager.executeScript(comment, rule);

   return scriptResult
    ? this.processPlaceholdersWithScript(scriptResult, omikujiItem)
    : this.processOmikujiOnly(omikujiItem, isDuplicateComment);
  } catch (error) {
   console.error('おみくじプロセス実行エラー:', error);
   return this.processOmikujiOnly(omikujiItem, isDuplicateComment);
  }
 }

 /**
  * デフォルトのプレースホルダー情報を設定
  */
 private setupDefaultPlaceholders(comment: Comment): void {
  const defaultPlaceholders: Record<DefaultPlaceholders, string | number> = {
   user: comment.data.displayName || comment.data.name || 'テストユーザー',
   lc: comment.meta?.lc ?? 0,
   tc: comment.meta?.tc ?? 0,
   viewer: this.serviceMeta?.viewer ?? 0,
   upVote: this.serviceMeta?.upVote ?? 0
  };
  this.placeProcess.updateResolvedValues(defaultPlaceholders);
 }

 /**
  * プレースホルダー処理（スクリプト結果付き）
  */
 private processPlaceholdersWithScript(
  scriptResult: ScriptResult,
  omikujiItem: OmikujiSetType
 ): BotMessage[] {
  try {
   this.placeProcess.updateResolvedValues(scriptResult.placeholders);
   this.PostMessage.post(scriptResult.postActions);
   const postActions = this.placeProcess.processPostActions(omikujiItem.postActions);
   this.PostMessage.post(postActions);
   return this.BotMessageGenerator.generateToasts(postActions);
  } finally {
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
   const postActions = this.placeProcess.processPostActions(omikujiItem.postActions);

   if (isDuplicateComment) {
    const modifiedPostActions = sanitizePostActionsForDuplicate(postActions);
    this.PostMessage.post(modifiedPostActions);
   } else {
    this.PostMessage.post(postActions);
   }
   return this.BotMessageGenerator.generateToasts(postActions);
  } finally {
   this.placeProcess.clearResolvedValues();
  }
 }
}
