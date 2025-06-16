// src/ConfigMaker/script/useCommentRulesStore.ts - コメントルール専用store
import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useOmikujiStore } from './useOmikujiStore';
import { CommentRuleType, createDefaultCommentRule } from '@/types/OmikujiTypesSchema';

export const useCommentRulesStore = defineStore('commentRules', () => {
 const omikujiStore = useOmikujiStore();

 // Computed
 const rules = computed(() =>
  Object.values(omikujiStore.data.comments).sort((a, b) => a.order - b.order)
 );

 const selectedRule = computed(() => {
  if (!omikujiStore.selectedRuleId || omikujiStore.selectedCategory !== 'comments') {
   return null;
  }
  return omikujiStore.data.comments[omikujiStore.selectedRuleId] || null;
 });

 // Actions
 const add = () => {
  const newRule = createDefaultCommentRule();
  const id = `comment_${Date.now()}`;
  const count = Object.keys(omikujiStore.data.comments).length;

  newRule.id = id;
  newRule.name = `コメントルール ${count + 1}`;
  newRule.order = count;

  omikujiStore.data.comments[id] = newRule;
  omikujiStore.selectCategory('comments');
  omikujiStore.selectRule(id);

  return id;
 };

 const update = (id: string, updates: Partial<CommentRuleType>) => {
  const rule = omikujiStore.data.comments[id];
  if (rule) {
   omikujiStore.data.comments[id] = { ...rule, ...updates };
   return true;
  }
  return false;
 };

 const remove = (id: string) => {
  if (omikujiStore.data.comments[id]) {
   delete omikujiStore.data.comments[id];
   if (omikujiStore.selectedRuleId === id) {
    omikujiStore.clearSelection();
   }
   return true;
  }
  return false;
 };

 const duplicate = (id: string) => {
  const original = omikujiStore.data.comments[id];
  if (original) {
   const newId = `comment_${Date.now()}`;
   const duplicated = {
    ...original,
    id: newId,
    name: `${original.name} (コピー)`,
    order: Object.keys(omikujiStore.data.comments).length
   };
   omikujiStore.data.comments[newId] = duplicated;
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

 return {
  rules,
  selectedRule,
  add,
  update,
  remove,
  duplicate,
  reorder
 };
});
