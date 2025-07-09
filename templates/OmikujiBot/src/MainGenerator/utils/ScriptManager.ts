// src/MainGenerator/utils/processors/ScriptManager.ts
import {
 CommentRuleType,
 OmikujiDataType,
 RuleType,
 TimerRuleType
} from '@/types/OmikujiTypesSchema';
import { ScriptClass, ScriptResult, UserStatistics, GameState } from '@/types/PresetTypes';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export class ScriptManager {
 private readonly scriptInstances: Record<string, ScriptClass> = {};
 private readonly gameStates: Record<string, GameState> = {};

 omikujiData: OmikujiDataType;

 // ランキングデータを適切な型で管理
 private rankingData: Record<string, UserStatistics[]> = {};

 constructor(omikujiData: OmikujiDataType) {
  this.omikujiData = omikujiData;
  this.initializeScripts();
 }

 /**
  * 外部スクリプトの初期化
  */
 private initializeScripts(): void {
  try {
   const commentRules: Record<string, CommentRuleType> = this.omikujiData.comments;
   const timerRules: Record<string, TimerRuleType> = this.omikujiData.timers;

   // コメントルールの処理
   for (const rule of Object.values(commentRules)) {
    this.initializeScript(rule.scriptId);
   }

   // タイマールールの処理
   for (const rule of Object.values(timerRules)) {
    this.initializeScript(rule.scriptId);
   }
  } catch (error) {
   console.error('スクリプト初期化エラー:', error);
  }
 }

 /**
  * 個別スクリプトの初期化
  */
 private initializeScript(scriptId: string | null): void {
  if (!scriptId || !scriptGameMap[scriptId]) {
   return;
  }

  // 既に初期化済みの場合はスキップ
  if (this.scriptInstances[scriptId]) {
   return;
  }

  const scriptPreset = scriptGameMap[scriptId];
  const scriptInstance = scriptPreset.execute;

  try {
   // 設定値の取得（スクリプト固有の設定があれば使用）
   const settings = this.omikujiData.scriptSettings[scriptId] || {};

   // 初期化処理 - EmptyObjectの場合は空オブジェクトとしてキャスト
   scriptInstance.setup(settings);

   // インスタンスを保存
   this.scriptInstances[scriptId] = scriptInstance;

   // ゲーム状態の初期化
   this.gameStates[scriptId] = {
    ruleId: scriptId,
    totalDraws: 0,
    userStats: {},
    currentUserIds: []
   };

   // ランキングデータの初期化
   this.rankingData[scriptId] = [];

   console.log(`スクリプト初期化完了: ${scriptId}`);
  } catch (error) {
   console.error(`スクリプト初期化エラー (${scriptId}):`, error);
  }
 }

 /**
  * スクリプトインスタンスを取得
  */
 getScriptInstance(scriptId: string): ScriptClass | null {
  return this.scriptInstances[scriptId] || null;
 }

 /**
  * ゲーム状態を取得
  */
 getGameState(scriptId: string): GameState | null {
  return this.gameStates[scriptId] || null;
 }

 /**
  * スクリプト実行
  */
 executeScript(comment: Comment, rule: RuleType): ScriptResult | null {
  const { scriptId } = rule;

  if (!scriptId || !scriptGameMap[scriptId]) {
   return null;
  }

  const scriptInstance = this.getScriptInstance(scriptId);
  if (!scriptInstance) {
   console.warn(`スクリプトインスタンスが見つかりません: ${scriptId}`);
   return null;
  }

  try {
   // スクリプトパラメータの取得
   const params = rule.scriptParams || {};

   // スクリプト実行 - EmptyObjectの場合は空オブジェクトとしてキャスト
   const result = scriptInstance.run(comment, params);

   // ランキングデータの更新
   if (result && result.rankingList) {
    this.rankingData[scriptId] = result.rankingList;

    // ゲーム状態の更新
    this.updateGameState(scriptId, result.rankingList);
   }

   return result;
  } catch (error) {
   console.error(`スクリプト実行エラー (${scriptId}):`, error);
   return null;
  }
 }

 /**
  * ゲーム状態の更新
  */
 private updateGameState(scriptId: string, rankingList: UserStatistics[]): void {
  const gameState = this.gameStates[scriptId];
  if (!gameState) return;

  // 総実行回数の更新
  gameState.totalDraws++;

  // ユーザー統計の更新
  for (const userStat of rankingList) {
   const userId = userStat.userId;

   // 新規ユーザーの場合は履歴に追加
   if (!gameState.currentUserIds.includes(userId)) {
    gameState.currentUserIds.push(userId);
   }

   // ユーザー統計の更新
   gameState.userStats[userId] = userStat;
  }
 }

 /**
  * API呼び出し実行
  */
 executeApiCall(
  scriptId: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
 ): any {
  const scriptInstance = this.getScriptInstance(scriptId);
  const gameState = this.getGameState(scriptId);

  if (!scriptInstance || !gameState || !scriptInstance.apiCall) {
   throw new Error(`API呼び出しが利用できません: ${scriptId}`);
  }

  try {
   // API呼び出し（実際のAPIコールはローカルでは行わない想定）
   // この部分は実装に応じて調整が必要
   console.warn(`API呼び出しはローカル環境では実行されません: ${scriptId}`);
   return null;
  } catch (error) {
   console.error(`API呼び出しエラー (${scriptId}):`, error);
   throw error;
  }
 }

 /**
  * スクリプトの再初期化
  */
 reinitializeScripts(): void {
  // クリーンアップ処理
  this.cleanup();

  // データのクリア
  Object.keys(this.scriptInstances).forEach((key) => {
   delete this.scriptInstances[key];
  });
  Object.keys(this.gameStates).forEach((key) => {
   delete this.gameStates[key];
  });
  Object.keys(this.rankingData).forEach((key) => {
   delete this.rankingData[key];
  });

  // 再初期化
  this.initializeScripts();
 }

 /**
  * クリーンアップ処理
  */
 cleanup(): void {
  Object.entries(this.scriptInstances).forEach(([scriptId, instance]) => {
   if (instance.cleanup) {
    try {
     const gameState = this.getGameState(scriptId);
     if (gameState) {
      instance.cleanup(gameState);
     }
    } catch (error) {
     console.error(`クリーンアップエラー (${scriptId}):`, error);
    }
   }
  });
 }

 /**
  * ランキングデータ取得
  */
 getRankingData(scriptId: string): UserStatistics[] | null {
  return this.rankingData[scriptId] || null;
 }

 /**
  * 全てのランキングデータを取得
  */
 getAllRankingData(): Record<string, UserStatistics[]> {
  return { ...this.rankingData };
 }

 /**
  * 特定ユーザーの統計情報を取得
  */
 getUserStatistics(scriptId: string, userId: string): UserStatistics | null {
  const gameState = this.getGameState(scriptId);
  return gameState?.userStats[userId] || null;
 }

 /**
  * アクティブなスクリプトのリストを取得
  */
 getActiveScripts(): string[] {
  return Object.keys(this.scriptInstances);
 }
}
