<!-- src/configMaker/components/characters/CharacterBasicInfo.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">基本情報</div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
   <!-- ID表示 -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">ID</span>
    </label>
    <div class="flex gap-2 items-center">
     <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 break-all">
      {{ localCharacter.id }}
     </div>
     <!-- 編集ボタン -->
     <PlaceholderIdEditor :currentId="localCharacter.id" mode="character" />
    </div>
   </div>

   <!-- id以外のテキストフィールドループ -->
   <div v-for="field in fields" :key="field.key" class="form-control">
    <label class="label-text">{{ field.label }}</label>
    <input type="text" class="input input-bordered w-full" v-model="localCharacter[field.key]" />
   </div>
  </div>
  <div class="grid grid-cols-1 gap-4 p-4">
   <!-- チェックボックス -->
   <div class="form-control flex-row items-center gap-2 mt-2">
    <input type="checkbox" class="checkbox" v-model="localCharacter.isIconDisplay" />
    <label class="label-text text-base pl-3"
     >アイコン表示を表示する(OFFの場合、アイコンの画像設定ができません)</label
    >
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterType } from '@type/';
import PlaceholderIdEditor from '@/ConfigMaker/components/placeholders/PlaceholderIdEditor.vue';

const props = defineProps<{
 modelValue: CharacterType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CharacterType];
}>();

// 共通フィールド定義
const fields = [
 { key: 'name', label: '設定名' },
 { key: 'description', label: '説明' },
 { key: 'displayName', label: 'ジェネレーターでの表示名' },
 { key: 'author', label: '作者' },
 { key: 'url', label: 'Webサイト' }
] as const;

// v-modelを使用したlocalCharacterの実装
const localCharacter = computed({
 get: () => props.modelValue,
 set: (value: CharacterType) => {
  emit('update:modelValue', value);
 }
});
</script>
