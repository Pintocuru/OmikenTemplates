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
 <CharacterEditForm
  v-if="selectedCharacter"
  :character="selectedCharacter"
  @update="handleUpdateCharacter"
  @delete="handleDeleteCharacter"
 />
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { createDefaultCharacter } from '@/types/OmikujiTypesSchema';
import { useCharacterStore } from '../script/useCharacterStore';
import { Plus, Users } from 'lucide-vue-next';
import RuleTabs from './RuleTabs.vue';
import CharacterEditForm from './CharacterEditForm.vue';
import { useOmikujiStore } from '../script/useOmikujiStore';

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

// 選択されたキャラクター
// TODO:これはselectedRule にする (selectedCharacterIdは削除)
const selectedCharacterId = ref<string>('');

// 計算プロパティ
const characterCount = computed(() => characterStore.characterCount);
const characters = computed(() => characterStore.rules);
const selectedCharacter = computed(() => characterStore.selectedRule);

// イベントハンドラー
const handleUpdateCharacter = (updates: any) => {
 if (selectedCharacterId.value) {
  characterStore.updateCharacter(selectedCharacterId.value, updates);
 }
};

const handleDeleteCharacter = (characterId?: string) => {
 const targetId = characterId || selectedCharacterId.value;
 if (!targetId) return;

 // @ts-ignore
 // インデックス式が型 'number' ではないため、要素に 'any' 型が暗黙的に指定されます。ts(7015)
 const character = characters.value[targetId];
 if (confirm(`キャラクター「${character.name || targetId}」を削除しますか？`)) {
  characterStore.removeCharacter(targetId);

  // 削除後、別のキャラクターを選択
  const remainingIds = Object.keys(characters.value).filter((id) => id !== targetId);
  selectedCharacterId.value = remainingIds[0] || '';
 }
};
</script>
