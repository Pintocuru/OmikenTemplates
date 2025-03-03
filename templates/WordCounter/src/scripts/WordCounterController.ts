// WordCounterController.ts
import { LocalStorageController } from '@common/LocalStorage/LocalStorageController';
import { ControllerAction, ControllerActionData, WordCounterConfig } from './types';

export class WordCounterController extends LocalStorageController<
 ControllerAction,
 ControllerActionData
> {
 private config: WordCounterConfig;

 constructor(config: WordCounterConfig) {
  super('WordCounter');
  this.config = config;
 }

 // カウントアップ処理
 countUp(): void {
  this.saveAction({
   action: 'countUp',
   data: {}
  });
 }

 // カウントダウン処理
 countDown(): void {
  this.saveAction({
   action: 'countDown',
   data: {}
  });
 }

 // ユーザーカウントモード切替
 UserCountToggle(): void {
  this.saveAction({
   action: 'UserCountToggle',
   data: {}
  });
 }

 // カウンターリセット
 resetCounter(): void {
  this.saveAction({
   action: 'resetCounter',
   data: {}
  });
 }

 // 現在の状態を取得
 getCurrentState(): { action: ControllerAction; data: ControllerActionData } | null {
  const storedValue = this.getStoredValue();
  if (!storedValue) return null;

  return {
   action: storedValue.action as ControllerAction,
   data: storedValue.data as ControllerActionData
  };
 }
}
