// src/scripts/TimerAbsolute.ts
import {
 TimeParts,
 SecondAdjustType,
 NextTimerConfigType,
 TIME_PATTERN,
 MINUTES_ONLY_PATTERN,
 RELATIVE_TIME_PATTERN
} from './types';

export class TimerAbsolute {
 secondAdjust: number = 10;
 MIN_SECONDS: number = 10; // タイマーの最低値(秒)
 MAX_SECONDS: number = 21600; // タイマーの最大値(秒)
 constructor(config: NextTimerConfigType) {
  this.MIN_SECONDS = config.MIN_SECONDS;
  this.MAX_SECONDS = Math.min(config.MAX_SECONDS, 43200);
 }

 // 文字列から時間入力を処理して日時オブジェクトを返す
 processTime(input: string, secondAdjust: SecondAdjustType): Date | null {
  this.secondAdjust = secondAdjust;

  // フルタイム表記
  const timeMatch = input.match(TIME_PATTERN);
  if (timeMatch) {
   const parts = this.extractTimeParts(timeMatch[0].trim());
   const targetDate = this.createTargetTime(parts);
   return this.validateTimeRange(targetDate);
  }

  // 分単位表記
  const minutesMatch = input.match(MINUTES_ONLY_PATTERN);
  if (minutesMatch) {
   const targetDate = this.processMinutesOnly(minutesMatch[0].trim());
   return this.validateTimeRange(targetDate);
  }

  // 相対時間表記
  const relativeMatch = input.match(RELATIVE_TIME_PATTERN);
  if (relativeMatch) {
   const targetDate = this.processRelativeTime(relativeMatch[0].trim());
   return this.validateTimeRange(targetDate);
  }

  return null;
 }

 // Date型から時間入力を処理
 processTimeDate(date: Date, secondAdjust: SecondAdjustType): Date {
  this.secondAdjust = secondAdjust;
  const normalizedDate = this.normalizeTime(date);
  return this.validateTimeRange(normalizedDate);
 }

 // 設定された最小・最大秒数の範囲内かチェックし、必要に応じて調整
 private validateTimeRange(targetDate: Date): Date {
  const now = new Date();

  // 現在時刻と目標時刻の差分を秒単位で計算
  let diffSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

  // 最小値と最大値の範囲内に調整
  if (diffSeconds < this.MIN_SECONDS) {
   // 最小秒数を下回る場合、現在時刻から最小秒数後の時刻に設定
   const newDate = new Date(now.getTime() + this.MIN_SECONDS * 1000);
   // 秒数のみ調整し、ミリ秒は0に設定
   newDate.setMilliseconds(0);
   return newDate;
  } else if (diffSeconds > this.MAX_SECONDS) {
   // 最大秒数を上回る場合、現在時刻から最大秒数後の時刻に設定
   const newDate = new Date(now.getTime() + this.MAX_SECONDS * 1000);
   // 秒数のみ調整し、ミリ秒は0に設定
   newDate.setMilliseconds(0);
   return newDate;
  }

  // 範囲内の場合はそのまま返す（ミリ秒は0に設定）
  targetDate.setMilliseconds(0);
  return targetDate;
 }

 // 分単位表記を処理
 private processMinutesOnly(minutesStr: string): Date {
  // 全角数字を半角に変換
  const normalized = minutesStr.replace(/[０-９]/g, (ch) =>
   String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

  // 数字部分を抽出
  const match = normalized.match(/([0-9]{1,2})[分ふんmM]/);
  if (!match) return new Date(); // マッチしない場合は現在時刻を返す

  const minutes = parseInt(match[1]);
  const now = new Date();
  const target = new Date(now);

  // 現在時刻の時間を維持し、指定された分に設定
  target.setHours(now.getHours(), minutes, 0, 0);

  // もし指定された分が過ぎている場合は次の時間に設定
  if (target <= now) {
   target.setHours(now.getHours() + 1);
  }

  return target;
 }

 // 相対時間表記を処理
 private processRelativeTime(relativeStr: string): Date {
  // 全角数字を半角に変換
  const normalized = relativeStr.replace(/[０-９]/g, (ch) =>
   String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

  // 数値と単位を抽出
  const match = normalized.match(/([0-9]{1,2})([秒びょうsS]|[分ふんmM])後/);
  if (!match) return new Date();

  const value = parseInt(match[1]);
  const unit = match[2];

  const now = new Date();
  const target = new Date(now);
  target.setMilliseconds(0); // ミリ秒を0に設定

  // 単位に応じて時間を計算
  if (unit.match(/[秒びょうsS]/)) {
   // 秒単位の場合
   const adjustedSeconds = Math.ceil(value / this.secondAdjust) * this.secondAdjust;
   target.setSeconds(now.getSeconds() + adjustedSeconds);
  } else if (unit.match(/[分ふんmM]/)) {
   // 分単位の場合
   target.setMinutes(now.getMinutes() + value, 0);
  }

  return target;
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

 // 時間を指定のルールに従って調整する
 normalizeTime(date: Date): Date {
  const parts: TimeParts = this.adjustTime(date.getHours(), date.getMinutes(), date.getSeconds());
  return this.createTargetTime(parts);
 }

 // 指定された時間値を SECOND_ADJUST の区切りに調整
 private adjustTime(h: number, m: number, s: number): TimeParts {
  const adjustedSeconds = Math.ceil(s / this.secondAdjust) * this.secondAdjust;
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
  if (target <= now) {
   // 過去の時間の場合は12時間先に設定（43200000ミリ秒 = 12時間）
   return new Date(target.getTime() + 43200000);
  }

  return target;
 }
}
