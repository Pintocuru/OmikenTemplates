// src/composables/useDisplayMode.ts
import { ref, computed } from 'vue';
import { DisplaySize } from '@/types/types';
import { OmikujiDataType } from '@/types/OmikujiTypesSchema';
import { CommentProcessor } from '@/MainGenerator/utils/commentProcessor';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';

export type DisplayMode = 'messages' | 'userVisits' | 'scriptGame';

export function useDisplayMode(omikujiData: OmikujiDataType, processor: CommentProcessor) {
 const displayModes: DisplayMode[] = ['messages', 'userVisits', 'scriptGame'];
 const currentDisplayModeIndex = ref(0);

 // 現在の表示モード
 const currentDisplayMode = computed(() => displayModes[currentDisplayModeIndex.value]);

 // スクリプトゲーム選択管理
 const currentScriptGameKey = ref<string>('');

 // 表示サイズ管理
 const displaySize = ref<DisplaySize>('md');

 // ランキングデータ更新トリガー用
 const rankingUpdateTrigger = ref(0);

 // omikujiDataから実際に使用されているscriptIdを取得
 const availableScriptIds = computed(() => {
  const scriptIds = new Set<string>();

  // commentsから scriptId を収集
  Object.values(omikujiData.comments).forEach((comment) => {
   if (comment.scriptId && scriptGameMap[comment.scriptId]) {
    scriptIds.add(comment.scriptId);
   }
  });

  return Array.from(scriptIds);
 });

 // 現在選択中のscriptIdを初期化・更新
 const initializeCurrentScriptGameKey = () => {
  const available = availableScriptIds.value;
  if (available.length > 0) {
   if (!currentScriptGameKey.value || !available.includes(currentScriptGameKey.value)) {
    currentScriptGameKey.value = available[0];
   }
  } else {
   currentScriptGameKey.value = '';
  }
 };

 // 現在のスクリプトゲームコンポーネントを取得
 const currentScriptGameComponent = computed(() => {
  initializeCurrentScriptGameKey();

  if (!currentScriptGameKey.value || !scriptGameMap[currentScriptGameKey.value]) {
   return null;
  }
  return scriptGameMap[currentScriptGameKey.value].component;
 });

 // 現在のスクリプトゲームのpropsを取得
 const currentScriptGameProps = computed(() => {
  if (!currentScriptGameKey.value || !scriptGameMap[currentScriptGameKey.value]) {
   return {};
  }
  const scriptId = currentScriptGameKey.value;
  rankingUpdateTrigger.value; // 更新トリガー用

  return {
   settings: omikujiData.scriptSettings?.[scriptId] || {},
   userRanking: processor.getRankingData(scriptId) || [],
   displaySize: displaySize.value
  };
 });

 // ランキングデータを更新する関数
 const updateRankingData = () => {
  rankingUpdateTrigger.value++;
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
  nextDisplayMode,
  prevDisplayMode,
  setScriptGameKey,
  nextScriptGame,
  prevScriptGame,
  setDisplaySize,
  increaseDisplaySize,
  decreaseDisplaySize,
  updateRankingData
 };
}
