<!-- src/configMaker/components/placeholders/PlaceholderValuesEditor.vue -->
<template>
 <div class="space-y-4">
  <!-- 編集モード切り替えボタン -->
  <div class="flex justify-end">
   <button
    @click="toggleEditMode"
    class="btn btn-sm bg-secondary"
    :class="{ 'btn-active': isTextMode }"
    title="編集モードを切り替え"
   >
    {{ isTextMode ? '🔧 入力モード' : '📝 テキストモード' }}
   </button>
  </div>

  <!-- 入力モード -->
  <div v-if="!isTextMode" class="space-y-1">
   <div v-for="(value, index) in localValues" :key="index" class="card bg-base-100 p-2">
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
     <!-- 重み -->
     <input
      type="number"
      v-model.number="value.weight"
      min="0"
      class="input input-bordered input-sm w-full sm:w-24 mb-2 sm:mb-0"
      placeholder="重み"
     />

     <!-- 内容 -->
     <input
      type="text"
      v-model="value.content"
      placeholder="プレースホルダーの内容"
      class="input input-bordered input-sm w-full"
     />

     <!-- 複製・削除ボタン -->
     <div class="flex gap-1 mt-2 sm:mt-0 sm:ml-auto">
      <button @click="duplicateValue(index)" class="btn btn-xs btn-outline" title="複製">📋</button>
      <button
       @click="removeValue(index)"
       class="btn btn-xs btn-outline btn-error"
       title="削除"
       :disabled="localValues.length <= 1"
      >
       🗑️
      </button>
     </div>
    </div>
   </div>

   <button @click="addValue" class="btn btn-primary btn-sm w-full">+ 値を追加</button>
  </div>

  <!-- テキストモード -->
  <div v-else>
   <!-- 入力形式の説明 -->
   <div class="alert alert-info">
    <span class="text-2xl">ℹ️</span>
    <div class="text-sm">
     <div class="font-semibold mb-1">入力形式:</div>
     <div>• 各行が1つの項目になります</div>
     <div>• 形式: <code class="bg-accent px-1 rounded">重み,内容</code></div>
     <div>
      • 例: <code class="bg-accent px-1 rounded">3,テキスト</code> または
      <code class="bg-accent px-1 rounded">テキスト</code>（数値がない場合、重み1として扱います）
     </div>
     <div class="text-xs text-gray-500 mt-1">※ 重みは1以上の整数で指定してください</div>
    </div>
   </div>

   <!-- テキストエリア -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">📝 テキスト入力</span>
     <span class="label-text-alt">{{ lineCount }}行</span>
    </label>
    <textarea
     v-model="textContent"
     class="textarea textarea-bordered h-64 font-mono text-sm resize-none w-full"
     placeholder="3,重要な内容&#10;1,普通の内容&#10;5,とても重要な内容&#10;単純なテキスト（重み1）"
     @input="updateLineCount"
    />
   </div>

   <!-- エラーサマリー -->
   <div v-if="hasErrors" class="alert alert-error">
    <span class="text-lg">⚠️</span>
    <div>
     <div class="font-semibold">入力エラーがあります</div>
     <div class="text-sm">{{ errorCount }}行にエラーがあります。修正してから保存してください。</div>
    </div>
   </div>

   <!-- 保存ボタン（直接編集版のみ） -->
   <button
    v-if="!isModal"
    @click="saveTextContent"
    class="btn btn-primary btn-sm w-full"
    :disabled="hasErrors || validItemsCount === 0"
   >
    💾 保存
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PlaceholderValueSchema } from '@type/';
import { usePlaceholderStore } from '@ConfigScript/usePlaceholderStore';

const props = defineProps<{
 placeholderId: string;
 isModal?: boolean;
 showNameEdit?: boolean;
}>();

const emit = defineEmits<{
 valuesChanged: [values: Array<{ weight: number; content: string }>];
 nameChanged: [name: string];
}>();

const placeholderStore = usePlaceholderStore();

// リアクティブデータ
const isTextMode = ref(false);
const textContent = ref('');
const placeholderName = ref('');
const lineCount = ref(0);
const localValues = ref<Array<{ weight: number; content: string }>>([]);

// 現在のプレースホルダーデータ
const currentPlaceholder = computed(() => placeholderStore.rulesMap[props.placeholderId]);

// 初期化
const initializeValues = () => {
 const placeholder = currentPlaceholder.value;
 placeholderName.value = placeholder?.name || '';

 if (placeholder?.values) {
  localValues.value = JSON.parse(JSON.stringify(placeholder.values));
 } else {
  localValues.value = [PlaceholderValueSchema.parse({})];
 }
};

