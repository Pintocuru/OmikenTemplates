// src/ConfigMaker/script/useOmikujiStore.ts - メインstore
import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
 OmikujiDataSchema,
 OmikujiDataType,
 createDefaultOmikujiData
} from '@/types/OmikujiTypesSchema';
import { omikujiSampleData } from '@/omikujiSampleData';

export const useOmikujiStore = defineStore('omikuji', () => {
 // Core data createDefaultOmikujiData()
 const data = ref<OmikujiDataType>(omikujiSampleData);

 // Navigation state
 const selectedCategory = ref<'comments' | 'timers' | 'placeholders' | 'scriptSettings'>(
  'comments'
 );
 const selectedRuleId = ref<string | null>(null);

 // Data operations
 const loadData = (omikujiData: unknown) => {
  try {
   const parsed = OmikujiDataSchema.safeParse(omikujiData);
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

 // Navigation
 const selectCategory = (category: typeof selectedCategory.value) => {
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
  data,
  selectedCategory,
  selectedRuleId,
  loadData,
  validateData,
  exportData,
  selectCategory,
  selectRule,
  clearSelection
 };
});
