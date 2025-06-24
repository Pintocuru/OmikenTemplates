// src/ConfigMaker/script/useCommentRulesStore.ts
// 簡略化されたコメントルールストア
import { defineStore } from 'pinia';
import { useRecordOperations } from './useRecordStore';

export const useCommentRulesStore = defineStore('commentRules', () => {
 const baseOperations = useRecordOperations('comments');

 return {
  ...baseOperations
 };
});
