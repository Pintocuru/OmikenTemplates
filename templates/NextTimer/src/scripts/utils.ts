// utils.ts
import { NextTimerConfigType, TimeParts } from '@scripts/types';

export class TimeUtils {
 // 全角の数字を半角に変換する
 static convertToHalfWidth(str: string): string {
  return str.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
 }

 // 現在の日時を基に目標時間を計算する
 static createTargetTime(hours: number, minutes: number, seconds: number): Date {
  const now = new Date();
  const target = new Date(
   now.getFullYear(),
   now.getMonth(),
   now.getDate(),
   hours,
   minutes,
   seconds
  );
  return target <= now ? new Date(target.getTime() + 24 * 60 * 60 * 1000) : target;
 }

 // 指定された時間値を SECOND_ADJUST を基準に丸める
 static adjustTimeValues(
  TIME_CONSTANTS: NextTimerConfigType,
  hours: number,
  minutes: number,
  seconds: number
 ): TimeParts {
  let adjustedHours = hours;
  let adjustedMinutes = minutes;
  let adjustedSeconds =
   Math.ceil(seconds / TIME_CONSTANTS.SECOND_ADJUST) * TIME_CONSTANTS.SECOND_ADJUST;

  if (adjustedSeconds === 60) {
   adjustedSeconds = 0;
   adjustedMinutes++;
   if (adjustedMinutes === 60) {
    adjustedMinutes = 0;
    adjustedHours++;
   }
  }

  return {
   hours: adjustedHours % 24,
   minutes: adjustedMinutes,
   seconds: adjustedSeconds
  };
 }
}
