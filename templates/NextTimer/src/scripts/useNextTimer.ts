// src/apps/scripts/useNextTimer.ts
import { onUnmounted, onMounted, reactive, computed, toRef } from 'vue';
import {
 ControllerAction,
 ControllerActionData,
 NextTimerConfig,
 SecondAdjustType,
 TimerState,
 VALID_ADJUSTS
} from './types';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserComments } from '@common/subscribe/GetUserComments';
import { LocalStorageController } from '@common/LocalStorage/LocalStorageController';
import { postWordParty } from '@common/api/PostOneComme';
import { TimerAbsolute } from './TimerAbsolute';

// スナイプタイマー用設定
const timeConfig: NextTimerConfig = {
 // コントローラーのほう
 MIN_SECONDS: window.TIME_CONFIG?.MIN_SECONDS || 10, // タイマーの最低値(秒)
 MAX_SECONDS: window.TIME_CONFIG?.MAX_SECONDS || 300, // タイマーの最大値(秒)

 // カウンターのほう
 ALWAYS_VISIBLE: window.TIME_CONFIG?.ALWAYS_VISIBLE || false, // 常時表示させるか
 AFTER_SHOW: window.TIME_CONFIG?.AFTER_SHOW || 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: window.TIME_CONFIG?.SECOND_ADJUST || 10, // 秒数を丸める(default=10秒単位)
 PARTY: window.TIME_CONFIG?.PARTY || {}, // WordPartyの発火タイミング
 PARTY_START: window.TIME_CONFIG?.PARTY_START || '', // タイマー起動時に発火するWordParty
 PARTY_FINISH: window.TIME_CONFIG?.PARTY_FINISH || '' // タイマー0で発火するWordParty
};

const config: ConfigUserType = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 ENABLED_SERVICES: window.CONFIG?.ENABLED_SERVICES || [], // 通すユーザーIDリスト(!IDでネガティブ)
 ALLOWED_IDS: window.CONFIG?.ALLOWED_IDS || [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: window.CONFIG?.ACCESS_LEVEL || 1, // アクセスレベル
 IS_GIFT: false, // ギフト無効
 KEYWORDS: window.CONFIG?.KEYWORDS || [] // この文字列で始まるコメントを有効にする
};

