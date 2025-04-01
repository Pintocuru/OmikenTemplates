// src/apps/scripts/useWordCounter.ts
import { computed, onMounted, reactive, watch, toRefs } from 'vue';
import { WordCounterState } from './types';
import { ComponentConfig, CounterConfig, CounterSet } from './schema';
import { createProcessComment } from './createProcessComment';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { GetMetas } from '@common/subscribe/GetMetas';
import { postWordParty } from '@common/api/PostOneComme';
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import { createHandleMetaUpdate } from './createHandleMetaUpdate';

export function useWordCounter(componentConfig: ComponentConfig, counterSet: CounterSet) {
 // デフォルト値を使用した設定の抽出と初期化
 const counterConfig: CounterConfig = counterSet.counter;
 const userVisitsConfig = counterSet.userVisits;

 // コメントからvisitデータを生成する
 const { fetchComments } = GetUserVisits(userVisitsConfig);
 // わんコメの枠の一番上のデータを取得 TODO: あとで枠指定するかも
 const { fetchMeta } = GetMetas();

 // リアクティブなstate
 const state = reactive<WordCounterState>({
  isInitFlag: false, // 初期化状態を false に設定（初期化後に true に変更）
  isLive: false,
  manualAdjustment: 0, // 手動で加算・減算した数値
  commentCount: 0, // fetchCommentsで取得した基本コメント数
  userCount: 0, // fetchCommentsで取得した基本ユーザー数
  syokenCount: 0, // fetchCommentsで取得した基本ユーザー数のうち、初見さん
  upVoteCount: 0,
  viewerCount: 0,
  peakUpVoteCount: 0, // 過去最高の高評価数
  peakViewerCount: 0 // 最大視聴者数
 });

 // カウントモードの判定
 const isDownMode = computed(() => counterConfig.TARGET_DOWN > 0);

 // コメント処理ハンドラ
 const processComment = createProcessComment(state);
 const handleMetaUpdate = createHandleMetaUpdate(state);

 // カウントモードに応じた基準値を取得
 const getBaseCount = () => {
  const countModeMap: Record<CounterConfig['COUNT_MODE'], number> = {
   user: state.userCount,
   comment: state.commentCount,
   syoken: state.syokenCount
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
  // 初期テーマ設定
  document.documentElement.setAttribute('data-theme', componentConfig.theme);

  try {
   // コメント取得と処理の初期化
   state.isInitFlag = await fetchComments(processComment);

   // metaタグからデータを取得
   await fetchMeta(handleMetaUpdate);
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
