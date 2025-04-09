<!-- src/apps/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-4xl mx-auto bg-base-100 shadow-lg rounded-lg">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">Counter Config Generator</h1>

  <!-- アクションボタン -->
  <div class="mb-4 flex justify-between">
   <div class="space-x-2">
    <button @click="configStore.generateConfig" class="btn btn-primary">設定をJSON出力</button>
   </div>
  </div>

  <!-- ComponentConfig 編集セクション -->
  <div class="mb-6">
   <ComponentConfigEditor />
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
import { useConfigMaker } from './components/useConfigMaker';

// pinia
const configStore = useConfigMaker();
</script>
