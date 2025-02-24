// src/scripts/TimerStorage.ts
import { TimerAction, TimerStorageData } from './types';

export class TimerStorageController {
 private readonly STORAGE_KEY = 'timer_control';
 private listeners: Set<(action: TimerAction, timestamp?: Date) => void>;

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
 addListener(callback: (action: TimerAction, timestamp?: Date) => void): void {
  this.listeners.add(callback);
 }

 // アクションリスナーを削除
 removeListener(callback: (action: TimerAction, timestamp?: Date) => void): void {
  this.listeners.remove(callback);
 }

 // タイマーを開始
 startTimer(timestamp: Date): void {
  this.saveAction({ action: 'start', timestamp: timestamp.toISOString() });
 }

 // タイマーを一時停止
 pauseTimer(): void {
  this.saveAction({ action: 'pause' });
 }

 // タイマーをリセット
 resetTimer(): void {
  this.saveAction({ action: 'reset' });
 }

 // タイマーの表示/非表示を切り替え
 toggleVisibility(): void {
  this.saveAction({ action: 'toggle_visibility' });
 }

 private handleStorageEvent = (event: StorageEvent): void => {
  if (event.key !== this.STORAGE_KEY) return;

  try {
   const data: TimerStorageData = JSON.parse(event.newValue || '');
   const timestamp = data.timestamp ? new Date(data.timestamp) : undefined;

   this.listeners.forEach((listener) => listener(data.action, timestamp));
  } catch (error) {
   console.error('Failed to process storage event:', error);
  }
 };

 private saveAction(data: TimerStorageData): void {
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
 }
}
