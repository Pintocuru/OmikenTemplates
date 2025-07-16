// src/composables/useDisplayMode.ts
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { DisplayMode, DisplaySize, OmikujiDataType, ScriptComponentPropsType } from '@type/';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { ScriptManager } from './ScriptManager';

interface ModeItem {
 type: DisplayMode;
 scriptKey?: string;
}

export function useDisplayMode(
 omikujiData: OmikujiDataType,
 scriptManager: ScriptManager,
 clearMessages?: () => void
) {
 const displaySettings = omikujiData.displaySettings;
 const displaySize = ref<DisplaySize>(displaySettings.displaySize);
 const forceRender = ref(0);
 const currentModeIndex = ref(0);

 // 自動切り替えタイマー
 const autoSwitchTimer = ref<number | null>(null);

 // 有効なモードアイテムを動的に構築（displaySettingsを考慮）
 const allModeItems = computed((): ModeItem[] => {
  const items: ModeItem[] = [];
  const enabledModes = displaySettings.enabledModes;

  // messagesモード
  if (enabledModes.messages) {
   items.push({ type: 'messages' });
  }

  // userVisitsモード
  if (enabledModes.userVisits) {
   items.push({ type: 'userVisits' });
  }

  // アクティブなスクリプトゲームを追加
  const activeScripts = scriptManager.getActiveScripts();
  activeScripts.forEach((scriptKey) => {
   // スクリプトゲームが有効かチェック（デフォルトはtrue）
   if (enabledModes.scriptGames[scriptKey] !== false) {
    items.push({ type: 'scriptGame', scriptKey });
   }
  });

  return items;
 });

 // 現在のモードアイテム
 const currentModeItem = computed(() => {
  const items = allModeItems.value;
  if (items.length === 0) return { type: 'messages' as DisplayMode };

  if (currentModeIndex.value >= items.length) {
   currentModeIndex.value = 0;
  }

  return items[currentModeIndex.value];
 });

 const currentDisplayMode = computed(() => currentModeItem.value.type);
 const currentScriptGameKey = computed(() => currentModeItem.value.scriptKey || '');
 const availableScriptIds = computed(() => scriptManager.getActiveScripts());

 const currentScriptGameComponent = computed(() => {
  const scriptKey = currentScriptGameKey.value;
  if (!scriptKey || !scriptGameMap[scriptKey]) return null;
  return scriptGameMap[scriptKey].component;
 });

 const currentScriptGameProps = computed((): ScriptComponentPropsType => {
  forceRender.value;
  const scriptKey = currentScriptGameKey.value;

  if (!scriptKey || !scriptGameMap[scriptKey]) {
   return {
    settings: {},
    userRankings: [],
    displaySize: displaySize.value
   };
  }

  const rankingData = scriptManager.getRankingData(scriptKey);

  return {
   settings: omikujiData.scriptSettings?.[scriptKey] || {},
   userRankings: rankingData || [],
   displaySize: displaySize.value
  };
 });

 // 自動切り替え機能
 const startAutoSwitch = () => {
  if (autoSwitchTimer.value) {
   clearInterval(autoSwitchTimer.value);
  }

  const interval = displaySettings.autoSwitchInterval;
  if (interval > 0) {
   autoSwitchTimer.value = setInterval(() => {
    switchToNextMode();
   }, interval * 1000);
  }
 };

 const stopAutoSwitch = () => {
  if (autoSwitchTimer.value) {
   clearInterval(autoSwitchTimer.value);
   autoSwitchTimer.value = null;
  }
 };

 // 自動切り替え間隔を動的に更新
 const updateAutoSwitchInterval = (newInterval: number) => {
  stopAutoSwitch();
  if (newInterval > 0) {
   startAutoSwitch();
  }
 };

 // 次のモードに切り替え
 const switchToNextMode = () => {
  clearMessages?.();
  const items = allModeItems.value;
  if (items.length === 0) return;

  currentModeIndex.value = (currentModeIndex.value + 1) % items.length;

  // 手動切り替え時は自動切り替えを一時停止してから再開
  if (displaySettings.autoSwitchInterval > 0) {
   stopAutoSwitch();
   startAutoSwitch();
  }
 };

 // 前のモードに切り替え
 const switchToPrevMode = () => {
  clearMessages?.();
  const items = allModeItems.value;
  if (items.length === 0) return;

  currentModeIndex.value = (currentModeIndex.value - 1 + items.length) % items.length;

  // 手動切り替え時は自動切り替えを一時停止してから再開
  if (displaySettings.autoSwitchInterval > 0) {
   stopAutoSwitch();
   startAutoSwitch();
  }
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

   // 手動切り替え時は自動切り替えを一時停止してから再開
   if (displaySettings.autoSwitchInterval > 0) {
    stopAutoSwitch();
    startAutoSwitch();
   }
  }
 };

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

 // 初期化処理
 const initialize = () => {
  // displaySizeをsettingsから初期化
  displaySize.value = displaySettings.displaySize;

  // デフォルトモード設定
  if (displaySettings.defaultMode) {
   switchToMode(displaySettings.defaultMode.type, displaySettings.defaultMode.scriptKey);
  }

  // 自動切り替え開始
  startAutoSwitch();
 };

 // 設定情報を取得
 const getDisplaySettings = () => {
  return {
   ...displaySettings,
   currentDisplaySize: displaySize.value
  };
 };

 const getCurrentModeInfo = () => {
  const items = allModeItems.value;
  return {
   currentIndex: currentModeIndex.value,
   totalModes: items.length,
   currentMode: currentModeItem.value,
   allModes: items
  };
 };

 // ライフサイクル
 onMounted(() => {
  initialize();
 });

 onUnmounted(() => {
  stopAutoSwitch();
 });

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
  startAutoSwitch,
  stopAutoSwitch,
  updateAutoSwitchInterval,

  // 設定取得
  getDisplaySettings,
  getCurrentModeInfo
 };
}
