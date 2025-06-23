<!-- src/components/CopyButton.vue -->
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
import { ref, computed } from 'vue';

interface Props {
 // コピーする値（必須）
 value: string;

 // タイトル（ツールチップ）
 title?: string;

 // TODO:下記は不要
 defaultText?: string;
 showText?: boolean;
 successText?: string;
 loadingText?: string;
 defaultIcon?: string;
 variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'custom';
 size?: 'xs' | 'sm' | 'md' | 'lg';
 successDuration?: number;
 disabled?: boolean;
 customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
 showText: false,
 defaultText: 'コピー',
 successText: 'コピー済み✓',
 loadingText: 'コピー中...',
 defaultIcon: '📋',
 variant: 'ghost',
 size: 'sm',
 successDuration: 2000,
 disabled: false,
 title: 'クリックしてコピー',
 customClass: ''
});

// Emits
// TODO:Emitsは不要
const emit = defineEmits<{
 success: [value: string];
 error: [error: Error];
 click: [event: MouseEvent];
}>();

// 状態管理
const copied = ref(false);
const isLoading = ref(false);

// @ts-ignore
// 名前空間 'NodeJS' が見つかりません。ts(2503)
let successTimer: NodeJS.Timeout | null = null;

// コピー処理
const handleCopy = async (event: MouseEvent) => {
 emit('click', event);

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

  // 成功イベントを発火
  emit('success', props.value);

  // 指定時間後に元の状態に戻す
  successTimer = setTimeout(() => {
   copied.value = false;
  }, props.successDuration);
 } catch (error) {
  isLoading.value = false;
  console.error('Copy failed:', error);

  // エラーイベントを発火
  emit('error', error as Error);

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
   emit('success', props.value);

   successTimer = setTimeout(() => {
    copied.value = false;
   }, props.successDuration);
  } catch (fallbackError) {
   console.error('Fallback copy also failed:', fallbackError);
  }
 }
};

// コンポーネントがアンマウントされる際のクリーンアップ
import { onUnmounted } from 'vue';
onUnmounted(() => {
 if (successTimer) {
  clearTimeout(successTimer);
 }
});
</script>
