// src/apps/scripts/useWordCounter.ts
import { computed, onUnmounted, onMounted, reactive, toRef, watch, ref } from 'vue';
import {
 ControllerAction,
 ControllerActionData,
 WordCounterConfig,
 WordCounterState
} from './types';
import { createProcessComment } from './createProcessComment';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { LocalStorageController } from '@common/LocalStorage/LocalStorageController';
import { postWordParty } from '@common/api/PostOneComme';

// 定数
const TARGET = window.WORD_CONFIG?.generator?.TARGET || 15; // 目標となる数値
const counter: WordCounterConfig['counter'] = {
 COUNT_MODE: window.WORD_CONFIG?.counter?.COUNT_MODE || 'comment', // カウントモード
 PARTY: window.WORD_CONFIG?.counter?.PARTY || {}, // WordPartyの発火タイミング
 PARTY_EVENT: window.WORD_CONFIG?.counter?.PARTY_EVENT || '', // カウント増加時に発火するWordParty
 PARTY_SUCCESS: window.WORD_CONFIG?.counter?.PARTY_SUCCESS || '' // TARGET_COUNT達成時に発火するWordParty
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
 const state: WordCounterState = reactive({
  isInitFlag: true, // わんコメ初期化フラグ
  commentCount: 0, // fetchCommentsで取得した基本コメント数
  userCount: 0, // fetchCommentsで取得した基本ユーザー数
  syokenCount: 0, // fetchCommentsで取得した基本ユーザー数のうち、初見さん
  manualAdjustment: 0 // 手動で加算・減算した数値
 });

 // コメントを受け取った時の処理
 const processComment = createProcessComment(state);

 // カウントモードに応じた基準値を取得
 const getBaseCount = () => {
  const countModeMap = {
   user: state.userCount,
   userDown: state.userCount,
   comment: state.commentCount,
   commentDown: state.commentCount,
   syoken: state.syokenCount
  };
  return countModeMap[counter.COUNT_MODE] || 0;
 };

 // カウント計算のロジック
 const count = computed(() => {
  const baseCount = getBaseCount();
  const isDownMode = counter.COUNT_MODE.endsWith('Down');
  const value = isDownMode
   ? TARGET - (baseCount + state.manualAdjustment)
   : baseCount + state.manualAdjustment;

  return Math.max(value, 0);
 });

 // アクション処理
 const increment = () => {
  state.manualAdjustment += 1;
 };
 const decrement = () => {
  if (count.value > 0) state.manualAdjustment -= 1;
 };
 const resetManualAdjustment = () => {
  state.manualAdjustment = 0;
 };

 const handleControllerAction = (action: ControllerAction, data: ControllerActionData) => {
  const actions = {
   countUp: increment,
   countDown: decrement,
   resetCounter: resetManualAdjustment
  };
  if (action in actions) actions[action]();
 };

 // WordPartyハンドラ
 watch(count, (newCount, oldCount) => {
  // わんコメ初期化できてない場合はreturn
  if (!state.isInitFlag) return;

  const isDownMode = counter.COUNT_MODE.endsWith('Down');

  // カウント変化によるWordParty処理
  if ((newCount > oldCount && !isDownMode) || (newCount < oldCount && isDownMode)) {
   if (counter.PARTY_EVENT !== '') {
    postWordParty(counter.PARTY_EVENT, -2);
   }
  }

  // 特定の数値に対応するWordParty
  const partyMessage = counter.PARTY[newCount];
  if (partyMessage) postWordParty(partyMessage, -2);

  // PARTY_SUCCESS の発火条件
  const isSuccess = isDownMode ? newCount === 0 : newCount === TARGET;
  if (isSuccess) {
   postWordParty(counter.PARTY_SUCCESS, -2);
  }
 });

 // 初期化
 onMounted(async () => {
  // わんコメの初期化ができたかをチェック
  state.isInitFlag = await fetchComments((visits) => {
   processComment(visits);
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
  controller,
  isInitFlag: toRef(state, 'isInitFlag'),
  count,
  // 手動操作関数を公開
  increment,
  decrement,
  resetManualAdjustment
 };
}
