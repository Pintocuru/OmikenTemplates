<!-- src/apps/configMaker/components/CharacterBasicInfo.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">基本情報</div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
   <!-- テキストフィールドループ -->
   <div v-for="field in fields" :key="field.key" class="form-control">
    <label class="label-text">{{ field.label }}</label>
    <input
     type="text"
     class="input input-bordered w-full"
     :value="character[field.key]"
     @input="onInput($event, field.key)"
    />
   </div>

   <!-- チェックボックス -->
   <div class="form-control flex-row items-center gap-2 mt-2">
    <input
     type="checkbox"
     class="checkbox"
     :checked="character.isIconDisplay"
     @change="onCheckboxChange"
    />
    <label class="label-text">アイコン表示</label>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import type { CharacterPresetType } from '@/types/OmikujiTypesSchema';

const props = defineProps<{
 character: CharacterPresetType;
}>();

const emit = defineEmits<{
 update: [updates: Partial<CharacterPresetType>];
}>();

// 共通フィールド定義
const fields = [
 { key: 'id', label: 'ID' },
 { key: 'name', label: '設定名' },
 { key: 'description', label: '説明' },
 { key: 'displayName', label: 'ジェネレーターでの表示名' },
 { key: 'author', label: '作者' },
 { key: 'url', label: 'Webサイト' }
] as const;

function onInput(event: Event, key: keyof CharacterPresetType) {
 const target = event.target as HTMLInputElement;
 if (target) {
  emit('update', { [key]: target.value });
 }
}

function onCheckboxChange(event: Event) {
 const target = event.target as HTMLInputElement;
 if (target) {
  emit('update', { isIconDisplay: target.checked });
 }
}
</script>
