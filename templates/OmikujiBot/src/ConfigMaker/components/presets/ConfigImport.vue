<!-- src/configMaker/components/presets/ConfigImport.vue -->
<template>
 <div class="flex-1 min-w-80">
  <span class="font-medium mr-2">設定読み込み:</span>
  <input
   ref="fileInputRef"
   type="file"
   accept=".json"
   @change="handleFileSelection"
   class="hidden"
  />
  <button @click="openFileDialog" class="btn btn-sm btn-secondary" :disabled="isFileLoading">
   <span v-if="isFileLoading" class="loading loading-spinner loading-sm mr-2"></span>
   jsonファイル読み込み
  </button>
 </div>

 <!-- インポートプレビューモーダル -->
 <div class="modal" :class="{ 'modal-open': showPreviewModal }">
  <div class="modal-box max-w-2xl">
   <h3 class="font-bold text-lg text-primary mb-4">設定読み込みプレビュー</h3>

   <div v-if="previewData" class="space-y-4">
    <!-- 概要 -->
    <div class="bg-base-200 p-4 rounded-lg">
     <div class="flex items-center gap-2 mb-2">
      <span class="font-medium">📊 読み込み概要</span>
     </div>
     <div class="grid grid-cols-2 gap-4 text-sm">
      <div>総項目数: {{ previewData.totalItems }}</div>
      <div v-if="previewData.hasConflicts" class="text-warning">⚠️ 競合項目があります</div>
     </div>
    </div>

    <!-- カテゴリ別設定 -->
    <div class="space-y-3">
     <h4 class="font-medium">カテゴリ別読み込み設定</h4>

     <div
      v-for="(config, category) in previewData.categories"
      :key="category"
      class="border border-base-300 rounded-lg p-3"
     >
      <div class="flex items-center justify-between mb-2">
       <div class="flex items-center gap-2">
        <input
         type="checkbox"
         :checked="config.enabled"
         @change="handleCategoryEnabledChange(category, $event)"
         class="checkbox checkbox-sm"
        />
        <span class="font-medium">{{ getCategoryDisplayName(category) }}</span>
        <span class="badge badge-sm">{{ config.count }}項目</span>
       </div>
      </div>

      <div v-if="config.enabled" class="ml-6 space-y-2">
       <!-- 読み込みモード選択 -->
       <div class="flex items-center gap-4">
        <span class="text-sm">読み込み方法:</span>
        <div class="flex gap-2">
         <label class="flex items-center gap-1">
          <input
           type="radio"
           :name="`mode-${category}`"
           value="replace"
           :checked="config.mode === 'replace'"
           @change="handleCategoryModeChange(category, 'replace')"
           class="radio radio-sm"
          />
          <span class="text-sm">置き換え</span>
         </label>
         <label class="flex items-center gap-1">
          <input
           type="radio"
           :name="`mode-${category}`"
           value="merge"
           :checked="config.mode === 'merge'"
           @change="handleCategoryModeChange(category, 'merge')"
           class="radio radio-sm"
          />
          <span class="text-sm">マージ</span>
         </label>
         <label class="flex items-center gap-1">
          <input
           type="radio"
           :name="`mode-${category}`"
           value="add-only"
           :checked="config.mode === 'add-only'"
           @change="handleCategoryModeChange(category, 'add-only')"
           class="radio radio-sm"
          />
          <span class="text-sm">追加のみ</span>
         </label>
         <label class="flex items-center gap-1">
          <input
           type="radio"
           :name="`mode-${category}`"
           value="skip"
           :checked="config.mode === 'skip'"
           @change="handleCategoryModeChange(category, 'skip')"
           class="radio radio-sm"
          />
          <span class="text-sm">スキップ</span>
         </label>
        </div>
       </div>

       <!-- 競合項目の表示 -->
       <div v-if="config.conflicts.length > 0" class="text-sm">
        <div class="text-warning pb-1">競合項目 ({{ config.conflicts.length }}件):</div>
        <div class="max-h-25 overflow-y-auto">
         <span
          v-for="conflictKey in config.conflicts"
          :key="conflictKey.key"
          class="inline-block bg-warning bg-opacity-20 text-warning-content px-2 py-1 rounded mr-1 mb-1"
         >
          {{ conflictKey.key }}
          <span v-if="conflictKey.name && conflictKey.name !== ''">({{ conflictKey.name }})</span>
         </span>
        </div>
       </div>
      </div>
     </div>
    </div>

    <!-- モード説明 -->
    <div class="bg-info bg-opacity-10 p-3 rounded-lg text-sm">
     <div class="font-medium mb-2">📝 読み込みモード説明</div>
     <ul class="space-y-1 text-xs">
      <li><strong>置き換え:</strong> カテゴリ全体を新しい設定で置き換え</li>
      <li><strong>マージ:</strong> 既存設定に新しい設定を追加・上書き</li>
      <li><strong>追加のみ:</strong> 重複しない項目のみ追加</li>
      <li><strong>スキップ:</strong> このカテゴリは読み込まない</li>
     </ul>
    </div>
   </div>

   <ModalFooterActions
    :on-cancel="cancelImportProcess"
    :on-save="executeImportProcess"
    :saveName="'読み込み実行'"
    :disabled="!hasEnabledCategories"
   />
  </div>
 </div>

 <!-- エラーモーダル -->
 <div class="modal" :class="{ 'modal-open': showErrorModal }">
  <div class="modal-box max-w-md">
   <h3 class="font-bold text-lg text-error mb-4">エラー</h3>
   <p class="text-sm mb-4">{{ errorMessage }}</p>
   <div class="modal-action">
    <button class="btn btn-primary" @click="showErrorModal = false">閉じる</button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CategoryType } from '@type/';
