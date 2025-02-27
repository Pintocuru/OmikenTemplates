// src/scripts/TimerStorage.ts
import { TimerAbsolute } from './TimerAbsolute';
import {
 NextTimerConfigType,
 SecondAdjustType,
 TimerAction,
 TimerActionData,
 TimerStorageData,
 VALID_ADJUSTS
} from './types';

export class TimerStorageController {
 private readonly STORAGE_KEY = 'timer_control';
 private MIN_SECONDS;
 private MAX_SECONDS;
 private listeners: Set<(action: TimerAction, data: TimerActionData) => void>;
 timerAbsolute: TimerAbsolute;

 constructor(config: NextTimerConfigType) {
  this.MIN_SECONDS = config?.MIN_SECONDS || 10;
  this.MAX_SECONDS = config?.MAX_SECONDS || 300;
  this.listeners = new Set();
  this.timerAbsolute = new TimerAbsolute(config);
 }

 // ストレージイベントのハンドラーを設定
 initialize(): void {
  window.addEventListener('storage', this.handleStorageEvent);
 }

 // クリーンアップ
 cleanup(): void {
  window.removeEventListener('storage', this.handleStorageEvent);
  this.listeners.clear();
 }

 // アクションリスナーを追加
 addListener(callback: (action: TimerAction, data: TimerActionData) => void): void {
  this.listeners.add(callback);
 }

 // アクションリスナーを削除
 removeListener(callback: (action: TimerAction, data: TimerActionData) => void): void {
  this.listeners.delete(callback);
 }

 // タイマーを開始
 startTimer(seconds: number, secondAdjust: SecondAdjustType): void {
  const rawTime = new Date(Date.now() + seconds * 1000);
  const timestamp = this.timerAbsolute.processTimeDate(rawTime, secondAdjust);
  if (timestamp) this.saveAction({ action: 'start', data: { timestamp } });
 }

 // タイマーを一時停止
 pauseTimer(): void {
  this.saveAction({ action: 'pause', data: {} });
 }

 // タイマーをリセット
 resetTimer(): void {
  this.saveAction({ action: 'reset', data: {} });
 }

 // タイマーの表示/非表示を切り替え
 toggleVisibility(): void {
  this.saveAction({ action: 'toggle_visibility', data: {} });
 }

 // secondAdjustを設定
 setSecondAdjust(seconds: SecondAdjustType): void {
  if (VALID_ADJUSTS.includes(seconds)) {
   this.saveAction({ action: 'second_adjust', data: { secondAdjust: seconds } });
  }
 }

 // 初期開始時間を変更
 setInitialTime(seconds: number): void {
  const adjustedSeconds = Math.max(this.MIN_SECONDS, Math.min(this.MAX_SECONDS, seconds));
  this.saveAction({ action: 'initial_time', data: { value: adjustedSeconds } });
 }

 private handleStorageEvent = (event: StorageEvent): void => {
  if (event.key !== this.STORAGE_KEY) return;

  try {
   const storageData = JSON.parse(event.newValue || '');
   const { timestamp, ...actualData } = storageData; // タイムスタンプを除外

   const result: TimerActionData = {
    timestamp: actualData.data.timestamp ? new Date(actualData.data.timestamp) : undefined,
    value: actualData.data.value
   };

   this.listeners.forEach((listener) => listener(actualData.action, result));
  } catch (error) {
   console.error('Failed to process storage event:', error);
  }
 };

 private saveAction(data: TimerStorageData): void {
  const actionWithTimestamp = { ...data, timestamp: Date.now() };
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actionWithTimestamp));
  this.handleStorageEvent(
   new StorageEvent('storage', {
    key: this.STORAGE_KEY,
    newValue: JSON.stringify(data)
   })
  );
 }
}
