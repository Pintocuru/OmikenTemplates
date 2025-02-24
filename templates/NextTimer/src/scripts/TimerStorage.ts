// src/scripts/TimerStorage.ts
import { TimerAction, TimerActionData, TimerStorageData } from './types';

export class TimerStorageController {
 private readonly STORAGE_KEY = 'timer_control';
 private readonly MIN_SECONDS = 10;
 private readonly MAX_SECONDS = 300;
 private listeners: Set<(action: TimerAction, data: TimerActionData) => void>;

 constructor() {
  this.listeners = new Set();
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
 startTimer(seconds: number): void {
  this.saveAction({
   action: 'start',
   data: { timestamp: new Date(Date.now() + seconds * 1000) }
  });
 }

 // タイマーを一時停止
 pauseTimer(): void {
  this.saveAction({
   action: 'pause',
   data: {}
  });
 }

 // タイマーをリセット
 resetTimer(): void {
  this.saveAction({
   action: 'reset',
   data: {}
  });
 }

 // タイマーの表示/非表示を切り替え
 toggleVisibility(): void {
  this.saveAction({
   action: 'toggle_visibility',
   data: {}
  });
 }

 // 初期開始時間を変更
 setInitialTime(seconds: number): void {
  const adjustedSeconds = Math.max(this.MIN_SECONDS, Math.min(this.MAX_SECONDS, seconds));

  this.saveAction({
   action: 'initial_time',
   data: {
    value: adjustedSeconds
   }
  });
 }

 private handleStorageEvent = (event: StorageEvent): void => {
  if (event.key !== this.STORAGE_KEY) return;

  try {
   const storageData: TimerStorageData = JSON.parse(event.newValue || '');
   const result: TimerActionData = {
    timestamp: storageData.data.timestamp ? new Date(storageData.data.timestamp) : undefined,
    value: storageData.data.value
   };

   this.listeners.forEach((listener) => listener(storageData.action, result));
  } catch (error) {
   console.error('Failed to process storage event:', error);
  }
 };

 private saveAction(data: TimerStorageData): void {
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
 }
}
