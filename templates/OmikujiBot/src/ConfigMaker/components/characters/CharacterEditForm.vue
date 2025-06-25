<!-- src/apps/configMaker/components/CharacterEditForm.vue -->
<template>
 <div class="card bg-base-100 shadow">
  <div class="card-body">
   <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
    <!-- 基本情報 -->
    <CharacterBasicInfo :character="character" @update="handleUpdate" />

    <!-- 色設定 -->
    <CharacterColorSettings :color="character.color" @update="handleColorUpdate" />
   </div>

   <!-- 画像設定 -->
   <CharacterImageSettings
    :images="character.image"
    @update="(updates) => (character.image = { ...character.image, ...updates })"
   />
   <!-- タグ設定 -->
   <CharacterTagManager :tags="character.tags" @update="handleTagsUpdate" />
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import type { CharacterPresetType } from '@/types/OmikujiTypesSchema';
import CharacterBasicInfo from './CharacterBasicInfo.vue';
import CharacterColorSettings from './CharacterColorSettings.vue';
import CharacterImageSettings from './CharacterImageSettings.vue';
import CharacterTagManager from './CharacterTagManager.vue';

const props = defineProps<{
 character: CharacterPresetType;
}>();

const emit = defineEmits<{
 update: [updates: Partial<CharacterPresetType>];
 delete: [];
}>();

const handleUpdate = (updates: Partial<CharacterPresetType>) => {
 emit('update', updates);
};

const handleColorUpdate = (colorUpdates: Partial<CharacterPresetType['color']>) => {
 const updatedColor = { ...props.character.color, ...colorUpdates };
 emit('update', { color: updatedColor });
};

const handleTagsUpdate = (tags: string[]) => {
 emit('update', { tags });
};
</script>
