// src/apps/scripts/useLocalStorage.ts
import { onUnmounted, onMounted, ref } from 'vue';
import {
 ControllerAction,
 ControllerActionData,
 NextTimerConfig,
 SecondAdjustType,
 VALID_ADJUSTS
} from './types';
import { ActionConfig, LocalStorageController } from '@common/LocalStorage/LocalStorageController';
import { TimerAbsolute } from './TimerAbsolute';

// スナイプタイマー用設定
const timeConfig: NextTimerConfig = {
 ALWAYS_VISIBLE: window.TIME_CONFIG?.ALWAYS_VISIBLE || false, // 常時表示させるか
 MIN_SECONDS: window.TIME_CONFIG?.MIN_SECONDS || 10, // タイマーの最低値(秒)
 MAX_SECONDS: window.TIME_CONFIG?.MAX_SECONDS || 300, // タイマーの最大値(秒)
 AFTER_SHOW: window.TIME_CONFIG?.AFTER_SHOW || 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: window.TIME_CONFIG?.SECOND_ADJUST || 10, // 秒数を丸める(default=10秒単位)
 PARTY: window.TIME_CONFIG?.PARTY || {}, // WordPartyの発火タイミング
 PARTY_START: window.TIME_CONFIG?.PARTY_START || '', // タイマー起動時に発火するWordParty
 PARTY_FINISH: window.TIME_CONFIG?.PARTY_FINISH || '' // タイマー0で発火するWordParty
};

export function useLocalStorage() {
 // LocalStorage 初期化
 const controller = new LocalStorageController<ControllerAction, ControllerActionData>(
  'WordCounter'
 );
 const timerAbsolute = new TimerAbsolute(timeConfig);
 const initialTime = ref(30);
 const secondAdjust = ref<SecondAdjustType>(10);
 const now = ref(Date.now()); // 現在時刻
 // 時刻を1秒ごとに更新
 let intervalId: NodeJS.Timeout | null = null;

 // タイマー開始
 const start = () => {
  const rawTime = new Date(Date.now() + initialTime.value * 1000);
  const timestamp = timerAbsolute.processTimeDate(rawTime, secondAdjust.value);
  if (timestamp) controller.saveAction({ action: 'start', data: { timestamp } });
 };

 // 初期開始時間を変更
 const setInitialTime = (amount: number) => {
  const newValue = Math.max(
   timeConfig.MIN_SECONDS,
   Math.min(timeConfig.MAX_SECONDS, initialTime.value + amount)
  );

  if (newValue !== initialTime.value) {
   initialTime.value = newValue;
   const huga = Math.max(timeConfig.MIN_SECONDS, Math.min(timeConfig.MAX_SECONDS, newValue));
   controller.saveAction({ action: 'initial_time', data: { value: huga } });
  }
 };

 // secondAdjustを設定
 const setSecondAdjust = (seconds: SecondAdjustType) => {
  let hoge;
  if (VALID_ADJUSTS.includes(seconds)) hoge = seconds;
  if (hoge) {
   controller.saveAction({ action: 'second_adjust', data: { secondAdjust: hoge } });
  }
 };

 // アクション定義
 const actionMap: Record<string, ActionConfig<ControllerAction, ControllerActionData>> = {
  start: { action: 'start', data: {} },
  pause: { action: 'pause', data: {} },
  reset: { action: 'reset', data: {} },
  toggle_visibility: { action: 'toggle_visibility', data: {} },
  initial_time: { action: 'initial_time', data: { value: 10 } },
  second_adjust: { action: 'second_adjust', data: { secondAdjust: 10 } }
 };

 // 初期化
 onMounted(() => {
  // LocalStorage 初期化
  controller.initialize();
  controller.registerActions(actionMap);

  intervalId = setInterval(() => {
   now.value = Date.now();
  }, 1000);
 });

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  controller.cleanup();
  if (intervalId) clearInterval(intervalId);
 });

 return {
  controller,
  start,
  setInitialTime,
  setSecondAdjust
 };
}
