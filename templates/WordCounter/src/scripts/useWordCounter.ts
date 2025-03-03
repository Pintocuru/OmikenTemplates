// useWordCounter.ts
import { computed, onUnmounted, toRefs, onMounted, Ref, watch, reactive } from 'vue';
import type { ControllerAction, ControllerActionData, WordCounterConfig } from './types';
import { WordCounterController } from './WordCounterController';
import { ServiceVisitType } from '@public/common/subscribe/GetUserVisits';

export function useWordCounter(config: WordCounterConfig) {
 // プロセッサー初期化
 const controller = new WordCounterController(config);

 // userの数をカウントするstate
 const state = reactive({
  isUserCount: config.IS_USER_COUNT,
  originUserCount: 0,
  originCommentCount: 0,
  userCount: 0,
  commentCount: 0
 });

 const count = computed(() => (state.isUserCount ? state.userCount : state.commentCount));

 // タイマーアクション処理
 const handleControllerAction = (action: ControllerAction, data: ControllerActionData) => {
  const actions: Record<ControllerAction, () => void> = {
   countUp: () => {
    if (state.isUserCount) state.userCount += 1;
    else state.commentCount += 1;
   },
   countDown: () => {
    if (state.isUserCount) state.userCount -= 1;
    else state.commentCount -= 1;
   },
   UserCountToggle: () => {
    state.isUserCount = !state.isUserCount;
   },
   resetCounter: () => {
    // リセットの実装
    state.userCount = state.originUserCount;
    state.commentCount = state.originCommentCount;
   }
  };

  if (action in actions) actions[action]();
 };

 // コメントによるタイマー発動
 const processComment = (visits: Record<string, ServiceVisitType>) => {
  // 合計値を計算
  let currentUserCount = 0;
  let currentCommentCount = 0;

  // visitsからデータを集計
  for (const serviceKey in visits) {
   const service = visits[serviceKey];

   // ユーザー数を数える (ユニークユーザー数)
   const serviceUserCount = Object.keys(service.user).length;
   currentUserCount += serviceUserCount;

   // コメント数 - 直接totalCountを使用
   currentCommentCount += service.totalCount;
  }

  // リセットケース: totalCountが0の場合はカウンターをリセット
  if (currentCommentCount === 0) {
   state.originUserCount = 0;
   state.originCommentCount = 0;
   state.userCount = 0;
   state.commentCount = 0;
   return;
  }

  // 初回実行時
  if (state.originUserCount === 0 && state.originCommentCount === 0) {
   state.originUserCount = currentUserCount;
   state.originCommentCount = currentCommentCount;
   state.userCount = currentUserCount;
   state.commentCount = currentCommentCount;
   return;
  }

  // ユーザー数の変化を検出
  if (currentUserCount > state.originUserCount) {
   const diff = currentUserCount - state.originUserCount;
   state.userCount += diff;
   state.originUserCount = currentUserCount;
  }

  // コメント数の変化を検出
  if (currentCommentCount > state.originCommentCount) {
   const diff = currentCommentCount - state.originCommentCount;
   state.commentCount += diff;
   state.originCommentCount = currentCommentCount;
  }
 };

 // 初期化時に LocalStorage を稼働（今回は使用しない）
 onMounted(() => {
  controller.initialize();
  controller.addListener(handleControllerAction);
 });

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  controller.cleanup();
 });

 return {
  processComment,
  count
 };
}
