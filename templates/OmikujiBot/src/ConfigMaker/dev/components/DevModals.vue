<!-- src/configMaker/dev/components/DevModals.vue -->
<template>
 <!-- 確認モーダル -->
 <div class="modal" :class="{ 'modal-open': showConfirmModal }">
  <div class="modal-box max-w-md">
   <h3 class="font-bold text-lg text-warning mb-4">確認</h3>
   <p class="text-sm mb-4">{{ confirmMessage }}</p>
   <div class="modal-action">
    <button class="btn btn-ghost" @click="$emit('cancel')">キャンセル</button>
    <button class="btn btn-error" @click="$emit('confirm')" :disabled="isExecutingConfirm">
     <span v-if="isExecutingConfirm" class="loading loading-spinner loading-sm mr-2"></span>
     実行
    </button>
   </div>
  </div>
 </div>

 <!-- エラーモーダル -->
 <div class="modal" :class="{ 'modal-open': showErrorModal }">
  <div class="modal-box max-w-md">
   <h3 class="font-bold text-lg text-error mb-4">エラー</h3>
   <p class="text-sm mb-4 whitespace-pre-line">{{ errorMessage }}</p>
   <div class="modal-action">
    <button class="btn btn-primary" @click="$emit('closeError')">閉じる</button>
   </div>
  </div>
 </div>

 <!-- 成功通知 -->
 <div v-if="showSuccessMessage" class="toast toast-top toast-center">
  <div class="alert alert-success">
   <span>{{ successMessage }}</span>
  </div>
 </div>
</template>

<script setup lang="ts">
interface Props {
 showConfirmModal: boolean;
 showErrorModal: boolean;
 showSuccessMessage: boolean;
 confirmMessage: string;
 errorMessage: string;
 successMessage: string;
 isExecutingConfirm: boolean;
}

interface Emits {
 (e: 'cancel'): void;
 (e: 'confirm'): void;
 (e: 'closeError'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
