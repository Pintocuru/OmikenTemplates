// src/apps/scripts/useLocalStorage.ts
import { onUnmounted, onMounted } from 'vue';
import { ControllerAction, ControllerActionData, WordCounterConfig } from './types';
import { ActionConfig, LocalStorageController } from '@common/LocalStorage/LocalStorageController';

export function useLocalStorage() {
 // LocalStorage 初期化
 const controller = new LocalStorageController<ControllerAction, ControllerActionData>(
  'WordCounter'
 );

 // アクション定義
 const actionMap: Record<string, ActionConfig<ControllerAction, ControllerActionData>> = {
  countUp: { action: 'countUp', data: {} },
  countDown: { action: 'countDown', data: {} },
  resetCounter: { action: 'resetCounter', data: {} }
 };

 // 初期化
 onMounted(() => {
  // LocalStorage 初期化
  controller.initialize();
  controller.registerActions(actionMap);
 });

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  controller.cleanup();
 });

 return {
  controller
 };
}
