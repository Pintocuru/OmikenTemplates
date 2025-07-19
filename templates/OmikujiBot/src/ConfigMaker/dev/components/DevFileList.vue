<!-- src/configMaker/components/dev/components/DevFileList.vue -->
<template>
 <div class="bg-black bg-opacity-20 rounded-lg p-4">
  <h3 class="font-medium mb-3 flex items-center gap-2">
   <FolderOpen class="w-4 h-4" />
   設定読み込み
  </h3>
  <div class="space-y-2">
   <button
    @click="$emit('refresh')"
    :disabled="isLoadingFileList"
    class="btn btn-info btn-sm w-full"
   >
    <span v-if="isLoadingFileList" class="loading loading-spinner loading-xs mr-2"></span>
    <RefreshCw class="w-4 h-4 mr-2" />
    ファイル一覧更新
   </button>

   <div v-if="availableFiles.length > 0" class="space-y-1">
    <div class="text-xs opacity-80 mb-2">保存済みファイル:</div>
    <div class="max-h-32 overflow-y-auto space-y-1">
     <div
      v-for="file in availableFiles"
      :key="file.name"
      class="flex items-center justify-between bg-black bg-opacity-20 rounded p-2 text-sm"
     >
      <div class="flex-1 truncate">
       <div class="font-medium">{{ file.displayName }}</div>
       <div class="text-xs opacity-70">{{ formatFileDate(file.modified) }}</div>
      </div>
      <div class="flex gap-1 ml-2">
       <button
        @click="$emit('load', file.name)"
        :disabled="isLoading"
        class="btn btn-xs btn-primary"
        title="読み込み"
       >
        <Download class="w-3 h-3" />
       </button>
       <button
        @click="$emit('delete', file.name)"
        :disabled="isDeleting"
        class="btn btn-xs btn-error"
        title="削除"
       >
        <Trash2 class="w-3 h-3" />
       </button>
      </div>
     </div>
    </div>
   </div>

   <div v-else-if="!isLoadingFileList" class="text-xs opacity-70 text-center py-2">
    保存済みファイルはありません
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import type { FileItem } from '../devTypes';
import { FolderOpen, RefreshCw, Download, Trash2 } from 'lucide-vue-next';

interface Props {
 availableFiles: FileItem[];
 isLoadingFileList: boolean;
 isLoading: boolean;
 isDeleting: boolean;
 formatFileDate: (date: string) => string;
}

interface Emits {
 (e: 'refresh'): void;
 (e: 'load', fileName: string): void;
 (e: 'delete', fileName: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
