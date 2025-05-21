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
 * @param {Comment[]} comments - コメントデータ
 * @return {Record<string, ExtendedServiceVisitType> | null} 処理済みユーザー訪問データ、または処理しなかった場合はnull
 */
export function processUserVisits(
 userVisits: Record<string, ServiceVisitType>,
 comments: Comment[]
): Record<string, ExtendedServiceVisitType> | null {
 // コメントがなければ処理しない
 if (!comments.length) return null;

 // ディープコピーを作成
 const processedVisits: Record<string, ExtendedServiceVisitType> = {};

 // サービスごとに処理
 for (const serviceKey in userVisits) {
  const serviceVisit = userVisits[serviceKey];

  if (!serviceVisit || !serviceVisit.user) continue;

  // 拡張型にキャストして新しいオブジェクトを作成
  const extendedServiceVisit: ExtendedServiceVisitType = {
   ...serviceVisit,
   user: {} as Record<string, ExtendedUserVisitType>
  };

  // ユーザーデータをコピーして拡張
  for (const userId in serviceVisit.user) {
   const originalUser = serviceVisit.user[userId];
   extendedServiceVisit.user[userId] = {
    ...originalUser,
    rank: 0,
    hitName: null,
    effectId: null
   };
  }

  // ユーザーごとに処理
  processUsers(extendedServiceVisit, comments);

  // 処理済みデータに追加
  processedVisits[serviceKey] = extendedServiceVisit;
 }

 return processedVisits;
}

/**
 * サービス内のユーザーを処理する
 *
 * @param {ExtendedServiceVisitType} serviceVisit - サービス訪問データ
 * @param {Comment[]} comments - コメントデータ
 */
function processUsers(serviceVisit: ExtendedServiceVisitType, comments: Comment[]): void {
 // コメントに含まれるユーザーIDのセットを作成（重複排除のため）
 const commentUserIds = new Set(comments.map((comment) => comment.data.userId));

 // コメントを投稿したユーザーのみ処理
 for (const userId of commentUserIds) {
  const user = serviceVisit.user[userId];

  // ユーザーが存在しない場合はスキップ
  if (!user) continue;

  processUserRank(user);
 }
}

/**
 * ユーザーのランクを処理する
 *
 * @param {ExtendedUserVisitType} user - ユーザーデータ
 */
function processUserRank(user: ExtendedUserVisitType): void {
 // ランクプロパティの初期化は userVisits の段階で行うため不要

 // すでに高いランク（3以上）を持っている場合はスキップ
 if (user.rank >= 3) return;

 // 抽選結果を取得
 const hitResult = getHitResult();

 // 現在のランクより高い結果が出た場合のみ更新
 if (hitResult.rank > user.rank) {
  user.rank = hitResult.rank;
  user.hitName = hitResult.name;
  user.effectId = hitResult.effectId;
 }
}
