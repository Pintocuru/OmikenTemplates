// src/ConfigMaker/script/useCommentRulesStore.ts
// 簡略化されたコメントルールストア
import { useRecordOperations } from './useRecordStore';
import { defineStore } from 'pinia';

export const useCommentRulesStore = defineStore('commentRules', () => {
 const baseOperations = useRecordOperations('comments');

 return {
  ...baseOperations
 };
});
