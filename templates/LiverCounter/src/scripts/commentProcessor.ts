// src/apps/scripts/commentProcessor.ts
import { WordCounterState } from './types';
import { ServiceVisitType } from '@common/subscribe/GetUserVisits';

export function createCommentProcessor(state: WordCounterState) {
 return (visits: Record<string, ServiceVisitType>) => {
  // すべてのサービスから集計データを計算
  const metrics = Object.values(visits).reduce(
   (acc, service) => ({
    commentCount: acc.commentCount + service.totalCount,
    userCount: acc.userCount + Object.keys(service.user).length,
    syokenCount: acc.syokenCount + service.syokenCount,
    totalGift: acc.totalGift + service.totalPrice
   }),
   { commentCount: 0, userCount: 0, syokenCount: 0, totalGift: 0 }
  );

  // データリセットケース
  if (metrics.commentCount === 0) {
   state.commentCount = 0;
   state.userCount = 0;
   state.syokenCount = 0;
   state.totalGift = 0;
   return;
  }

  // 初期化または値の更新
  if (state.userCount === 0 && state.commentCount === 0) {
   // 初期値設定
   Object.assign(state, metrics);
  } else {
   // 各指標が増加した場合のみ更新
   if (metrics.commentCount > state.commentCount) state.commentCount = metrics.commentCount;
   if (metrics.userCount > state.userCount) state.userCount = metrics.userCount;
   if (metrics.syokenCount > state.syokenCount) state.syokenCount = metrics.syokenCount;
   if (metrics.totalGift > state.totalGift) state.totalGift = metrics.totalGift;
  }
 };
}
