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
   <button @click="download" class="btn btn-primary" :disabled="isExporting">
    <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
    設定を出力
   </button>
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

 <!-- エラーモーダル -->
 <div class="modal" :class="{ 'modal-open': showErrorModal }">
  <div class="modal-box max-w-md">
   <h3 class="font-bold text-lg text-error mb-4">エラー</h3>
   <p class="text-sm mb-4">{{ errorMessage }}</p>
   <div class="modal-action">
    <button class="btn btn-primary" @click="showErrorModal = false">閉じる</button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOmikujiStore } from '../script/useOmikujiStore';
import { presets } from '../script/ConfigPresetsData';

// Stores
const omikujiStore = useOmikujiStore();

// State
const showModal = ref(false);
const showErrorModal = ref(false);
const isExporting = ref(false);
const errorMessage = ref('');

// Computed
const currentData = computed(() => omikujiStore.data);

// 現在の設定がプリセットと一致するか確認する関数
const isActivePreset = (presetId: string) => {
 const preset = presets.find((p) => p.id === presetId);
 if (!preset) return false;

 // プリセットの構造に応じて比較ロジックを調整
 // 現在はプリセットが未実装なので、常にfalseを返す
 return false;
};

// プリセットを適用する関数
const applyPreset = (presetId: string) => {
 const preset = presets.find((p) => p.id === presetId);
 if (!preset) {
  showError('指定されたプリセットが見つかりません。');
  return;
 }

 try {
  // プリセットが実装されたら、ここでデータを適用
  // omikujiStore.loadData(preset.data);
  console.log('プリセット適用:', preset.name);
 } catch (error) {
  showError('プリセットの適用に失敗しました。');
 }
};

// 設定ファイルをダウンロードしてモーダルを表示
const download = async () => {
 if (isExporting.value) return;

 try {
  isExporting.value = true;

  // データの検証
  const validation = omikujiStore.validateData();
  if (!validation.success) {
   showError('設定データに問題があります。エラーを修正してから再度お試しください。');
   return;
  }

  // データをJSファイル形式で出力
  const success = await generateConfigFile();

  if (success) {
   showModal.value = true;
  } else {
   showError('設定ファイルの生成に失敗しました。');
  }
 } catch (error) {
  console.error('Export error:', error);
  showError('設定ファイルの出力中にエラーが発生しました。');
 } finally {
  isExporting.value = false;
 }
};

// 設定ファイルを生成してダウンロード
const generateConfigFile = async (): Promise<boolean> => {
 try {
  // データをJavaScript形式で出力
  const configData = omikujiStore.exportData();
  const jsContent = generateJSFileContent(configData);

  // ファイルダウンロード
  const blob = new Blob([jsContent], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'config.js';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
  return true;
 } catch (error) {
  console.error('File generation error:', error);
  return false;
 }
};

// JavaScript ファイルの内容を生成
const generateJSFileContent = (configData: string): string => {
 const timestamp = new Date().toISOString();

 return `// Generated by Omikuji Config Maker
// Generated at: ${timestamp}
// 
// このファイルはコンフィグエディターで生成されました。
// 手動で編集する場合は、JSON形式の構文エラーにご注意ください。

window.omikujiConfig = ${configData};

// 設定が読み込まれたことを確認するためのフラグ
window.omikujiConfigLoaded = true;

console.log('Omikuji Config loaded:', new Date().toISOString());
`;
};

// エラーを表示
const showError = (message: string) => {
 errorMessage.value = message;
 showErrorModal.value = true;
};
</script>

<style scoped>
.preset-container {
 flex: 1;
 min-width: 300px;
}

.loading {
 display: inline-block;
}
</style>
