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
import { emotionLabels, CharacterEmotionType, getImagePath } from '@type/';
import { useCharacterStore } from '@ConfigScript/useCharacterStore';

const props = defineProps<{
 characterKey: string;
 iconKey: CharacterEmotionType;
 imgClass?: string; // アイコンに適用するクラス
 fallbackClass?: string; // 画像がない場合に適用するクラス
}>();

const characterStore = useCharacterStore();
const charactersMap = computed(() => characterStore.rulesMap);

const iconSrc = computed(() => getImagePath(`${props.characterKey}/${props.iconKey}`));
const altText = computed(() => emotionLabels[props.iconKey]);
</script>
