// common/LocalStorage/LocalStorageController.ts
type StorageAction = string;
type StorageActionData = Record<string, any>;
type StorageData = {
 action: StorageAction;
 data: StorageActionData;
 timestamp?: number;
};

export class LocalStorageController<
 Action extends StorageAction = string,
 ActionData extends StorageActionData = Record<string, any>
> {
 private readonly storageKey: string;
 private listeners: Set<(action: Action, data: ActionData) => void>;

 constructor(storageKey: string) {
  this.storageKey = storageKey;
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
 addListener(callback: (action: Action, data: ActionData) => void): void {
  this.listeners.add(callback);
 }

 // アクションリスナーを削除
 removeListener(callback: (action: Action, data: ActionData) => void): void {
  this.listeners.delete(callback);
 }

 // アクションを保存
 protected saveAction(data: { action: Action; data: ActionData }): void {
  const actionWithTimestamp: StorageData = { ...data, timestamp: Date.now() };
  localStorage.setItem(this.storageKey, JSON.stringify(actionWithTimestamp));

  // イベントを発火させて他のタブと同期
  this.handleStorageEvent(
   new StorageEvent('storage', {
    key: this.storageKey,
    newValue: JSON.stringify(actionWithTimestamp)
   })
  );
 }

 // 値を取得
 protected getStoredValue(): StorageData | null {
  const storedData = localStorage.getItem(this.storageKey);
  if (!storedData) return null;

  try {
   return JSON.parse(storedData);
  } catch (error) {
   console.error('Failed to parse stored data:', error);
   return null;
  }
 }

 // ストレージイベントのハンドラー
 private handleStorageEvent = (event: StorageEvent): void => {
  // 特定のキー以外はkick
  if (event.key !== this.storageKey) return;

  try {
   if (!event.newValue) return;

   const storageData = JSON.parse(event.newValue);
   const { timestamp, ...actualData } = storageData; // タイムスタンプを除外

   this.listeners.forEach((listener) =>
    listener(actualData.action as Action, actualData.data as ActionData)
   );
  } catch (error) {
   console.error('Failed to process storage event:', error);
  }
 };
}
