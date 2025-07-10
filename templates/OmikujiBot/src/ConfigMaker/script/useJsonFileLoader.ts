// composables/useJsonFileLoader.ts
import { ref } from 'vue';
import { OmikujiDataSchema, type OmikujiDataType } from '@/types/OmikujiTypesSchema';

/**
 * JSONファイルの読み込みを担当するComposable
 */
export const useJsonFileLoader = () => {
 const fileInputRef = ref<HTMLInputElement | null>(null);
 const isFileLoading = ref(false);
 const fileLoadError = ref('');

 // ファイル選択をトリガー
 const openFileDialog = () => {
  fileInputRef.value?.click();
 };

 // JSONファイルを読み込んでパース
 const parseJsonFile = async (file: File): Promise<OmikujiDataType | null> => {
  try {
   const text = await file.text();
   const jsonData = JSON.parse(text);

   // スキーマ検証
   const validatedData = OmikujiDataSchema.parse(jsonData);
   return validatedData;
  } catch (error) {
   console.error('JSON parse error:', error);
   throw new Error('JSONファイルの形式が正しくありません。');
  }
 };

 // ファイル選択ハンドラー
 const loadJsonFromFile = async (event: Event): Promise<OmikujiDataType | null> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return null;

  isFileLoading.value = true;
  fileLoadError.value = '';

  try {
   const data = await parseJsonFile(file);

   // ファイル入力をリセット（同じファイルを再選択可能にする）
   target.value = '';

   return data;
  } catch (error) {
   fileLoadError.value = error instanceof Error ? error.message : '読み込みエラーが発生しました';
   return null;
  } finally {
   isFileLoading.value = false;
  }
 };

 // リセット
 const resetFileLoader = () => {
  fileLoadError.value = '';
 };

 return {
  // State
  fileInputRef,
  isFileLoading,
  fileLoadError,

  // Actions
  openFileDialog,
  loadJsonFromFile,
  resetFileLoader
 };
};
