// src/ConfigMaker/script/useTimerRulesStore.ts - タイマールール専用store
import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useOmikujiStore } from './useOmikujiStore';
import { TimerRuleType, createDefaultTimerRule } from '@/types/OmikujiTypesSchema';

export const useTimerRulesStore = defineStore('timerRules', () => {
 const omikujiStore = useOmikujiStore();

 // Computed
 const rules = computed(() =>
  Object.values(omikujiStore.data.timers).sort((a, b) => a.order - b.order)
 );

 const selectedRule = computed(() => {
  if (!omikujiStore.selectedRuleId || omikujiStore.selectedCategory !== 'timers') {
   return null;
  }
  return omikujiStore.data.timers[omikujiStore.selectedRuleId] || null;
 });

 // Actions
 const add = () => {
  const newRule = createDefaultTimerRule();
  const id = `timer_${Date.now()}`;
  const count = Object.keys(omikujiStore.data.timers).length;

  newRule.id = id;
  newRule.name = `タイマールール ${count + 1}`;
  newRule.order = count;

  omikujiStore.data.timers[id] = newRule;
  omikujiStore.selectCategory('timers');
  omikujiStore.selectRule(id);

  return id;
 };

 const update = (id: string, updates: Partial<TimerRuleType>) => {
  const rule = omikujiStore.data.timers[id];
  if (rule) {
   omikujiStore.data.timers[id] = { ...rule, ...updates };
   return true;
  }
  return false;
 };

 const remove = (id: string) => {
  if (omikujiStore.data.timers[id]) {
   delete omikujiStore.data.timers[id];
   if (omikujiStore.selectedRuleId === id) {
    omikujiStore.clearSelection();
   }
   return true;
  }
  return false;
 };

 const duplicate = (id: string) => {
  const original = omikujiStore.data.timers[id];
  if (original) {
   const newId = `timer_${Date.now()}`;
   const duplicated = {
    ...original,
    id: newId,
    name: `${original.name} (コピー)`,
    order: Object.keys(omikujiStore.data.timers).length
   };
   omikujiStore.data.timers[newId] = duplicated;
   omikujiStore.selectRule(newId);
   return newId;
  }
  return null;
 };

 const reorder = (fromIndex: number, toIndex: number) => {
  const rulesCopy = [...rules.value];
  const [moved] = rulesCopy.splice(fromIndex, 1);
  rulesCopy.splice(toIndex, 0, moved);

  rulesCopy.forEach((rule, index) => {
   rule.order = index;
  });
 };

 // タイマールール特有のメソッド
 const updateInterval = (id: string, intervalSeconds: number) => {
  return update(id, { intervalSeconds });
 };

 const getActiveRules = () => {
  return rules.value.filter((rule) => rule.isEnabled);
 };

 const getNextExecutionTime = (rule: TimerRuleType, lastExecutionTime?: Date) => {
  const baseTime = lastExecutionTime || new Date();
  return new Date(baseTime.getTime() + rule.intervalSeconds * 1000);
 };

 return {
  rules,
  selectedRule,
  add,
  update,
  remove,
  duplicate,
  reorder,
  updateInterval,
  getActiveRules,
  getNextExecutionTime
 };
});
