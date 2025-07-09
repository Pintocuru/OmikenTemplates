// src/composables/useDisplayMode.ts
import { ref, computed } from 'vue';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { CommentProcessor } from '../utils/commentProcessor';

export type DisplayMode = 'messages' | 'userVisits' | 'scriptGame';
export type DisplaySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function useDisplayMode(omikujiData: any, processor: CommentProcessor) {
 const displayModes: DisplayMode[] = ['messages', 'userVisits', 'scriptGame'];
 const currentDisplayModeIndex = ref(0);

 // 現在の表示モード
 const currentDisplayMode = computed(() => displayModes[currentDisplayModeIndex.value]);

 // スクリプトゲーム選択管理
 const currentScriptGameKey = ref<string>(Object.keys(scriptGameMap)[0] || '');

 // 表示サイズ管理
 const displaySize = ref<DisplaySize>('md');

 // ランキングデータ更新トリガー用
 const rankingUpdateTrigger = ref(0);

 // 現在のスクリプトゲームコンポーネントを取得
 const currentScriptGameComponent = computed(() => {
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

  // rankingUpdateTriggerを依存関係に含めることで、明示的に更新をトリガーできる
  rankingUpdateTrigger.value; // この行で依存関係に追加

  console.log(processor.getRankingData(scriptId));

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

 // 表示サイズ変更
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

  // アクション
  nextDisplayMode,
  prevDisplayMode,
  setScriptGameKey,
  setDisplaySize,
  updateRankingData // 新しく追加
 };
}
