// src/apps/configMaker/components/configMaker.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { counterSetOperations } from './counterSetOperations';
import { useGenerateConfig } from './useGenerateConfig';
import { CounterSet, validateConfig } from '@/scripts/schema';

// 初期設定の検証
const initialConfig = validateConfig(window.counterSets);

export const useConfigMaker = defineStore('configMaker', () => {
 // State
 const counterSets = ref<CounterSet[]>(initialConfig);
 const activeSetIndex = ref(0);
 const showPreview = ref(false);

 // Computed
 const activeSet = computed(() => counterSets.value[activeSetIndex.value] || null);
 const canMoveUp = computed(() => activeSetIndex.value > 0);
 const canMoveDown = computed(() => activeSetIndex.value < counterSets.value.length - 1);
 const canDelete = computed(() => counterSets.value.length > 1);
 const activeTheme = computed(() => activeSet.value?.generator.theme || 'light');

 // コンポーザブル
 const { generateConfig } = useGenerateConfig(counterSets);

 // 共通更新処理
 const updateSets = (
  operation: (sets: CounterSet[], index: number) => { newSets: CounterSet[]; newIndex: number },
  index: number
 ) => {
  const { newSets, newIndex } = operation(counterSets.value, index);
  counterSets.value = newSets;
  activeSetIndex.value = newIndex;
 };

 // Actions
 const setActiveSet = (index: number) => {
  if (index >= 0 && index < counterSets.value.length) activeSetIndex.value = index;
 };
 const addCounterSet = () =>
  updateSets(counterSetOperations.addCounterSet, counterSets.value.length);
 const deleteSet = (index: number) => {
  if (canDelete.value) updateSets(counterSetOperations.deleteSet, index);
 };
 const duplicateSet = (index: number) => updateSets(counterSetOperations.duplicateSet, index);
 const moveSetUp = (index: number) =>
  canMoveUp.value && updateSets(counterSetOperations.moveSetUp, index);
 const moveSetDown = (index: number) =>
  canMoveDown.value && updateSets(counterSetOperations.moveSetDown, index);
 const togglePreview = () => (showPreview.value = !showPreview.value);

 // テーマ変更の監視
 watch(
  activeTheme,
  (newTheme) => {
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