import type { ImportMode } from '@ConfigScript/useImportPreviewManager';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import { useJsonImportOrchestrator } from '@ConfigScript/useJsonImportOrchestrator';

// Store
const omikujiStore = useOmikujiStore();

// Composables
const importOrchestrator = useJsonImportOrchestrator();

// State
const showPreviewModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');

// カテゴリ表示名のマッピング
const categoryDisplayNames: Record<CategoryType, string> = {
 comments: 'コメント',
 timers: 'タイマー',
 placeholders: 'プレースホルダー',
 scriptSettings: 'スクリプト設定',
 characters: 'キャラクター'
};

// Computed
const hasEnabledCategories = computed(() => importOrchestrator.enabledCategories.value.length > 0);

// カテゴリ表示名を取得
const getCategoryDisplayName = (category: CategoryType): string => {
 return categoryDisplayNames[category] || category;
};

// ファイル選択処理
const handleFileSelection = async (event: Event) => {
 const data = await importOrchestrator.handleFileSelection(event);

 if (importOrchestrator.fileLoadError.value) {
  showError(importOrchestrator.fileLoadError.value);
  return;
 }

 if (data) {
  // プレビュー生成
  const preview = importOrchestrator.createImportPreview(omikujiStore.data);
  if (preview) {
   showPreviewModal.value = true;
  }
 }
};

// カテゴリ有効/無効切り替え
const handleCategoryEnabledChange = (category: CategoryType, event: Event) => {
 const enabled = (event.target as HTMLInputElement).checked;
 importOrchestrator.updateImportCategoryConfig(category, { enabled });
};

// カテゴリモード変更
const handleCategoryModeChange = (category: CategoryType, mode: ImportMode) => {
 importOrchestrator.updateImportCategoryConfig(category, { mode });
};

// インポート実行
const executeImportProcess = () => {
 try {
  const result = importOrchestrator.executeDataImport(omikujiStore.data);
  if (result) {
   // ストアのデータを更新
   omikujiStore.loadData(result);
   showPreviewModal.value = false;
   importOrchestrator.resetImportProcess();

   // 成功メッセージ（必要に応じて）
   console.log('設定の読み込みが完了しました');
  }
 } catch (error) {
  console.error('Import error:', error);
  showError('設定の読み込みに失敗しました。');
 }
};

// インポートキャンセル
const cancelImportProcess = () => {
 showPreviewModal.value = false;
 importOrchestrator.resetImportProcess();
};

// エラーを表示
const showError = (message: string) => {
 errorMessage.value = message;
 showErrorModal.value = true;
};

// Expose refs and methods for template
const { fileInputRef, isFileLoading, previewData, openFileDialog } = importOrchestrator;
</script>
