<!-- src/apps/controller/App.vue -->
<template>
 <div class="p-6 w-full bg-gray-800 rounded-lg shadow-md">
  <!-- メインコントロール -->
  <div class="grid grid-cols-2 gap-4 mb-8">
   <button
    @click="controller.action('countUp')"
    class="p-6 rounded-xl shadow-lg transition-all text-4xl font-bold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-3 h-40"
   >
    <PlusCircle class="w-16 h-16" />
    <span>+1</span>
   </button>

   <button
    @click="controller.action('countDown')"
    class="p-6 rounded-xl shadow-lg transition-all text-4xl font-bold bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-3 h-40"
   >
    <MinusCircle class="w-16 h-16" />
    <span>-1</span>
   </button>
  </div>

  <!-- リセット/表示切替ボタン -->
  <div class="grid grid-cols-1 gap-4">
   <button
    @click="controller.action('resetCounter')"
    class="p-6 rounded-xl shadow-lg transition-all text-3xl font-bold bg-yellow-500 text-white hover:bg-yellow-600 flex items-center justify-center gap-3 h-28"
   >
    <RefreshCw class="w-12 h-12" />
    <span>リセット</span>
   </button>

   <button
    @click="controller.action('userCountToggle')"
    class="p-6 rounded-xl shadow-lg transition-all text-3xl font-bold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-3 h-28"
   >
    <ToggleLeft v-if="isUserCount" class="w-12 h-12" />
    <ToggleRight v-else class="w-12 h-12" />
    <span>{{ isUserCount ? 'ユーザー数モード' : 'おはカウントモード' }}</span>
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WordCounterConfig } from '@/scripts/types';
import { useWordCounter } from '@/scripts/useWordCounter';
import { PlusCircle, MinusCircle, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-vue-next';

// コンポーザブル
const { controller } = useWordCounter();

// 設定
const wordCounterConfig = ref<WordCounterConfig>({
 IS_USER_COUNT: false // デフォルトはおはカウントモード
});

// 現在のモード
const isUserCount = ref(wordCounterConfig.value.IS_USER_COUNT);
</script>

<style>
/* OBSでの操作性向上のためのグローバルスタイル */
body {
 overflow: hidden;
 user-select: none;
 touch-action: manipulation;
}

button {
 -webkit-tap-highlight-color: transparent;
}
</style>
