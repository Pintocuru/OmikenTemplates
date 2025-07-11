<!-- src/configMaker/components/comments/PostActionsEditor.vue -->
<template>
 <div class="form-control">
  <div class="flex justify-between items-center mb-1">
   <label class="label py-1">
    <span class="label-text text-sm font-medium">わんコメへの投稿</span>
    <span class="badge badge-sm badge-outline ml-2">{{ modelValue.length }}</span>
   </label>
   <button @click="openDialog" class="btn btn-sm btn-primary" type="button">
    <span class="text-sm">⚙️</span>
    編集
   </button>
  </div>

  <!-- プレビュー表示 -->
  <PostActionsPreview :actions="modelValue" :charactersArray="charactersArray" />

  <!-- 編集ダイアログ -->
  <PostActionsEditDialog
   ref="dialog"
   :actions="modelValue"
   :charactersArray="charactersArray"
   @update:actions="handleUpdate"
  />
 </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { type PostActionType } from '@/types/OmikujiTypesSchema';
import PostActionsPreview from './PostActionsPreview.vue';
import PostActionsEditDialog from './PostActionsEditDialog.vue';
import { useCharacterStore } from '@/ConfigMaker/script/useCharacterStore';

// ストアを使用
const characterStore = useCharacterStore();
const charactersArray = computed(() => characterStore.rulesArray);

// Props
const props = defineProps<{
 modelValue: PostActionType[];
}>();

// Emits
const emit = defineEmits<{
 'update:modelValue': [value: PostActionType[]];
}>();

// Refs
const dialog: Ref<InstanceType<typeof PostActionsEditDialog> | null> = ref(null);

// Methods
const openDialog = () => {
 dialog.value?.open();
};

const handleUpdate = (actions: PostActionType[]) => {
 emit('update:modelValue', actions);
};
</script>
