// src/scripts/TimerAbsolute.ts
import {
 TimeParts,
 SecondAdjustType,
 TIME_PATTERN,
 MINUTES_ONLY_PATTERN,
 RELATIVE_TIME_PATTERN
} from './types';

export class TimerAbsolute {
 private readonly MIN_SECONDS: number;
 private readonly MAX_SECONDS: number;
 private secondAdjust: number;

 constructor(MIN_SECONDS: number, MAX_SECONDS: number) {
  this.MIN_SECONDS = MIN_SECONDS;
  this.MAX_SECONDS = Math.min(MAX_SECONDS, 43200);
  this.secondAdjust = 10;
 }

 // 全角数値を半角にし、HTMLタグを削る
 private normalizeInput(input: string): string {
  return input
   .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
   .replace(/<[^>]*>/g, '');
 }

 // Process time input with different parsing strategies
 processTime(input: string, secondAdjust: SecondAdjustType): Date | null {
  this.secondAdjust = secondAdjust;
  const normalizedInput = this.normalizeInput(input);

  // 元の定数パターンを使用して解析
  const relativeMatch = normalizedInput.match(RELATIVE_TIME_PATTERN);
  if (relativeMatch) {
   const result = this.parseRelativeTime(relativeMatch[0].trim());
   return result ? this.validateTimeRange(result) : null;
  }

  const timeMatch = normalizedInput.match(TIME_PATTERN);
  if (timeMatch) {
   const result = this.parseFullTime(timeMatch[0].trim());
   return result ? this.validateTimeRange(result) : null;
  }

  const minutesMatch = normalizedInput.match(MINUTES_ONLY_PATTERN);
  if (minutesMatch) {
   const result = this.parseMinutesOnly(minutesMatch[0].trim());
   return result ? this.validateTimeRange(result) : null;
  }

  return null;
 }

 processTimeDate(date: Date, secondAdjust: SecondAdjustType): Date | null {
  this.secondAdjust = secondAdjust;
  const normalizedDate = this.normalizeTime(date);
  return normalizedDate ? this.validateTimeRange(normalizedDate) : null;
 }

 // Validate and adjust time based on configured constraints
 private validateTimeRange(targetDate: Date): Date | null {
  const now = new Date();
  let diffSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
  const minAcceptableSeconds = Math.max(this.MIN_SECONDS, this.secondAdjust);

  if (diffSeconds < minAcceptableSeconds) {
   const newDate = new Date(now.getTime() + minAcceptableSeconds * 1000);
   newDate.setMilliseconds(0);
   return newDate;
  }

  if (diffSeconds > this.MAX_SECONDS) {
   const newDate = new Date(now.getTime() + this.MAX_SECONDS * 1000);
   newDate.setMilliseconds(0);
   return newDate;
  }

  targetDate.setMilliseconds(0);
  return targetDate;
 }

 // Parse relative time (e.g., "10分後")
 private parseRelativeTime(input: string): Date | null {
  const match = input.match(/([0-9]{1,3})(秒|びょう|s|S|分|ふん|m|M)後/);
  if (!match) return null;

  const [, valueStr, unit] = match;
  const value = parseInt(valueStr);
  if (value <= 0) return null;

  const now = new Date();
  const target = new Date(now);
  target.setMilliseconds(0);

  const secondsToAdd = unit.match(/分|ふん|m|M/) ? value * 60 : value;
  const totalSeconds = now.getSeconds() + secondsToAdd;

  const adjustedTime = this.adjustTime(now.getHours(), now.getMinutes(), totalSeconds);
  target.setHours(adjustedTime.hours, adjustedTime.minutes, adjustedTime.seconds);

  return target;
 }

 // Parse full time format (e.g., "14:30:45")
 private parseFullTime(input: string): Date | null {
  const match = input.match(
   /([0-9]{1,2})[:：じ時]([0-9]{1,2})(?:[分ふん])?(?:[:：]?([0-9]{1,2})(?:[秒びょう])?)?/
  );
  if (!match) return null;

  const [, h, m, s = '0'] = match;
  const parts = this.adjustTime(parseInt(h), parseInt(m), parseInt(s));

  if (parts.hours >= 24 || parts.minutes >= 60 || parts.seconds >= 60) return null;

  return this.createTargetTime(parts);
 }

 // Parse minutes-only format (e.g., "30分")
 private parseMinutesOnly(input: string): Date | null {
  const match = input.match(/([0-9]{1,2})[分ふんmM]/);
  if (!match) return null;

  const minutes = parseInt(match[1]);
  if (minutes >= 60) return null;

  const now = new Date();
  const target = new Date(now.getTime());
  target.setHours(now.getHours(), minutes, 0, 0);

  if (target <= now) {
   target.setHours(now.getHours() + 1);
  }

  return target;
 }

 // Normalize time according to specific rules
 normalizeTime(date: Date): Date | null {
  const parts = this.adjustTime(date.getHours(), date.getMinutes(), date.getSeconds());
  return this.createTargetTime(parts);
 }

 // Adjust time to align with specified second adjustment
 private adjustTime(h: number, m: number, s: number): TimeParts {
  const adjustedSeconds = Math.ceil(s / this.secondAdjust) * this.secondAdjust;
  const minutes = m + Math.floor(adjustedSeconds / 60);
  const hours = (h + Math.floor(minutes / 60)) % 24;

  return {
   hours,
   minutes: minutes % 60,
   seconds: adjustedSeconds % 60
  };
 }

 // Create target time based on current date
 private createTargetTime({ hours, minutes, seconds }: TimeParts): Date | null {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, seconds, 0);

  if (target <= now) {
   target.setDate(target.getDate() + 1);
  }

  const diffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
  return diffSeconds <= this.MAX_SECONDS ? target : null;
 }
}
