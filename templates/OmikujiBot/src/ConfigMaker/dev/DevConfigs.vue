<!-- src/configMaker/components/dev/DevConfigs.vue -->
<template>
 <div class="card bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-6 shadow-lg">
  <div class="card-body p-4">
   <div class="flex items-center gap-2 mb-4">
    <div class="badge badge-warning">DEV</div>
    <h2 class="text-lg font-bold">開発者用プリセット管理</h2>
   </div>

   <!-- ファイル操作エリア -->
   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 保存セクション -->
    <DevFileSave
     v-model="state.saveFileName"
     :is-saving="state.isSaving"
     @save="saveConfigToServer"
    />

    <!-- 読み込みセクション -->
    <DevFileList
     :available-files="state.availableFiles"
     :is-loading-file-list="state.isLoadingFileList"
     :is-loading="state.isLoading"
     :is-deleting="state.isDeleting"
     :format-file-date="formatFileDate"
     @refresh="refreshFileList"
     @load="loadConfigFromServer"
     @delete="deleteConfigFromServer"
    />
   </div>

   <!-- 接続ステータス -->
   <div class="mt-4 text-xs opacity-75 flex items-center gap-2">
    <div
     class="w-2 h-2 rounded-full"
     :class="state.isServerConnected ? 'bg-green-400' : 'bg-red-400'"
    ></div>
    <span>{{ state.isServerConnected ? '開発サーバー接続中' : '開発サーバー未接続' }}</span>
   </div>
  </div>
 </div>

 <!-- モーダル群 -->
 <DevModals
  :show-confirm-modal="state.showConfirmModal"
  :show-error-modal="state.showErrorModal"
  :show-success-message="state.showSuccessMessage"
  :confirm-message="state.confirmMessage"
  :error-message="state.errorMessage"
  :success-message="state.successMessage"
  :is-executing-confirm="state.isExecutingConfirm"
  @cancel="cancelConfirmAction"
  @confirm="executeConfirmAction"
  @close-error="state.showErrorModal = false"
 />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDevConfigs } from './composables/useDevConfigs';
import DevFileSave from './components/DevFileSave.vue';
import DevFileList from './components/DevFileList.vue';
import DevModals from './components/DevModals.vue';

const {
 state,
 refreshFileList,
 saveConfigToServer,
 loadConfigFromServer,
 deleteConfigFromServer,
 executeConfirmAction,
 cancelConfirmAction,
 formatFileDate
} = useDevConfigs();

// マウント時にファイル一覧を取得
onMounted(() => {
 refreshFileList();
});
</script>
