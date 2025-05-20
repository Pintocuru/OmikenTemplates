<!-- src/apps/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">テスト コンフィグエディター</h1>

  <!-- アクションボタンとプリセット -->
  <div class="mb-4">
   <!-- プリセットコンポーネント -->
   <ConfigPresets />
  </div>

  <!-- ComponentConfig 編集セクション -->
  <div class="mb-6">
   <UserVisitsEditor />
  </div>
 </div>
</template>

<script setup lang="ts">
import UserVisitsEditor from './components/UserVisitsEditor.vue';
import ConfigPresets from './components/ConfigPresets.vue';
</script>
