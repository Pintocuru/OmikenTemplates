<!-- src/configMaker/components/TextEditModal.vue -->
<template>
 <div>
  <!-- テキストエディットボタン -->
  <button @click="openModal" class="btn btn-sm btn-outline" title="テキストエディットモードで編集">
   📝 テキスト編集
  </button>

  <!-- モーダル -->
  <div v-if="isModalOpen" class="modal modal-open">
   <div class="modal-box max-w-4xl">
    <h3 class="font-bold text-lg mb-4">テキストエディット - {{ title }}</h3>

    <div class="space-y-4">
     <!-- 説明 -->
     <div class="alert alert-info">
      <svg
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 24 24"
       class="stroke-current shrink-0 w-6 h-6"
      >
       <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
       ></path>
      </svg>
      <div class="text-sm">
       <div>各行が1つの値になります。形式: <code>重み|内容</code></div>
       <div>
        例: <code>1.0|テキストの内容</code> または
        <code>内容のみ</code>（重みは1.0として扱われます）
       </div>
      </div>
     </div>

     <!-- テキストエリア -->
     <div class="form-control">
      <label class="label">
       <span class="label-text">値の一覧（1行につき1つの値）</span>
       <span class="label-text-alt">{{ lineCount }}行</span>
      </label>
      <textarea
       v-model="textContent"
       class="textarea textarea-bordered h-64 font-mono text-sm"
       placeholder="1.0|最初の内容&#10;2.0|2番目の内容&#10;普通の内容（重み1.0）"
       @input="updateLineCount"
      ></textarea>
     </div>

     <!-- プレビュー -->
     <div class="card bg-base-200">
      <div class="card-body p-4">
       <h4 class="card-title text-base">プレビュー</h4>
       <div class="space-y-1 max-h-32 overflow-y-auto">
        <div
         v-for="(item, index) in previewItems"
         :key="index"
         class="flex justify-between items-center bg-base-100 p-2 rounded text-sm"
         :class="item.hasError ? 'border border-error' : ''"
        >
         <div class="flex-1 min-w-0">
          <div class="truncate">
           {{ item.content || '(内容なし)' }}
           <span v-if="item.hasError" class="text-error ml-2">← エラー: {{ item.error }}</span>
          </div>
         </div>
         <div class="flex-shrink-0 ml-2">
          <span class="badge badge-outline badge-xs">{{ item.weight }}</span>
         </div>
        </div>
        <div v-if="previewItems.length === 0" class="text-gray-500 text-sm text-center py-2">
         内容を入力してください
        </div>
       </div>
      </div>
     </div>
    </div>

    <div class="modal-action">
     <button @click="closeModal" class="btn btn-ghost">キャンセル</button>
     <button
      @click="saveContent"
      class="btn btn-primary"
      :disabled="hasErrors || previewItems.length === 0"
     >
      保存
     </button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface ValueItem {
 weight: number;
 content: string;
}

interface Props {
 values: ValueItem[];
 title?: string;
}

interface Emits {
 (e: 'updateValues', values: ValueItem[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// リアクティブデータ
const isModalOpen = ref(false);
const textContent = ref('');
const lineCount = ref(0);

// computed
const previewItems = computed(() => {
 const lines = textContent.value.split('\n').filter((line) => line.trim());
 return lines.map((line, index) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) {
   return {
    weight: 1.0,
    content: '',
    hasError: true,
    error: '空行です'
   };
  }

  // パイプで分割
  const parts = trimmedLine.split('|');

  if (parts.length === 1) {
   // 内容のみの場合
   return {
    weight: 1.0,
    content: parts[0].trim(),
    hasError: false,
    error: ''
   };
  } else if (parts.length === 2) {
   // 重み|内容の場合
   const weightStr = parts[0].trim();
   const content = parts[1].trim();

   const weight = parseFloat(weightStr);
   if (isNaN(weight) || weight < 0) {
    return {
     weight: 0,
     content: content,
     hasError: true,
     error: '重みは0以上の数値である必要があります'
    };
   }

   return {
    weight: weight,
    content: content,
    hasError: false,
    error: ''
   };
  } else {
   // パイプが多すぎる場合
   return {
    weight: 0,
    content: trimmedLine,
    hasError: true,
    error: 'パイプ(|)は1つまでです'
   };
  }
 });
});

const hasErrors = computed(() => {
 return previewItems.value.some((item) => item.hasError);
});

// メソッド
const openModal = () => {
 // 現在の値をテキスト形式に変換
 textContent.value = props.values
  .map((value) => {
   if (value.weight === 1.0) {
    return value.content;
   } else {
    return `${value.weight}|${value.content}`;
   }
  })
  .join('\n');

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
 if (hasErrors.value || previewItems.value.length === 0) {
  return;
 }

 const newValues = previewItems.value
  .filter((item) => !item.hasError)
  .map((item) => ({
   weight: item.weight,
   content: item.content
  }));

 emit('updateValues', newValues);
 closeModal();
};

// textContentの変更を監視してlineCountを更新
watch(textContent, updateLineCount);
</script>
