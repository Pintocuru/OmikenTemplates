<!-- src/configMaker/components/presets/ConfigExport.vue -->
<template>
 <div class="flex flex-wrap gap-2">
  <button @click="exportConfig" class="btn btn-primary" :disabled="isExporting">
   <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
   設定を出力(js)
  </button>

  <button @click="exportTemplate" class="btn btn-secondary" :disabled="isExporting">
   <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
   テンプレート出力(json)
  </button>
 </div>

 <!-- 完了モーダル -->
 <div class="modal" :class="{ 'modal-open': showModal }">
  <div class="modal-box max-w-md">
   <h3 class="font-bold text-lg text-primary mb-4">{{ modalTitle }}</h3>

   <div class="space-y-4 text-sm">
    <div class="flex items-start gap-3">
     <div class="text-success mt-1">✓</div>
     <p>{{ modalMessage }}</p>
    </div>

    <div class="bg-base-200 p-4 rounded-lg">
     <h4 class="font-semibold mb-2 flex items-center gap-2">📋 次の手順</h4>
     <ol class="list-decimal list-inside space-y-2">
      <li v-for="step in modalSteps" :key="step">
       <span v-html="step"></span>
      </li>
     </ol>
    </div>
   </div>

   <div class="modal-action mt-6">
    <button class="btn btn-primary" @click="showModal = false">閉じる</button>
   </div>
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
import { ref, watchEffect } from 'vue';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';
import { useConfigExport } from '@/ConfigMaker/script/useConfigExport';

// Store
const omikujiStore = useOmikujiStore();

// Composables
const {
 isExporting,
 exportConfigFile,
 exportTemplateFile,
 errorMessage: exportError
} = useConfigExport();

// State
const showModal = ref(false);
const showErrorModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalSteps = ref<string[]>([]);
const errorMessage = ref('');

// 設定ファイル出力
const exportConfig = async () => {
 try {
  const validation = omikujiStore.validateData();
  if (!validation.success) {
   showError('設定データに問題があります。エラーを修正してから再度お試しください。');
   return;
  }

  const success = await exportConfigFile(omikujiStore.exportData());

  if (success) {
   showSuccessModal(
    '設定ファイルのダウンロード完了',
    '設定ファイルのダウンロードが完了しました。',
    [
     '<span class="font-medium">omikujiData.js</span> ファイルを、コンフィグエディターと同じフォルダに上書き保存',
     'OBSなどのアプリケーションを再起動して新しい設定を反映'
    ]
   );
  }
 } catch (error) {
  console.error('Config export error:', error);
  showError('設定ファイルの出力中にエラーが発生しました。');
 }
};

// テンプレート出力
const exportTemplate = async () => {
 try {
  const success = await exportTemplateFile(omikujiStore.exportData());

  if (success) {
   showSuccessModal(
    'テンプレートファイルのダウンロード完了',
    'テンプレートファイルのダウンロードが完了しました。',
    [
     'ダウンロードした <span class="font-medium">template.json</span> ファイルを保存',
     '他のプロジェクトでベースとして使用したり、設定を共有する際にご利用ください'
    ]
   );
  }
 } catch (error) {
  console.error('Template export error:', error);
  showError('テンプレートファイルの出力中にエラーが発生しました。');
 }
};

// 成功モーダル表示
const showSuccessModal = (title: string, message: string, steps: string[]) => {
 modalTitle.value = title;
 modalMessage.value = message;
 modalSteps.value = steps;
 showModal.value = true;
};

// エラー表示
const showError = (message: string) => {
 errorMessage.value = message;
 showErrorModal.value = true;
};

// エクスポートエラーを監視
const handleExportError = () => {
 if (exportError.value) {
  showError(exportError.value);
 }
};

// エクスポートエラーの監視
watchEffect(() => {
 if (exportError.value) {
  handleExportError();
 }
});
</script>
