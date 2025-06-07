// src/MainGenerator/utils/CommentProcessor.ts
import { BotMessage } from '@/types/types';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { charasSampleData, omikujiSampleData } from '@/omikujiSampleData';
import { CommentRule, OmikujiSet } from '@/types/OmikujiTypes';
import { PostMessage } from './PostMessage2';
import { PlaceProcess } from './PlaceProcess2';
import { ScriptManager } from './ScriptManager';
import {
 generateToastsFromActions,
 processCommentRule,
 sanitizePostActionsForDuplicate
} from './CommentRuleProcessor';
import { drawOmikuji } from './PlayOmikuji';

const BOT_USER_ID = 'OmikujiBot';

export class CommentProcessor {
 private readonly timeThreshold = 5; // これ以上経過した古いコメントは判定しない(秒)
 private readonly processingCooldownSeconds = 3; // 処理クールダウン時間
 private lastProcessedTime: number = 0;

 // 依存関係
 public readonly PostMessage: PostMessage;
 public readonly placeProcess: PlaceProcess;
 private readonly scriptManager: ScriptManager;

 constructor() {
  this.PostMessage = new PostMessage(charasSampleData);
  this.placeProcess = new PlaceProcess(omikujiSampleData.placeholders);
  this.scriptManager = new ScriptManager();
 }

 /**
  * メイン処理: コメントを処理して拡張コメントを作成
  */
 processComments(comments: Comment[]): BotMessage[] {
  if (!comments.length) return [];

  const currentTime = Date.now();
  const botMessages: BotMessage[] = [];

  for (const comment of comments) {
   const secondsSinceComment = (currentTime - new Date(comment.data.timestamp).getTime()) / 1000;
   const isWithinTimeThreshold = secondsSinceComment <= this.timeThreshold;

   if (!isWithinTimeThreshold) continue;

   if (comment.data.userId === BOT_USER_ID) {
    const processedBotComment = this.processBotComment(comment);
    if (processedBotComment) {
     botMessages.push(processedBotComment);
    }
   } else {
    const cannotProcess = this.isWithinProcessingCooldown(currentTime);

    // ユーザーコメント処理の結果を取得してマージ
    const userCommentResults = this.processUserComment(comment, cannotProcess);
    botMessages.push(...userCommentResults);

    if (!cannotProcess) {
     this.lastProcessedTime = currentTime;
    }
   }
  }

  return botMessages;
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
  const checkId = comment.data.id;
  const character = Object.values(charasSampleData).find((char) => checkId.includes(char.id));
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
  * @returns Toast処理などで生成されたBotMessage配列
  */
 private processUserComment(comment: Comment, cannotProcess: boolean = false): BotMessage[] {
  let isDuplicateComment = false;
  const generatedBotMessages: BotMessage[] = [];

  try {
   const commentRules = omikujiSampleData.comments;

   for (const rule of Object.values(commentRules)) {
    const result = processCommentRule(comment, rule, isDuplicateComment, cannotProcess);

    if (!result.success) continue;

    // Toast専用の処理
    if (result.toastActions) {
     const toastBotMessages = generateToastsFromActions(result.toastActions);
     generatedBotMessages.push(...toastBotMessages);
     isDuplicateComment = true;
     continue;
    }

    // 通常のおみくじ処理
    const omikujiItem = drawOmikuji(rule.omikuji) as OmikujiSet;
    if (!omikujiItem) continue;

    const omikujiBotMessages = this.executeOmikujiProcess(
     comment,
     rule,
     omikujiItem,
     isDuplicateComment
    );
    generatedBotMessages.push(...omikujiBotMessages);
    isDuplicateComment = true;
   }
  } catch (error) {
   console.error('ユーザーコメント処理エラー:', error);
  }

  return generatedBotMessages;
 }

 /**
  * おみくじプロセスの実行
  * @returns 生成されたBotMessage配列
  */
 private executeOmikujiProcess(
  comment: Comment,
  rule: CommentRule,
  omikujiItem: OmikujiSet,
  isDuplicateComment: boolean
 ): BotMessage[] {
  const generatedBotMessages: BotMessage[] = [];

  try {
   // スクリプト実行
   const scriptResult = this.scriptManager.executeScript(comment, rule);

   if (scriptResult) {
    // スクリプトの投稿アクション実行
    if (scriptResult.postActions?.length > 0) {
     this.PostMessage.post(scriptResult.postActions);
    }

    // プレースホルダー処理（スクリプト付き）
    const scriptBotMessages = this.processPlaceholdersWithScript(
     scriptResult.placeholders,
     omikujiItem
    );
    generatedBotMessages.push(...scriptBotMessages);
   } else {
    // スクリプトなしのおみくじ処理
    const omikujiBotMessages = this.processOmikujiOnly(omikujiItem, isDuplicateComment);
    generatedBotMessages.push(...omikujiBotMessages);
   }
  } catch (error) {
   console.error('おみくじプロセス実行エラー:', error);
   // エラー時もおみくじ処理は続行
   const fallbackBotMessages = this.processOmikujiOnly(omikujiItem, isDuplicateComment);
   generatedBotMessages.push(...fallbackBotMessages);
  }

  return generatedBotMessages;
 }

 /**
  * プレースホルダー処理（スクリプト結果付き）
  * @returns 生成されたBotMessage配列
  */
 private processPlaceholdersWithScript(
  scriptPlaceholders: Record<string, string> | undefined,
  omikujiItem: OmikujiSet
 ): BotMessage[] {
  try {
   // スクリプトのプレースホルダーを更新
   if (scriptPlaceholders) {
    this.placeProcess.updateResolvedValues(scriptPlaceholders);
   }

   // おみくじのプレースホルダーを解決し、わんコメに投稿
   const postActions = this.placeProcess.processOmikuji(omikujiItem);
   this.PostMessage.post(postActions);

   // Toast処理とBotMessage取得
   const toastBotMessages = generateToastsFromActions(postActions);
   return toastBotMessages;
  } finally {
   // プレースホルダーをクリア（必ずクリアする）
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * おみくじのみ処理（スクリプトなし）
  * @returns 生成されたBotMessage配列
  */
 private processOmikujiOnly(omikujiItem: OmikujiSet, isDuplicateComment: boolean): BotMessage[] {
  try {
   const postActions = this.placeProcess.processOmikuji(omikujiItem);

   if (!isDuplicateComment) {
    // 通常の投稿
    this.PostMessage.post(postActions);
   } else {
    // コメント重複時の処理
    const modifiedPostActions = sanitizePostActionsForDuplicate(postActions);
    this.PostMessage.post(modifiedPostActions);
   }

   // Toast処理とBotMessage取得
   const toastBotMessages = generateToastsFromActions(postActions);
   return toastBotMessages;
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
}
