// src/ConfigMaker/script/useCharacterStore.ts - キャラクター専用ストア
import { defineStore } from 'pinia';
import { useRecordOperations } from './useRecordStore';

export const useCharacterStore = defineStore('characterRules', () => {
 const baseOperations = useRecordOperations('characters');

 return {
  // 基本操作は全てuseRecordOperationsから
  ...baseOperations
 };
});
