<!-- src/configMaker/components/parts/CharacterIcon.vue -->
<template>
 <div
  class="tooltip tooltip-top"
  :data-tip="`${charactersMap[props.characterKey]?.name} (${altText})`"
 >
  <img v-if="iconSrc" :src="iconSrc" :alt="altText" :class="imgClass" />
  <div v-else :class="fallbackClass">画像なし</div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCharacterStore } from '@ConfigScript/useCharacterStore';
import { emotionLabels, CharacterEmotionType } from '@type/';

const props = defineProps<{
 characterKey: string;
 iconKey: CharacterEmotionType;
 imgClass?: string; // アイコンに適用するクラス
 fallbackClass?: string; // 画像がない場合に適用するクラス
}>();

const characterStore = useCharacterStore();
const charactersMap = computed(() => characterStore.rulesMap);

// 画像ベースURL
const imageBaseUrl =
 typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGE_BASE_URL
  ? import.meta.env.VITE_IMAGE_BASE_URL
  : './Characters/';

const getCharacterIconPath = (characterKey: string, iconKey: CharacterEmotionType): string => {
 const character = charactersMap.value[characterKey];
 if (!character || !character.image || !character.image[iconKey]) {
  return '';
 }
 return character.image[iconKey];
};

const iconSrc = computed(() => {
 const path = getCharacterIconPath(props.characterKey, props.iconKey);
 return path ? imageBaseUrl + path : '';
});

const altText = computed(() => emotionLabels[props.iconKey] || 'キャラクターアイコン');
</script>
