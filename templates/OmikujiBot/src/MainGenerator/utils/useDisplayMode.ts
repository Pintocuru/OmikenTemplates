// src/composables/useDisplayMode.ts
import { ref, computed } from 'vue';
import {
 DisplaySize,
 OmikujiDataType,
 ScriptComponentPropsType,
 ScriptComponentType,
 UserStatsType
} from '@type/';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { ScriptManager } from './ScriptManager';

export type DisplayMode = 'messages' | 'userVisits' | 'scriptGame';

// 全てのモードを統合した管理システム
interface ModeItem {
 type: DisplayMode;
 scriptKey?: string; // scriptGameの場合のみ使用
}

export function useDisplayMode(
 omikujiData: OmikujiDataType,
 scriptManager: ScriptManager,
 clearMessages?: () => void
) {
 const displaySize = ref<DisplaySize>('md');
 const forceRender = ref(0); // リアクティブ更新用
 const currentModeIndex = ref(0);

 // 全てのモードアイテムを動的に構築
 const allModeItems = computed((): ModeItem[] => {
  const items: ModeItem[] = [{ type: 'messages' }, { type: 'userVisits' }];

  // アクティブなスクリプトゲームを追加
  const activeScripts = scriptManager.getActiveScripts();
  activeScripts.forEach((scriptKey) => {
   items.push({ type: 'scriptGame', scriptKey });
  });

  return items;
 });

 // 現在のモードアイテム
 const currentModeItem = computed(() => {
  const items = allModeItems.value;
  if (items.length === 0) return { type: 'messages' as DisplayMode };

  // インデックスが範囲外の場合は最初に戻る
  if (currentModeIndex.value >= items.length) {
   currentModeIndex.value = 0;
  }

  return items[currentModeIndex.value];
 });

 // 現在の表示モード
 const currentDisplayMode = computed(() => currentModeItem.value.type);

 // 現在のスクリプトゲームキー
 const currentScriptGameKey = computed(() => currentModeItem.value.scriptKey || '');

 // ScriptManagerから直接アクティブなスクリプトIDを取得
 const availableScriptIds = computed(() => scriptManager.getActiveScripts());

 // 現在のスクリプトゲームコンポーネント
 const currentScriptGameComponent = computed(() => {
  const scriptKey = currentScriptGameKey.value;
  if (!scriptKey || !scriptGameMap[scriptKey]) return null;
  return scriptGameMap[scriptKey].component;
 });

 // 現在のスクリプトゲームのprops（リアクティブに更新される）
 const currentScriptGameProps = computed((): ScriptComponentPropsType => {
  forceRender.value;
  const scriptKey = currentScriptGameKey.value;

  // デフォルト値を設定
  if (!scriptKey || !scriptGameMap[scriptKey]) {
   return {
    settings: {},
    userRankings: [],
    displaySize: displaySize.value
   };
  }

  // ScriptManagerから最新のランキングデータを取得
  const rankingData = scriptManager.getRankingData(scriptKey);

  return {
   settings: omikujiData.scriptSettings?.[scriptKey] || {},
   userRankings: rankingData || [],
   displaySize: displaySize.value
  };
 });

 // 次のモードに切り替え
 const switchToNextMode = () => {
  clearMessages?.();
  const items = allModeItems.value;
  if (items.length === 0) return;

  currentModeIndex.value = (currentModeIndex.value + 1) % items.length;
 };

 // 前のモードに切り替え
 const switchToPrevMode = () => {
  clearMessages?.();
  const items = allModeItems.value;
  if (items.length === 0) return;

  currentModeIndex.value = (currentModeIndex.value - 1 + items.length) % items.length;
 };

 // 特定のモードに直接切り替え
 const switchToMode = (mode: DisplayMode, scriptKey?: string) => {
  clearMessages?.();
  const items = allModeItems.value;

  const targetIndex = items.findIndex((item) => {
   if (item.type !== mode) return false;
   if (mode === 'scriptGame' && scriptKey) {
    return item.scriptKey === scriptKey;
   }
   return true;
  });

  if (targetIndex !== -1) {
   currentModeIndex.value = targetIndex;
  }
 };

 // 特定のスクリプトゲームに切り替え
 const setScriptGameKey = (key: string) => {
  switchToMode('scriptGame', key);
 };

 // 表示サイズ変更
 const displaySizes: DisplaySize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

 const increaseDisplaySize = () => {
  const currentIndex = displaySizes.indexOf(displaySize.value);
  const nextIndex = Math.min(currentIndex + 1, displaySizes.length - 1);
  displaySize.value = displaySizes[nextIndex];
 };

 const decreaseDisplaySize = () => {
  const currentIndex = displaySizes.indexOf(displaySize.value);
  const prevIndex = Math.max(currentIndex - 1, 0);
  displaySize.value = displaySizes[prevIndex];
 };

 const setDisplaySize = (size: DisplaySize) => {
  displaySize.value = size;
 };

 const forceUpdate = () => {
  forceRender.value++;
 };

 // 現在のモード情報を取得（デバッグ用）
 const getCurrentModeInfo = () => {
  const items = allModeItems.value;
  return {
   currentIndex: currentModeIndex.value,
   totalModes: items.length,
   currentMode: currentModeItem.value,
   allModes: items
  };
 };

 return {
  // 状態
  currentDisplayMode,
  currentScriptGameKey,
  currentScriptGameComponent,
  currentScriptGameProps,
  scriptGameMap,
  displaySize,
  availableScriptIds,

  // アクション
  switchToNextMode,
  switchToPrevMode,
  switchToMode,
  setScriptGameKey,
  setDisplaySize,
  increaseDisplaySize,
  decreaseDisplaySize,
  forceUpdate,
  getCurrentModeInfo // デバッグ用
 };
}
