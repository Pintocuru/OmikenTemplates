// src/apps/scripts/useWordCounter.ts
import { computed, onUnmounted, onMounted, reactive, toRef, watch } from 'vue';
import { ControllerAction, ControllerActionData, WordCounterConfig } from './types';
import { createProcessComment } from './createProcessComment';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { LocalStorageController } from '@common/LocalStorage/LocalStorageController';
import { postWordParty } from '@common/api/PostOneComme';

// 定数
const WordConfig: WordCounterConfig = {
 IS_USER_COUNT: true, // ユーザー数をカウントか、コメント数をカウントか
 COUNT_PARTY: window.WORD_CONFIG?.COUNT_PARTY || {}, // WordPartyの発火タイミング
 COUNT_PARTY_EVENT: window.WORD_CONFIG?.COUNT_PARTY_EVENT || '', // カウント増加時に発火するWordParty
 TARGET_COUNT: window.WORD_CONFIG?.TARGET_COUNT || 15, // 目標となる数値
 LOOP_COUNT: window.WORD_CONFIG?.LOOP_COUNT || false, // 目標達成後、色を変化させるか
 PROGRESS_TEXTS: window.WORD_CONFIG?.PROGRESS_TEXTS || [] // 数値が増えるたびに変化するテキスト
};

const config: ConfigUserType = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 ALLOWED_IDS: window.CONFIG?.ALLOWED_IDS || [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: window.CONFIG?.ACCESS_LEVEL || 1, // アクセスレベル
 IS_GIFT: false, // ギフト無効
 KEYWORDS: window.CONFIG?.KEYWORDS || [] // この文字列で始まるコメントを有効にする
};

export function useWordCounter() {
 // LocalStorage 初期化
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
    state.userCount = state.originUserCount;
    state.commentCount = state.originCommentCount;
   }
  };

  if (action in actions) actions[action]();
 };

 // WordPartyハンドラ
 watch(count, (newCount, oldCount) => {
  // わんコメ初期化できてない場合はreturn
  if (!state.isInitFlag) return;

  // カウント増加時に発火するWordParty
  if (newCount > oldCount) postWordParty(WordConfig.COUNT_PARTY_EVENT, -2);

  // 特定の数値に対応するWordParty
  const partyMessage = WordConfig.COUNT_PARTY[newCount];
  if (partyMessage) postWordParty(partyMessage, -2);
 });

 // 初期化
 onMounted(async () => {
  // わんコメの初期化ができたかをチェック
  state.isInitFlag = await fetchComments((visits) => processComment(visits));
  // LocalStorage 初期化
  controller.initialize();
  controller.addListener(handleControllerAction);
 });

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  controller.cleanup();
 });

 return {
  controller,
  isInitFlag: toRef(state, 'isInitFlag'),
  isUserCount: toRef(state, 'isUserCount'),
  count,
  WordConfig
 };
}
