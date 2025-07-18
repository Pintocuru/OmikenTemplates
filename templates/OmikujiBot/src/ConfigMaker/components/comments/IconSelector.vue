<!-- src/configMaker/components/comments/IconSelector.vue -->
<template>
 <div class="form-control">
  <label class="label py-0">
   <span class="label-text text-xs">🎨 アイコン</span>
  </label>
  <div class="flex gap-1">
   <select v-model="localIconKey" class="select select-bordered select-sm flex-1">
    <option v-for="(icon, index) in characterEmotions" :key="index" :value="icon">
     {{ emotionLabels[icon] }}
    </option>
   </select>
   <div class="relative">
    <button
     @click="showIconPreview"
     @mouseenter="showHoverPreview = true"
     @mouseleave="showHoverPreview = false"
     class="btn btn-sm btn-outline"
     title="アイコンプレビュー"
     :disabled="!getCharacterIconPath(characterKey, localIconKey)"
    >
     <Eye class="w-4 h-4" />
    </button>

    <div
     v-if="showHoverPreview && getCharacterIconPath(characterKey, localIconKey)"
     class="absolute top-full right-0 mt-1 p-2 bg-white border rounded shadow-lg z-10 pointer-events-none"
    >
     <div class="text-center">
      <p class="text-sm text-gray-600 mb-2">{{ characterName }}</p>
      <p class="text-xs text-gray-500 mb-2">{{ emotionLabels[localIconKey] }}</p>
      <CharacterIcon
       :characterKey="characterKey"
       :iconKey="localIconKey"
       imgClass="max-w-16 max-h-16 object-contain rounded-full"
      />
     </div>
    </div>
   </div>
  </div>
 </div>

 <IconPreviewModal
  ref="iconPreviewModalRef"
  :characterKey="characterKey"
  :currentIconKey="localIconKey"
  @select:icon="handleIconSelect"
 />
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import { emotionLabels, characterEmotions, CharacterEmotionType } from '@type/';
import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue';
import IconPreviewModal from '@ConfigComponents/postAction/IconPreviewModal.vue';
import { useCharacterStore } from '@ConfigScript/useCharacterStore';
import { Eye } from 'lucide-vue-next';

// Props
const props = defineProps<{
 characterKey: string;
 iconKey: CharacterEmotionType;
}>();

// Emits
const emit = defineEmits<{
 'update:iconKey': [value: string];
 showPreview: [characterKey: string, iconKey: CharacterEmotionType]; // 使用されていないようですが、残しておきます
}>();

// Store
const characterStore = useCharacterStore();
const charactersMap = computed(() => characterStore.rulesMap);

// Refs
const showHoverPreview = ref(false);
const iconPreviewModalRef: Ref<InstanceType<typeof IconPreviewModal> | null> = ref(null); // モーダルコンポーネントのref

// Computed properties
const localIconKey = computed({
 get: () => props.iconKey,
 set: (newValue) => {
  emit('update:iconKey', newValue);
 }
});

const characterName = computed(() => {
 const character = charactersMap.value[props.characterKey];
 return character?.name || '';
});

// Methods
const getCharacterIconPath = (characterKey: string, iconKey: CharacterEmotionType): string => {
 const character = charactersMap.value[characterKey];
 if (!character || !character.image || !character.image[iconKey]) {
  return '';
 }
 return character.image[iconKey];
};

const showIconPreview = () => {
 iconPreviewModalRef.value?.showModal();
};

const handleIconSelect = (selectedIcon: CharacterEmotionType) => {
 localIconKey.value = selectedIcon;
};
</script>
