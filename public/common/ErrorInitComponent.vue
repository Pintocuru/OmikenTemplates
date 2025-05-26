<!-- common/ErrorInitComponent.vue -->
<template>
 <div class="p-4 bg-red-100 border border-red-300 rounded-lg text-center">
  <h2 class="text-xl font-semibold text-red-600 mb-3">読み込みエラー</h2>
  <p class="text-gray-800 mb-3">データの読み込みに失敗しました。以下の確認をお願いします。</p>

  <div class="text-left text-sm text-gray-600 mb-4">
   <p class="font-medium">確認事項:</p>
   <ul class="list-disc pl-5">
    <li>わんコメが正常に起動していることを確認してください</li>

    <!-- プラグイン関連の情報表示 -->
    <template v-if="props.pluginUid">
     <li>
      本ジェネレーターは「<a
       href="https://booth.pm/ja/items/6499304"
       class="text-blue-600 hover:text-blue-800"
       >おみくじBOTプラグイン</a
      >」専用です
     </li>
     <li>「おみくじBOTプラグイン」が有効になっているか確認してください</li>
     <li>
      config.js の <code class="bg-gray-200 px-1 rounded">PLUGIN_UID</code> が
      <code class="bg-gray-200 px-1 rounded">{{ props.pluginUid }}</code>
      と一致するか確認してください
     </li>
    </template>
   </ul>

   <!-- エラー解決のヒント -->
   <p class="font-medium mt-2">エラー解決のヒント:</p>
   <ul class="list-disc pl-5">
    <li>
     OBSでの使用時は<strong>コンソールログ</strong>をご確認ください（OBS設定画面の「ログの表示」）
    </li>
   </ul>
  </div>

  <button
   @click="handleReload"
   class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
   再読み込み
  </button>
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// プラグインIDを受け取るプロパティ
const props = defineProps<{ pluginUid?: string | null }>();

// 再読み込み処理
const handleReload = () => {
 window.location.reload();
};

// 15秒後に自動リロード
onMounted(() => {
 setTimeout(() => {
  handleReload();
 }, 15000);
});
</script>
