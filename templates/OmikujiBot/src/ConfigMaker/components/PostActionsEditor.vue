<!-- src/configMaker/components/PostActionsEditor.vue -->
<template>
 <div class="form-control">
  <div class="flex justify-between items-center mb-2">
   <label class="label py-1">
    <span class="label-text text-sm font-medium">Post Actions</span>
    <span class="badge badge-sm badge-outline ml-2">{{ modelValue.length }}</span>
   </label>
   <button @click="openDialog" class="btn btn-sm btn-primary" type="button">
    <span class="text-xs">⚙️</span>
    編集
   </button>
  </div>

  <!-- プレビュー表示 -->
  <div class="bg-base-200 rounded p-3 text-sm">
   <div v-if="modelValue.length === 0" class="text-gray-500 italic">
    Post Actions が設定されていません
   </div>
   <div v-else class="space-y-1">
    <div v-for="(action, index) in previewActions" :key="index" class="flex items-center gap-2">
     <span class="w-4 text-center text-xs text-gray-500">{{ index + 1 }}</span>
     <div class="flex-1 flex flex-wrap gap-1 text-xs">
      <span v-if="action.characterKey" class="badge badge-xs"
       >👤 {{ getCharacterLabel(action.characterKey) }}</span
      >
      <span v-if="action.iconKey" class="badge badge-xs"
       >🎨 {{ getIconLabel(action.iconKey) }}</span
      >
      <span v-if="action.delaySeconds > 0" class="badge badge-xs"
       >⏱️ {{ action.delaySeconds }}s</span
      >
      <span v-if="action.wordParty" class="badge badge-xs badge-accent">🎉 Party</span>
      <span v-if="action.messageContent" class="badge badge-xs badge-info">💬 Message</span>
      <span v-if="action.messageToast" class="badge badge-xs badge-warning">🍞 Toast</span>
     </div>
    </div>
    <div v-if="modelValue.length > maxPreviewItems" class="text-xs text-gray-500 mt-1">
     他 {{ modelValue.length - maxPreviewItems }} 件...
    </div>
   </div>
  </div>

  <!-- 編集ダイアログ -->
  <dialog ref="dialog" class="modal">
   <div class="modal-box max-w-5xl max-h-[90vh]">
    <div class="flex justify-between items-center mb-4">
     <h3 class="font-bold text-lg">Post Actions 編集</h3>
     <div class="flex gap-2">
      <button @click="addAction" class="btn btn-sm btn-primary">➕ 追加</button>
      <button @click="closeDialog" class="btn btn-sm btn-circle btn-ghost">✕</button>
     </div>
    </div>

    <div class="overflow-y-auto max-h-[60vh]">
     <div v-if="editingActions.length === 0" class="text-center text-gray-500 py-8">
      Post Actions がありません。「➕ 追加」ボタンで追加してください。
     </div>

     <div v-else class="space-y-4">
      <div v-for="(action, index) in editingActions" :key="index" class="card bg-base-200 p-4">
       <div class="flex justify-between items-start mb-3">
        <h4 class="font-medium flex items-center gap-2">
         <span class="badge badge-sm">{{ index + 1 }}</span>
         Action
        </h4>
        <div class="flex gap-1">
         <button
          @click="moveActionUp(index)"
          :disabled="index === 0"
          class="btn btn-xs btn-outline"
          title="上に移動"
         >
          ⬆️
         </button>
         <button
          @click="moveActionDown(index)"
          :disabled="index === editingActions.length - 1"
          class="btn btn-xs btn-outline"
          title="下に移動"
         >
          ⬇️
         </button>
         <button @click="duplicateAction(index)" class="btn btn-xs btn-outline" title="複製">
          📋
         </button>
         <button @click="removeAction(index)" class="btn btn-xs btn-outline btn-error" title="削除">
          🗑️
         </button>
        </div>
       </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <!-- Character Key -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">👤 Character</span>
         </label>
         <select v-model="action.characterKey" class="select select-bordered select-sm">
          <option value="">選択してください</option>
          <option v-for="char in characterOptions" :key="char.value" :value="char.value">
           {{ char.label }}
          </option>
         </select>
        </div>

        <!-- Icon Key -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">🎨 Icon</span>
         </label>
         <select v-model="action.iconKey" class="select select-bordered select-sm">
          <option value="">選択してください</option>
          <option v-for="icon in iconOptions" :key="icon.value" :value="icon.value">
           {{ icon.label }}
          </option>
         </select>
        </div>

        <!-- Delay Seconds -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">⏱️ 遅延秒数</span>
         </label>
         <input
          type="number"
          v-model.number="action.delaySeconds"
          min="0"
          step="0.1"
          class="input input-bordered input-sm"
          placeholder="0"
         />
        </div>
       </div>

       <!-- Optional Fields -->
       <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
        <!-- Word Party -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">🎉 Word Party</span>
          <span class="text-xs text-gray-500">(オプション)</span>
         </label>
         <input
          type="text"
          v-model="action.wordParty"
          class="input input-bordered input-sm"
          placeholder="必要な場合のみ"
         />
        </div>

        <!-- Message Toast -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">🍞 Message Toast</span>
          <span class="text-xs text-gray-500">(オプション)</span>
         </label>
         <input
          type="text"
          v-model="action.messageToast"
          class="input input-bordered input-sm"
          placeholder="必要な場合のみ"
         />
        </div>

        <!-- Message Content (フルwidth) -->
        <div class="form-control lg:col-span-1">
         <label class="label py-1">
          <span class="label-text text-sm">💬 Message Content</span>
          <span class="text-xs text-gray-500">(オプション)</span>
         </label>
         <textarea
          v-model="action.messageContent"
          class="textarea textarea-bordered textarea-sm"
          rows="2"
          placeholder="必要な場合のみ"
         ></textarea>
        </div>
       </div>
      </div>
     </div>
    </div>

    <div class="modal-action">
     <button @click="closeDialog" class="btn btn-ghost">キャンセル</button>
     <button @click="saveActions" class="btn btn-primary">保存</button>
    </div>
   </div>
  </dialog>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import type { PostActionType } from '@/types/OmikujiTypesSchema';

