// src/MainGenerator/utils/commentProcessor.ts
import { CommentGod, LotteryEntry, ServiceVisitGodType } from '@/types';
import { ServiceVisitType, UserVisitType } from '@common/subscribe/GetUserVisits';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { DEFAULT_WIN, lotteryTable } from './LotteryTable';

// コメント処理と抽選機能
export class CommentProcessor {
 private userVisitsGod: Record<string, ServiceVisitGodType> = {};
 private timeThreshold = 5;
 private lottery = new LotteryEngine();
 private userDataCache = new Map<string, UserVisitType>();

 // コメントに抽選結果を付与して拡張コメントを作成
 processComments(userVisits: Record<string, ServiceVisitType>, comments: Comment[]): CommentGod[] {
  if (!comments.length) return [];

  const currentTime = Date.now();
  this.buildUserDataCache(userVisits);

  return comments.map((comment) => {
   const { userId, timestamp } = comment.data;
   const secondsSince = (currentTime - new Date(timestamp).getTime()) / 1000;

   // 時間制限外のコメント/ユーザーデータが見つからない場合は抽選しない
   if (secondsSince > this.timeThreshold || !this.userDataCache.has(userId)) {
    return this.createCommentGod(comment, DEFAULT_WIN, false);
   }

   const hitEntry = this.lottery.performLottery();
   this.updateUserVisitData(userId, hitEntry);
   return this.createCommentGod(comment, hitEntry, true);
  });
 }

 // ユーザーデータキャッシュを構築
 private buildUserDataCache(userVisits: Record<string, ServiceVisitType>): void {
  this.userDataCache.clear();
  Object.values(userVisits).forEach((serviceVisit) => {
   if (serviceVisit?.user) {
    Object.entries(serviceVisit.user).forEach(([userId, userData]) => {
     if (!this.userDataCache.has(userId)) {
      this.userDataCache.set(userId, userData);
     }
    });
   }
  });
 }

 // 拡張コメントを生成
 private createCommentGod(
  comment: Comment,
  hitEntry: LotteryEntry,
  isLottery: boolean
 ): CommentGod {
  const userId = comment.data.userId;
  const userData = this.userVisitsGod[userId];

  return {
   ...comment,
   godStatus: userData
    ? {
       rank: userData.rank,
       effectId: userData.effectId,
       badges: userData.badges
      }
    : { rank: 0, effectId: null, badges: [] },
   hitEntry: isLottery ? hitEntry : DEFAULT_WIN
  };
 }

 // ユーザー訪問データを更新
 private updateUserVisitData(userId: string, hitEntry: LotteryEntry): void {
  let userData = this.userVisitsGod[userId];

  if (!userData) {
   userData = this.userVisitsGod[userId] = {
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
   userData.rank = hitEntry.rank;
   userData.effectId = hitEntry.effectId;
  }

  // バッジを追加
  if (hitEntry.badgeImg !== '') {
   const existingLabels = new Set(userData.badges.map((badge) => badge.label));
   if (!existingLabels.has(hitEntry.name)) {
    userData.badges.push({ url: hitEntry.badgeImg, label: hitEntry.name });
   }
  }
 }

 // 処理済みユーザー訪問データを取得する
 getUserVisitsGod() {
  return this.userVisitsGod;
 }
 // 時間閾値を設定する
 setTimeThreshold(seconds: number) {
  this.timeThreshold = seconds;
 }
 // キャッシュをクリア（メモリ管理用）
 clearCache() {
  this.userDataCache.clear();
 }
}

// 抽選エンジン
class LotteryEngine {
 private cumulativeWeights: number[];

 constructor() {
  this.cumulativeWeights = [];
  let cumulative = 0;
  lotteryTable.forEach((entry) => {
   cumulative += entry.numerator;
   this.cumulativeWeights.push(cumulative);
  });
 }

 // 抽選を実行
 performLottery(): LotteryEntry {
  const draw = this.getSecureRandomInt(65536);
  const index = this.binarySearch(this.cumulativeWeights, draw);

  if (index < lotteryTable.length) {
   console.log(`[当選] ${lotteryTable[index].name} (抽選値: ${draw})`);
  } else {
   console.log(`[デフォルト当選] ${DEFAULT_WIN.name} (抽選値: ${draw})`);
  }

  return index < lotteryTable.length ? lotteryTable[index] : DEFAULT_WIN;
 }

 // 二分探索
 private binarySearch(arr: number[], target: number): number {
  let left = 0,
   right = arr.length - 1;

  while (left <= right) {
   const mid = Math.floor((left + right) / 2);
   if (arr[mid] > target) {
    if (mid === 0 || arr[mid - 1] <= target) return mid;
    right = mid - 1;
   } else {
    left = mid + 1;
   }
  }
  return arr.length;
 }

 // 乱数生成
 private getSecureRandomInt(max: number): number {
  const array = new Uint16Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
 }
}
