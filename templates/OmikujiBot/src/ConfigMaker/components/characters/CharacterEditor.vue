<!-- src/apps/configMaker/components/CharacterEditor.vue -->
<template>
 <!-- キャラクターがない場合 -->
 <div v-if="characterCount === 0" class="text-center py-8 text-gray-500">
  <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
  <p>キャラクターが設定されていません</p>
  <p class="text-sm">「新しいキャラクター」ボタンから追加してください</p>
 </div>

 <!-- キャラクタータブ（複数の場合） -->
 <RuleTabs :rules="charactersArray" :selectedRule="selectedCharacter" ruleType="characters" />

 <!-- 選択されたキャラクターの編集フォーム -->
 <div v-if="selectedCharacter">
  <!-- 基本情報 -->
  <CharacterBasicInfo v-model="selectedCharacter" />

  <!-- 色設定 -->
  <CharacterColorSettings v-model="selectedCharacter.color" />

  <!-- 画像設定 -->
  <CharacterImageSettings v-model="selectedCharacter.image" />
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
const charactersArray = computed(() => characterStore.rulesArray);
const characterCount = computed(() => Object.keys(charactersArray.value).length);

// v-modelを使用したselectedCharacterの実装
const selectedCharacter = computed({
 get: () => characterStore.selectedRule,
 set: (value: CharacterPresetType | null) => {
  if (value) {
   characterStore.update(value.id, value);
  }
 }
});
</script>
