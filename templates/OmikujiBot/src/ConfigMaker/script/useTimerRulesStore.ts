// src/ConfigMaker/script/useTimerRulesStore.ts - 簡略化されたタイマールールストア
import { defineStore } from 'pinia';
import { TimerRuleType } from '@/types/OmikujiTypesSchema';
import { useRecordOperations } from './useRecordStore';

export const useTimerRulesStore = defineStore('timerRules', () => {
 const baseOperations = useRecordOperations('timers');

 // タイマールール特有のメソッド
 const updateInterval = (id: string, intervalSeconds: number) => {
  return baseOperations.update(id, { intervalSeconds } as Partial<TimerRuleType>);
 };

 const getActiveRules = () => {
  return baseOperations.rules.value.filter((rule) => rule.isEnabled);
 };

 const getNextExecutionTime = (rule: TimerRuleType, lastExecutionTime?: Date) => {
  const baseTime = lastExecutionTime || new Date();
  return new Date(baseTime.getTime() + rule.intervalSeconds * 1000);
 };

 return {
  ...baseOperations,
  updateInterval,
  getActiveRules,
  getNextExecutionTime
 };
});
