// src/MainGenerator/utils/commentProcessor.ts
import { CommentGod, LotteryEntry, ServiceVisitGodType } from '@/types';
import { ServiceVisitType, UserVisitType } from '@common/subscribe/GetUserVisits';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { DEFAULT_WIN, lotteryTable } from './LotteryTable';

/**
 * コメント処理と抽選機能を管理するクラス
 */
export class CommentProcessor {
 private processedUserVisits: Record<string, ServiceVisitGodType>;
 private timeThresholdSeconds: number;
 private lottery: LotteryEngine;
 private userDataCache: Map<string, UserVisitType> = new Map(); // キャッシュ追加
 private currentTime: number = 0; // 現在時刻をキャッシュ

 constructor(
  processedUserVisits: Record<string, ServiceVisitGodType> = {},
  timeThresholdSeconds: number = 5
 ) {
  this.processedUserVisits = processedUserVisits;
  this.timeThresholdSeconds = timeThresholdSeconds;
  this.lottery = new LotteryEngine();
 }

 /**
  * コメントに抽選結果を付与して拡張コメントを作成する
  */
 processComments(userVisits: Record<string, ServiceVisitType>, comments: Comment[]): CommentGod[] {
  if (comments.length === 0) return [];

  // 現在時刻を一度だけ取得
  this.currentTime = Date.now();

  // ユーザーデータのキャッシュを構築（一度だけ）
  this.buildUserDataCache(userVisits);

  // バッチ処理用の配列を準備
  const lotteryTargets: { comment: Comment; userData: UserVisitType }[] = [];
  const nonLotteryComments: CommentGod[] = [];

  // 1回目のループ: 抽選対象とそれ以外を分類
  for (const comment of comments) {
   const userId = comment.data.userId;
   const timestamp = new Date(comment.data.timestamp).getTime();
   const secondsSince = (this.currentTime - timestamp) / 1000;

   // 時間制限外のコメントは抽選しない
   if (secondsSince > this.timeThresholdSeconds) {
    nonLotteryComments.push(this.createNonLotteryComment(comment));
    continue;
   }

   // ユーザーデータが見つからない場合も抽選しない
   const userData = this.userDataCache.get(userId);
   if (!userData) {
    console.log(`[抽選スキップ] ユーザーID ${userId} が見つかりません`);
    nonLotteryComments.push(this.createNonLotteryComment(comment));
    continue;
   }

   lotteryTargets.push({ comment, userData });
  }

  // 2回目のループ: 抽選対象をバッチ処理
  const lotteryResults = this.batchLottery(lotteryTargets);

  // 結果をマージして返却
  return [...nonLotteryComments, ...lotteryResults];
 }

 /**
  * ユーザーデータキャッシュを構築
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
  * バッチ抽選処理
  */
 private batchLottery(targets: { comment: Comment; userData: UserVisitType }[]): CommentGod[] {
  const results: CommentGod[] = [];

  for (const { comment, userData } of targets) {
   const userId = comment.data.userId;

   // 抽選実行
   const hitEntry = this.lottery.performLottery();

   // ユーザー訪問データの更新
   this.updateUserVisitData(userId, hitEntry);

   // 拡張コメントを作成
   results.push(this.createLotteryComment(comment, hitEntry));
  }

  return results;
 }

 /**
  * 抽選対象外のコメントを作成（最適化版）
  */
 private createNonLotteryComment(comment: Comment): CommentGod {
  const userId = comment.data.userId;
  const existingData = this.processedUserVisits[userId];

  return {
   ...comment,
   godStatus: existingData
    ? {
       rank: existingData.rank,
       effectId: existingData.effectId,
       badges: existingData.badges
      }
    : {
       rank: 0,
       effectId: null,
       badges: []
      },
   hitEntry: DEFAULT_WIN
  };
 }

 /**
  * 抽選結果付きコメントを作成
  */
 private createLotteryComment(comment: Comment, hitEntry: LotteryEntry): CommentGod {
  const userId = comment.data.userId;
  const userData = this.processedUserVisits[userId];

  return {
   ...comment,
   godStatus: {
    rank: userData.rank,
    effectId: userData.effectId,
    badges: userData.badges
   },
   hitEntry
  };
 }

 /**
  * ユーザー訪問データを更新（最適化版）
  */
 private updateUserVisitData(userId: string, hitEntry: LotteryEntry): void {
  let userData = this.processedUserVisits[userId];

  // 既存データがない場合は初期化
  if (!userData) {
   userData = this.processedUserVisits[userId] = {
    isSyoken: false,
    profileImage: '',
    count: 0,
    price: 0,
    rank: 0,
    effectId: null,
    badges: []
   };
  }

  // より高いランクの場合のみ更新
  if (hitEntry.rank > userData.rank) {
   console.log(
    `[ランクアップ] ユーザーID: ${userId}, ${hitEntry.name} (ランク${userData.rank} -> ${hitEntry.rank})`
   );
   userData.rank = hitEntry.rank;
   userData.effectId = hitEntry.effectId;
  }

  // 確定役（effectId >= 11）の場合はバッジを追加
  if (hitEntry.effectId && hitEntry.effectId >= 11 && hitEntry.badgeImg) {
   // Set を使用して重複チェックを高速化
   const existingLabels = new Set(userData.badges.map((badge) => badge.label));
   if (!existingLabels.has(hitEntry.name)) {
    userData.badges.push({
     url: hitEntry.badgeImg,
     label: hitEntry.name
    });
   }
  }
 }

 /**
  * 処理済みユーザー訪問データを取得する
  */
 getProcessedUserVisits(): Record<string, ServiceVisitGodType> {
  return this.processedUserVisits;
 }

 /**
  * 時間閾値を設定する
  */
 setTimeThreshold(seconds: number): void {
  this.timeThresholdSeconds = seconds;
 }

 /**
  * キャッシュをクリア（メモリ管理用）
  */
 clearCache(): void {
  this.userDataCache.clear();
 }
}

/**
 * 抽選エンジン（最適化版）
 */
class LotteryEngine {
 private totalWeight: number;
 private cumulativeWeights: number[]; // 累積重みを事前計算

 constructor() {
  // 抽選テーブルの総重みと累積重みを事前計算
  this.cumulativeWeights = [];
  let cumulative = 0;

  for (const entry of lotteryTable) {
   cumulative += entry.numerator;
   this.cumulativeWeights.push(cumulative);
  }

  this.totalWeight = cumulative;
 }

 /**
  * 抽選を実行（最適化版）
  */
 performLottery(): LotteryEntry {
  const draw = this.getSecureRandomInt(65536);

  // 二分探索で高速検索
  const index = this.binarySearch(this.cumulativeWeights, draw);

  if (index < lotteryTable.length) {
   const entry = lotteryTable[index];
   console.log(`[当選] ${entry.name} (ランク${entry.rank}) effectId: ${entry.effectId}`);
   return entry;
  }

  // テーブル外の場合はデフォルト当選を返す
  console.log(`[デフォルト当選] ${DEFAULT_WIN.name} (抽選値: ${draw})`);
  return DEFAULT_WIN;
 }

 /**
  * 二分探索（累積重み配列から抽選値に対応するインデックスを検索）
  */
 private binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
   const mid = Math.floor((left + right) / 2);
   if (arr[mid] > target) {
    if (mid === 0 || arr[mid - 1] <= target) {
     return mid;
    }
    right = mid - 1;
   } else {
    left = mid + 1;
   }
  }

  return arr.length;
 }

 /**
  * 暗号学的に安全な乱数を生成
  */
 private getSecureRandomInt(max: number): number {
  const array = new Uint16Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
 }
}
