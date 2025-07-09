<!-- src/configMaker/components/ExternalScriptEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">外部スクリプト設定</div>
  <div class="card-body">
   <!-- スクリプト有効化チェックボックス -->
   <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
     <input
      type="checkbox"
      :checked="isScriptEnabled"
      @change="toggleScript"
      class="checkbox checkbox-primary"
     />
     <span class="label-text font-medium">外部スクリプトを使用する</span>
    </label>
   </div>

   <!-- スクリプト選択とパラメータ設定 -->
   <div v-if="isScriptEnabled" class="space-y-4 mt-6">
    <!-- スクリプト選択 -->
    <div class="form-control w-full">
     <label class="label">
      <span class="label-text font-medium">スクリプトID</span>
     </label>
     <select
      :value="modelValue.scriptId || ''"
      @change="updateScriptId"
      class="select select-bordered w-full"
     >
      <option value="">スクリプトを選択してください</option>
      <option v-for="(script, scriptId) in scriptGameMap" :key="scriptId" :value="scriptId">
       {{ scriptId }}
      </option>
     </select>
    </div>

    <!-- 選択されたスクリプトの説明 -->
    <div v-if="selectedScript" class="alert alert-info">
     <span>ℹ️</span>
     <span>{{ selectedScript.description }}</span>
    </div>

    <!-- スクリプト設定パラメータ -->
    <div v-if="selectedScript?.params?.length" class="space-y-4">
     <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
      <div v-for="setting in selectedScript.params" :key="setting.id" class="form-control w-full">
       <label class="label">
        <span class="label-text font-medium">{{ setting.name }}</span>
        <span v-if="setting.description" class="label-text-alt">{{ setting.description }}</span>
       </label>

       <!-- 文字列入力 -->
       <input
        v-if="setting.inputType === 'string'"
        type="text"
        :value="getParamValue(setting.id, setting.defaultValue)"
        @input="updateParam(setting.id, ($event.target as HTMLInputElement).value)"
        class="input input-bordered w-full"
        :placeholder="setting.description || ''"
       />

       <!-- 数値入力 -->
       <input
        v-else-if="setting.inputType === 'number'"
        type="number"
        :value="getParamValue(setting.id, setting.defaultValue)"
        @input="updateParam(setting.id, Number(($event.target as HTMLInputElement).value))"
        :min="setting.min"
        :max="setting.max"
        class="input input-bordered w-full"
       />

       <!-- セレクト -->
       <select
        v-else-if="setting.inputType === 'select'"
        :value="getParamValue(setting.id, setting.defaultValue)"
        @change="updateParam(setting.id, ($event.target as HTMLSelectElement).value)"
        class="select select-bordered w-full"
       >
        <option v-for="(option, index) in setting.values" :key="index" :value="option">
         {{ option }}
        </option>
       </select>

       <!-- ブール値（チェックボックス） -->
       <div v-else-if="setting.inputType === 'boolean'" class="form-control">
        <label class="label cursor-pointer justify-start gap-3">
         <input
          type="checkbox"
          :checked="getParamValue(setting.id, setting.defaultValue)"
          @change="updateParam(setting.id, ($event.target as HTMLInputElement).checked)"
          class="checkbox checkbox-primary"
         />
         <span class="label-text">有効</span>
        </label>
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
import type { CommentRuleType } from '@/types/OmikujiTypesSchema';
import type { ParameterItem, ScriptPreset } from '@/types/PresetTypes';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';

const props = defineProps<{
 modelValue: CommentRuleType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CommentRuleType];
}>();

// 外部スクリプトが有効かどうか
const isScriptEnabled = computed(() => props.modelValue.scriptId !== null);

// 選択されたスクリプトの取得
const selectedScript = computed((): ScriptPreset | null => {
 if (!props.modelValue.scriptId) return null;
 return scriptGameMap[props.modelValue.scriptId] || null;
});

// スクリプト設定パラメータの取得（型安全）
const scriptParams = computed(() => props.modelValue.scriptParams || {});

// 外部スクリプトの有効/無効を切り替え
const toggleScript = (event: Event) => {
 const target = event.target as HTMLInputElement;
 const enabled = target.checked;

 if (enabled) {
  emit('update:modelValue', {
   ...props.modelValue,
   scriptId: '',
   scriptParams: {}
  });
 } else {
  emit('update:modelValue', {
   ...props.modelValue,
   scriptId: null,
   scriptParams: null
  });
 }
};

// スクリプトIDを更新
const updateScriptId = (event: Event) => {
 const target = event.target as HTMLSelectElement;
 const scriptId = target.value || null;

 let defaultScriptParams: Record<string, any> = {};

 // 選択されたスクリプトのデフォルト値を設定
 if (scriptId && scriptGameMap[scriptId]) {
  const script = scriptGameMap[scriptId];

  if (script.params?.length) {
   script.params.forEach((param: ParameterItem) => {
    defaultScriptParams[param.id] = param.defaultValue;
   });
  }
 }

 emit('update:modelValue', {
  ...props.modelValue,
  scriptId,
  scriptParams: defaultScriptParams // ← こちらを送信する
 });
};

// 設定パラメータの値を取得
const getParamValue = (key: string, defaultValue: any) => {
 return scriptParams.value[key] !== undefined ? scriptParams.value[key] : defaultValue;
};

// 設定パラメータを更新
const updateParam = (key: string, value: any) => {
 const currentParams = props.modelValue.scriptParams || {};

 emit('update:modelValue', {
  ...props.modelValue,
  scriptParams: {
   ...currentParams,
   [key]: value
  }
 });
};
</script>
