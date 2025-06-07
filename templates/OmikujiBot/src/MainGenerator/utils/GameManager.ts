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
 private script: ScriptPreset<any, any, any, Extras>;

 constructor(script: ScriptPreset<any, any, any, Extras>, initialGame?: GameState<Extras>) {
  this.script = script;
  this.gameState = this.createInitialState(initialGame);
 }

 // 初期状態作成をメソッドに分離（DRY原則）
 private createInitialState(initialGame?: GameState<Extras>): GameState<Extras> {
  const baseState: GameState = {
   ruleId: this.script.id,
   totalDraws: 0,
   userStats: {},
   currentUserIds: []
  };

  return {
   ...baseState,
   ...initialGame
  } as GameState<Extras>;
 }

 public getGame(): GameState<Extras> {
  // ディープコピーを返す
  return JSON.parse(JSON.stringify(this.gameState));
 }

 public async run(comment: Comment): Promise<ScriptResult> {
  try {
   // パラメータの取得
   const paramValues = this.getParamValues();

   // スクリプト実行（ScriptClass.run を呼び出し）
   const result = await Promise.resolve(this.script.execute.run(comment, paramValues));

   // ゲーム状態の更新（GameManager内部で管理）
   this.updateGameStateAfterScript(comment);

   return result;
  } catch (error) {
   // エラーハンドリング
   console.error('Script execution failed:', error);
   return this.createErrorResult(error);
  }
 }

 // パラメータ値を取得するヘルパーメソッド
 private getParamValues(): Record<string, any> {
  const paramValues: Record<string, any> = {};
  this.script.params.forEach((param) => {
   paramValues[param.id] = param.defaultValue;
  });
  return paramValues;
 }

 // スクリプト実行後のゲーム状態更新
 private updateGameStateAfterScript(comment: Comment): void {
  // おみくじ実行回数を増やす
  this.gameState.totalDraws += 1;

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
   ...this.gameState.currentUserIds.filter((id: string) => id !== userId)
  ];
 }

 private createErrorResult(error: any): ScriptResult {
  return {
   postActions: [],
   placeholders: {}
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
 public async callApi(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
 ): Promise<any> {
  if (!this.script.execute.apiCall) {
   const errorResult = {
    status: 'error' as const,
    message: 'ApiCall function not defined in script'
   };
   console.error('API call failed:', errorResult.message);
   return errorResult;
  }

  try {
   const result = await this.script.execute.apiCall(
    this.gameState,
    method,
    endpoint,
    body,
    headers
   );

   // API呼び出し結果でゲーム状態を更新
   if (result.status === 'success' && result.gameState) {
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
    message: error instanceof Error ? error.message : 'Unknown error occurred',
    error
   };
  }
 }

 // 使用できるプレースホルダーの取得
 public getPlaceholders(): Record<string, string> {
  const placeholders: Record<string, string> = {};
  this.script.placeholders.forEach((placeholder) => {
   placeholders[placeholder.id] = placeholder.value;
  });
  return placeholders;
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

 // スクリプトのセットアップ実行
 public async setup(): Promise<void> {
  if (this.script.execute.setup) {
   const settingsValues = this.getSettingsValues();
   await this.script.execute.setup(settingsValues);
  }
 }

 // スクリプトのクリーンアップ実行
 public async cleanup(): Promise<void> {
  if (this.script.execute.cleanup) {
   await this.script.execute.cleanup(this.gameState);
  }
 }

 // 設定値を取得するヘルパーメソッド
 private getSettingsValues(): Record<string, any> {
  const settingsValues: Record<string, any> = {};
  this.script.settings.forEach((setting) => {
   settingsValues[setting.id] = setting.defaultValue;
  });
  return settingsValues;
 }
}