export function useNextTimer() {
 // LocalStorage 初期化
 const controller = new LocalStorageController<ControllerAction, ControllerActionData>(
  'WordCounter'
 );
 // プロセッサー初期化
 const timeProcessor = new TimerAbsolute(timeConfig.MIN_SECONDS, timeConfig.MAX_SECONDS);

 // Library:コメントからvisitデータを生成する
 const { fetchComments } = GetUserComments(config);

 // userの数をカウントするstate
 const state: TimerState = reactive({
  isInitFlag: false, // わんコメ初期化フラグ
  isVisible: timeConfig.ALWAYS_VISIBLE, // 表示中か
  isTimerRunning: false, // カウント中か
  countdown: 0, // 残り時間(秒)
  displayTime: '---', // 時刻表示
  initialTime: 30, // タイマーの初期値
  secondAdjust: timeConfig.SECOND_ADJUST // 秒数を丸める単位
 });

 // 桁ごとの数字を返す
 const countdownDigits = computed(
  () => state.countdown?.toString().padStart(2, '0').split('').map(Number) || []
 );

 // タイマーリソース管理
 const timers = {
  countdown: null as number | null,
  hide: null as ReturnType<typeof setTimeout> | null
 };

 // WordParty投稿ハンドラー
 const handleWordParty = (type: string) => {
  if (state.isInitFlag) postWordParty(type, -2);
  return true;
 };

 // カウントダウンを終了
 const finishCountdown = (calledAt: Record<number, boolean>) => {
  state.countdown = 0;
  state.isTimerRunning = false;
  if (!calledAt[0]) calledAt[0] = handleWordParty(timeConfig.PARTY_FINISH);
  if (!timeConfig.ALWAYS_VISIBLE) {
   timers.hide = setTimeout(() => (state.isVisible = false), timeConfig.AFTER_SHOW * 1000);
  }
 };

 // カウントダウン中の処理
 const handleCountdownParty = (seconds: number, calledAt: Record<number, boolean>) => {
  const secondsToCall = Object.keys(timeConfig.PARTY)
   .map(Number)
   .sort((a, b) => b - a)
   .find((second) => seconds <= second && !calledAt[second]);

  if (secondsToCall !== undefined) {
   calledAt[secondsToCall] = handleWordParty(timeConfig.PARTY[secondsToCall]);
  }
 };

 // カウントダウンを開始
 const startCountdown = (targetTime: Date) => {
  cleanup();

  const calledAt: Record<number, boolean> = {};

  state.isVisible = true;
  state.isTimerRunning = true;
  state.displayTime = targetTime.toTimeString().slice(0, 8);

  if (!calledAt[-1]) calledAt[-1] = handleWordParty(timeConfig.PARTY_START);

  const updateCountdown = () => {
   const diff = targetTime.getTime() - Date.now();

   if (diff > 0) {
    state.countdown = Math.ceil(diff / 1000);
    handleCountdownParty(state.countdown, calledAt);
    timers.countdown = requestAnimationFrame(updateCountdown);
   } else {
    finishCountdown(calledAt);
   }
  };

  updateCountdown();
 };

 // タイマーアクション処理
 const startAction = (timestamp: Date) => {
  const adjustedTime = timeProcessor.processTimeDate(timestamp, state.secondAdjust);
  if (adjustedTime) startCountdown(adjustedTime);
 };

 const startActionInput = (time: number = state.initialTime) => {
  const futureTime = new Date(Date.now() + time * 1000); // 現在時刻 + 30秒
  startAction(futureTime);
 };

 const pauseAction = () => {
  if (timers.countdown) {
   cancelAnimationFrame(timers.countdown);
   state.isTimerRunning = false;
  }
 };

 const resetAction = () => {
  cleanup();
  state.countdown = state.initialTime;
  state.displayTime = '---';
  state.isTimerRunning = false;
 };

 const toggleVisibilityAction = () => {
  if (state.isVisible && timers.countdown) {
   cancelAnimationFrame(timers.countdown);
   state.isTimerRunning = false;
  }
  state.isVisible = !state.isVisible;
 };

 const initialTimeAction = (data: ControllerActionData) => {
  if (data.initialTime && !state.isTimerRunning) {
   state.initialTime = data.initialTime;
   state.countdown = data.initialTime;
   state.displayTime = '---';
  }
 };

 const secondAdjustAction = (data: ControllerActionData) => {
  if (data.initialTime && [10, 15, 20, 30].includes(data.initialTime)) {
   state.secondAdjust = data.initialTime as SecondAdjustType;
  }
 };

 // タイマーアクション処理
 const handleControllerAction = (action: ControllerAction, data?: ControllerActionData) => {
  if (data) {
   // 必要に応じて型変換
   const parsedData: ControllerActionData = {
    ...data,
    timestamp: typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp,
    initialTime: typeof data.initialTime === 'string' ? Number(data.initialTime) : data.initialTime,
    secondAdjust:
     typeof data.secondAdjust === 'string'
      ? (VALID_ADJUSTS.find((v) => v === Number(data!.secondAdjust)) ?? undefined)
      : data.secondAdjust
   };
   data = parsedData; // 変換後のデータを使う
  }

  const actions: Record<ControllerAction, (data?: ControllerActionData) => void> = {
   start: (data) => data?.timestamp && startAction(data.timestamp),
   pause: pauseAction,
   reset: resetAction,
   toggle_visibility: toggleVisibilityAction,
   initial_time: (data) => data && initialTimeAction(data),
   second_adjust: (data) => data && secondAdjustAction(data)
  };

  if (action in actions) actions[action](data);
 };

 // クリーンアップ関数
 const cleanup = () => {
  if (timers.countdown) cancelAnimationFrame(timers.countdown);
  if (timers.hide) clearTimeout(timers.hide);
 };

 // 初期化
 onMounted(async () => {
  // わんコメの初期化ができたかをチェック
  state.isInitFlag = await fetchComments((comments) => {
   comments.forEach((newComment) => {
    // タイマー稼働中は新たな設定を受け付けない
    if (state.isTimerRunning) return;

    const comment = newComment.data.comment;
    const time = timeProcessor.processTime(comment, state.secondAdjust);
    if (time) startCountdown(time);
   });
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
  timerState: toRef(state),
  countdownDigits,

  // 各アクション
  startAction,
  startActionInput,
  pauseAction,
  resetAction,
  toggleVisibilityAction,
  initialTimeAction,
  secondAdjustAction
 };
}
