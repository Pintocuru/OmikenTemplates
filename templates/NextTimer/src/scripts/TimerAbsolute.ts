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
 MAX_SECONDS: number = 43200; // タイマーの最大値(秒)
 constructor(config: NextTimerConfigType) {
  this.MIN_SECONDS = config.MIN_SECONDS;
  this.MAX_SECONDS = Math.min(config.MAX_SECONDS, 43200);
 }

 // 文字列から時間入力を処理して日時オブジェクトを返す
 processTime(input: string, secondAdjust: SecondAdjustType): Date | null {
  this.secondAdjust = secondAdjust;

  // 相対時間表記
  const relativeMatch = input.match(RELATIVE_TIME_PATTERN);
  if (relativeMatch) {
   const targetDate = this.processRelativeTime(relativeMatch[0].trim());
   return targetDate ? this.validateTimeRange(targetDate) : null;
  }

  // フルタイム表記
  const timeMatch = input.match(TIME_PATTERN);
  if (timeMatch) {
   const parts = this.extractTimeParts(timeMatch[0].trim());
   // 無効な時間フォーマットをチェック（99:90など）
   if (parts.hours >= 24 || parts.minutes >= 60 || parts.seconds >= 60) {
    return null;
   }
   const targetDate = this.createTargetTime(parts);
   return targetDate ? this.validateTimeRange(targetDate) : null;
  }

  // 分単位表記
  const minutesMatch = input.match(MINUTES_ONLY_PATTERN);
  if (minutesMatch) {
   const targetDate = this.processMinutesOnly(minutesMatch[0].trim());
   return targetDate ? this.validateTimeRange(targetDate) : null;
  }

  return null;
 }

 // Date型から時間入力を処理
 processTimeDate(date: Date, secondAdjust: SecondAdjustType): Date | null {
  this.secondAdjust = secondAdjust;
  const normalizedDate = this.normalizeTime(date);
  return normalizedDate ? this.validateTimeRange(normalizedDate) : null;
 }

 // 設定された最小・最大秒数の範囲内かチェックし、必要に応じて調整
 private validateTimeRange(targetDate: Date): Date | null {
  const now = new Date();

  // 現在時刻と目標時刻の差分を秒単位で計算
  let diffSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

  // 最小値を確認（10秒 + adjustTimeで加算した秒数）
  const minAcceptableSeconds = Math.max(this.MIN_SECONDS, this.secondAdjust);

  // 最小値を下回る場合
  if (diffSeconds < minAcceptableSeconds) {
   // 最小秒数以上になるように調整
   const newDate = new Date(now.getTime() + minAcceptableSeconds * 1000);
   newDate.setMilliseconds(0);
   return newDate;
  } else if (diffSeconds > this.MAX_SECONDS) {
   // 最大秒数を上回る場合
   const newDate = new Date(now.getTime() + this.MAX_SECONDS * 1000);
   newDate.setMilliseconds(0);
   return newDate;
  }

  // 範囲内の場合はそのまま返す（ミリ秒は0に設定）
  targetDate.setMilliseconds(0);
  return targetDate;
 }

 // 分単位表記を処理
 private processMinutesOnly(minutesStr: string): Date | null {
  // 全角数字を半角に変換
  const normalized = minutesStr.replace(/[０-９]/g, (ch) =>
   String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

  // 数字部分を抽出
  const match = normalized.match(/([0-9]{1,2})[分ふんmM]/);
  if (!match) return null;

  const minutes = parseInt(match[1]);
  if (minutes >= 60) return null; // 無効な分数の場合

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
 private processRelativeTime(relativeStr: string): Date | null {
  // 全角数字を半角に変換
  const normalized = relativeStr.replace(/[０-９]/g, (ch) =>
   String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

  // 数値と単位を抽出（1〜3桁の数字に対応）
  const match = normalized.match(/([0-9]{1,3})(秒|びょう|s|S|分|ふん|m|M)後/);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  // 値が0の場合は無効
  if (value <= 0) return null;

  const now = new Date();
  const target = new Date(now);
  target.setMilliseconds(0); // ミリ秒を0に設定

  // 単位に応じて秒数を計算
  let secondsToAdd = 0;
  if (unit.match(/分|ふん|m|M/)) {
   // 分単位の場合、60倍して秒数に変換
   secondsToAdd = value * 60;
  } else if (unit.match(/秒|びょう|s|S/)) {
   // 秒単位の場合、そのまま使用
   secondsToAdd = value;
  }

  // 現在時刻の秒数と追加する秒数を合計
  const totalSeconds = now.getSeconds() + secondsToAdd;

  // adjustTime を使って秒数を調整
  const adjustedTime = this.adjustTime(now.getHours(), now.getMinutes(), totalSeconds);

  // 調整後の時刻を設定
  target.setHours(adjustedTime.hours);
  target.setMinutes(adjustedTime.minutes);
  target.setSeconds(adjustedTime.seconds);

  return target;
 }

 // 時間文字列から時、分、秒を抽出
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
 normalizeTime(date: Date): Date | null {
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
 private createTargetTime({ hours, minutes, seconds }: TimeParts): Date | null {
  const now = new Date();
  const target = new Date(now);

  target.setHours(hours, minutes, seconds, 0);

  // 過去の時間の場合は翌日とみなして日付を1日進める
  if (target <= now) {
   target.setDate(target.getDate() + 1);
  }

  // 現在時刻との差分を計算
  const diffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  // 設定した時間が遠すぎる場合（指定された最大秒数よりも離れている場合）は無効と判断
  if (diffSeconds > this.MAX_SECONDS) {
   return null;
  }

  return target;
 }
}
