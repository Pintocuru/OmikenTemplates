<!-- src/apps/configMaker/components/CharacterBasicInfo.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">基本情報</div>
  <div class="flex flex-wrap gap-4 p-4">
   <!-- ID -->
   <!-- TODO:IDの編集は PlaceholderIdEditor で行う -->
   <div class="form-control">
    <label class="label-text">ID</label>
    <input
     type="text"
     class="input input-bordered w-full"
     :value="character.id"
     @input="onInput($event, 'id')"
    />
   </div>

   <!-- 名前 -->
   <div class="form-control">
    <label class="label-text">名前</label>
    <input
     type="text"
     class="input input-bordered w-full"
     :value="character.name"
     @input="onInput($event, 'name')"
    />
   </div>

   <!-- 説明 -->
   <div class="form-control">
    <label class="label-text">説明</label>
    <input
     type="text"
     class="input input-bordered w-full"
     :value="character.description"
     @input="onInput($event, 'description')"
    />
   </div>

   <!-- 表示名 -->
   <div class="form-control">
    <label class="label-text">表示名</label>
    <input
     type="text"
     class="input input-bordered w-full"
     :value="character.displayName"
     @input="onInput($event, 'displayName')"
    />
   </div>

   <!-- 作者 -->
   <div class="form-control">
    <label class="label-text">作者</label>
    <input
     type="text"
     class="input input-bordered w-full"
     :value="character.author"
     @input="onInput($event, 'author')"
    />
   </div>

   <!-- アイコン表示 -->
   <div class="flex items-center gap-2">
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

function onInput(event: Event, key: keyof CharacterPresetType) {
 const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
 if (target) {
  emit('update', { [key]: target.value });
 }
}

function onNumberInput(event: Event) {
 const target = event.target as HTMLInputElement | null;
 if (target) {
  const value = parseInt(target.value);
  emit('update', { order: isNaN(value) ? 0 : value });
 }
}

function onCheckboxChange(event: Event) {
 const target = event.target as HTMLInputElement | null;
 if (target) {
  emit('update', { isIconDisplay: target.checked });
 }
}
</script>