// Props
const props = defineProps<{
 modelValue: PostActionType[];
 characterOptions?: Array<{ value: string; label: string }>;
 iconOptions?: Array<{ value: string; label: string }>;
}>();

// Emits
const emit = defineEmits<{
 'update:modelValue': [value: PostActionType[]];
}>();

// Refs
const dialog: Ref<HTMLDialogElement | null> = ref(null);
const editingActions: Ref<PostActionType[]> = ref([]);

// Constants
const maxPreviewItems = 3;

// Default options
const defaultCharacterOptions = [
 { value: 'character1', label: 'キャラクター1' },
 { value: 'character2', label: 'キャラクター2' },
 { value: 'character3', label: 'キャラクター3' }
];

const defaultIconOptions = [
 { value: 'icon1', label: 'アイコン1' },
 { value: 'icon2', label: 'アイコン2' },
 { value: 'icon3', label: 'アイコン3' }
];

// Computed
const characterOptions = computed(() => props.characterOptions || defaultCharacterOptions);
const iconOptions = computed(() => props.iconOptions || defaultIconOptions);
const previewActions = computed(() => props.modelValue.slice(0, maxPreviewItems));

// Helper functions
const createDefaultAction = (): PostActionType => ({
 characterKey: '',
 iconKey: '',
 delaySeconds: 0,
 wordParty: '',
 messageContent: '',
 messageToast: ''
});

const getCharacterLabel = (key: string): string => {
 const option = characterOptions.value.find((opt) => opt.value === key);
 return option ? option.label : key;
};

const getIconLabel = (key: string): string => {
 const option = iconOptions.value.find((opt) => opt.value === key);
 return option ? option.label : key;
};

// Dialog methods
const openDialog = () => {
 editingActions.value = JSON.parse(JSON.stringify(props.modelValue));
 dialog.value?.showModal();
};

const closeDialog = () => {
 dialog.value?.close();
 editingActions.value = [];
};

const saveActions = () => {
 emit('update:modelValue', [...editingActions.value]);
 closeDialog();
};

// Action management methods
const addAction = () => {
 editingActions.value.push(createDefaultAction());
};

const removeAction = (index: number) => {
 editingActions.value.splice(index, 1);
};

const duplicateAction = (index: number) => {
 const original = editingActions.value[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 editingActions.value.splice(index + 1, 0, duplicated);
};

const moveActionUp = (index: number) => {
 if (index > 0) {
  const temp = editingActions.value[index];
  editingActions.value[index] = editingActions.value[index - 1];
  editingActions.value[index - 1] = temp;
 }
};

const moveActionDown = (index: number) => {
 if (index < editingActions.value.length - 1) {
  const temp = editingActions.value[index];
  editingActions.value[index] = editingActions.value[index + 1];
  editingActions.value[index + 1] = temp;
 }
};
</script>
