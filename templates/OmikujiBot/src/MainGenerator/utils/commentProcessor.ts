// src/MainGenerator/utils/CommentProcessor.ts
import { BotMessage } from '@/types/types';
import { CommentRuleType, OmikujiDataType, OmikujiSetType } from '@/types/OmikujiTypesSchema';
import { isWithinProcessingCooldown, isWithinTimeThreshold } from './CommentProcessorCooldown';
import { PostMessage } from './PostMessage2';
import { PlaceProcess } from './PlaceProcess2';
import { ScriptManager } from './ScriptManager';
import {
 BotMessageGenerator,
 processCommentRule,
 sanitizePostActionsForDuplicate
} from './CommentProcessorToast';
import { drawOmikuji } from './PlayOmikuji';
import { SETTINGS } from '@public/common/settings';
import { GetMetas } from '@public/common/subscribe/GetMetas';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import { ScriptResult } from '@/types/PresetTypes';

export class CommentProcessor {
 private lastProcessedTime: number = 0; // クールタイム管理
 private currentServiceMeta: ServiceMeta | null = null; // Metaデータ管理

 // 依存関係
 private readonly PostMessage: PostMessage;
 private readonly placeProcess: PlaceProcess;
 private readonly scriptManager: ScriptManager;
 private readonly omikujiData: OmikujiDataType;
 private readonly BotMessageGenerator: BotMessageGenerator;

 constructor(omikujiData: OmikujiDataType) {
  this.omikujiData = omikujiData;
  this.PostMessage = new PostMessage(omikujiData.characters);
  this.placeProcess = new PlaceProcess(omikujiData.placeholders);
  this.scriptManager = new ScriptManager(omikujiData);
  this.BotMessageGenerator = new BotMessageGenerator(omikujiData.characters);
  this.initializeMetaFetcher();
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
   if (!isWithinTimeThreshold(comment.data.timestamp, currentTime)) continue;

   const processedMessages =
    comment.data.userId === SETTINGS.BOT_USER_ID
     ? this.BotMessageGenerator.processBotComment(comment)
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
  * ユーザーコメントの処理
  */
 private processUserComment(comment: Comment, currentTime: number): BotMessage[] {
  const botMessages: BotMessage[] = [];
  let isDuplicateComment = false;
  let hasCommentBasedRule = false; // コメント条件を含むルールがあるかどうか
  const firstCharacterId = Object.keys(this.omikujiData.characters)[0];

  try {
   // orderの順番に並べる
   const sortedRules = Object.values(this.omikujiData.comments).sort((a, b) => a.order - b.order);

   for (const rule of sortedRules) {
    const isCommentBased = rule.threshold.conditions.includes('comment');
    const isWithinCooldown = isWithinProcessingCooldown(currentTime, this.lastProcessedTime);

    // コメント条件を含むルールの場合のクールダウン処理
    if (isCommentBased && isWithinCooldown) {
     const result = processCommentRule(comment, rule, firstCharacterId, isDuplicateComment, true);
     if (result.success && result.toastActions) {
      const toast = this.BotMessageGenerator.generateToasts(result.toastActions);
      botMessages.push(...toast);
      isDuplicateComment = true;
     }
     continue;
    }

    // 通常のルール処理
    const result = processCommentRule(comment, rule, firstCharacterId, isDuplicateComment, false);
    if (!result.success) continue;

    // Toast専用の処理（クールダウン中やその他の理由）
    if (result.toastActions) {
     const toast = this.BotMessageGenerator.generateToasts(result.toastActions);
     botMessages.push(...toast);
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
    if (isCommentBased) hasCommentBasedRule = true;
   }
   if (hasCommentBasedRule) this.lastProcessedTime = currentTime;
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
    ? this.processPlaceholdersWithScript(scriptResult, omikujiItem)
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
  this.placeProcess.updateResolvedValues({
   user: comment.data.displayName || comment.data.name,
   lc: comment.meta?.lc ?? 0,
   tc: comment.meta?.tc ?? 0,
   viewer: this.currentServiceMeta?.viewer ?? 0,
   upVote: this.currentServiceMeta?.upVote ?? 0
  });
 }

 /**
  * プレースホルダー処理（スクリプト結果付き）
  */
 private processPlaceholdersWithScript(
  scriptResult: ScriptResult,
  omikujiItem: OmikujiSetType
 ): BotMessage[] {
  try {
   // スクリプトのプレースホルダーを更新
   this.placeProcess.updateResolvedValues(scriptResult.placeholders);

   // スクリプトの投稿アクション実行
   this.PostMessage.post(scriptResult.postActions);

   // おみくじのプレースホルダーを解決し、わんコメに投稿
   const postActions = this.placeProcess.processOmikuji(omikujiItem);
   this.PostMessage.post(postActions);

   // Toast処理とBotMessage取得
   return this.BotMessageGenerator.generateToasts(postActions);
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
   return this.BotMessageGenerator.generateToasts(postActions);
  } finally {
   // プレースホルダーをクリア
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * スクリプトの再初期化
  */
 reinitializeScripts(): void {
  this.scriptManager.reinitializeScripts();
 }

 /**
  * ランキングデータ取得
  */
 getRankingData(scriptId: string) {
  return this.scriptManager.getRankingData(scriptId);
 }

 /**
  * メタデータフェッチャーの初期化とポーリング開始
  */
 private initializeMetaFetcher(): void {
  const metaFetcher = GetMetas(); // 0番目のサービスメタを取得
  metaFetcher.fetchMeta((meta) => {
   this.currentServiceMeta = meta;
   console.log('Updated Service Meta:', this.currentServiceMeta); // デバッグ用
  });
 }
}
