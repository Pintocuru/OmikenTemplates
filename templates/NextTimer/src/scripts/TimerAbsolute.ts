// src/scripts/TimerAbsolute.ts
import { TimeParts, NextTimerConfigType, TIME_PATTERN } from './types';

export class TimerAbsolute {
 constructor(private config: NextTimerConfigType) {}

 // 絶対時間を処理
 processTime(comment: string): Date[] | null {
  const matches = comment.match(TIME_PATTERN);
  if (!matches) return null;

  return matches.map((timeMatch) => {
   const parts = this.extractTimeParts(timeMatch.trim());
   return this.createTargetTime(parts);
  });
 }

 //  時間文字列から時、分、秒を抽出
 private extractTimeParts(timeStr: string): TimeParts {
  const normalized = timeStr.replace(/[０-９]/g, (ch) =>
   String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

  const match = normalized.match(
   /([0-9]{1,2})[:：じ時]([0-9]{1,2})(?:[分ふん])?(?:[:：]?([0-9]{1,2})(?:[秒びょう])?)?/
  );

  if (!match) return { hours: 0, minutes: 0, seconds: 0 };
  const [, h, m, s = '0'] = match;

  return this.adjustTime(parseInt(h), parseInt(m), parseInt(s));
 }

 // 指定された時間値を SECOND_ADJUST を基準に丸める
 private adjustTime(h: number, m: number, s: number): TimeParts {
  const adjustedSeconds = Math.ceil(s / this.config.SECOND_ADJUST) * this.config.SECOND_ADJUST;
  let minutes = m + Math.floor(adjustedSeconds / 60);
  let hours = (h + Math.floor(minutes / 60)) % 24;

  return {
   hours,
   minutes: minutes % 60,
   seconds: adjustedSeconds % 60
  };
 }

 // 現在の日時を基に目標時間を計算する
 private createTargetTime({ hours, minutes, seconds }: TimeParts): Date {
  const now = new Date();
  const target = new Date(now);

  target.setHours(hours, minutes, seconds, 0);
  return target <= now ? new Date(target.getTime() + 86400000) : target;
 }
}
