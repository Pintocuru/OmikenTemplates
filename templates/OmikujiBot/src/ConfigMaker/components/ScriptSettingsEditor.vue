<!-- src/apps/configMaker/components/ScriptSettingsEditor.vue -->
<template>
 <div>
  <div class="flex justify-between items-center mb-4">
   <h3 class="text-lg font-semibold">スクリプト設定</h3>
  </div>

  <!-- スクリプト設定がない場合 -->
  <div v-if="Object.keys(scriptGameMap).length === 0" class="text-center py-8 text-gray-500">
   <Settings class="w-12 h-12 mx-auto mb-2 opacity-50" />
   <p>利用可能なスクリプトがありません</p>
  </div>

  <!-- スクリプト設定リスト -->
  <div v-else class="space-y-4">
   <div
    v-for="(scriptPreset, scriptId) in scriptGameMap"
    :key="scriptId"
    class="card bg-base-100 shadow"
   >
    <div class="card-body">
     <div class="flex justify-between items-start">
      <div class="flex-1">
       <h4 class="font-semibold text-lg mb-2">{{ scriptPreset.name }}</h4>
       <p class="text-sm text-gray-600 mb-4">{{ scriptPreset.description }}</p>

       <!-- 設定項目がない場合 -->
       <div
        v-if="!scriptPreset.settings || scriptPreset.settings.length === 0"
        class="text-gray-500 italic"
       >
        このスクリプトには設定可能な項目がありません
       </div>

       <!-- 設定項目 -->
       <div v-else class="space-y-3">
        <div
         v-for="settingDef in scriptPreset.settings"
         :key="settingDef.id"
         class="flex items-center gap-3"
        >
         <div class="flex flex-col min-w-32">
          <label class="label-text font-medium">{{ settingDef.name }}</label>
          <span v-if="settingDef.description" class="text-xs text-gray-500">{{
           settingDef.description
          }}</span>
         </div>

         <!-- 文字列入力 -->
         <input
          v-if="settingDef.inputType === 'string'"
          :value="getCurrentSettingValue(scriptId, settingDef.id, settingDef.defaultValue)"
          type="text"
          class="input input-bordered input-sm flex-1"
          :placeholder="getSettingPlaceholder(settingDef.defaultValue) || ''"
          @input="
           (e) => updateScriptSetting(scriptId, settingDef.id, (e.target as HTMLInputElement).value)
          "
         />

         <!-- 数値入力 -->
         <input
          v-else-if="settingDef.inputType === 'number'"
          :value="getCurrentSettingValue(scriptId, settingDef.id, settingDef.defaultValue)"
          type="number"
          class="input input-bordered input-sm flex-1"
          :placeholder="getSettingPlaceholder(settingDef.defaultValue) || '0'"
          :min="settingDef.min"
          :max="settingDef.max"
          @input="
           (e) =>
            updateScriptSetting(
             scriptId,
             settingDef.id,
             parseFloat((e.target as HTMLInputElement).value) || 0
            )
          "
         />

         <!-- 真偽値入力 -->
         <input
          v-else-if="settingDef.inputType === 'boolean'"
          :checked="getCurrentSettingValue(scriptId, settingDef.id, settingDef.defaultValue)"
          type="checkbox"
          class="checkbox"
          @change="
           (e) =>
            updateScriptSetting(scriptId, settingDef.id, (e.target as HTMLInputElement).checked)
          "
         />

         <!-- 選択肢入力 -->
         <select
          v-else-if="settingDef.inputType === 'select' && settingDef.values"
          :value="getCurrentSettingValue(scriptId, settingDef.id, settingDef.defaultValue)"
          class="select select-bordered select-sm flex-1"
          @change="
           (e) =>
            updateScriptSetting(scriptId, settingDef.id, (e.target as HTMLSelectElement).value)
          "
         >
          <option v-for="(option, index) in settingDef.values" :key="index" :value="option">
           {{ option }}
          </option>
         </select>

         <!-- その他の型（文字列として扱う） -->
         <input
          v-else
          :value="getCurrentSettingValue(scriptId, settingDef.id, settingDef.defaultValue)"
          type="text"
          class="input input-bordered input-sm flex-1"
          :placeholder="getSettingPlaceholder(settingDef.defaultValue) || ''"
          @input="
           (e) => updateScriptSetting(scriptId, settingDef.id, (e.target as HTMLInputElement).value)
          "
         />

         <!-- リセットボタン -->
         <button
          class="btn btn-ghost btn-xs"
          @click="resetScriptSetting(scriptId, settingDef.id)"
          title="デフォルト値に戻す"
         >
          <RotateCcw class="w-3 h-3" />
         </button>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';
