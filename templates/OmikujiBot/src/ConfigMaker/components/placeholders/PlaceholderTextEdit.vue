<!-- src/configMaker/components/PlaceholderTextEdit.vue -->
<template>
 <div>
  <!-- テキストエディットボタン -->
  <button
   @click="openModal"
   class="btn btn-sm btn-outline hover:btn-primary transition-colors"
   title="テキストエディットモードで編集"
  >
   📝 {{ textContent ? textContent : '編集' }}
  </button>

  <!-- モーダル -->
  <div v-if="isModalOpen" class="modal modal-open">
   <div class="modal-box max-w-4xl">
    <h3 class="font-bold text-lg mb-4">📝 テキストエディット</h3>

    <div class="space-y-4">
     <!-- プレースホルダー名編集 -->
     <div class="form-control">
      <label class="label">
       <span class="label-text font-medium">🏷️ プレースホルダー名</span>
      </label>
      <input
       v-model="placeholderName"
       class="input input-bordered"
       placeholder="プレースホルダー名を入力"
      />
     </div>

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
       <div class="text-sm">
        {{ errorCount }}行にエラーがあります。修正してから保存してください。
       </div>
      </div>
     </div>
    </div>

    <div class="modal-action">
     <button @click="closeModal" class="btn btn-ghost">❌ キャンセル</button>
     <button
      @click="saveContent"
      class="btn btn-primary"
      :disabled="hasErrors || validItemsCount === 0"
     >
      💾 保存 ({{ validItemsCount }}項目)
     </button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { PlaceholderValueSchema } from '@/types/OmikujiTypesSchema';
import { ref, computed, watch } from 'vue';
import { usePlaceholderStore } from '@/ConfigMaker/script/usePlaceholderStore';

const props = defineProps<{
 placeholderId: string;
 textContent?: string;
}>();

const placeholderStore = usePlaceholderStore();

// リアクティブデータ
const isModalOpen = ref(false);
const textContent = ref('');
const placeholderName = ref('');
const lineCount = ref(0);

// 現在のプレースホルダーデータ
const currentPlaceholder = computed(() => placeholderStore.placeholders[props.placeholderId]);

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

// メソッド
const openModal = () => {
 const placeholder = currentPlaceholder.value;
 placeholderName.value = placeholder?.name || '';

 if (placeholder?.values) {
  textContent.value = placeholder.values
   .map((value) => (value.weight === 1 ? value.content : `${value.weight},${value.content}`))
   .join('\n');
 } else {
  textContent.value = '';
 }

 updateLineCount();
 isModalOpen.value = true;
};

const closeModal = () => {
 isModalOpen.value = false;
 textContent.value = '';
 placeholderName.value = '';
};

const updateLineCount = () => {
 lineCount.value = textContent.value.split('\n').length;
};

const saveContent = () => {
 if (hasErrors.value || validItemsCount.value === 0) return;

 const newValues = previewItems.value
  .filter((item) => !item.hasError)
  .map(({ weight, content }) => ({ weight, content }));

 // 名前とvaluesを更新
 const nameSuccess = placeholderStore.updatePlaceholderName(
  props.placeholderId,
  placeholderName.value
 );
 const valuesSuccess = placeholderStore.updatePlaceholderValues(props.placeholderId, newValues);

 if (nameSuccess && valuesSuccess) {
  closeModal();
 } else {
  console.error(`Failed to update placeholder for ID: ${props.placeholderId}`);
 }
};

watch(textContent, updateLineCount);
</script>
