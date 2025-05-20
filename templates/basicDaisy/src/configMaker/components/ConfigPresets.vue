<!-- src/apps/configMaker/components/ConfigPresets.vue -->
<template>
 <div class="flex flex-wrap justify-between items-center gap-4">
  <!-- プリセット -->
  <div v-if="presets.length > 0" class="preset-container">
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
   <button @click="download" class="btn btn-primary">設定を出力</button>
  </div>
 </div>

 <!-- DaisyUI Modal Dialog -->
 <div class="modal" :class="{ 'modal-open': showModal }">
  <div class="modal-box max-w-md">
   <h3 class="font-bold text-lg text-primary mb-4">設定ファイルのダウンロード完了</h3>

   <div class="space-y-4 text-sm">
    <div class="flex items-start gap-3">
     <div class="text-success mt-0.5">✓</div>
     <p>設定ファイルのダウンロードが完了しました。</p>
    </div>

    <div class="bg-base-200 p-4 rounded-lg">
     <h4 class="font-semibold mb-2 flex items-center gap-2">📋 次の手順</h4>
     <ol class="list-decimal list-inside space-y-2">
      <li>
       <span class="font-medium">config.js</span>
       ファイルを、コンフィグエディターと同じフォルダに上書き保存
      </li>
      <li>OBSなどのアプリケーションを再起動して新しい設定を反映</li>
     </ol>
    </div>
   </div>

   <div class="modal-action mt-6">
    <button class="btn btn-primary" @click="showModal = false">閉じる</button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useConfigMaker } from '../script/useConfigMaker';
import { presets } from '../script/ConfigPresetsData';

// pinia
const configStore = useConfigMaker();
const showModal = ref(false);

// 現在の設定がプリセットと一致するか確認する関数
const isActivePreset = (presetId: string) => {
 const preset = presets.find((p) => p.id === presetId);
 if (!preset) return false;

 // 簡易比較
 const configMatch = JSON.stringify(configStore.config) === JSON.stringify(preset.config);

 return configMatch;
};

// プリセットを適用する関数
const applyPreset = (presetId: string) => {
 const preset = presets.find((p) => p.id === presetId);
 if (!preset) return;

 // configStoreの状態を更新
 //configStore.applyPreset(preset.config);
};

// 設定ファイルをダウンロードしてモーダルを表示
const download = async () => {
 // 既存のダウンロード機能を呼び出し
 const success = await configStore.generateConfig();
 if (success) showModal.value = true;
};
</script>

<style scoped>
.preset-container {
 flex: 1;
 min-width: 300px;
}
</style>
