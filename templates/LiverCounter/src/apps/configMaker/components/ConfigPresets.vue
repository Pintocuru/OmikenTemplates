<!-- src/apps/configMaker/components/ConfigPresets.vue -->
<template>
 <div class="flex flex-wrap justify-between items-center gap-4">
  <div class="preset-container">
   <span class="font-medium mr-2">プリセット:</span>
   <div class="flex flex-wrap gap-2">
    <button
     v-for="preset in presets"
     :key="preset.id"
     @click="applyPreset(preset.id)"
     class="btn btn-sm"
     :class="{ 'btn-accent': isActivePreset(preset.id) }"
    >
     {{ preset.name }}
    </button>
   </div>
  </div>
  <div class="space-x-2">
   <button @click="configStore.generateConfig" class="btn btn-primary">設定をJSON出力</button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useConfigMaker } from './useConfigMaker';
import { presets, ConfigPreset } from './ConfigPresetsData';

const configStore = useConfigMaker();

// 現在の設定がプリセットと一致するか確認する関数
const isActivePreset = (presetId: string) => {
 const preset = presets.find((p) => p.id === presetId);
 if (!preset) return false;

 // 簡易比較 - 実際の実装ではより詳細な比較が必要かもしれません
 const configMatch = JSON.stringify(configStore.componentConfig) === JSON.stringify(preset.config);
 const setsMatch = JSON.stringify(configStore.counterSets) === JSON.stringify(preset.counterSets);

 return configMatch && setsMatch;
};

// プリセットを適用する関数
const applyPreset = (presetId: string) => {
 const preset = presets.find((p) => p.id === presetId);
 if (!preset) return;

 // configStoreの状態を更新
 configStore.applyPreset(preset.config, preset.counterSets);
};
</script>
