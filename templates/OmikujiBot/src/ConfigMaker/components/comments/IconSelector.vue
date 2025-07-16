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
      <img
       :src="imageBaseUrl + getCharacterIconPath(characterKey, localIconKey)"
       :alt="emotionLabels[localIconKey]"
       class="max-w-16 max-h-16 object-contain rounded"
      />
     </div>
    </div>
   </div>
  </div>
 </div>

 <dialog ref="iconPreviewRef" class="modal">
  <div class="modal-box max-w-4xl">
   <h3 class="font-bold text-lg mb-4 text-base-content">{{ characterName }} - アイコン選択</h3>

   <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
    <div
     v-for="emotion in characterEmotions"
     :key="emotion"
     @click="selectEmotion(emotion)"
     class="cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-lg"
     :class="[
      localIconKey === emotion
       ? 'border-primary bg-primary-focus/10'
       : 'border-base-200 hover:border-base-300'
     ]"
    >
     <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center">
       <img
        v-if="getCharacterIconPath(characterKey, emotion)"
        :src="imageBaseUrl + getCharacterIconPath(characterKey, emotion)"
        :alt="emotionLabels[emotion]"
        class="max-w-full max-h-full object-contain rounded-full"
       />
       <div v-else class="text-gray-400">画像なし</div>
      </div>
      <p class="text-base-content">{{ emotionLabels[emotion] }}</p>
     </div>
    </div>
   </div>

   <div class="modal-action">
    <button @click="closeIconPreview" class="btn">キャンセル</button>
   </div>
  </div>
 </dialog>
</template>

<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import { emotionLabels, characterEmotions, CharacterEmotionType } from '@type/';
import { useCharacterStore } from '@/ConfigMaker/script/useCharacterStore';
import { Eye } from 'lucide-vue-next'; // lucide-vue-next から Eye コンポーネントをインポート

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
const iconPreviewRef: Ref<HTMLDialogElement | null> = ref(null);

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

// 画像ベースURL
const imageBaseUrl =
 typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGE_BASE_URL
  ? import.meta.env.VITE_IMAGE_BASE_URL
  : './Characters/';

// Methods
const getCharacterIconPath = (characterKey: string, iconKey: CharacterEmotionType): string => {
 const character = charactersMap.value[characterKey];
 if (!character || !character.image || !character.image[iconKey]) {
  return '';
 }
 return character.image[iconKey];
};

const showIconPreview = () => {
 iconPreviewRef.value?.showModal();
};

const closeIconPreview = () => {
 iconPreviewRef.value?.close();
};

const selectEmotion = (emotion: CharacterEmotionType) => {
 localIconKey.value = emotion;
 closeIconPreview();
};
</script>
