// src/composables/useDisplayMode.ts
import { ref, computed, watchEffect } from 'vue';
import { DisplaySize } from '@/types/types';
import { OmikujiDataType } from '@/types/OmikujiTypesSchema';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { ScriptManager } from './ScriptManager';

export type DisplayMode = 'messages' | 'userVisits' | 'scriptGame';

export function useDisplayMode(
 omikujiData: OmikujiDataType,
 scriptManager: ScriptManager,
 clearMessages?: () => void
) {
 const displayModes: DisplayMode[] = ['messages', 'userVisits', 'scriptGame'];
 const currentDisplayModeIndex = ref(0);
 const currentScriptGameKey = ref<string>('');
 const displaySize = ref<DisplaySize>('md');
 const forceRender = ref(0); // リアクティブ更新用

 // 現在の表示モード
 const currentDisplayMode = computed(() => displayModes[currentDisplayModeIndex.value]);

 // ScriptManagerから直接アクティブなスクリプトIDを取得
 const availableScriptIds = computed(() => scriptManager.getActiveScripts());

 // 現在のスクリプトゲームコンポーネント
 const currentScriptGameComponent = computed(() => {
  const scriptKey = currentScriptGameKey.value;
  if (!scriptKey || !scriptGameMap[scriptKey]) return null;
  return scriptGameMap[scriptKey].component;
 });

 // 現在のスクリプトゲームのprops（リアクティブに更新される）
 const currentScriptGameProps = computed(() => {
  forceRender.value;
  const scriptKey = currentScriptGameKey.value;
  if (!scriptKey || !scriptGameMap[scriptKey]) return {};

  // ScriptManagerから最新のランキングデータを取得
  const rankingData = scriptManager.getRankingData(scriptKey);

  return {
   settings: omikujiData.scriptSettings?.[scriptKey] || {},
   userRanking: rankingData || [],
   displaySize: displaySize.value
  };
 });

 // 現在のスクリプトゲームキーを初期化する関数
 const initializeCurrentScriptGameKey = () => {
  const available = scriptManager.getActiveScripts();
  if (available.length > 0) {
   if (!currentScriptGameKey.value || !available.includes(currentScriptGameKey.value)) {
    currentScriptGameKey.value = available[0];
   }
  } else {
   currentScriptGameKey.value = '';
  }
 };
 initializeCurrentScriptGameKey();

 // 表示モード切り替え（メッセージクリア付き）
 const switchToNextMode = () => {
  clearMessages?.();
  if (currentDisplayMode.value === 'scriptGame' && availableScriptIds.value.length > 1) {
   nextScriptGame();
  } else {
   nextDisplayMode();
  }
 };

 const switchToPrevMode = () => {
  clearMessages?.();
  if (currentDisplayMode.value === 'scriptGame' && availableScriptIds.value.length > 1) {
   prevScriptGame();
  } else {
   prevDisplayMode();
  }
 };

 // 表示モード切り替え関数
 const nextDisplayMode = () => {
  currentDisplayModeIndex.value = (currentDisplayModeIndex.value + 1) % displayModes.length;
 };

 const prevDisplayMode = () => {
  currentDisplayModeIndex.value =
   (currentDisplayModeIndex.value - 1 + displayModes.length) % displayModes.length;
 };

 // スクリプトゲーム選択
 const setScriptGameKey = (key: string) => {
  currentScriptGameKey.value = key;
 };

 // 次のスクリプトゲームに切り替え
 const nextScriptGame = () => {
  const available = availableScriptIds.value;
  if (available.length <= 1) return;

  const currentIndex = available.indexOf(currentScriptGameKey.value);
  const nextIndex = (currentIndex + 1) % available.length;
  currentScriptGameKey.value = available[nextIndex];
 };

 // 前のスクリプトゲームに切り替え
 const prevScriptGame = () => {
  const available = availableScriptIds.value;
  if (available.length <= 1) return;

  const currentIndex = available.indexOf(currentScriptGameKey.value);
  const prevIndex = (currentIndex - 1 + available.length) % available.length;
  currentScriptGameKey.value = available[prevIndex];
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
  nextDisplayMode,
  prevDisplayMode,
  setScriptGameKey,
  nextScriptGame,
  prevScriptGame,
  setDisplaySize,
  increaseDisplaySize,
  decreaseDisplaySize,
  forceUpdate
 };
}
