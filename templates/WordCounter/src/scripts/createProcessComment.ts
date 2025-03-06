// createProcessComment.ts
import { WordCounterState } from './types';
import { ServiceVisitType } from '@common/subscribe/GetUserVisits';

export function createProcessComment(state: WordCounterState) {
 return (visits: Record<string, ServiceVisitType>) => {
  if (!state.isInitFlag) return;

  // 合計値を計算
  const { currentUserCount, currentCommentCount } = Object.values(visits).reduce(
   (acc, service) => ({
    currentUserCount: acc.currentUserCount + Object.keys(service.user).length,
    currentCommentCount: acc.currentCommentCount + service.totalCount
   }),
   { currentUserCount: 0, currentCommentCount: 0 }
  );

  // リセットケース
  if (currentCommentCount === 0) {
   state.originUserCount = state.originCommentCount = state.userCount = state.commentCount = 0;
   return;
  }

  // 初回実行時
  if (state.originUserCount === 0 && state.originCommentCount === 0) {
   state.originUserCount = state.userCount = currentUserCount;
   state.originCommentCount = state.commentCount = currentCommentCount;
   return;
  }

  // ユーザー数とコメント数の変化を検出
  if (currentUserCount > state.originUserCount) {
   state.userCount += currentUserCount - state.originUserCount;
   state.originUserCount = currentUserCount;
  }
  if (currentCommentCount > state.originCommentCount) {
   state.commentCount += currentCommentCount - state.originCommentCount;
   state.originCommentCount = currentCommentCount;
  }
 };
}
