<!-- src/configMaker/components/placeholders/PlaceholderModal.vue -->
<template>
 <div>
  <!-- モーダルオープンボタン -->
  <button
   @click="openModal"
   class="btn btn-sm btn-outline hover:btn-primary transition-colors"
   title="プレースホルダーの編集"
  >
   編集
  </button>

  <!-- モーダル -->
  <div v-if="isModalOpen" class="modal modal-open">
   <div class="modal-box max-w-4xl">
    <h3 class="font-bold text-lg mb-4">📝 プレースホルダー設定</h3>

    <PlaceholderValuesEditor
     ref="editorRef"
     :placeholderId="placeholderId"
     :isModal="true"
     :showNameEdit="true"
     @nameChanged="handleNameChanged"
    />

    <ModalFooterActions :on-cancel="closeModal" :on-save="saveContent" :disabled="!canSave" />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';
import { usePlaceholderStore } from '@ConfigScript/usePlaceholderStore';

const props = defineProps<{
 placeholderId: string;
}>();

const placeholderStore = usePlaceholderStore();

// リアクティブデータ
const isModalOpen = ref(false);
const editorRef = ref<InstanceType<typeof PlaceholderValuesEditor> | null>(null);
const localName = ref('');

// 保存可能かどうか
const canSave = computed(() => {
 return editorRef.value?.canSave || false;
});

// メソッド
const openModal = () => {
 isModalOpen.value = true;
 // 次のティックで初期化を実行
 setTimeout(() => {
  editorRef.value?.initializeValues();
 }, 0);
};

const closeModal = () => {
 isModalOpen.value = false;
 localName.value = '';
};

const handleNameChanged = (name: string) => {
 localName.value = name;
};

const saveContent = () => {
 if (!editorRef.value) return;

 const newValues = editorRef.value.getCurrentValues();
 if (!newValues) return;

 // 名前とvaluesを更新
 const nameSuccess = placeholderStore.updatePlaceholderName(
  props.placeholderId,
  editorRef.value.placeholderName || localName.value
 );
 const valuesSuccess = placeholderStore.updatePlaceholderValues(props.placeholderId, newValues);

 if (nameSuccess && valuesSuccess) {
  closeModal();
 } else {
  console.error(`Failed to update placeholder for ID: ${props.placeholderId}`);
 }
};
</script>
