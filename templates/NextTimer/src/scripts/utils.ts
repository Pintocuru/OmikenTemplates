// utils.ts
import { TimeParts } from '@scripts/types';
import { TIME_CONSTANTS } from '@scripts/constants';

export class TimeUtils {
 static convertToHalfWidth(str: string): string {
  return str.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
 }

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

 static adjustTimeValues(hours: number, minutes: number, seconds: number): TimeParts {
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
