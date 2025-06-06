// src/MainGenerator/utils/commentProcessor.ts
import { BotMessage, CommentBot } from '@/types/types';
import { ServiceVisitType, UserVisitType } from '@common/subscribe/GetUserVisits';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ThresholdCommentChecker } from './ThresholdCommentChecker';
import { charasSampleData, omikujiSampleData } from '@/omikujiSampleData';
import { PlayOmikuji } from './PlayOmikuji';
import { CommentRule, OmikujiSet, PostAction } from '@/types/OmikujiTypes';
import { ScriptClass, ScriptPreset } from '@/types/PresetTypes';
import { BomberSpin } from '../scriptGame/BomberSpin.js';
import { PostMessage } from './PostMessage2';
import { PlaceProcess } from './PlaceProcess2';

// このスクリプトBOTのcomment.data.userId
const BOT_USER_ID = 'OmikujiBot';

/**
 * コメント処理と抽選機能を管理するクラス
 */
export class CommentProcessor {
 private readonly timeThreshold = 5; // 秒
 private readonly userDataCache = new Map<string, UserVisitType>();
 private readonly scriptInstances: Record<string, ScriptClass> = {};

 // 外部スクリプトのマップ
 private readonly scriptMap: Record<string, ScriptPreset> = {
  BomberSpin
 };

 public readonly PostMessage: PostMessage; // わんコメ投稿用class
 public readonly placeProcess: PlaceProcess; // プレースホルダー用class

 constructor() {
  this.PostMessage = new PostMessage(charasSampleData);
  this.placeProcess = new PlaceProcess(omikujiSampleData.placeholders);
  this.initializeScripts();
 }

 /**
  * 外部スクリプトの初期化
  */
 private initializeScripts(): void {
  try {
   const commentRules: Record<string, CommentRule> = omikujiSampleData.comments;

   for (const rule of Object.values(commentRules)) {
    const { scriptId, scriptSettings } = rule;

    if (scriptId && this.scriptMap[scriptId]) {
     // クラスをインスタンス化
     const scriptInstance = this.scriptMap[scriptId].execute;

     // 設定を渡す
     if (scriptSettings) {
      scriptInstance.setup(scriptSettings);
     }

     // インスタンスを保存
     this.scriptInstances[scriptId] = scriptInstance;
    }
   }
  } catch (error) {
   console.error('スクリプト初期化エラー:', error);
  }
 }

 /**
  * スクリプトインスタンスを取得
  */
 private getScriptInstance(scriptId: string): ScriptClass | null {
  return this.scriptInstances[scriptId] || null;
 }

 /**
  * コメントに抽選結果を付与して拡張コメントを作成
  */
 processComments(userVisits: Record<string, ServiceVisitType>, comments: Comment[]): BotMessage[] {
  if (!comments.length) return [];

  const currentTime = Date.now();
  this.buildUserDataCache(userVisits);

  const processedComments: BotMessage[] = [];

  for (const comment of comments) {
   const { userId, timestamp } = comment.data;
   const secondsSinceComment = (currentTime - new Date(timestamp).getTime()) / 1000;
   const isWithinTimeThreshold = secondsSinceComment <= this.timeThreshold;

   if (comment.data.userId === BOT_USER_ID) {
    // BOTのコメント処理
    if (isWithinTimeThreshold) {
     const processedBotComment = this.processBotComment(comment);
     if (processedBotComment) {
      processedComments.push(processedBotComment);
     }
    }
   } else {
    // ユーザーコメント処理
    if (isWithinTimeThreshold) {
     this.processUserComment(comment, userId);
    }
    this.updateUserVisitData(userId);
   }
  }

  return processedComments;
 }

 /**
  * BOTコメントの処理
  */
 private processBotComment(comment: Comment): BotMessage | null {
  // 現在はスキップ
  // TODO: BOTコメント処理の実装
  return null;
 }

 /**
  * ユーザーコメントの処理
  */
 private processUserComment(comment: Comment, userId: string): void {
  this.executeWordCheck(comment);
 }

 /**
  * おみくじCheck・実行
  * 改善点：
  * - 戻り値をvoidに変更（使用されていないため）
  * - エラーハンドリングを追加
  * - 処理の流れを明確化
  */
 private executeWordCheck(comment: Comment): void {
  try {
   const commentRules = omikujiSampleData.comments;

   // 全ルールをチェックする
   // TODO:1つでもヒットした場合はそこでチェック終了(残りがヒットしても無視する)
   for (const rule of Object.values(commentRules)) {
    if (this.processCommentRule(comment, rule)) {
     // ルールが成功した場合、最初の一つだけ処理して終了
     break;
    }
   }
  } catch (error) {
   console.error('コメント処理エラー:', error);
  }
 }