import { useScriptSettingsStore } from '@/ConfigMaker/script/useScriptSettingsStore';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { Settings, RotateCcw } from 'lucide-vue-next';

// store
const scriptSettingsStore = useScriptSettingsStore();
const omikujiStore = useOmikujiStore();

const scriptSettings = computed(() => omikujiStore.data.scriptSettings);

// 現在の設定値を取得（デフォルト値を考慮）
const getCurrentSettingValue = (scriptId: string, settingId: string, defaultValue: any) => {
 const currentSettings = scriptSettings.value[scriptId];
 if (currentSettings && settingId in currentSettings) {
  return currentSettings[settingId];
 }
 return defaultValue;
};

// 設定値を更新
const updateScriptSetting = (scriptId: string, settingId: string, value: any) => {
 const currentSettings = { ...(scriptSettings.value[scriptId] || {}) };
 currentSettings[settingId] = value;
 scriptSettingsStore.updateItemInCategory('scriptSettings', scriptId, currentSettings);
};

const getSettingPlaceholder = (settingDef: any) => {
 if (settingDef.defaultValue == null) return '';
 if (typeof settingDef.defaultValue === 'string') return settingDef.defaultValue;
 if (typeof settingDef.defaultValue === 'number') return settingDef.defaultValue.toString();
 if (typeof settingDef.defaultValue === 'boolean') return settingDef.defaultValue.toString();
 return String(settingDef.defaultValue);
};

// 設定値をデフォルトに戻す
const resetScriptSetting = (scriptId: string, settingId: string) => {
 const scriptPreset = scriptGameMap[scriptId];
 if (!scriptPreset || !scriptPreset.settings) return;

 const settingDef = scriptPreset.settings.find((s) => s.id === settingId);
 if (!settingDef) return;

 if (confirm(`設定「${settingDef.name}」をデフォルト値に戻しますか？`)) {
  const currentSettings = { ...(scriptSettings.value[scriptId] || {}) };
  if (settingDef.defaultValue !== undefined) {
   currentSettings[settingId] = settingDef.defaultValue;
  } else {
   delete currentSettings[settingId];
  }
  scriptSettingsStore.updateItemInCategory('scriptSettings', scriptId, currentSettings);
 }
};

// scriptSettingsから不要な項目を削除（scriptGameMapにないもの）
const cleanupScriptSettings = () => {
 const currentScriptSettings = { ...scriptSettings.value };
 let hasChanges = false;

 // scriptGameMapにないスクリプトIDを削除
 for (const scriptId in currentScriptSettings) {
  if (!(scriptId in scriptGameMap)) {
   delete currentScriptSettings[scriptId];
   hasChanges = true;
   continue;
  }

  // scriptGameMapにない設定項目を削除
  const scriptPreset = scriptGameMap[scriptId];
  const validSettingIds = new Set(scriptPreset.settings?.map((s) => s.id) || []);

  for (const settingId in currentScriptSettings[scriptId]) {
   if (!validSettingIds.has(settingId)) {
    delete currentScriptSettings[scriptId][settingId];
    hasChanges = true;
   }
  }
 }

 if (hasChanges) {
  // 一括でstoreを更新
  omikujiStore.data.scriptSettings = currentScriptSettings;
 }
};

// コンポーネント初期化時にクリーンアップを実行
cleanupScriptSettings();
</script>
