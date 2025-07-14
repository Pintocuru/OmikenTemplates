// composables/useJsonImportOrchestrator.ts
import { ref, computed } from 'vue';
import type { OmikujiDataType, CategoryType } from '@type/';
import { useJsonFileLoader } from './useJsonFileLoader';
import { useImportPreviewManager, CategoryImportConfig } from './useImportPreviewManager';
import { useDataMerger } from './useDataMerger';

/**
 * JSONインポート全体を統括するComposable
 */
export const useJsonImportOrchestrator = () => {
 // 各機能のComposable
 const fileLoader = useJsonFileLoader();
 const previewManager = useImportPreviewManager();
 const dataMerger = useDataMerger();

 // 内部状態
 const importedJsonData = ref<OmikujiDataType | null>(null);

 // ファイル選択処理
 const handleFileSelection = async (event: Event) => {
  const data = await fileLoader.loadJsonFromFile(event);

  if (fileLoader.fileLoadError.value) {
   return null;
  }

  if (data) {
   importedJsonData.value = data;
   return data;
  }

  return null;
 };

 // プレビュー生成
 const createImportPreview = (currentData: OmikujiDataType) => {
  if (!importedJsonData.value) return null;

  return previewManager.generatePreview(currentData, importedJsonData.value);
 };

 // インポート実行
 const executeDataImport = (currentData: OmikujiDataType): OmikujiDataType | null => {
  if (!importedJsonData.value || !previewManager.previewData.value) return null;

  return dataMerger.mergeDataSets(
   currentData,
   importedJsonData.value,
   previewManager.previewData.value
  );
 };

 // カテゴリ設定の更新
 const updateImportCategoryConfig = (
  category: CategoryType,
  config: Partial<CategoryImportConfig>
 ) => {
  previewManager.updateCategorySettings(category, config);
 };

 // 全体リセット
 const resetImportProcess = () => {
  importedJsonData.value = null;
  previewManager.clearPreview();
  fileLoader.resetFileLoader();
 };

 // 計算されたプロパティ
 const hasImportedData = computed(() => !!importedJsonData.value);
 const isImportReady = computed(() => hasImportedData.value && previewManager.hasPreviewData.value);

 return {
  // File Loader
  fileInputRef: fileLoader.fileInputRef,
  isFileLoading: fileLoader.isFileLoading,
  fileLoadError: fileLoader.fileLoadError,
  openFileDialog: fileLoader.openFileDialog,

  // Preview Manager
  previewData: previewManager.previewData,
  enabledCategories: previewManager.enabledCategories,

  // Internal State
  importedJsonData,

  // Computed
  hasImportedData,
  isImportReady,

  // Actions
  handleFileSelection,
  createImportPreview,
  executeDataImport,
  updateImportCategoryConfig,
  resetImportProcess
 };
};
