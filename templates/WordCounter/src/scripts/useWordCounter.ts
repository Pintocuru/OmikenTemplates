// useWordCounter.ts
import { computed, onUnmounted, onMounted, reactive, ref, toRef } from 'vue';
import { ControllerAction, ControllerActionData, WordCounterConfig } from './types';
import { WordCounterController } from './WordCounterController';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserVisits, ServiceVisitType } from '@common/subscribe/GetUserVisits';

// 定数
const WordConfig: WordCounterConfig = {
 IS_USER_COUNT: true // ユーザー数をカウントか、コメント数をカウントか
};

const config: ConfigUserType = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 ALLOWED_IDS: window.CONFIG?.ALLOWED_IDS || [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: window.CONFIG?.ACCESS_LEVEL || 1, // アクセスレベル
 IS_GIFT: false, // ギフト無効
 KEYWORDS: window.CONFIG?.KEYWORDS || [] // この文字列で始まるコメントを有効にする
};

export function useWordCounter() {
 // プロセッサー初期化
 const controller = new WordCounterController(WordConfig);
 const { fetchComments } = GetUserVisits(config);

 // userの数をカウントするstate
 const state = reactive({
  isInitFlag: true,
  isUserCount: WordConfig.IS_USER_COUNT,
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
  // わんコメが起動できていないなら早期return
  if (!state.isInitFlag) return;

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

 // 初期化
 onMounted(async () => {
  // わんコメの初期化ができたかをチェック
  state.isInitFlag = await fetchComments((visits) => {
   // 更新があるたびにチェック
   processComment(visits);
   console.log(visits);
  });
  // LocalStorage 初期化
  controller.initialize();
  controller.addListener(handleControllerAction);
 });

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  controller.cleanup();
 });

 return {
  isInitFlag: toRef(state, 'isInitFlag'),
  count
 };
}
