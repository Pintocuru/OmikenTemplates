<!-- src/configMaker/components/comments/BaseSettingsEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <!-- ヘッダー -->
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex items-center justify-between">
   <div class="flex items-center gap-2">
    <!-- カラーピッカー -->
    <ColorPicker v-model="editorColor" />
    <span>基本設定</span>
   </div>
   <label class="cursor-pointer flex items-center gap-2">
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
    <span class="text-sm">ルールを有効にする</span>
   </label>
  </div>

  <!-- ボディ -->
  <div class="grid grid-cols-1 sm:grid-cols-1 gap-4 p-4">
   <SettingItem
    label="ルール名"
    description="識別しやすい名前"
    :showReset="false"
    containerClass="form-control"
   >
    <input type="text" v-model="name" class="input input-bordered w-full" />
   </SettingItem>

   <SettingItem
    label="説明"
    description="ルールの紹介文"
    :showReset="false"
    containerClass="form-control"
   >
    <input type="text" v-model="description" class="input input-bordered w-full" />
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RuleType } from '@type/';
import ColorPicker from '@ConfigComponents/parts/ColorPicker.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';

const props = defineProps<{
 modelValue: RuleType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: RuleType];
}>();

// 各プロパティのcomputed getter/setter
const createComputed = <T extends keyof RuleType>(key: T) =>
 computed({
  get: () => props.modelValue[key],
  set: (value) => emit('update:modelValue', { ...props.modelValue, [key]: value })
 });

const name = createComputed('name');
const description = createComputed('description');
const isEnabled = createComputed('isEnabled');
const editorColor = createComputed('editorColor');
</script>
