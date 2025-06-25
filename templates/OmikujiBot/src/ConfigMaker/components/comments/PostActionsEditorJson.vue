<!-- src/configMaker/components/PostActionsEditorJson.vue -->
<template>
 <div class="form-control">
  <div class="flex justify-between items-center mb-1">
   <label class="label py-1">
    <span class="label-text text-sm font-medium">わんコメへの投稿</span>
    <span class="badge badge-sm badge-outline ml-2">{{ modelValue.length }}</span>
   </label>
   <div class="flex gap-2">
    <button @click="toggleEditMode" class="btn btn-sm btn-secondary" type="button">
     <span class="text-sm">{{ isJsonMode ? '📝' : '💾' }}</span>
     {{ isJsonMode ? 'GUI編集' : 'JSON編集' }}
    </button>
    <button @click="openDialog" class="btn btn-sm btn-primary" type="button">
     <span class="text-sm">⚙️</span>
     詳細編集
    </button>
   </div>
  </div>

  <!-- JSON編集モード -->
  <div v-if="isJsonMode" class="space-y-2">
   <div class="flex gap-2 mb-2">
    <button @click="exportToClipboard" class="btn btn-xs btn-outline">
     📋 クリップボードにコピー
    </button>
    <button @click="importFromClipboard" class="btn btn-xs btn-outline">
     📥 クリップボードから読込
    </button>
    <button @click="prettifyJson" class="btn btn-xs btn-outline">✨ 整形</button>
   </div>

   <textarea
    v-model="jsonText"
    class="textarea textarea-bordered w-full font-mono text-sm"
    rows="12"
    placeholder="JSON形式でPostActionsを編集..."
    @blur="validateAndApplyJson"
   ></textarea>

   <div v-if="jsonError" class="alert alert-error text-xs">
    <span>⚠️ JSONエラー: {{ jsonError }}</span>
   </div>

   <div class="flex gap-2">
    <button @click="applyJson" class="btn btn-sm btn-success">✅ 適用</button>
    <button @click="resetJson" class="btn btn-sm btn-ghost">🔄 リセット</button>
   </div>
  </div>

  <!-- 通常のプレビュー表示 -->
  <PostActionsPreview v-else :actions="modelValue" />

  <!-- 編集ダイアログ -->
  <PostActionsEditDialog ref="dialog" :actions="modelValue" @update:actions="handleUpdate" />
 </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { type PostActionType } from '@/types/OmikujiTypesSchema';
import PostActionsPreview from './PostActionsPreview.vue';
import PostActionsEditDialog from './PostActionsEditDialog.vue';
import { toast } from 'vue-sonner';

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
const isJsonMode = ref(false);
const jsonText = ref('');
const jsonError = ref('');

// JSON関連の処理
const updateJsonText = () => {
 try {
  jsonText.value = JSON.stringify(props.modelValue, null, 2);
  jsonError.value = '';
 } catch (error) {
  jsonError.value = error instanceof Error ? error.message : 'JSONの生成に失敗しました';
 }
};

// プロパティが変更されたときにJSONテキストを更新
watch(() => props.modelValue, updateJsonText, { immediate: true, deep: true });

// Methods
const openDialog = () => {
 dialog.value?.open();
};

const handleUpdate = (actions: PostActionType[]) => {
 emit('update:modelValue', actions);
};

const toggleEditMode = () => {
 if (!isJsonMode.value) {
  updateJsonText();
 } else {
  validateAndApplyJson();
 }
 isJsonMode.value = !isJsonMode.value;
};

const validateAndApplyJson = () => {
 try {
  const parsed = JSON.parse(jsonText.value);
  if (!Array.isArray(parsed)) {
   throw new Error('配列である必要があります');
  }

  // 基本的な構造チェック
  const validatedActions: PostActionType[] = parsed.map((action, index) => {
   if (typeof action !== 'object' || action === null) {
    throw new Error(`${index + 1}番目の要素がオブジェクトではありません`);
   }

   return {
    characterKey: typeof action.characterKey === 'string' ? action.characterKey : '',
    iconKey: typeof action.iconKey === 'string' ? action.iconKey : '',
    delaySeconds:
     typeof action.delaySeconds === 'number' && action.delaySeconds >= 0 ? action.delaySeconds : 0,
    wordParty: typeof action.wordParty === 'string' ? action.wordParty : '',
    messageContent: typeof action.messageContent === 'string' ? action.messageContent : '',
    messageToast: typeof action.messageToast === 'string' ? action.messageToast : ''
   };
  });

  jsonError.value = '';
  return validatedActions;
 } catch (error) {
  jsonError.value = error instanceof Error ? error.message : 'JSONの解析に失敗しました';
  return null;
 }
};

const applyJson = () => {
 const validatedActions = validateAndApplyJson();
 if (validatedActions) {
  emit('update:modelValue', validatedActions);
 }
};

const resetJson = () => {
 updateJsonText();
 jsonError.value = '';
};

const prettifyJson = () => {
 try {
  const parsed = JSON.parse(jsonText.value);
  jsonText.value = JSON.stringify(parsed, null, 2);
  jsonError.value = '';
 } catch (error) {
  jsonError.value = 'JSONの整形に失敗しました';
 }
};

const exportToClipboard = async () => {
 try {
  await navigator.clipboard.writeText(jsonText.value);
  toast.success('クリップボードにコピーしました');
 } catch (error) {
  console.error('クリップボードへのコピーに失敗:', error);
 }
};

const importFromClipboard = async () => {
 try {
  const text = await navigator.clipboard.readText();
  jsonText.value = text;
  jsonError.value = '';
 } catch (error) {
  console.error('クリップボードからの読み込みに失敗:', error);
 }
};
</script>