 /**
  * 個別のコメントルール処理
  */
 private processCommentRule(comment: Comment, rule: CommentRule): boolean {
  try {
   // コメントとルールのマッチング
   const thresholdChecker = new ThresholdCommentChecker(rule.threshold);
   if (!thresholdChecker.check(comment)) {
    return false;
   }

   // おみくじ抽選
   const omikujiItem = this.drawOmikuji(rule);
   if (!omikujiItem) {
    console.warn('おみくじアイテムが取得できませんでした');
    return false;
   }

   // スクリプト実行とプレースホルダー処理
   this.executeScriptAndProcessPlaceholders(comment, rule, omikujiItem);

   return true;
  } catch (error) {
   console.error('コメントルール処理エラー:', error);
   return false;
  }
 }

 /**
  * おみくじ抽選
  */
 private drawOmikuji(rule: CommentRule): OmikujiSet | null {
  try {
   const omikujiItem = new PlayOmikuji(rule.omikuji).draw() as OmikujiSet;
   return omikujiItem || null;
  } catch (error) {
   console.error('おみくじ抽選エラー:', error);
   return null;
  }
 }

 /**
  * スクリプト実行とプレースホルダー処理
  */
 private executeScriptAndProcessPlaceholders(
  comment: Comment,
  rule: CommentRule,
  omikujiItem: OmikujiSet
 ): void {
  const { scriptId } = rule;

  if (!scriptId || !this.scriptMap[scriptId]) {
   // スクリプトがない場合はおみくじのみ処理
   this.processOmikujiOnly(omikujiItem);
   return;
  }

  const scriptInstance = this.getScriptInstance(scriptId);
  if (!scriptInstance) {
   console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`);
   this.processOmikujiOnly(omikujiItem);
   return;
  }

  try {
   // スクリプト実行
   const scriptResult = scriptInstance.run(comment, rule.omikuji);

   // スクリプトの投稿アクション実行
   if (scriptResult.postActions?.length > 0) {
    this.PostMessage.post(scriptResult.postActions);
   }

   // プレースホルダー処理
   this.processPlaceholders(scriptResult.placeholders, omikujiItem);
  } catch (error) {
   console.error(`スクリプト実行エラー (${scriptId}):`, error);
   // スクリプトエラー時もおみくじは処理する
   this.processOmikujiOnly(omikujiItem);
  }
 }

 /**
  * プレースホルダー処理
  */
 private processPlaceholders(
  scriptPlaceholders: Record<string, string> | undefined,
  omikujiItem: OmikujiSet
 ): void {
  try {
   // スクリプトのプレースホルダーを更新
   if (scriptPlaceholders) {
    this.placeProcess.updateResolvedValues(scriptPlaceholders);
   }

   // おみくじのプレースホルダーを解決し、わんコメに投稿
   const postActions = this.placeProcess.processOmikuji(omikujiItem);
   this.PostMessage.post(postActions);

   // Toast処理
   this.handleToast(postActions);
  } finally {
   // プレースホルダーをクリア（必ずクリアする）
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * おみくじのみ処理（スクリプトなし）
  */
 private processOmikujiOnly(omikujiItem: OmikujiSet): void {
  try {
   const postActions = this.placeProcess.processOmikuji(omikujiItem);
   this.PostMessage.post(postActions);
   this.handleToast(postActions);
  } finally {
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * Toast処理
  */
 private async handleToast(postActions: PostAction[]): Promise<BotMessage[]> {
  const toastActions = postActions.filter((action) => action.messageToast?.trim());

  const botMessages = await Promise.all(
   toastActions.map(async (action) => {
    const characterKey = action.characterKey;
    // delaySeconds に応じて遅延
    await new Promise((resolve) => setTimeout(resolve, action.delaySeconds * 1000));

    return {
     id: crypto.randomUUID(),
     name: charasSampleData[characterKey].name ?? '',
     profileImage: charasSampleData[characterKey].image[action.iconKey] ?? '',
     timestamp: new Date().toISOString(),
     comment: action.messageToast,
     isToast: true
    };
   })
  );

  return botMessages;
 }

 /**
  * ユーザー訪問データを更新
  */
 private updateUserVisitData(userId: string): void {
  const userData = this.userDataCache.get(userId);
  if (userData) {
   // TODO: ユーザーデータの更新処理を実装
   // userData.count += 1;
   // その他の更新処理
  }
 }

 /**
  * ユーザーデータを構築
  */
 private buildUserDataCache(userVisits: Record<string, ServiceVisitType>): void {
  this.userDataCache.clear();

  for (const serviceVisit of Object.values(userVisits)) {
   if (serviceVisit?.user) {
    for (const [userId, userData] of Object.entries(serviceVisit.user)) {
     if (!this.userDataCache.has(userId)) {
      this.userDataCache.set(userId, userData);
     }
    }
   }
  }
 }

 /**
  * スクリプトの再初期化（必要に応じて）
  */
 public reinitializeScripts(): void {
  // 既存のインスタンスをクリア
  Object.keys(this.scriptInstances).forEach((key) => {
   delete this.scriptInstances[key];
  });

  this.initializeScripts();
 }
}
