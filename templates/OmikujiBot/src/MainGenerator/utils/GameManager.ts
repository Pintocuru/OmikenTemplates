// src/MainGenerator/utils/GameManager.ts
import { GameState, ScriptPreset, ScriptResult, UserStatistics } from '@/types/PresetTypes';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// 統計情報の型定義を追加
interface GameStatistics {
 totalDraws: number;
 totalUsers: number;
 activeUsers: number;
 averageDrawsPerUser: number;
}

export class GameManager<Extras extends Record<string, any> = {}> {
 private gameState: GameState<Extras>;
 private script: ScriptPreset;

 constructor(script: ScriptPreset, initialGame?: GameState<Extras>) {
  this.script = script;
  this.gameState = this.createInitialState(initialGame);
 }

 // 初期状態作成をメソッドに分離（DRY原則）
 private createInitialState(initialGame?: GameState<Extras>): GameState<Extras> {
  const baseState = {
   ruleId: this.script.id,
   settings: this.script.settings,
   totalDraws: 0,
   userStats: {},
   currentUserIds: []
  };

  return {
   ...baseState,
   ...initialGame // 初期値で上書き可能
  } as GameState<Extras>;
 }

 public getGame(): GameState<Extras> {
  // ディープコピーを返す
  return JSON.parse(JSON.stringify(this.gameState));
 }

 public async run(comment: Comment): Promise<ScriptResult> {
  try {
   // パラメータの取得
   const paramValues = this.script.params.values;

   // スクリプト実行（同期・非同期両対応）
   const result = await Promise.resolve(this.script.func(this.gameState, comment, paramValues));

   // ゲーム状態の更新
   this.updateFromScriptResult(result, comment);

   return result;
  } catch (error) {
   // エラーハンドリング
   console.error('Script execution failed:', error);
   return this.createErrorResult(error);
  }
 }

 // メソッド名を明確化（private updateGameState から変更）
 private updateFromScriptResult(result: ScriptResult, comment: Comment): void {
  // 結果からゲーム状態を更新
  this.gameState = {
   ...this.gameState,
   ...result.gameState,
   totalDraws: this.gameState.totalDraws + 1 // おみくじ実行回数を増やす
  };

  // ユーザー統計の更新
  this.updateUserStats(comment.data.name, comment.data.userId);
 }

 private updateUserStats(userName: string, userId: string): void {
  const currentStats = this.gameState.userStats[userId];

  // 新規ユーザーまたは既存ユーザーの統計更新
  this.gameState.userStats[userId] = {
   userId,
   name: userName,
   draws: (currentStats?.draws ?? 0) + 1,
   wins: currentStats?.wins ?? 0,
   points: currentStats?.points ?? 0,
   status: currentStats?.status ?? 'active',
   lastPlayed: new Date().toISOString()
  };

  // ユーザー履歴の更新（重複排除して最新を先頭に）
  this.gameState.currentUserIds = [
   userId,
   ...this.gameState.currentUserIds.filter((id: any) => id !== userId)
  ];
 }

 private createErrorResult(error: any): ScriptResult {
  return {
   postActions: [],
   placeholders: {},
   gameState: this.gameState
  };
 }

 // ゲーム状態のリセット（初期化ロジックを再利用）
 public resetGame(): void {
  this.gameState = this.createInitialState();
 }

 // 特定ユーザーの統計取得
 public getUserStats(userId: string): UserStatistics | undefined {
  return this.gameState.userStats[userId];
 }

 // 全ユーザーの統計取得
 public getAllUserStats(): UserStatistics[] {
  return Object.values(this.gameState.userStats);
 }

 // ゲーム状態の部分更新
 public updatePartialState(updates: Partial<GameState<Extras>>): void {
  this.gameState = {
   ...this.gameState,
   ...updates
  };
 }

 // API呼び出し（統一されたエラーハンドリング）
 public async callApi(method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any): Promise<any> {
  if (!this.script.ApiCall) {
   const errorResult = {
    status: 'error' as const,
    gameState: this.gameState,
    message: 'ApiCall function not defined in script'
   };
   console.error('API call failed:', errorResult.message);
   return errorResult;
  }

  try {
   const result = await this.script.ApiCall(this.gameState, method, body);

   // API呼び出し結果でゲーム状態を更新
   if (result.status === 'success') {
    this.gameState = {
     ...this.gameState,
     ...result.gameState
    };
   }

   return result;
  } catch (error) {
   console.error('API call failed:', error);
   // エラー時も統一された形式で返す（throwではなく）
   return {
    status: 'error' as const,
    gameState: this.gameState,
    message: error instanceof Error ? error.message : 'Unknown error occurred',
    error
   };
  }
 }

 // 使用できるプレースホルダーの取得
 public getPlaceholders(): Record<string, string> {
  return { ...this.script.placeholders.values };
 }

 // 統計情報の取得（戻り値型を明示）
 public getStatistics(): GameStatistics {
  const totalUsers = Object.keys(this.gameState.userStats).length;
  return {
   totalDraws: this.gameState.totalDraws,
   totalUsers,
   activeUsers: this.gameState.currentUserIds.length,
   averageDrawsPerUser: this.gameState.totalDraws / Math.max(totalUsers, 1)
  };
 }
}
