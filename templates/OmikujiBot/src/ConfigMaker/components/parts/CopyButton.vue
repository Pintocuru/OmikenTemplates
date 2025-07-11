<!-- src/configMaker/components/parts/CopyButton.vue -->
<template>
 <button @click="handleCopy" :title="title" :disabled="disabled || isLoading">
  <span class="btn btn-sm btn-outline hover:btn-primary transition-colors">
   <span v-if="isLoading">⏳コピー中…</span>
   <span v-else-if="copied">✓コピー済み</span>
   <span v-else>📋 コピー</span>
  </span>
 </button>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

interface Props {
 // コピーする値（必須）
 value: string;
 // タイトル（ツールチップ）
 title?: string;
 // 無効化フラグ
 disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
 title: 'クリックしてコピー',
 disabled: false
});

// 状態管理
const copied = ref(false);
const isLoading = ref(false);

let successTimer: number | null = null;

// コピー処理
const handleCopy = async () => {
 if (props.disabled || isLoading.value) {
  return;
 }

 // 既存のタイマーをクリア
 if (successTimer) {
  clearTimeout(successTimer);
 }

 try {
  isLoading.value = true;

  // クリップボードにコピー
  await navigator.clipboard.writeText(props.value);

  // 成功状態に変更
  isLoading.value = false;
  copied.value = true;

  // 2秒後に元の状態に戻す
  successTimer = setTimeout(() => {
   copied.value = false;
  }, 2000);
 } catch (error) {
  isLoading.value = false;
  console.error('Copy failed:', error);

  // フォールバック: 古いブラウザ対応
  try {
   const textArea = document.createElement('textarea');
   textArea.value = props.value;
   textArea.style.position = 'fixed';
   textArea.style.opacity = '0';
   document.body.appendChild(textArea);
   textArea.select();
   document.execCommand('copy');
   document.body.removeChild(textArea);

   copied.value = true;

   successTimer = setTimeout(() => {
    copied.value = false;
   }, 2000);
  } catch (fallbackError) {
   console.error('Fallback copy also failed:', fallbackError);
  }
 }
};

// コンポーネントがアンマウントされる際のクリーンアップ
onUnmounted(() => {
 if (successTimer) {
  clearTimeout(successTimer);
 }
});
</script>
