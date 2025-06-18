// src/ConfigMaker/script/usePlaceholderStore.ts - プレースホルダー専用store
import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useOmikujiStore } from './useOmikujiStore';
import { PlaceholderSourceType } from '@/types/OmikujiTypesSchema';
import { useRecordOperations } from './useRecordStore';

export const usePlaceholderStore = defineStore('placeholder', () => {
 const baseOperations = useRecordOperations('placeholders');

 const omikujiStore = useOmikujiStore();

 // プレースホルダーの辞書型データを取得するためのcomputed
 const placeholders = computed(() => omikujiStore.data.placeholders);

 const sources = computed(() => Object.values(omikujiStore.data.placeholders));

 // PlaceholderEditor.vueで使用される機能の実装
 const addPlaceholder = (placeholder: PlaceholderSourceType) => {
  // プレースホルダーをストアに追加
  omikujiStore.data.placeholders[placeholder.id] = placeholder;

  // プレースホルダーカテゴリを選択状態にする
  omikujiStore.selectCategory('placeholders');

  return placeholder.id;
 };

 const deletePlaceholder = (placeholderId: string): boolean => {
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

 const selectPlaceholder = (placeholderId: string): boolean => {
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

 // プレースホルダーIDの更新
 const updatePlaceholderId = (oldId: string, newId: string): boolean => {
  // 古いIDのプレースホルダーが存在するかチェック
  if (!omikujiStore.data.placeholders[oldId]) {
   return false;
  }

  // 新しいIDが既に存在するかチェック（重複回避）
  if (omikujiStore.data.placeholders[newId]) {
   return false;
  }

  // 既存のプレースホルダーデータを取得
  const placeholderData = { ...omikujiStore.data.placeholders[oldId] };

  // プレースホルダーデータのIDを更新
  placeholderData.id = newId;

  // 新しいIDでプレースホルダーを追加
  omikujiStore.data.placeholders[newId] = placeholderData;

  // 古いIDのプレースホルダーを削除
  delete omikujiStore.data.placeholders[oldId];

  // 現在選択中のプレースホルダーが更新対象の場合、選択状態を新しいIDに更新
  if (omikujiStore.selectedRuleId === oldId) {
   omikujiStore.selectRule(newId);
  }

  // プレースホルダー内のcontentを更新
  const oldPlaceholder = `<<${oldId}>>`;
  const newPlaceholder = `<<${newId}>>`;

  // 全てのプレースホルダーのvalues.contentを更新
  Object.values(omikujiStore.data.placeholders).forEach((placeholder) => {
   placeholder.values.forEach((value) => {
    if (value.content.includes(oldPlaceholder)) {
     value.content = value.content.replace(
      new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      newPlaceholder
     );
    }
   });
  });

  // 全てのコメントルールのomikuji.contentを更新
  Object.values(omikujiStore.data.comments).forEach((rule) => {
   rule.omikuji.forEach((omikujiSet) => {
    // omikujiSetのpostActionsは配列で、各要素にcontentプロパティがある可能性があるため確認
    omikujiSet.postActions?.forEach((action) => {
     if (
      action &&
      typeof action === 'object' &&
      'content' in action &&
      typeof action.content === 'string'
     ) {
      if (action.content.includes(oldPlaceholder)) {
       action.content = action.content.replace(
        new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        newPlaceholder
       );
      }
     }
    });
   });
  });

  // 全てのタイマールールのomikuji.contentを更新
  Object.values(omikujiStore.data.timers).forEach((rule) => {
   rule.omikuji.forEach((omikujiSet) => {
    omikujiSet.postActions?.forEach((action) => {
     if (
      action &&
      typeof action === 'object' &&
      'content' in action &&
      typeof action.content === 'string'
     ) {
      if (action.content.includes(oldPlaceholder)) {
       action.content = action.content.replace(
        new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        newPlaceholder
       );
      }
     }
    });
   });
  });

  return true;
 };

 return {
  ...baseOperations,
  // computedプロパティ
  placeholders // 追加: PlaceholderEditor.vueで使用される
 };
});
