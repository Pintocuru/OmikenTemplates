<!-- src/configMaker/components/PostActionsPreview.vue -->
<template>
 <div class="bg-base-200 rounded p-3 text-sm">
  <div v-if="actions.length === 0" class="text-gray-500 italic">
   Post Actions が設定されていません
  </div>
  <div v-else class="space-y-2">
   <div v-for="(action, index) in actions" :key="index">
    <div class="flex items-center gap-2 mb-1">
     <span class="w-4 text-center text-sm text-gray-500 font-medium">{{ index + 1 }}</span>
     <div class="flex flex-wrap gap-1 text-xs">
      <span v-if="action.characterKey" class="badge badge-sm"
       >👤 {{ getCharacterLabel(action.characterKey) }}</span
      >
      <span v-if="action.iconKey" class="badge badge-sm"
       >🎨 {{ getIconLabel(action.iconKey) }}</span
      >
      <span class="badge badge-sm badge-secondary"> ⏱️ {{ action.delaySeconds }}s </span>
     </div>
    </div>
    <div
     v-if="action.messageContent || action.wordParty || action.messageToast"
     class="ml-6 space-y-1"
    >
     <div v-if="action.messageContent" class="text-sm">
      <span class="text-info font-medium">💬 Message:</span>
      <span class="ml-1">{{ action.messageContent }}</span>
     </div>
     <div v-if="action.wordParty" class="text-sm">
      <span class="text-accent font-medium">🎉 Party:</span>
      <span class="ml-1">{{ action.wordParty }}</span>
     </div>
     <div v-if="action.messageToast" class="text-sm">
      <span class="text-warning font-medium">🍞 Toast:</span>
      <span class="ml-1">{{ action.messageToast }}</span>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CharacterPresetType, type PostActionType } from '@/types/OmikujiTypesSchema';
import { emotionLabels, type CharacterEmotion } from '@/types/PresetTypes';

// Props
const props = defineProps<{
 actions: PostActionType[];
 charactersArray: CharacterPresetType[];
}>();

// キャラクター選択肢
const characterOptions = computed(() => {
 return props.charactersArray.map((character) => ({
  value: character.id,
  label: character.name
 }));
});

// ヘルパー関数
const getCharacterLabel = (key: string): string => {
 const option = characterOptions.value.find((opt) => opt.value === key);
 return option ? option.label : key;
};

const getIconLabel = (key: CharacterEmotion): string => {
 return emotionLabels[key] || key;
};
</script>
