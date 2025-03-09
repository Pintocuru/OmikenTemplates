<!-- common/ErrorInitComponent.vue -->
<template>
 <div class="error-init p-6 bg-red-100 border border-red-300 rounded-lg shadow-md text-center">
  <div class="flex justify-center items-center space-x-4 mb-4">
   <svg
    class="w-12 h-12 text-red-600"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
   >
    <path
     fill-rule="evenodd"
     d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14a6 6 0 110 12 6 6 0 010-12zm-1 6a1 1 0 112 0v2a1 1 0 11-2 0v-2zm0 4a1 1 0 112 0v2a1 1 0 11-2 0v-2z"
     clip-rule="evenodd"
    />
   </svg>
   <h2 class="text-2xl font-semibold text-red-600">読み込みエラー</h2>
  </div>

  <p class="text-gray-800 mb-4">データの読み込みに失敗しました。以下の確認をお願いします。</p>

  <div class="text-left text-sm text-gray-600 space-y-2 mb-6">
   <p class="font-medium">確認事項:</p>
   <ul class="list-disc pl-6">
    <li>わんコメが正常に起動していることを確認してください</li>

    <!-- props.config.PLUGIN_UID が null でない場合に内容を追加 -->
    <template v-if="props.pluginUid">
     <li>
      本ジェネレーターは「
      <a href="https://booth.pm/ja/items/6499304" class="text-blue-600 hover:text-blue-800">
       おみくじBOTプラグイン
      </a>
      」専用です
     </li>
     <li>
      わんコメのメニュー >
      プラグインで「おみくじBOTプラグイン」が表示されていることを確認してください
     </li>
     <li>プラグインが有効（ON）になっていることを確認してください</li>
     <li>
      config.js の
      <code class="bg-gray-200 p-1 rounded">PLUGIN_UID</code> が
      <code class="bg-gray-200 p-1 rounded">{{ props.pluginUid }}</code>
      となっています。「おみくじBOTプラグイン」のディレクトリ名と、config.js の PLUGIN_UID
      が同じになるように編集してください。
     </li>
    </template>
   </ul>
   <!-- OBSの使用に関する案内とコンソールログについて -->
   <p class="font-medium">エラーの原因を探るには:</p>
   <ul class="list-disc pl-6">
    <li>OBSでの使用時に問題が発生した場合は、<strong>コンソールログ</strong>をご確認ください。</li>
    <li>
     コンソールログとは、アプリケーションが出力するエラーメッセージやデバッグ情報が表示される場所です。
    </li>
    <li>OBSの設定画面の「ログの表示」から確認できます。</li>
    <li>エラーが表示されている場合、設定や接続に関する情報が得られることがあります。</li>
   </ul>
  </div>

  <button
   @click="handleReload"
   class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
  >
   再読み込み
  </button>
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// PLUGIN_UID
const props = defineProps<{ pluginUid?: string | null }>();

const handleReload = () => {
 window.location.reload();
};

// ページが表示されてから10秒後にリロードを実行
onMounted(() => {
 setTimeout(() => {
  window.location.reload();
 }, 10000);
});
</script>

<style scoped>
.error-init a {
 text-decoration: underline;
 transition: color 0.2s;
}

.error-init button:disabled {
 opacity: 0.7;
 cursor: not-allowed;
}
</style>
