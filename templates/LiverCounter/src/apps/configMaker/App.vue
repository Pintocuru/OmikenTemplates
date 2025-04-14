<!-- src/apps/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">
   ライバーカウンター コンフィグエディター
  </h1>

  <!-- アクションボタンとプリセット -->
  <div class="mb-4">
   <!-- プリセットコンポーネント -->
   <ConfigPresets />
  </div>

  <!-- ComponentConfig 編集セクション -->
  <div class="mb-6">
   <ComponentConfigEditor class="mb-6" />
  </div>

  <!-- CounterSets 編集セクション -->
  <div class="mb-6">
   <CounterSetsEditor />
  </div>
 </div>
</template>

<script setup lang="ts">
import ComponentConfigEditor from './components/ComponentConfigEditor.vue';
import CounterSetsEditor from './components/CounterSetsEditor.vue';
import ConfigPresets from './components/ConfigPresets.vue';
</script>
