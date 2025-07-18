// composables/useImportPreviewManager.ts
import { ref, computed } from 'vue';
import { validateOmikujiData, type OmikujiDataType, type CategoryType } from '@type/';

export type ImportMode = 'replace' | 'merge' | 'add-only';

// 競合情報を表すインターフェース
export interface ConflictInfo {
 key: string;
 name: string;
}

export interface CategoryImportConfig {
 enabled: boolean;
 mode: ImportMode;
 count: number; // インポートされる項目数
 conflicts: ConflictInfo[]; // 競合する項目のキーと名前
}

export interface ImportPreview {
 categories: Record<CategoryType, CategoryImportConfig>;
 totalItems: number;
 hasConflicts: boolean;
}

/**
 * インポートプレビューの生成と管理を担当するComposable
 */
export const useImportPreviewManager = () => {
 const previewData = ref<ImportPreview | null>(null);

 // デフォルトの読み込み設定
 const createDefaultConfig = (): CategoryImportConfig => ({
  enabled: true,
  mode: 'merge',
  count: 0,
  conflicts: []
 });

 // アイテムから名前を取得するヘルパー関数
 const getItemName = (item: any): string => {
  if (item && typeof item === 'object' && 'name' in item) {
   return item.name || '';
  }
  return '';
 };

 // 現在のデータとインポートデータの比較・プレビュー生成
 const buildPreview = (
  currentData: OmikujiDataType,
  importedData: OmikujiDataType
 ): ImportPreview => {
  // バリデーション済みのデータを作成
  const validatedImportData = validateOmikujiData(importedData);

  const categories: Record<CategoryType, CategoryImportConfig> = {
   comments: createDefaultConfig(),
   timers: createDefaultConfig(),
   placeholders: createDefaultConfig(),
   scriptSettings: createDefaultConfig(),
   characters: createDefaultConfig(),
   displaySettings: createDefaultConfig(),
   wordPartySettings: createDefaultConfig()
  };

  let totalItems = 0;
  let hasConflicts = false;

  // 各カテゴリの分析
  Object.entries(categories).forEach(([categoryKey, config]) => {
   const category = categoryKey as CategoryType;
   const currentItems = currentData[category] || {};
   const importItems = validatedImportData[category] || {};

   const importKeys = Object.keys(importItems);
   const currentKeys = Object.keys(currentItems);
   const conflictKeys = importKeys.filter((key) => currentKeys.includes(key));

   // 競合情報を作成（キーと名前を含む）
   const conflicts: ConflictInfo[] = conflictKeys.map((key) => ({
    key,
    name: getItemName(importItems[key])
   }));

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

 // プレビュー生成
 const generatePreview = (
  currentData: OmikujiDataType,
  importedData: OmikujiDataType
 ): ImportPreview => {
  const preview = buildPreview(currentData, importedData);
  previewData.value = preview;
  return preview;
 };

 // カテゴリ設定の更新
 const updateCategorySettings = (category: CategoryType, config: Partial<CategoryImportConfig>) => {
  if (!previewData.value) return;

  previewData.value.categories[category] = {
   ...previewData.value.categories[category],
   ...config
  };
 };

 // プレビューをクリア
 const clearPreview = () => {
  previewData.value = null;
 };

 // 計算されたプロパティ
 const hasPreviewData = computed(() => !!previewData.value);
 const enabledCategories = computed(() => {
  if (!previewData.value) return [];
  return Object.entries(previewData.value.categories)
   .filter(([, config]) => config.enabled)
   .map(([category]) => category as CategoryType);
 });

 return {
  // State
  previewData,

  // Computed
  hasPreviewData,
  enabledCategories,

  // Actions
  generatePreview,
  updateCategorySettings,
  clearPreview
 };
};
