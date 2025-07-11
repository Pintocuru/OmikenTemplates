<!-- src/configMaker/components/comments/ExternalScriptEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">外部スクリプト設定</div>
  <div class="card-body">
   <!-- スクリプト有効化チェックボックス -->
   <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
     <input type="checkbox" v-model="isScriptEnabled" class="checkbox checkbox-primary" />
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
     <select v-model="scriptId" class="select select-bordered w-full">
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
        v-model="getDynamicParamComputed(setting.id, setting.defaultValue).value"
        class="input input-bordered w-full"
        :placeholder="setting.description || ''"
       />

       <!-- 数値入力 -->
       <input
        v-else-if="setting.inputType === 'number'"
        type="number"
        v-model.number="getDynamicParamComputed(setting.id, setting.defaultValue).value"
        :min="setting.min"
        :max="setting.max"
        class="input input-bordered w-full"
       />

       <!-- セレクト -->
       <select
        v-else-if="setting.inputType === 'select'"
        v-model="getDynamicParamComputed(setting.id, setting.defaultValue).value"
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
          v-model="getDynamicParamComputed(setting.id, setting.defaultValue).value"
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

// `isScriptEnabled` を v-model で制御するために、scriptId を null/空文字列で切り替える
const isScriptEnabled = computed({
 get: () => props.modelValue.scriptId !== null,
 set: (enabled: boolean) => {
  if (enabled) {
   // 有効にする場合、scriptId を空文字列に（未選択状態）し、scriptParams を空オブジェクトに
   emit('update:modelValue', {
    ...props.modelValue,
    scriptId: '', // 空文字列で初期化
    scriptParams: {}
   });
  } else {
   // 無効にする場合、scriptId を null にし、scriptParams も null に
   emit('update:modelValue', {
    ...props.modelValue,
    scriptId: null,
    scriptParams: null
   });
  }
 }
});

// `scriptId` を v-model で制御
const scriptId = computed({
 get: () => props.modelValue.scriptId || '', // null の場合は空文字列を返す
 set: (newScriptId: string) => {
  let finalScriptId: string | null = newScriptId === '' ? null : newScriptId;
  let defaultScriptParams: Record<string, any> = {};

  // 選択されたスクリプトのデフォルト値を設定
  if (finalScriptId && scriptGameMap[finalScriptId]) {
   const script = scriptGameMap[finalScriptId];
   if (script.params?.length) {
    script.params.forEach((param: ParameterItem) => {
     defaultScriptParams[param.id] = param.defaultValue;
    });
   }
  }

  emit('update:modelValue', {
   ...props.modelValue,
   scriptId: finalScriptId,
   scriptParams: defaultScriptParams
  });
 }
});

// 選択されたスクリプトの取得
const selectedScript = computed((): ScriptPreset | null => {
 if (!props.modelValue.scriptId) return null;
 return scriptGameMap[props.modelValue.scriptId] || null;
});

// 動的な scriptParams の各項目を v-model でバインドするためのヘルパー
// `getDynamicParamComputed` は、個々のパラメータIDとデフォルト値を受け取り、
// それに対応する書き込み可能な computed Ref を返します。
const getDynamicParamComputed = (paramId: string, defaultValue: any) => {
 return computed<any>({
  // `any` は一時的な型ですが、必要に応じてより厳密な型を定義できます
  get: () => {
   // modelValue.scriptParams が null の可能性があるのでチェック
   return props.modelValue.scriptParams?.[paramId] !== undefined
    ? props.modelValue.scriptParams[paramId]
    : defaultValue;
  },
  set: (value) => {
   // scriptParams が null の場合は空オブジェクトで初期化
   const currentParams = props.modelValue.scriptParams || {};
   emit('update:modelValue', {
    ...props.modelValue,
    scriptParams: {
     ...currentParams,
     [paramId]: value
    }
   });
  }
 });
};
</script>
