<!-- src/configMaker/components/comments/ScriptGameEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">スクリプトゲーム設定</div>
  <div class="card-body">
   <!-- スクリプト有効化チェックボックス -->

   <SettingItem label="スクリプトゲームを使用" :showReset="false">
    <label class="label cursor-pointer justify-start gap-3">
     <input type="checkbox" v-model="isScriptEnabled" class="checkbox checkbox-primary" />
     <span class="label-text font-medium"
      >スクリプトゲームを選択することで、使用できるプレースホルダーが増えます</span
     >
    </label>
   </SettingItem>

   <!-- スクリプト選択とパラメータ設定 -->
   <div v-if="isScriptEnabled" class="space-y-4 mt-6">
    <!-- スクリプト選択 -->
    <SettingItem
     label="スクリプトゲーム"
     :description="'ゲーム結果は、おみくじ設定＞プレースホルダー一覧で出力'"
     :showReset="false"
    >
     <select v-model="scriptId" class="select select-bordered w-full">
      <option value="">スクリプトを選択してください</option>
      <option v-for="(script, scriptId) in scriptGameMap" :key="scriptId" :value="scriptId">
       {{ scriptId }}
      </option>
     </select>
    </SettingItem>

    <!-- 選択されたスクリプトの説明 -->
    <div v-if="selectedScript" class="alert alert-info">
     <span>ℹ️</span>
     <span>{{ selectedScript.description }}</span>
    </div>

    <!-- スクリプト設定パラメータ -->
    <div v-if="selectedScript?.params?.length" class="space-y-4">
     <SettingItem
      v-for="setting in selectedScript.params"
      :key="setting.id"
      :label="setting.name"
      :description="setting.description"
      @reset="resetParam(setting.id, setting.defaultValue)"
     >
      <!-- 文字列入力 -->
      <input
       v-if="setting.inputType === 'string'"
       type="text"
       v-model="scriptParams[setting.id]"
       class="input input-bordered w-full"
       :placeholder="setting.description || ''"
      />

      <!-- 数値入力 -->
      <input
       v-else-if="setting.inputType === 'number'"
       type="number"
       v-model.number="scriptParams[setting.id]"
       :min="setting.min"
       :max="setting.max"
       class="input input-bordered w-full"
      />

      <!-- セレクト -->
      <select
       v-else-if="setting.inputType === 'select'"
       v-model="scriptParams[setting.id]"
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
         v-model="scriptParams[setting.id]"
         class="checkbox checkbox-primary"
        />
        <span class="label-text">有効</span>
       </label>
      </div>
     </SettingItem>
    </div>
    <div v-else>設定可能なパラメータがありません</div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CommentRuleType, ScriptPreset, createScriptParamsSchema } from '@type/';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';

const props = defineProps<{
 modelValue: CommentRuleType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CommentRuleType];
}>();

// スクリプト有効化フラグ
const isScriptEnabled = computed({
 get: () => props.modelValue.scriptId !== null,
 set: (enabled: boolean) => {
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
 }
});

// スクリプトID
const scriptId = computed({
 get: () => props.modelValue.scriptId || '',
 set: (newScriptId: string) => {
  const finalScriptId = newScriptId === '' ? null : newScriptId;
  let defaultParams = {};

  if (finalScriptId) {
   const schema = createScriptParamsSchema(finalScriptId);
   defaultParams = schema.parse({});
  }

  emit('update:modelValue', {
   ...props.modelValue,
   scriptId: finalScriptId,
   scriptParams: defaultParams
  });
 }
});

// 選択されたスクリプト
const selectedScript = computed((): ScriptPreset | null => {
 if (!props.modelValue.scriptId) return null;
 return scriptGameMap[props.modelValue.scriptId] || null;
});

// スクリプトパラメータの双方向バインディング
const scriptParams = computed({
 get: () => props.modelValue.scriptParams || {},
 set: (newParams: Record<string, any>) => {
  emit('update:modelValue', {
   ...props.modelValue,
   scriptParams: newParams
  });
 }
});

// パラメータリセット
const resetParam = (paramId: string, defaultValue: any) => {
 const currentParams = { ...scriptParams.value };
 currentParams[paramId] = defaultValue;
 scriptParams.value = currentParams;
};
</script>
