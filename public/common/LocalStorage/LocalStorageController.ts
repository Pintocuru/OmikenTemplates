// common/LocalStorage/LocalStorageController.ts
type StorageAction = string;
type StorageActionData = Record<string, any>;
type StorageData = {
 action: StorageAction;
 data: StorageActionData;
 timestamp?: number;
};

export interface ActionConfig<
 Action extends StorageAction = string,
 ActionData extends StorageActionData = Record<string, any>
> {
 action: Action;
 data: ActionData;
}

export class LocalStorageController<
 Action extends StorageAction = string,
 ActionData extends StorageActionData = Record<string, any>
> {
 private readonly storageKey: string;
 private listeners: Set<(action: Action, data: ActionData) => void>;
 private actionMap: Record<string, ActionConfig<Action, ActionData>>;

 constructor(storageKey: string) {
  this.storageKey = storageKey;
  this.listeners = new Set();
  this.actionMap = {};
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

 // アクションマップに新しいアクションを追加
 registerAction(key: string, config: ActionConfig<Action, ActionData>): void {
  this.actionMap[key] = config;
 }

 // 複数のアクションを一度に登録
 registerActions(actions: Record<string, ActionConfig<Action, ActionData>>): void {
  this.actionMap = { ...this.actionMap, ...actions };
 }

 // アクションを実行
 action(actionKey: string): void {
  const actionConfig = this.actionMap[actionKey];
  if (actionConfig) {
   this.saveAction(actionConfig);
  } else {
   console.error(`Action "${actionKey}" not found.`);
  }
 }

 // アクションを保存
 protected saveAction(data: ActionConfig<Action, ActionData>): void {
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
