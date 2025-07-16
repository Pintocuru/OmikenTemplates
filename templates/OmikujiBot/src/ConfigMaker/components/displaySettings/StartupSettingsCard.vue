<!-- src/ConfigMaker/components/display/StartupSettingsCard.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">起動時設定</div>
  <div class="card-body space-y-4">
   <!-- モード選択 -->
   <SettingItem
    label="モード"
    description="アプリケーション起動時のデフォルトモード"
    @reset="resetDefaultModeType"
   >
    <select
     v-model="displaySettings.defaultMode.type"
     class="select select-bordered w-full max-w-xs"
    >
     <option v-for="mode in displayModeOptions" :key="mode" :value="mode">
      {{ displayModeLabels[mode] }}
     </option>
    </select>
   </SettingItem>

   <!-- スクリプトキー（スクリプトゲーム選択時のみ） -->
   <SettingItem
    v-if="displaySettings.defaultMode.type === 'scriptGame'"
    label="スクリプトゲームの表示"
    description="どのスクリプトゲームを表示するか"
    @reset="resetDefaultModeScriptKey"
   >
    <select
     v-model="displaySettings.defaultMode.scriptKey"
     class="select select-bordered w-full max-w-xs"
    >
     <option v-for="(value, key) in scriptGameMap" :key="key" :value="key">
      {{ value.name }}({{ key }})
     </option>
    </select>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { displayMode, displayModeLabels, DisplaySettingsSchema, DisplayMode } from '@type/';
import SettingItem from './SettingItem.vue';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定の参照
const displaySettings = computed(() => data.value.displaySettings);

// 選択肢の定義
const displayModeOptions: DisplayMode[] = [...displayMode];

// リセット機能（スキーマのデフォルト値を使用）
const resetDefaultModeType = () => {
 const defaultMode = DisplaySettingsSchema.shape.defaultMode.parse(undefined);
 displaySettings.value.defaultMode.type = defaultMode.type;
};

const resetDefaultModeScriptKey = () => {
 const defaultMode = DisplaySettingsSchema.shape.defaultMode.parse(undefined);
 displaySettings.value.defaultMode.scriptKey = defaultMode.scriptKey;
};
</script>
