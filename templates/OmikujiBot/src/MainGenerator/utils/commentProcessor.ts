// src/MainGenerator/utils/commentProcessor.ts
import { BotMessage } from '@/types/types';
import { ServiceVisitType } from '@common/subscribe/GetUserVisits';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { checkThresholdComment } from './ThresholdCommentChecker';
import { charasSampleData, omikujiSampleData } from '@/omikujiSampleData';
import { PlayOmikuji } from './PlayOmikuji';
import { CommentRule, OmikujiSet, PostAction } from '@/types/OmikujiTypes';
import { CharacterPreset, ScriptClass, ScriptPreset } from '@/types/PresetTypes';
import { BomberSpin } from '../scriptGame/BomberSpin.js';
import { PostMessage } from './PostMessage2';
import { PlaceProcess } from './PlaceProcess2';

// このスクリプトBOTのcomment.data.userId
const BOT_USER_ID = 'OmikujiBot';

// 外部スクリプトのマップ
const scriptMap: Record<string, ScriptPreset> = {
 BomberSpin
};

/**
 * コメント処理と抽選機能を管理するクラス
 */
export class CommentProcessor {
 private readonly timeThreshold = 5; // 秒
 private userVisits: Record<string, ServiceVisitType> = {};
 private readonly scriptInstances: Record<string, ScriptClass> = {};

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

    if (scriptId && scriptMap[scriptId]) {
     // クラスをインスタンス化
     const scriptInstance = scriptMap[scriptId].execute;

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
  this.userVisits = userVisits;

  const currentTime = Date.now();

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
    // TODO: 前回処理してから3秒以内であれば、「処理できない」フラグを渡す
    if (isWithinTimeThreshold) {
     this.processUserComment(comment);
    }
   }
  }

  return processedComments;
 }

 /**
  * BOTコメントの処理
  */
 private processBotComment(comment: Comment): BotMessage | null {
  const checkId = comment.data.id;
  let hogg: CharacterPreset;

  // charasSampleData をすべて調べて checkId の先頭に入っているなら、そのデータを入れる
  if (checkId.includes(charasSampleData[0].id)) {
   hogg = charasSampleData[0];
  } else {
   // 万が一見つからなかった場合(他のプラグインの投稿など)は何も返さない
   return null;
  }
  return {
   id: comment.data.id,
   name: comment.data.name,
   profileImage: comment.data.profileImage,
   timestamp: comment.data.timestamp,
   comment: comment.data.comment,
   isToast: false,
   color: hogg.color
  };
 }

 /**
  * ユーザーコメントの処理
  */
 private processUserComment(comment: Comment): void {
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
  let flag: boolean = false; // コメント重複flag

  try {
   const commentRules = omikujiSampleData.comments;

   // 全ルールをチェックする
   for (const rule of Object.values(commentRules)) {
    if (this.processCommentRule(comment, rule, flag)) {
     flag = true; // コメント重複flagをtrueにして更にcheck
    }
   }
  } catch (error) {
   console.error('コメント処理エラー:', error);
  }
 }

 /**
  * 個別のコメントルール処理
  */
 private processCommentRule(comment: Comment, rule: CommentRule, flag: boolean): boolean {
  try {
   // コメントとルールのマッチング
   if (!checkThresholdComment(comment, rule.threshold)) return false;

   // TODO:「コメント重複flag」がtrueかつ、threshold.conditionsに'comment'が入っているなら、
   // おみくじ抽選をせず、代わりに「おみくじが被った」というToast表示をさせる
   if (flag && rule.threshold.conditions.includes('comment')) {
    return this.handleToast([
     {
      characterKey: charasSampleData[0].id,
      iconKey: 'Default',
      delaySeconds: 0,
      wordParty: '',
      messageContent: '',
      messageToast: `コメントが被って、「${rule.name}」ができなかったよ。またコメントしてね。`
     }
    ]);
   }
   // おみくじ抽選
   const omikujiItem = this.drawOmikuji(rule);
   if (!omikujiItem) {
    console.warn('おみくじアイテムが取得できませんでした');
    return false;
   }

   // スクリプト実行とプレースホルダー処理
   this.executeScriptAndProcessPlaceholders(comment, rule, omikujiItem, flag);

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
  omikujiItem: OmikujiSet,
  flag: boolean
 ): void {
  const { scriptId } = rule;

  if (!scriptId || !scriptMap[scriptId]) {
   // スクリプトがない場合はおみくじのみ処理
   this.processOmikujiOnly(omikujiItem, flag);
   return;
  }

  const scriptInstance = this.getScriptInstance(scriptId);
  if (!scriptInstance) {
   console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`);
   this.processOmikujiOnly(omikujiItem, flag);
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
   this.processOmikujiOnly(omikujiItem, flag);
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
 private processOmikujiOnly(omikujiItem: OmikujiSet, flag: boolean): void {
  try {
   const postActions = this.placeProcess.processOmikuji(omikujiItem);
   // コメント重複flagがないなら通常の投稿
   if (!flag) {
    this.PostMessage.post(postActions);
   } else {
    // TODO:コメント重複flag があるなら、postActions に入っているすべてのwordParty を削除し、
    // すべての messageContent の内容を messageToast に移動させる
    // (messageToastに入っていた内容は上書きして良い)
   }
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
     isToast: true,
     color: charasSampleData[characterKey].color
    };
   })
  );

  return botMessages;
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
