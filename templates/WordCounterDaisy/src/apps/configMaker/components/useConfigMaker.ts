// src/apps/configMaker/stores/configMaker.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { CounterSet } from '@scripts/types';
import { validateConfig } from '@/scripts/schema';
import { counterSetOperations } from './counterSetOperations';

// 定数
const CONFIG_FILE_NAME = 'config.js';
const CONFIG_MIME_TYPE = 'application/javascript';

// 初期設定の検証
const initialConfig = validateConfig(window.counterSets);

export const useConfigMaker = defineStore('configMaker', () => {
 // State
 const counterSets = ref<CounterSet[]>(initialConfig);
 const activeSetIndex = ref(0);
 const showPreview = ref(false);

 // Computed
 const activeSet = computed(() => counterSets.value[activeSetIndex.value] || null);

 // Derived computed properties for UI states
 const canMoveUp = computed(() => activeSetIndex.value > 0);
 const canMoveDown = computed(() => activeSetIndex.value < counterSets.value.length - 1);
 const canDelete = computed(() => counterSets.value.length > 1);

 // Actions
 const setActiveSet = (index: number) => {
  if (index >= 0 && index < counterSets.value.length) {
   activeSetIndex.value = index;
  }
 };

 const addCounterSet = () => {
  const { newSets, newIndex } = counterSetOperations.addCounterSet(counterSets.value);
  counterSets.value = newSets;
  activeSetIndex.value = newIndex;
 };

 const deleteSet = (index: number) => {
  if (!canDelete.value) return;

  const { newSets, newActiveIndex } = counterSetOperations.deleteSet(
   counterSets.value,
   index,
   activeSetIndex.value
  );
  counterSets.value = newSets;
  activeSetIndex.value = newActiveIndex;
 };

 const duplicateSet = (index: number) => {
  const { newSets, newIndex } = counterSetOperations.duplicateSet(counterSets.value, index);
  counterSets.value = newSets;
  activeSetIndex.value = newIndex;
 };

 const moveSetUp = (index: number) => {
  if (!canMoveUp.value) return;

  const { newSets, newIndex } = counterSetOperations.moveSetUp(counterSets.value, index);
  counterSets.value = newSets;
  activeSetIndex.value = newIndex;
 };

 const moveSetDown = (index: number) => {
  if (!canMoveDown.value) return;

  const { newSets, newIndex } = counterSetOperations.moveSetDown(counterSets.value, index);
  counterSets.value = newSets;
  activeSetIndex.value = newIndex;
 };

 const togglePreview = () => {
  showPreview.value = !showPreview.value;
 };

 // JavaScript設定ファイルの内容を生成
 const buildConfigFileContent = (): string => {
  const configObject = counterSets.value;
  return (
   `const config = ${JSON.stringify(configObject, null, 2)};\n` +
   `if (typeof window !== 'undefined') window.counterSets = config;`
  );
 };

 // 現在の設定をファイルとしてダウンロード
 const generateConfig = async (): Promise<boolean> => {
  try {
   const content = buildConfigFileContent();
   const blob = new Blob([content], { type: CONFIG_MIME_TYPE });
   const url = URL.createObjectURL(blob);

   const link = document.createElement('a');
   link.href = url;
   link.download = CONFIG_FILE_NAME;
   link.style.display = 'none';

   document.body.appendChild(link);
   link.click();

   // Clean up
   document.body.removeChild(link);
   URL.revokeObjectURL(url);

   return true;
  } catch (error) {
   console.error('Error generating config file:', error);
   return false;
  }
 };

 // アクティブなセットのテーマを取得
 const activeTheme = computed(() => {
  return activeSet.value?.generator.theme || 'light';
 });

 // テーマ変更の監視
 watch(
  activeTheme,
  (newTheme) => {
   // data-themeの変更
   document.documentElement.setAttribute('data-theme', newTheme);
  },
  { immediate: true }
 );

 return {
  // State
  counterSets,
  activeSetIndex,
  activeSet,
  showPreview,

  // Computed
  canMoveUp,
  canMoveDown,
  canDelete,
  activeTheme,

  // Actions
  setActiveSet,
  addCounterSet,
  deleteSet,
  duplicateSet,
  moveSetUp,
  moveSetDown,
  togglePreview,
  generateConfig
 };
});
