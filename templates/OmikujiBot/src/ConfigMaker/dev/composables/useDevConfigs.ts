// src/configMaker/dev/composables/useDevConfigs.ts
import { ref, reactive } from 'vue';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import { devConfigApi } from '../services/apiService';
import type { FileItem, DevConfigsState } from '../devTypes';

export function useDevConfigs() {
 const omikujiStore = useOmikujiStore();

 // State
 const state = reactive<DevConfigsState>({
  saveFileName: '',
  availableFiles: [],
  isSaving: false,
  isLoading: false,
  isDeleting: false,
  isLoadingFileList: false,
  isExecutingConfirm: false,
  isServerConnected: true,
  showConfirmModal: false,
  showErrorModal: false,
  showSuccessMessage: false,
  errorMessage: '',
  successMessage: '',
  confirmMessage: '',
  pendingAction: null
 });

 // Utility functions
 const showSuccess = (message: string) => {
  state.successMessage = message;
  state.showSuccessMessage = true;
  setTimeout(() => {
   state.showSuccessMessage = false;
  }, 3000);
 };

 const showError = (message: string) => {
  state.errorMessage = message;
  state.showErrorModal = true;
 };

 const handleApiError = (error: Error) => {
  console.error('API Error:', error);
  state.isServerConnected = false;
  const message = error.message + '\n開発サーバーが起動していることを確認してください。';
  showError(message);
 };

 const formatFileDate = (dateString: string): string => {
  try {
   const date = new Date(dateString);
   return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
   });
  } catch {
   return dateString;
  }
 };

 // Main functions
 const refreshFileList = async () => {
  state.isLoadingFileList = true;
  try {
   state.availableFiles = await devConfigApi.getFileList();
   state.isServerConnected = true;
  } catch (error) {
   handleApiError(error as Error);
  } finally {
   state.isLoadingFileList = false;
  }
 };

 const saveConfigToServer = async () => {
  const trimmedFileName = state.saveFileName.trim();
  if (!trimmedFileName) return;

  state.isSaving = true;
  try {
   const configData = JSON.stringify(omikujiStore.data, null, 2);
   await devConfigApi.saveConfig(trimmedFileName, configData);

   state.saveFileName = '';
   await refreshFileList();
   showSuccess(`設定を "${trimmedFileName}" として保存しました`);
   state.isServerConnected = true;
  } catch (error) {
   handleApiError(error as Error);
  } finally {
   state.isSaving = false;
  }
 };

 const loadConfigFromServer = async (fileName: string) => {
  state.isLoading = true;
  try {
   const configData = await devConfigApi.loadConfig(fileName);
   omikujiStore.loadData(configData);
   showSuccess(`設定 "${fileName.replace('.json', '')}" を読み込みました`);
   state.isServerConnected = true;
  } catch (error) {
   handleApiError(error as Error);
  } finally {
   state.isLoading = false;
  }
 };

 const deleteConfigFromServer = async (fileName: string) => {
  state.confirmMessage = `設定ファイル "${fileName.replace('.json', '')}" を削除しますか？\nこの操作は取り消せません。`;
  state.pendingAction = async () => {
   try {
    await devConfigApi.deleteConfig(fileName);
    await refreshFileList();
    showSuccess(`設定ファイル "${fileName.replace('.json', '')}" を削除しました`);
    state.isServerConnected = true;
   } catch (error) {
    handleApiError(error as Error);
   }
  };
  state.showConfirmModal = true;
 };

 const executeConfirmAction = async () => {
  if (!state.pendingAction) return;

  state.isExecutingConfirm = true;
  try {
   await state.pendingAction();
  } finally {
   state.isExecutingConfirm = false;
   state.showConfirmModal = false;
   state.pendingAction = null;
  }
 };

 const cancelConfirmAction = () => {
  state.showConfirmModal = false;
  state.pendingAction = null;
 };

 return {
  state,
  refreshFileList,
  saveConfigToServer,
  loadConfigFromServer,
  deleteConfigFromServer,
  executeConfirmAction,
  cancelConfirmAction,
  formatFileDate
 };
}
