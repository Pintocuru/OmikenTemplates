<!-- src/ConfigMaker/components/display/DisplayModeSettingsCard.vue -->
<template>
 <div class="card bg-base-300">
  <!-- タイトル行：左にタイトル、右にリセットボタン -->
  <div class="flex items-center justify-between bg-secondary text-lg p-2 pl-4 rounded-t">
   <span>表示モード設定</span>
   <button
    class="btn btn-ghost btn-sm"
    @click="resetAllModes"
    title="すべてのモードをデフォルトに戻す"
   >
    <RotateCcw class="w-4 h-4" />
   </button>
  </div>

  <!-- モード設定項目 -->
  <div class="flex flex-wrap gap-4 m-4">
   <!-- メッセージモード -->
   <label class="flex items-center gap-2 p-2 rounded">
    <input
     v-model="displaySettings.enabledModes.messages"
     type="checkbox"
     class="checkbox checkbox-primary"
    />
    <span class="label-text">BOTメッセージ</span>
   </label>

   <!-- ユーザー訪問履歴モード -->
   <label class="flex items-center gap-2 p-2 rounded">
    <input
     v-model="displaySettings.enabledModes.userVisits"
     type="checkbox"
     class="checkbox checkbox-primary"
    />
    <span class="label-text">訪問履歴</span>
   </label>

   <!-- スクリプトゲーム -->
   <label
    v-for="(value, index) in scriptGameMap"
    :key="index"
    class="flex items-center gap-2 p-2 rounded"
   >
    <input
     v-model="displaySettings.enabledModes.scriptGames[index]"
     type="checkbox"
     class="checkbox checkbox-primary"
    />
    <span class="label-text">{{ value.name }}</span>
   </label>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import { scriptGameMap, scriptGameKeys } from '@/ScriptGame/ScriptGameMap';
import { storeToRefs } from 'pinia';
import { RotateCcw } from 'lucide-vue-next';

const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);
const displaySettings = computed(() => data.value.displaySettings);

// 全て true にリセット
const resetAllModes = () => {
 displaySettings.value.enabledModes.messages = true;
 displaySettings.value.enabledModes.userVisits = true;

 for (const key of scriptGameKeys) {
  displaySettings.value.enabledModes.scriptGames[key] = true;
 }
};
</script>
