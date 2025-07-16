<!-- src/configMaker/components/scriptSettings/ScriptSettingsEditor.vue -->
<template>
 <!-- スクリプト設定リスト -->
 <div v-if="hasScripts">
  <div
   v-for="(scriptPreset, scriptId) in scriptGameMap"
   :key="scriptId"
   class="card bg-base-300 mt-4"
  >
   <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
    {{ scriptPreset.name }} <span class="text-base">(id:{{ scriptPreset.id }})</span>
    <span class="ml-2 cursor-help" :title="scriptPreset.description"> ℹ️ </span>
   </div>

   <div class="card-body">
    <div class="flex justify-between items-start">
     <div class="flex-1">
      <!-- 設定項目がない場合 -->
      <div v-if="!hasSettings(scriptPreset)" class="text-gray-500 italic">
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
         <span v-if="settingDef.description" class="text-xs text-gray-500">
          {{ settingDef.description }}
         </span>
        </div>

        <!-- 動的入力コンポーネント -->
        <component
         :is="getInputComponent(settingDef.inputType)"
         v-bind="getInputProps(scriptId, settingDef)"
         @input="handleInput(scriptId, settingDef.id, $event)"
         @change="handleChange(scriptId, settingDef.id, $event)"
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

 <!-- スクリプト設定がない場合 -->
 <div v-else class="text-center py-8 text-gray-500">
  <Settings class="w-12 h-12 mx-auto mb-2 opacity-50" />
  <p>利用可能なスクリプトがありません</p>
 </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { ParameterInputType, ScriptPreset } from '@type/';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';
import { useScriptSettingsStore } from '@/ConfigMaker/script/useScriptSettingsStore';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { Settings, RotateCcw } from 'lucide-vue-next';

// Store
const scriptSettingsStore = useScriptSettingsStore();
const omikujiStore = useOmikujiStore();

const scriptSettings = computed(() => omikujiStore.data.scriptSettings);
const hasScripts = computed(() => Object.keys(scriptGameMap).length !== 0);

// ヘルパー関数
const hasSettings = (scriptPreset: ScriptPreset) => {
 return scriptPreset.settings && scriptPreset.settings.length > 0;
};

const getCurrentSettingValue = (scriptId: string, settingId: string, defaultValue: any) => {
 const currentSettings = scriptSettings.value[scriptId];
 return currentSettings && settingId in currentSettings ? currentSettings[settingId] : defaultValue;
};

const getSettingPlaceholder = (defaultValue: any) => {
 if (defaultValue == null) return '';
 return String(defaultValue);
};

// 入力コンポーネントの動的選択
const getInputComponent = (inputType: ParameterInputType) => {
 const components = {
  string: 'input',
  number: 'input',
  boolean: 'input',
  select: 'select'
 };
 return components[inputType] || 'input';
};

// 入力プロパティの生成
const getInputProps = (scriptId: string, settingDef: any) => {
 const baseProps = {
  value: getCurrentSettingValue(scriptId, settingDef.id, settingDef.defaultValue),
  class: getInputClass(settingDef.inputType),
  placeholder: getSettingPlaceholder(settingDef.defaultValue)
 };
 switch (settingDef.inputType) {
  case 'string':
   return { ...baseProps, type: 'text' };

  case 'number':
   return {
    ...baseProps,
    type: 'number',
    min: settingDef.min,
    max: settingDef.max
   };

  case 'boolean':
   console.log(settingDef.defaultValue);
   return {
    type: 'checkbox',
    class: 'checkbox',
    checked: getCurrentSettingValue(scriptId, settingDef.id, settingDef.defaultValue)
   };

  case 'select':
   return {
    ...baseProps,
    class: 'select select-bordered select-sm flex-1'
   };

  default:
   return { ...baseProps, type: 'text' };
 }
};

const getInputClass = (inputType: string) => {
 return inputType === 'boolean' ? 'checkbox' : 'input input-bordered input-sm flex-1';
};

// イベントハンドラー
const handleInput = (scriptId: string, settingId: string, event: Event) => {
 const target = event.target as HTMLInputElement;
 let value;

 if (target.type === 'checkbox') {
  value = target.checked;
 } else if (target.type === 'number') {
  value = parseFloat(target.value) || 0;
 } else {
  value = target.value;
 }

 updateScriptSetting(scriptId, settingId, value);
};

const handleChange = (scriptId: string, settingId: string, event: Event) => {
 const target = event.target as HTMLInputElement | HTMLSelectElement;
 let value;

 if (target.type === 'checkbox') {
  value = (target as HTMLInputElement).checked;
 } else {
  value = target.value;
 }

 updateScriptSetting(scriptId, settingId, value);
};

const handleBooleanChange = (scriptId: string, settingId: string, event: Event) => {
 const target = event.target as HTMLInputElement;
 updateScriptSetting(scriptId, settingId, target.checked);
};

// 設定値の更新
const updateScriptSetting = (scriptId: string, settingId: string, value: any) => {
 const currentSettings = { ...(scriptSettings.value[scriptId] || {}) };
 currentSettings[settingId] = value;
 scriptSettingsStore.updateItemInCategory('scriptSettings', scriptId, currentSettings);
};

// 設定値をデフォルトに戻す（ダイアログ不要に変更）
const resetScriptSetting = (scriptId: string, settingId: string) => {
 const scriptPreset = scriptGameMap[scriptId];
 if (!scriptPreset || !scriptPreset.settings) return;

 const settingDef = scriptPreset.settings.find((s) => s.id === settingId);
 if (!settingDef) return;

 const currentSettings = { ...(scriptSettings.value[scriptId] || {}) };
 if (settingDef.defaultValue !== undefined) {
  currentSettings[settingId] = settingDef.defaultValue;
 } else {
  delete currentSettings[settingId];
 }
 scriptSettingsStore.updateItemInCategory('scriptSettings', scriptId, currentSettings);
};

// scriptSettingsから不要な項目を削除
const cleanupScriptSettings = () => {
 const currentScriptSettings = { ...scriptSettings.value };
 let hasChanges = false;

 for (const scriptId in currentScriptSettings) {
  if (!(scriptId in scriptGameMap)) {
   delete currentScriptSettings[scriptId];
   hasChanges = true;
   continue;
  }

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
  omikujiStore.data.scriptSettings = currentScriptSettings;
 }
};

// 初期化時にクリーンアップを実行
cleanupScriptSettings();
</script>
