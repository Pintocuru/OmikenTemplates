// utils.ts
import { NextTimerConfigType, ProcessResult, TIME_PATTERNS, TimeParts } from '@scripts/types';

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

export class TimeProcessor {
 constructor(private timeConfig: NextTimerConfigType) {}

 //  時間文字列から時、分、秒を抽出
 private extractTime(timeMatch: string): TimeParts {
  const cleanMatch = TimeUtils.convertToHalfWidth(timeMatch);
  const timeParts =
   cleanMatch.match(
    /([0-9]{1,2})[:：じ時]([0-9]{1,2})(?:[分ふん])?(?:[:：]?([0-9]{1,2})(?:[秒びょう])?)?/
   ) || cleanMatch.match(/([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2}))?/);

  if (!timeParts) return { hours: 0, minutes: 0, seconds: 0 };

  const [, hours, minutes, seconds = '0'] = timeParts;
  return TimeUtils.adjustTimeValues(
   this.timeConfig,
   parseInt(hours),
   parseInt(minutes),
   parseInt(seconds)
  );
 }

 // 絶対時間を処理
 processAbsoluteTime(comment: string): ProcessResult {
  try {
   const matches = comment.match(TIME_PATTERNS.absolute);
   if (!matches) return { success: false };

   const results = matches.map((timeMatch) => {
    const { hours, minutes, seconds } = this.extractTime(timeMatch.trim());
    return TimeUtils.createTargetTime(hours, minutes, seconds);
   });

   return { success: true, times: results };
  } catch (error) {
   return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
   };
  }
 }

 // 相対時間を処理
 processRelativeTime(comment: string): ProcessResult {
  try {
   const matches = comment.match(TIME_PATTERNS.relative);
   if (!matches) return { success: false };

   const results = matches.map((match) => {
    const { value, unit } = this.parseRelativeTimeValue(match);
    const targetTime = this.calculateTargetTime(value, unit);
    return targetTime;
   });

   return { success: true, times: results };
  } catch (error) {
   return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
   };
  }
 }

 // 分と秒を判定
 private parseRelativeTimeValue(match: string): { value: number; unit: 'minutes' | 'seconds' } {
  if (match.match(/[０-９0-9]{1,3}(?:分後|ふんご|秒後|びょうご)/)) {
   const value = parseInt(TimeUtils.convertToHalfWidth(match.replace(/[^０-９0-9]/g, '')));
   const unit = match.includes('分') || match.includes('ふん') ? 'minutes' : 'seconds';
   return { value, unit };
  }

  const matchResult = match.toLowerCase().match(/([0-9]+)\s+(min(?:ute)?s?|sec(?:ond)?s?)/);
  if (!matchResult) return { value: 0, unit: 'seconds' };

  const [, value, unitStr] = matchResult;
  return {
   value: parseInt(value),
   unit: unitStr.startsWith('min') ? 'minutes' : 'seconds'
  };
 }

 // 秒数を丸める（TIME_CONSTANTS.SECOND_ADJUST を適用）
 private calculateTargetTime(value: number, unit: 'minutes' | 'seconds'): Date {
  const now = new Date();
  const targetTime = new Date(now.getTime() + value * (unit === 'minutes' ? 60000 : 1000));

  const secondAdjust = this.timeConfig.SECOND_ADJUST;
  targetTime.setSeconds(Math.ceil(targetTime.getSeconds() / secondAdjust) * secondAdjust);

  return targetTime;
 }
}
