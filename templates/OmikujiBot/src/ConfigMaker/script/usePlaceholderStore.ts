// src/ConfigMaker/script/usePlaceholderStore.ts - プレースホルダー専用store
import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useOmikujiStore } from './useOmikujiStore';
import { PlaceholderSourceType, createDefaultPlaceholderSource } from '@/types/OmikujiTypesSchema';
import { PlaceholderSource } from '@/types/OmikujiTypes';

export const usePlaceholderStore = defineStore('placeholder', () => {
 const omikujiStore = useOmikujiStore();

 // プレースホルダーの辞書型データを取得するためのcomputed
 const placeholders = computed(() => omikujiStore.data.placeholders);

 const sources = computed(() => Object.values(omikujiStore.data.placeholders));

 const selectedSource = computed(() => {
  if (!omikujiStore.selectedRuleId || omikujiStore.selectedCategory !== 'placeholders') {
   return null;
  }
  return omikujiStore.data.placeholders[omikujiStore.selectedRuleId] || null;
 });

 // PlaceholderEditor.vueで使用される機能の実装
 const addPlaceholder = (placeholder: PlaceholderSource) => {
  // プレースホルダーをストアに追加
  omikujiStore.data.placeholders[placeholder.id] = placeholder;

  // プレースホルダーカテゴリを選択状態にする
  omikujiStore.selectCategory('placeholders');

  return placeholder.id;
 };

 const deletePlaceholder = (placeholderId: string) => {
  // プレースホルダーが存在するかチェック
  if (!omikujiStore.data.placeholders[placeholderId]) {
   return false;
  }

  // プレースホルダーを削除
  delete omikujiStore.data.placeholders[placeholderId];

  // 削除されたプレースホルダーが現在選択中の場合、選択をクリア
  if (omikujiStore.selectedRuleId === placeholderId) {
   omikujiStore.clearSelection();
  }

  return true;
 };

 const selectPlaceholder = (placeholderId: string) => {
  // プレースホルダーが存在するかチェック
  if (!omikujiStore.data.placeholders[placeholderId]) {
   return false;
  }

  // プレースホルダーカテゴリを選択
  omikujiStore.selectCategory('placeholders');

  // 指定されたプレースホルダーを選択
  omikujiStore.selectRule(placeholderId);

  return true;
 };

 return {
  // computedプロパティ
  placeholders, // 追加: PlaceholderEditor.vueで使用される
  sources,
  selectedSource,

  // PlaceholderEditor.vue専用のメソッド
  addPlaceholder,
  deletePlaceholder,
  selectPlaceholder
 };
});
