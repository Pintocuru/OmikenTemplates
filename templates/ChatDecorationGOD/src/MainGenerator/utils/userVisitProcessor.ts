// src/MainGenerator/utils/userVisitProcessor.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ServiceVisitType, UserVisitType } from '@common/subscribe/GetUserVisits';
import { getHitResult } from './hitTable';

/**
 * 拡張されたユーザー訪問タイプ
 */
export interface ExtendedUserVisitType extends UserVisitType {
 rank: number;
 hitName: string | null;
 effectId: number | null;
}

/**
 * 拡張されたサービス訪問タイプ
 */
export interface ExtendedServiceVisitType extends Omit<ServiceVisitType, 'user'> {
 user: Record<string, ExtendedUserVisitType>;
}

/**
 * ユーザー訪問データを処理する
 *
 * @param {Record<string, ServiceVisitType>} userVisits - ユーザー訪問データ
 * @param {Comment} comment - コメントデータ
 * @param {Record<string, ExtendedServiceVisitType>} existingProcessed - 既存の処理済みデータ
 * @return {Record<string, ExtendedServiceVisitType> | null} 処理済みユーザー訪問データ、または処理しなかった場合はnull
 */
export function processUserVisits(
 userVisits: Record<string, ServiceVisitType>,
 comment: Comment,
 existingProcessed: Record<string, ExtendedServiceVisitType> = {}
): Record<string, ExtendedServiceVisitType> | null {
 // 既存データをベースにディープコピーを作成
 const processedVisits: Record<string, ExtendedServiceVisitType> = {};

 // 既存データを複製
 for (const serviceKey in existingProcessed) {
  const existingService = existingProcessed[serviceKey];
  processedVisits[serviceKey] = {
   ...existingService,
   user: {}
  };

  // ユーザーデータも複製
  for (const userId in existingService.user) {
   processedVisits[serviceKey].user[userId] = {
    ...existingService.user[userId]
   };
  }
 }

 // サービスごとに処理
 for (const serviceKey in userVisits) {
  console.log(serviceKey);
  const serviceVisit = userVisits[serviceKey];

  if (!serviceVisit || !serviceVisit.user) continue;

  // まだ処理されていないサービスの場合は初期化
  if (!processedVisits[serviceKey]) {
   processedVisits[serviceKey] = {
    ...serviceVisit,
    user: {} as Record<string, ExtendedUserVisitType>
   };

   // ユーザーデータをコピーして拡張
   for (const userId in serviceVisit.user) {
    const originalUser = serviceVisit.user[userId];
    processedVisits[serviceKey].user[userId] = {
     ...originalUser,
     rank: 0,
     hitName: null,
     effectId: null
    };
   }
  } else {
   // 既存サービスに新しいユーザーがいる場合は追加
   for (const userId in serviceVisit.user) {
    if (!processedVisits[serviceKey].user[userId]) {
     const originalUser = serviceVisit.user[userId];
     processedVisits[serviceKey].user[userId] = {
      ...originalUser,
      rank: 0,
      hitName: null,
      effectId: null
     };
    }
   }
  }

  // コメントを処理
  processComment(processedVisits[serviceKey], comment);
 }

 return processedVisits;
}

/**
 * サービス内のユーザーを処理する
 * @param {ExtendedServiceVisitType} serviceVisit - サービス訪問データ
 * @param {Comment} comment - コメントデータ
 */
function processComment(serviceVisit: ExtendedServiceVisitType, comment: Comment): void {
 const userId = comment.data.userId;
 const user = serviceVisit.user[userId];

 // ユーザーが存在しない場合はスキップ
 if (!user) return;

 processUserRank(user);
}

/**
 * ユーザーのランクを処理する
 *
 * @param {ExtendedUserVisitType} user - ユーザーデータ
 */
function processUserRank(user: ExtendedUserVisitType): void {
 // すでに高いランク（3以上）を持っている場合はスキップ
 if (user.rank >= 4) return;

 // 抽選結果を取得
 const hitResult = getHitResult();

 // 現在のランクより高い結果が出た場合のみ更新
 if (hitResult && hitResult.rank > user.rank) {
  user.rank = hitResult.rank;
  user.hitName = hitResult.name;
  user.effectId = hitResult.effectId;
 }
}
