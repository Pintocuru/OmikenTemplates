// src/ConfigMaker/script/useOmikujiStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
 CategoryType,
 OmikujiDataSchema,
 OmikujiDataType,
 validateOmikujiData
} from '@/types/OmikujiTypesSchema';

// omikujiData
const omikujiData = validateOmikujiData(window.omikujiData);

export const useOmikujiStore = defineStore('omikuji', () => {
 // Core data
 const data = ref<OmikujiDataType>(omikujiData);

 // Navigation state
 const selectedCategory = ref<CategoryType>('comments');
 const selectedRuleId = ref<string | null>(null);

 // Data operations
 const loadData = (loadData: unknown) => {
  try {
   const parsed = OmikujiDataSchema.safeParse(loadData);
   if (parsed.success) {
    data.value = parsed.data;
    return { success: true, message: 'データを正常に読み込みました。' };
   } else {
    return {
     success: false,
     message: 'データの形式が正しくありません。',
     errors: parsed.error.errors
    };
   }
  } catch (error) {
   return { success: false, message: 'データの読み込み中にエラーが発生しました。' };
  }
 };

 const validateData = () => {
  return OmikujiDataSchema.safeParse(data.value);
 };

 const exportData = () => {
  const validation = validateData();
  if (validation.success) {
   return JSON.stringify(data.value, null, 2);
  }
  throw new Error('データの検証に失敗しました。');
 };

 // Category operations
 const addItemToCategory = <T>(category: CategoryType, id: string, item: T) => {
  if (!data.value[category]) {
   data.value[category] = {} as any;
  }
  (data.value[category] as Record<string, T>)[id] = item;
 };

 const updateItemInCategory = <T>(category: CategoryType, id: string, item: T) => {
  if (data.value[category] && (data.value[category] as Record<string, T>)[id] !== undefined) {
   (data.value[category] as Record<string, T>)[id] = item;
  } else {
   addItemToCategory(category, id, item);
  }
 };

 const removeItemFromCategory = (category: CategoryType, id: string) => {
  if (data.value[category] && (data.value[category] as Record<string, any>)[id] !== undefined) {
   delete (data.value[category] as Record<string, any>)[id];
  }
 };

 const getItemFromCategory = <T>(category: CategoryType, id: string): T | undefined => {
  return (data.value[category] as Record<string, T>)?.[id];
 };

 const getCategoryItems = <T>(category: CategoryType): Record<string, T> => {
  return (data.value[category] as Record<string, T>) || {};
 };

 const duplicateItemInCategory = <T>(category: CategoryType, id: string): string | null => {
  const item = getItemFromCategory<T>(category, id);
  if (!item) return null;

  const newId = `${id}_copy_${Date.now()}`;
  addItemToCategory(category, newId, { ...item } as T);
  return newId;
 };

 // Navigation
 const selectCategory = (category: CategoryType) => {
  selectedCategory.value = category;
  selectedRuleId.value = null;
 };

 const selectRule = (id: string) => {
  selectedRuleId.value = id;
 };

 const clearSelection = () => {
  selectedRuleId.value = null;
 };

 return {
  // データ
  data,

  // ナビゲーション状態
  selectedCategory,
  selectedRuleId,

  // データ操作メソッド
  loadData,
  validateData,
  exportData,

  // カテゴリ操作メソッド
  addItemToCategory,
  updateItemInCategory,
  removeItemFromCategory,
  getItemFromCategory,
  getCategoryItems,
  duplicateItemInCategory,

  // ナビゲーション
  selectCategory,
  selectRule,
  clearSelection
 };
});
