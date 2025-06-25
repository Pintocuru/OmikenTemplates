<!-- src/apps/configMaker/components/CharacterEditor.vue -->
<template>
 <!-- キャラクターがない場合 -->
 <div v-if="characterCount === 0" class="text-center py-8 text-gray-500">
  <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
  <p>キャラクターが設定されていません</p>
  <p class="text-sm">「新しいキャラクター」ボタンから追加してください</p>
 </div>

 <!-- キャラクタータブ（複数の場合） -->
 <RuleTabs :rules="characters" :selectedRule="selectedCharacter" ruleType="characters" />

 <!-- 選択されたキャラクターの編集フォーム -->
 <div v-if="selectedCharacter">
  <!-- 基本情報 -->
  <CharacterBasicInfo :character="selectedCharacter" @update="handleUpdate" />

  <!-- 色設定 -->
  <CharacterColorSettings :color="selectedCharacter.color" @update="handleColorUpdate" />

  <!-- 画像設定 -->
  <CharacterImageSettings :images="selectedCharacter.image" @update="handleImageUpdate" />
 </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { useCharacterStore } from '@ConfigScript/useCharacterStore';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import type { CharacterPresetType } from '@/types/OmikujiTypesSchema';
import RuleTabs from '@ConfigComponents/parts/RuleTabs.vue';
import CharacterBasicInfo from './CharacterBasicInfo.vue';
import CharacterColorSettings from './CharacterColorSettings.vue';
import CharacterImageSettings from './CharacterImageSettings.vue';
import CharacterTagManager from './CharacterTagManager.vue';
import { Users } from 'lucide-vue-next';

// ストアを使用
const characterStore = useCharacterStore();
const omikujiStore = useOmikujiStore();

// RuleTabsコンポーネントで使用するstore機能を拡張
const extendedStore = {
 ...characterStore,
 selectRule: (ruleId: string) => {
  omikujiStore.selectCategory('characters');
  omikujiStore.selectRule(ruleId);
 }
};
provide('charactersRulesStore', extendedStore);

// 計算プロパティ
const characters = computed(() => characterStore.rules);
const selectedCharacter = computed(() => characterStore.selectedRule);
const characterCount = computed(() => Object.keys(characters.value).length);

// イベントハンドラー
const handleUpdate = (updates: Partial<CharacterPresetType>) => {
 if (selectedCharacter.value) {
  characterStore.update(selectedCharacter.value.id, updates);
 }
};

const handleColorUpdate = (colorUpdates: Partial<CharacterPresetType['color']>) => {
 if (selectedCharacter.value) {
  const updatedColor = { ...selectedCharacter.value.color, ...colorUpdates };
  characterStore.update(selectedCharacter.value.id, { color: updatedColor });
 }
};

const handleImageUpdate = (imageUpdates: Partial<CharacterPresetType['image']>) => {
 if (selectedCharacter.value) {
  const updatedImage = { ...selectedCharacter.value.image, ...imageUpdates };
  characterStore.update(selectedCharacter.value.id, { image: updatedImage });
 }
};

const handleTagsUpdate = (tags: string[]) => {
 if (selectedCharacter.value) {
  characterStore.update(selectedCharacter.value.id, { tags });
 }
};
</script>
