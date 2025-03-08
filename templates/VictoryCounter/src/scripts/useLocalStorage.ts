// src/apps/scripts/useLocalStorage.ts
import { onUnmounted, onMounted } from 'vue';
import { ControllerAction, ControllerActionData, WordCounterConfig } from './types';
import { ActionConfig, LocalStorageController } from '@common/LocalStorage/LocalStorageController';

// 定数
const WordConfig: WordCounterConfig = {
 IS_USER_COUNT: true, // ユーザー数をカウントか、コメント数をカウントか
 COUNT_PARTY: window.WORD_CONFIG?.COUNT_PARTY || {}, // WordPartyの発火タイミング
 COUNT_PARTY_EVENT: window.WORD_CONFIG?.COUNT_PARTY_EVENT || '', // カウント増加時に発火するWordParty
 TARGET_COUNT: window.WORD_CONFIG?.TARGET_COUNT || 15, // 目標となる数値
 LOOP_COUNT: window.WORD_CONFIG?.LOOP_COUNT || false, // 目標達成後、色を変化させるか
 PROGRESS_TEXTS: window.WORD_CONFIG?.PROGRESS_TEXTS, // 数値が増えるたびに変化するテキスト
 PROGRESS_TEXTS_AFTER: window.WORD_CONFIG?.PROGRESS_TEXTS_AFTER, // 数値が増えるたびに変化するテキスト
 PROGRESS_STYLES: window.WORD_CONFIG?.PROGRESS_STYLES, // 数値が増えるたびに変化するテキスト
 SECOND_NAME_MODE: window.WORD_CONFIG?.SECOND_NAME_MODE // Splatoonの二つ名モード(隠し)
};

export function useLocalStorage() {
 // LocalStorage 初期化
 const controller = new LocalStorageController<ControllerAction, ControllerActionData>(
  'WordCounter'
 );

 // アクション定義
 const actionMap: Record<string, ActionConfig<ControllerAction, ControllerActionData>> = {
  countUp: { action: 'countUp', data: {} },
  countDown: { action: 'countDown', data: {} },
  userCountToggle: { action: 'userCountToggle', data: {} },
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
  controller,
  WordConfig
 };
}
