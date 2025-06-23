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
   <div class="modal-box max-w-2xl">
    <h3 class="font-bold text-lg mb-4">📝 テキストエディット - {{ currentPlaceholder.name }}</h3>

    <div class="space-y-4">
     <!-- 説明 -->
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

     <!-- テキストエリアとプレビュー -->
     <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- テキストエリア -->
      <div class="form-control">
       <label class="label">
        <span class="label-text font-medium">📝 テキスト入力</span>
        <span class="label-text-alt">{{ lineCount }}行</span>
       </label>
       <textarea
        v-model="textContent"
        class="textarea textarea-bordered h-64 font-mono text-sm resize-none"
        placeholder="3,重要な内容&#10;1,普通の内容&#10;5,とても重要な内容&#10;単純なテキスト（重み1）"
        @input="updateLineCount"
       />
      </div>
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

// ストアを使用
const placeholderStore = usePlaceholderStore();

// リアクティブデータ
const isModalOpen = ref(false);
const textContent = ref('');
const lineCount = ref(0);

// 現在のプレースホルダーデータを取得
const currentPlaceholder = computed(() => {
 return placeholderStore.placeholders[props.placeholderId];
});

// テキスト行を解析してPlaceholderValue候補に変換
const parseLineToCandidate = (line: string) => {
 const trimmedLine = line.trim();
 if (!trimmedLine) return null;

 const parts = trimmedLine.split(',');

 if (parts.length === 1) {
  // 内容のみの場合
  return { weight: 1, content: parts[0].trim() };
 } else if (parts.length === 2) {
  // 重み,内容の場合
  const weightNum = parseInt(parts[0].trim(), 10);
  return { weight: weightNum, content: parts[1].trim() };
 } else {
  // コンマが多すぎる場合は内容として扱う
  return { weight: 1, content: trimmedLine };
 }
};

// computed
const previewItems = computed(() => {
 const lines = textContent.value.split('\n');
 return lines
  .map((line) => {
   const candidate = parseLineToCandidate(line);
   if (!candidate) return null;

   // Zodスキーマでバリデーション
   const result = PlaceholderValueSchema.safeParse(candidate);

   if (result.success) {
    return {
     ...result.data,
     hasError: false,
     error: ''
    };
   } else {
    // エラーメッセージを日本語に変換
    const getJapaneseError = (error: any) => {
     const issue = error.issues?.[0];
     if (!issue) return '不正な値です';

     if (issue.path?.[0] === 'weight') {
      return '重みは1以上の整数である必要があります';
     } else if (issue.path?.[0] === 'content') {
      return '内容が必要です';
     }
     return '不正な値です';
    };

    return {
     weight: candidate.weight || 0,
     content: candidate.content || '',
     hasError: true,
     error: getJapaneseError(result.error)
    };
   }
  })
  .filter((item) => item !== null);
});

const hasErrors = computed(() => previewItems.value.some((item) => item.hasError));
const validItemsCount = computed(() => previewItems.value.filter((item) => !item.hasError).length);
const errorCount = computed(() => previewItems.value.filter((item) => item.hasError).length);

// メソッド
const openModal = () => {
 // 現在のプレースホルダーのvaluesからテキストを構築
 if (currentPlaceholder.value?.values) {
  textContent.value = currentPlaceholder.value.values
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
};

const updateLineCount = () => {
 lineCount.value = textContent.value.split('\n').length;
};

const saveContent = () => {
 if (hasErrors.value || validItemsCount.value === 0) return;

 const newValues = previewItems.value
  .filter((item) => !item.hasError)
  .map(({ weight, content }) => ({ weight, content }));

 // ストアを使って直接更新
 const success = placeholderStore.updatePlaceholderValues(props.placeholderId, newValues);

 if (success) {
  closeModal();
 } else {
  console.error(`Failed to update placeholder values for ID: ${props.placeholderId}`);
 }
};

watch(textContent, updateLineCount);
</script>
