<!-- src/configMaker/components/scriptSettings/ScriptSettingsEditor.vue -->
<template>
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
      <div v-if="!hasSettings(scriptPreset)" class="text-gray-500 italic">
       このスクリプトには設定可能な項目がありません
      </div>

      <div v-else class="space-y-3">
       <SettingItem
        v-for="settingDef in scriptPreset.settings"
        :key="settingDef.id"
        :label="settingDef.name"
        :description="settingDef.description"
        @reset="resetScriptSetting(scriptId as string, settingDef.id as string)"
       >
        <component
         :is="getInputComponent(settingDef.inputType)"
         v-bind="getInputProps(scriptId as string, settingDef)"
         @input="handleInput(scriptId as string, settingDef.id as string, $event)"
         @change="handleChange(scriptId as string, settingDef.id as string, $event)"
        />
       </SettingItem>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>

 <div v-else class="text-center py-8 text-gray-500">
  <Settings class="w-12 h-12 mx-auto mb-2 opacity-50" />
  <p>利用可能なスクリプトがありません</p>
 </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { ParameterInputType, ScriptPreset } from '@type/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import { useScriptSettingsStore } from '@ConfigScript/useScriptSettingsStore';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { Settings } from 'lucide-vue-next';

const scriptSettingsStore = useScriptSettingsStore();
const omikujiStore = useOmikujiStore();

const scriptSettings = computed(() => omikujiStore.data.scriptSettings);
const hasScripts = computed(() => Object.keys(scriptGameMap).length !== 0);

const hasSettings = (scriptPreset: ScriptPreset) => {
 return scriptPreset.settings && scriptPreset.settings.length > 0;
};

const getCurrentSettingValue = (scriptId: string, settingId: string) => {
 const currentSettings = scriptSettings.value[scriptId];
 return currentSettings ? currentSettings[settingId] : undefined;
};

const getInputComponent = (inputType: ParameterInputType) => {
 const components = {
  string: 'input',
  number: 'input',
  boolean: 'input',
  select: 'select'
 };
 return components[inputType] || 'input';
};

const getInputProps = (scriptId: string, settingDef: any) => {
 const baseProps = {
  value: getCurrentSettingValue(scriptId, settingDef.id),
  class: getInputClass(settingDef.inputType)
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
   return {
    type: 'checkbox',
    class: 'checkbox',
    checked: getCurrentSettingValue(scriptId, settingDef.id)
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

const updateScriptSetting = (scriptId: string, settingId: string, value: any) => {
 const currentSettings = { ...(scriptSettings.value[scriptId] || {}) };
 currentSettings[settingId] = value;
 scriptSettingsStore.updateItemInCategory('scriptSettings', scriptId, currentSettings);
};

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
  const actualSettings = scriptPreset?.settings;

  if (!Array.isArray(actualSettings) || actualSettings.length === 0) {
   continue;
  }

  const validSettingIds = new Set(actualSettings.map((s) => s.id));

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

onMounted(() => {
 cleanupScriptSettings();
});
</script>

<style scoped>
/* スタイルはそのまま */
</style>
