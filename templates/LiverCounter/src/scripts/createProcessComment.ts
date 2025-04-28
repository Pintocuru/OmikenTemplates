// src/scripts/createProcessComment.ts
import { WordCounterState } from './types';
import { ServiceVisitType } from '@common/subscribe/GetUserVisits';

export function createProcessComment(state: WordCounterState) {
 return (visits: Record<string, ServiceVisitType>) => {
  // 合計値を計算
  const { currentCommentCount, currentUserCount, currentSyokenCount, currentGift } = Object.values(
   visits
  ).reduce(
   (acc, service) => ({
    currentUserCount: acc.currentUserCount + Object.keys(service.user).length,
    currentCommentCount: acc.currentCommentCount + service.totalCount,
    currentSyokenCount: acc.currentSyokenCount + service.syokenCount,
    currentGift: acc.currentGift + service.totalPrice
   }),
   { currentCommentCount: 0, currentUserCount: 0, currentSyokenCount: 0, currentGift: 0 }
  );

  // リセットケース
  if (currentCommentCount === 0) {
   state.commentCount = 0;
   state.userCount = 0;
   state.syokenCount = 0;
   state.totalGift = 0;
   return;
  }

  // 初回実行時
  if (state.userCount === 0 && state.commentCount === 0) {
   state.commentCount = currentCommentCount;
   state.userCount = currentUserCount;
   state.syokenCount = currentSyokenCount;
   state.totalGift = currentGift;
   return;
  }

  // ユーザー数とコメント数の変化を検出
  if (currentCommentCount > state.commentCount) state.commentCount = currentCommentCount;
  if (currentUserCount > state.userCount) state.userCount = currentUserCount;
  if (currentSyokenCount > state.syokenCount) state.syokenCount = currentSyokenCount;
  if (currentGift > state.totalGift) state.totalGift = currentGift;
 };
}
