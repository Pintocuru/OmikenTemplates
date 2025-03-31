// src/apps/scripts/useWordCounter.ts
import { computed, onMounted, reactive, watch, toRefs } from 'vue';
import { CounterConfig, CounterSet, WordCounterState } from './types';
import { createProcessComment } from './createProcessComment';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { postWordParty } from '@common/api/PostOneComme';

export function useWordCounter(counterSet: CounterSet) {
 // デフォルト値を使用した設定の抽出と初期化
 const counterConfig: CounterConfig = counterSet.counter;
 const userVisitsConfig = counterSet.userVisits;

 // コメントからvisitデータを生成する
 const { fetchComments } = GetUserVisits(userVisitsConfig);

 // リアクティブなstate
 const state = reactive<WordCounterState>({
  isInitFlag: false, // 初期化状態を false に設定（初期化後に true に変更）
  commentCount: 0,
  userCount: 0,
  syokenCount: 0,
  manualAdjustment: 0
 });

 // カウントモードの判定
 const isDownMode = computed(() => counterConfig.TARGET_DOWN > 0);

 // コメント処理ハンドラ
 const processComment = createProcessComment(state);

 // カウントモードに応じた基準値を取得
 const getBaseCount = () => {
  const countModeMap = {
   user: state.userCount,
   comment: state.commentCount,
   syoken: state.syokenCount,
   total: 0 // totalは外部での計算なため必ず0
  };
  return countModeMap[counterConfig.COUNT_MODE] || 0;
 };

 // カウント計算（メモ化）
 const count = computed(() => {
  const baseCount = getBaseCount();
  const value = isDownMode.value
   ? counterConfig.TARGET_DOWN - (baseCount + state.manualAdjustment)
   : baseCount + state.manualAdjustment;

  return Math.max(value * counterConfig.MULTIPLIER, 0);
 });

 // アクション処理
 const increment = () => state.manualAdjustment++;

 const decrement = () => {
  if (count.value > 0) state.manualAdjustment--;
 };

 const resetManualAdjustment = () => (state.manualAdjustment = 0);

 // WordParty処理
 const handleWordParty = (newCount: number, oldCount: number) => {
  // 初期化されていない場合は処理しない
  if (!state.isInitFlag) return;

  // カウント変化によるイベント発火
  if ((newCount > oldCount && !isDownMode.value) || (newCount < oldCount && isDownMode.value)) {
   if (counterConfig.PARTY_EVENT) {
    postWordParty(counterConfig.PARTY_EVENT, -2);
   }
  }

  // 特定数値に対応するイベント
  const partyMessage = counterConfig.PARTY[newCount];
  if (partyMessage) {
   postWordParty(partyMessage, -2);
  }

  // 目標達成時のイベント
  const isSuccess = isDownMode.value ? newCount === 0 : newCount === counterConfig.TARGET_DOWN;
  if (isSuccess && counterConfig.PARTY_SUCCESS) {
   postWordParty(counterConfig.PARTY_SUCCESS, -2);
  }
 };

 // カウント変更監視
 watch(count, handleWordParty);

 // 初期化処理
 onMounted(async () => {
  // 初期テーマを手動で設定
  document.documentElement.setAttribute('data-theme', counterSet.generator.theme);

  try {
   // コメント取得と処理の初期化
   state.isInitFlag = await fetchComments(processComment);
  } catch (error) {
   console.error('WordCounter initialization error:', error);
   state.isInitFlag = false;
  }
 });

 return {
  ...toRefs(state),
  count,
  increment,
  decrement,
  resetManualAdjustment,
  isDownMode // 追加：モード情報をエクスポート
 };
}
