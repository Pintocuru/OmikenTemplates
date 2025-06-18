<!-- src/configMaker/components/PlaceholderIdEditor.vue -->
<template>
 <div>
  <!-- IDエディタボタン -->
  <button @click="openDialog" class="btn btn-sm btn-outline" title="IDを編集">📝 ID編集</button>

  <!-- ダイアログ -->
  <div v-if="isDialogOpen" class="modal modal-open">
   <div class="modal-box">
    <h3 class="font-bold text-lg">プレースホルダーID編集</h3>

    <div class="py-4">
     <div class="form-control">
      <label class="label">
       <span class="label-text">現在のID</span>
      </label>
      <div class="input input-bordered bg-base-200 text-gray-600">
       {{ currentId }}
      </div>
     </div>

     <div class="form-control mt-4">
      <label class="label">
       <span class="label-text">新しいID</span>
      </label>
      <input
       type="text"
       v-model="newId"
       placeholder="新しいIDを入力"
       class="input input-bordered"
       :class="{ 'input-error': hasError }"
       @input="validateId"
      />
      <label class="label" v-if="hasError">
       <span class="label-text-alt text-error">{{ errorMessage }}</span>
      </label>
     </div>

     <div class="alert alert-warning mt-4">
      <svg
       xmlns="http://www.w3.org/2000/svg"
       class="stroke-current shrink-0 h-6 w-6"
       fill="none"
       viewBox="0 0 24 24"
      >
       <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
       />
      </svg>
      <span class="text-sm">
       IDを変更すると、このプレースホルダーを参照している他の設定も影響を受ける可能性があります。
      </span>
     </div>
    </div>

    <div class="modal-action">
     <button @click="closeDialog" class="btn btn-ghost">キャンセル</button>
     <button
      @click="saveId"
      class="btn btn-primary"
      :disabled="hasError || !newId.trim() || newId === currentId"
     >
      保存
     </button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePlaceholderStore } from '../script/usePlaceholderStore';

// Props
const props = defineProps<{
 currentId: string;
}>();

// piniaストアを使用
const placeholderStore = usePlaceholderStore();

// リアクティブデータ
const isDialogOpen = ref(false);
const newId = ref('');
const errorMessage = ref('');

// computed
const hasError = computed(() => errorMessage.value !== '');

// 既存のIDリストを取得（重複チェック用）
const existingIds = computed(() => Object.keys(placeholderStore.placeholders));

// メソッド
const openDialog = () => {
 newId.value = props.currentId;
 errorMessage.value = '';
 isDialogOpen.value = true;
};

const closeDialog = () => {
 isDialogOpen.value = false;
 newId.value = '';
 errorMessage.value = '';
};

const validateId = () => {
 const id = newId.value.trim();

 if (!id) {
  errorMessage.value = 'IDを入力してください';
  return;
 }

 if (id === props.currentId) {
  errorMessage.value = '';
  return;
 }

 // ID形式チェック（英数字とアンダースコア、ハイフンのみ）
 if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
  errorMessage.value = 'IDは英数字、アンダースコア(_)、ハイフン(-)のみ使用可能です';
  return;
 }

 // 既存IDとの重複チェック
 if (existingIds.value.includes(id)) {
  errorMessage.value = 'このIDは既に使用されています';
  return;
 }

 errorMessage.value = '';
};

const saveId = () => {
 if (hasError.value || !newId.value.trim() || newId.value === props.currentId) {
  return;
 }

 // Piniaストアで直接ID更新を実行
 const success = placeholderStore.updatePlaceholderId(props.currentId, newId.value.trim());

 if (success) {
  closeDialog();
 } else {
  // 更新に失敗した場合のエラーハンドリング
  errorMessage.value = 'ID更新に失敗しました';
 }
};
</script>