// 編集モード切り替え
const toggleEditMode = () => {
 if (!isTextMode.value) {
  // 入力モードからテキストモードへ
  textContent.value = localValues.value
   .map((value) => (value.weight === 1 ? value.content : `${value.weight},${value.content}`))
   .join('\n');
  updateLineCount();
 } else {
  // テキストモードから入力モードへ
  if (!hasErrors.value && validItemsCount.value > 0) {
   localValues.value = previewItems.value
    .filter((item) => !item.hasError)
    .map(({ weight, content }) => ({ weight, content }));
  }
 }
 isTextMode.value = !isTextMode.value;
};

// 値の追加
const addValue = () => {
 localValues.value.push(PlaceholderValueSchema.parse({}));
};

// 値の削除
const removeValue = (index: number) => {
 if (localValues.value.length <= 1) return;
 localValues.value.splice(index, 1);
};

// 値の複製
const duplicateValue = (index: number) => {
 const original = localValues.value[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 duplicated.content = `${original.content} (コピー)`;

 localValues.value.splice(index + 1, 0, duplicated);
};

// 行をパースしてバリデーション
const parseAndValidateLine = (line: string) => {
 const trimmed = line.trim();
 if (!trimmed) return null;

 const parts = trimmed.split(',');
 const candidate =
  parts.length === 2 && !isNaN(parseInt(parts[0].trim()))
   ? { weight: parseInt(parts[0].trim()), content: parts[1].trim() }
   : { weight: 1, content: trimmed };

 const result = PlaceholderValueSchema.safeParse(candidate);

 return {
  ...candidate,
  hasError: !result.success,
  error: result.success ? '' : getErrorMessage(result.error)
 };
};

// エラーメッセージを日本語化
const getErrorMessage = (error: any) => {
 const issue = error.issues?.[0];
 if (issue?.path?.[0] === 'weight') return '重みは1以上の整数である必要があります';
 if (issue?.path?.[0] === 'content') return '内容が必要です';
 return '不正な値です';
};

// プレビューアイテム
const previewItems = computed(() =>
 textContent.value
  .split('\n')
  .map(parseAndValidateLine)
  .filter((item) => item !== null)
);

// バリデーション状態
const hasErrors = computed(() => previewItems.value.some((item) => item.hasError));
const validItemsCount = computed(() => previewItems.value.filter((item) => !item.hasError).length);
const errorCount = computed(() => previewItems.value.filter((item) => item.hasError).length);

// 保存可能かどうか
const canSave = computed(() => {
 if (isTextMode.value) {
  return !hasErrors.value && validItemsCount.value > 0;
 } else {
  return localValues.value.length > 0;
 }
});

// 行数更新
const updateLineCount = () => {
 lineCount.value = textContent.value.split('\n').length;
};

// テキストコンテンツの保存（直接編集版のみ）
const saveTextContent = () => {
 if (hasErrors.value || validItemsCount.value === 0) return;

 const newValues = previewItems.value
  .filter((item) => !item.hasError)
  .map(({ weight, content }) => ({ weight, content }));

 const success = placeholderStore.updatePlaceholderValues(props.placeholderId, newValues);

 if (!success) {
  console.error(`Failed to update placeholder values for ID: ${props.placeholderId}`);
 } else {
  toggleEditMode();
 }
};

// 現在の値を取得（モーダル版で使用）
const getCurrentValues = () => {
 if (isTextMode.value) {
  if (hasErrors.value || validItemsCount.value === 0) return null;
  return previewItems.value
   .filter((item) => !item.hasError)
   .map(({ weight, content }) => ({ weight, content }));
 } else {
  return localValues.value.length > 0 ? localValues.value : null;
 }
};

// 監視
watch(textContent, updateLineCount);

// 直接編集版の場合、localValuesの変更を監視してリアルタイム更新
// TODO:watch の代わりに、computedのget/setを使って欲しい
watch(
 localValues,
 (newValues) => {
  if (!props.isModal) {
   placeholderStore.updatePlaceholderValues(props.placeholderId, newValues);
  }
 },
 { deep: true }
);

// 名前の変更を監視
watch(placeholderName, (newName) => {
 if (props.showNameEdit) {
  emit('nameChanged', newName);
 }
});

// 外部からアクセス可能な関数
defineExpose({
 initializeValues,
 getCurrentValues,
 canSave,
 placeholderName
});

// 初期化
initializeValues();
</script>
