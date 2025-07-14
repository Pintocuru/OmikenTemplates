// composables/useJsonImport.ts
import { ref, computed } from 'vue';
import { OmikujiDataSchema, type OmikujiDataType, type CategoryType } from '@type/';

export type ImportMode = 'replace' | 'merge' | 'add-only';

export interface CategoryImportConfig {
 enabled: boolean;
 mode: ImportMode;
 count: number; // インポートされる項目数
 conflicts: string[]; // 競合する項目のキー
}

export interface ImportPreview {
 categories: Record<CategoryType, CategoryImportConfig>;
 totalItems: number;
 hasConflicts: boolean;
}

export const useJsonImport = () => {
 const fileInput = ref<HTMLInputElement | null>(null);
 const isLoading = ref(false);
 const importData = ref<OmikujiDataType | null>(null);
 const importPreview = ref<ImportPreview | null>(null);
 const errorMessage = ref('');

 // デフォルトの読み込み設定
 const defaultCategoryConfig = (): CategoryImportConfig => ({
  enabled: true,
  mode: 'merge',
  count: 0,
  conflicts: []
 });

 // ファイル選択をトリガー
 const triggerFileSelect = () => {
  fileInput.value?.click();
 };

 // JSONファイルを読み込んでパース
 const loadJsonFile = async (file: File): Promise<OmikujiDataType | null> => {
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

 // 現在のデータとインポートデータの比較・プレビュー生成
 const generatePreview = (
  currentData: OmikujiDataType,
  importedData: OmikujiDataType
 ): ImportPreview => {
  const categories: Record<CategoryType, CategoryImportConfig> = {
   comments: defaultCategoryConfig(),
   timers: defaultCategoryConfig(),
   placeholders: defaultCategoryConfig(),
   scriptSettings: defaultCategoryConfig(),
   characters: defaultCategoryConfig()
  };

  let totalItems = 0;
  let hasConflicts = false;

  // 各カテゴリの分析
  Object.entries(categories).forEach(([categoryKey, config]) => {
   const category = categoryKey as CategoryType;
   const currentItems = currentData[category] || {};
   const importItems = importedData[category] || {};

   const importKeys = Object.keys(importItems);
   const currentKeys = Object.keys(currentItems);
   const conflicts = importKeys.filter((key) => currentKeys.includes(key));

   config.count = importKeys.length;
   config.conflicts = conflicts;

   if (conflicts.length > 0) {
    hasConflicts = true;
   }

   totalItems += importKeys.length;
  });

  return {
   categories,
   totalItems,
   hasConflicts
  };
 };

 // データのマージ処理
 const mergeData = (
  currentData: OmikujiDataType,
  importedData: OmikujiDataType,
  preview: ImportPreview
 ): OmikujiDataType => {
  const result: OmikujiDataType = { ...currentData };

  Object.entries(preview.categories).forEach(([categoryKey, config]) => {
   if (!config.enabled) return;

   const category = categoryKey as CategoryType;

   const currentItems = result[category] as Record<string, unknown>;
   const importItems = importedData[category] as Record<string, unknown>;

   let newItems: typeof currentItems;

   switch (config.mode) {
    case 'replace':
     newItems = importItems;
     break;
    case 'merge':
     newItems = { ...currentItems, ...importItems };
     break;
    case 'add-only':
     newItems = { ...currentItems };
     Object.entries(importItems).forEach(([key, value]) => {
      if (!(key in currentItems)) {
       newItems[key] = value;
      }
     });
     break;
   }

   result[category] = newItems as any; // 最終的に unknown → any にダウンキャスト
  });

  return result;
 };

 // ファイル選択ハンドラー
 const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
   const data = await loadJsonFile(file);
   importData.value = data;

   // ファイル入力をリセット（同じファイルを再選択可能にする）
   target.value = '';

   return data;
  } catch (error) {
   errorMessage.value = error instanceof Error ? error.message : '読み込みエラーが発生しました';
   return null;
  } finally {
   isLoading.value = false;
  }
 };

 // プレビュー生成
 const createPreview = (currentData: OmikujiDataType) => {
  if (!importData.value) return null;

  const preview = generatePreview(currentData, importData.value);
  importPreview.value = preview;
  return preview;
 };

 // インポート実行
 const executeImport = (currentData: OmikujiDataType): OmikujiDataType | null => {
  if (!importData.value || !importPreview.value) return null;

  return mergeData(currentData, importData.value, importPreview.value);
 };

 // カテゴリ設定の更新
 const updateCategoryConfig = (category: CategoryType, config: Partial<CategoryImportConfig>) => {
  if (!importPreview.value) return;

  importPreview.value.categories[category] = {
   ...importPreview.value.categories[category],
   ...config
  };
 };

 // リセット
 const reset = () => {
  importData.value = null;
  importPreview.value = null;
  errorMessage.value = '';
 };

 // 計算されたプロパティ
 const hasImportData = computed(() => !!importData.value);
 const hasPreview = computed(() => !!importPreview.value);
 const enabledCategories = computed(() => {
  if (!importPreview.value) return [];
  return Object.entries(importPreview.value.categories)
   .filter(([, config]) => config.enabled)
   .map(([category]) => category as CategoryType);
 });

 return {
  // State
  fileInput,
  isLoading,
  importData,
  importPreview,
  errorMessage,

  // Computed
  hasImportData,
  hasPreview,
  enabledCategories,

  // Actions
  triggerFileSelect,
  handleFileSelect,
  createPreview,
  executeImport,
  updateCategoryConfig,
  reset
 };
};
