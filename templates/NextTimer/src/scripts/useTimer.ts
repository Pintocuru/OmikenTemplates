// useTimer.ts
import { reactive, computed, onUnmounted, toRefs } from 'vue';
import { NextTimerConfigType, ProcessResult, TimeParts } from './types';
import { TimeUtils } from './utils';
import { TIME_PATTERNS } from './constants';
import { postWordParty } from '@common/api/PostOneComme';

export function useTimer(timeConfig: NextTimerConfigType) {
 const state = reactive({
  displayTime: null as string | null,
  countdown: null as number | null,
  isVisible: timeConfig.ALWAYS_VISIBLE ? true : false,
  isHuwahuwa: false
 });

 const timers = {
  countdown: null as number | null,
  hide: null as ReturnType<typeof setTimeout> | null
 };

 // 桁ごとの数字を返す
 const countdownDigits = computed(() => {
  return state.countdown?.toString().padStart(2, '0').split('').map(Number) || [];
 });

 const cleanup = () => {
  if (timers.countdown) cancelAnimationFrame(timers.countdown);
  if (timers.hide) clearTimeout(timers.hide);
 };

 //  時間文字列から時、分、秒を抽出
 const extractTime = (timeMatch: string): TimeParts => {
  const cleanMatch = TimeUtils.convertToHalfWidth(timeMatch);
  const timeParts =
   cleanMatch.match(
    /([0-9]{1,2})[:：じ時]([0-9]{1,2})(?:[分ふん])?(?:[:：]?([0-9]{1,2})(?:[秒びょう])?)?/
   ) || cleanMatch.match(/([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2}))?/);

  if (!timeParts) {
   return { hours: 0, minutes: 0, seconds: 0 };
  }

  const [, hoursStr, minutesStr, secondsStr = '0'] = timeParts;
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);
  const seconds = parseInt(secondsStr);

  return TimeUtils.adjustTimeValues(hours, minutes, seconds);
 };

 // 絶対時間を処理する
 const processAbsoluteTime = (comment: string): ProcessResult => {
  try {
   const matches = comment.match(TIME_PATTERNS.absolute);
   if (!matches) {
    return { success: false };
   }

   for (const timeMatch of matches) {
    const { hours, minutes, seconds } = extractTime(timeMatch.trim());
    const targetTime = TimeUtils.createTargetTime(hours, minutes, seconds);
    setDisplayTime(targetTime);
   }

   return { success: true };
  } catch (error) {
   return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error in absolute time processing'
   };
  }
 };

 // 相対時間を処理
 const processRelativeTime = (comment: string): ProcessResult => {
  try {
   const matches = comment.match(TIME_PATTERNS.relative);
   if (!matches) return { success: false };

   for (const match of matches) {
    let timeValue: number = 0;
    let unit: 'minutes' | 'seconds' = 'seconds';

    if (match.match(/[０-９0-9]{1,3}(?:分後|ふんご|秒後|びょうご)/)) {
     timeValue = parseInt(TimeUtils.convertToHalfWidth(match.replace(/[^０-９0-9]/g, '')));
     unit = match.includes('分') || match.includes('ふん') ? 'minutes' : 'seconds';
    } else {
     const matchResult = match.toLowerCase().match(/([0-9]+)\s+(min(?:ute)?s?|sec(?:ond)?s?)/);
     if (matchResult) {
      const [, value, unitStr] = matchResult;
      timeValue = parseInt(value);
      unit = unitStr.startsWith('min') ? 'minutes' : 'seconds';
     }
    }

    const now = new Date();
    const targetTime = new Date(now.getTime() + timeValue * (unit === 'minutes' ? 60000 : 1000));

    if (targetTime.getTime() - now.getTime() < 10000) {
     if (!timeConfig.ALWAYS_VISIBLE) state.isVisible = false;
     return { success: true };
    }

    // 秒数を丸める（TIME_CONSTANTS.SECOND_ADJUST を適用）
    const secondAdjust = timeConfig.SECOND_ADJUST;
    targetTime.setSeconds(Math.ceil(targetTime.getSeconds() / secondAdjust) * secondAdjust);

    setDisplayTime(targetTime);
   }

   return { success: true };
  } catch (error) {
   return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error in relative time processing'
   };
  }
 };

 // 表示する時間をセット
 const setDisplayTime = (targetTime: Date): void => {
  state.displayTime = targetTime.toTimeString().slice(0, 8);
  state.isVisible = true;
  startCountdown(targetTime);
 };

 // カウントダウンを開始
 const startCountdown = (targetTime: Date): void => {
  cleanup();

  const calledAt: Record<number, boolean> = {};
  const secondsToCall = Object.keys(timeConfig.COUNT_PARTY)
   .map(Number)
   .sort((a, b) => b - a);

  secondsToCall.forEach((second) => {
   calledAt[second] = false;
  });

  // `start` の代わりに `-1` をキーとして使用
  if (!calledAt[-1]) {
   postWordParty(timeConfig.COUNT_PARTY_START, -2);
   calledAt[-1] = true;
  }

  const updateCountdown = (): void => {
   const now = new Date();
   const diff = targetTime.getTime() - now.getTime();

   if (diff > 0) {
    state.isHuwahuwa = true;
    const seconds = Math.ceil(diff / 1000);
    state.countdown = seconds;

    for (const second of secondsToCall) {
     if (seconds <= second && !calledAt[second]) {
      postWordParty(timeConfig.COUNT_PARTY[second as keyof typeof timeConfig.COUNT_PARTY], -2);
      calledAt[second] = true;
      break;
     }
    }
    timers.countdown = requestAnimationFrame(updateCountdown);
   } else {
    state.countdown = 0;
    state.isHuwahuwa = false;
    if (!calledAt[0]) {
     postWordParty(timeConfig.COUNT_PARTY_FINISH, -2);
     calledAt[0] = true;
    }
    timers.hide = setTimeout(() => {
     if (!timeConfig.ALWAYS_VISIBLE) state.isVisible = false;
    }, timeConfig.AFTER_SHOW * 1000);
   }
  };

  updateCountdown();
 };

 // メイン基幹
 const processComment = (comment: string): void => {
  try {
   const absoluteResult = processAbsoluteTime(comment);
   const relativeResult = processRelativeTime(comment);

   if (!absoluteResult.success && !relativeResult.success) {
    console.debug('No valid time patterns found in comment');
   }
  } catch (error) {
   console.error('Error processing comment:', error);
  }
 };

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(cleanup);

 return {
  ...toRefs(state),
  countdownDigits,
  processComment,
  cleanup
 };
}
