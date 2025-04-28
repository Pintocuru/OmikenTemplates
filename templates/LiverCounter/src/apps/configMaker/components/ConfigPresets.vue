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
   <button @click="downloadAndShowInstructions" class="btn btn-primary">設定を出力</button>
  </div>
 </div>

 <!-- DaisyUI Modal Dialog -->
 <div class="modal" :class="{ 'modal-open': showModal }">
  <div class="modal-box">
   <h3 class="font-bold text-lg">設定ファイルのダウンロード完了</h3>
   <p class="py-4">設定ファイルのダウンロードが完了しました。以下の場所に保存してください：</p>
   <div class="bg-base-200 p-3 rounded-lg mb-4">
    <code>project/config/config.js</code>
   </div>
   <p>ファイルを上記のパスに配置後、アプリケーションを再起動すると新しい設定が反映されます。</p>
   <div class="modal-action">
    <button class="btn" @click="showModal = false">閉じる</button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useConfigMaker } from './useConfigMaker';
import { presets } from './ConfigPresetsData';
import { ref } from 'vue';

// pinia
const configStore = useConfigMaker();
const showModal = ref(false);

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

// 設定ファイルをダウンロードして説明を表示する関数
const downloadAndShowInstructions = async () => {
 // 既存のダウンロード機能を呼び出し
 const success = await configStore.generateConfig();

 // ダウンロードが成功したらモーダルを表示
 if (success) {
  showModal.value = true;
 }
};
</script>

<style scoped>
.preset-container {
 flex: 1;
 min-width: 300px;
}
</style>
