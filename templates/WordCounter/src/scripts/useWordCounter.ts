// useWordCounter.ts
import { computed, onUnmounted, onMounted, reactive, toRef } from 'vue';
import { ControllerAction, ControllerActionData, WordCounterConfig } from './types';
import { createProcessComment } from './createProcessComment';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { ActionConfig, LocalStorageController } from '@common/LocalStorage/LocalStorageController';

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
 const controller = new LocalStorageController<ControllerAction, ControllerActionData>(
  'WordCounter'
 );
 // Library:コメントからvisitデータを生成する
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

 // コメントを受け取った時の処理
 const processComment = createProcessComment(state);

 const count = computed(() => (state.isUserCount ? state.userCount : state.commentCount));

 // アクション定義
 const actionMap: Record<string, ActionConfig<ControllerAction, ControllerActionData>> = {
  countUp: { action: 'countUp', data: {} },
  countDown: { action: 'countDown', data: {} },
  userCountToggle: { action: 'userCountToggle', data: {} },
  resetCounter: { action: 'resetCounter', data: {} }
 };

 // アクション処理
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
   userCountToggle: () => {
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

 // 初期化
 onMounted(async () => {
  // わんコメの初期化ができたかをチェック
  state.isInitFlag = await fetchComments((visits) => {
   // 更新があるたびにチェック
   processComment(visits);
  });
  // LocalStorage 初期化
  controller.initialize();
  controller.registerActions(actionMap);
  controller.addListener(handleControllerAction);
 });

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  controller.cleanup();
 });

 return {
  controller,
  isInitFlag: toRef(state, 'isInitFlag'),
  count
 };
}
