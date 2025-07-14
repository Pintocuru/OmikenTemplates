// composables/useDataMerger.ts
import type { OmikujiDataType, CategoryType } from '@type/';
import type { ImportPreview } from './useImportPreviewManager';

/**
 * データのマージ処理を担当するComposable
 */
export const useDataMerger = () => {
 // データのマージ処理
 const mergeDataSets = (
  currentData: OmikujiDataType,
  importedData: OmikujiDataType,
  preview: ImportPreview
 ): OmikujiDataType => {
  const result: OmikujiDataType = { ...currentData };

  Object.entries(preview.categories).forEach(([categoryKey, config]) => {
   if (!config.enabled || config.mode === 'skip') return;

   const category = categoryKey as CategoryType;

   const currentItems = result[category] as Record<string, unknown>;
   const importItems = importedData[category] as Record<string, unknown>;

   let mergedItems: typeof currentItems;

   switch (config.mode) {
    case 'replace':
     mergedItems = importItems;
     break;
    case 'merge':
     mergedItems = { ...currentItems, ...importItems };
     break;
    case 'add-only':
     mergedItems = { ...currentItems };
     Object.entries(importItems).forEach(([key, value]) => {
      if (!(key in currentItems)) {
       mergedItems[key] = value;
      }
     });
     break;
   }

   result[category] = mergedItems as any; // 最終的に unknown → any にダウンキャスト
  });

  return result;
 };

 // カテゴリ単位でのマージ
 const mergeCategoryData = (
  currentItems: Record<string, unknown>,
  importItems: Record<string, unknown>,
  mode: 'replace' | 'merge' | 'add-only' | 'skip'
 ): Record<string, unknown> => {
  switch (mode) {
   case 'replace':
    return importItems;
   case 'merge':
    return { ...currentItems, ...importItems };
   case 'add-only':
    const result = { ...currentItems };
    Object.entries(importItems).forEach(([key, value]) => {
     if (!(key in currentItems)) {
      result[key] = value;
     }
    });
    return result;
   case 'skip':
    return currentItems; // 何も変更しない
  }
 };

 return {
  mergeDataSets,
  mergeCategoryData
 };
};
