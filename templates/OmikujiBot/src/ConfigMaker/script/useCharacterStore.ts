// src/ConfigMaker/script/useCharacterStore.ts - キャラクター専用ストア（短縮版）
import { computed, provide, ref } from 'vue';
import { defineStore } from 'pinia';
import { useOmikujiStore } from './useOmikujiStore';
import { type CharacterPresetType } from '@/types/OmikujiTypesSchema';
import { useRecordOperations } from './useRecordStore';

export const useCharacterStore = defineStore('characterRules', () => {
 const baseOperations = useRecordOperations('characters');
 const omikujiStore = useOmikujiStore();

 // 基本データアクセス
 const characters = computed(() => omikujiStore.data.characters);
 const characterList = computed(() => Object.values(characters.value));
 const characterCount = computed(() => Object.keys(characters.value).length);

 // 選択されたキャラクター管理（独自の状態管理が必要な場合）
 const selectedCharacterId = ref<string>('');
 const selectedCharacter = computed(() => {
  return selectedCharacterId.value ? characters.value[selectedCharacterId.value] : null;
 });

 // キャラクター固有のメソッド
 const getCharactersByTag = (tag: string) => {
  return characterList.value.filter((char) => char.tags.includes(tag));
 };

 const getAllTags = () => {
  const tags = new Set<string>();
  characterList.value.forEach((char) => {
   char.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
 };

 const selectCharacter = (id: string) => {
  selectedCharacterId.value = id;
 };

 const selectFirstCharacter = () => {
  const firstId = Object.keys(characters.value)[0];
  if (firstId) {
   selectedCharacterId.value = firstId;
  }
 };

 // 既存のAPIとの互換性のためのエイリアス
 // TODO:互換性を解消してコード量を減らしたい
 const addCharacter = (id: string, character: CharacterPresetType) => {
  omikujiStore.addItemToCategory('characters', id, character);
 };

 const updateCharacter = (id: string, updates: Partial<CharacterPresetType>) => {
  baseOperations.update(id, updates);
 };

 const removeCharacter = (id: string) => {
  baseOperations.remove(id);
 };

 const duplicateCharacter = (id: string) => {
  return baseOperations.duplicate(id);
 };

 // RuleTabs用のstoreをprovide
 const provideCharacterRulesStore = () => {
  provide('charactersRulesStore', {
   selectRule: selectCharacter,
   add: baseOperations.add,
   remove: baseOperations.remove,
   duplicate: baseOperations.duplicate,
   update: baseOperations.update,
   reorder: baseOperations.reorder
  });
 };

 return {
  // 基本操作は全てuseRecordOperationsから
  ...baseOperations,

  // State
  characters,
  characterList,
  characterCount,
  selectedCharacterId,
  selectedCharacter,

  // キャラクター固有のメソッド
  getCharactersByTag,
  getAllTags,
  selectCharacter,
  selectFirstCharacter,

  // 既存API互換性のためのエイリアス
  // TODO:互換性による余計なコードを解消したい
  addCharacter,
  updateCharacter,
  removeCharacter,
  duplicateCharacter,

  provideCharacterRulesStore
 };
});
