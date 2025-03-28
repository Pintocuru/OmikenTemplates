<!-- src/configMaker.vue -->
<template>
 <div class="p-4 max-w-2xl mx-auto bg-base-100 shadow-lg rounded-lg">
  <h2 class="text-2xl font-bold mb-6 text-center text-primary">Bingo Config Generator</h2>

  <!-- アクションボタン -->
  <div class="mb-4 flex justify-end">
   <button @click="configStore.generateConfig" class="btn btn-primary">config.js を生成</button>
  </div>

  <div class="space-y-4">
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold text-base-content">
     基本設定 (Basic Settings)
    </div>
    <div class="collapse-content">
     <BasicSettings />
    </div>
   </div>

   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div
     class="collapse-title text-lg font-semibold text-base-content flex justify-between items-center"
    >
     固定項目 (Bingo Seeds)
    </div>
    <div class="collapse-content">
     <FixedItems />
    </div>
   </div>

   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div
     class="collapse-title text-lg font-semibold text-base-content flex justify-between items-center"
    >
     ランダム項目 (Bingo Random Seeds)
    </div>
    <div class="collapse-content">
     <RandomItems />
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useConfigMaker } from '@/configMaker/useConfigMaker';
import BasicSettings from '@/configMaker/BasicSettings.vue';
import FixedItems from '@/configMaker/FixedItems.vue';
import RandomItems from '@/configMaker/RandomItems.vue';

// pinia
const configStore = useConfigMaker();
</script>
