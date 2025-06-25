// src/ConfigMaker/script/useRecordStore.ts - 共通ルールストア
import { computed } from 'vue';
import { useOmikujiStore } from './useOmikujiStore';
import {
 CharacterPresetType,
 CommentRuleType,
 createDefaultCharacter,
 createDefaultCommentRule,
 createDefaultPlaceholder,
 createDefaultTimerRule,
 PlaceholderType,
 TimerRuleType
} from '@/types/OmikujiTypesSchema';

// 共通のルール操作を提供するコンポーザブル
type Category = 'comments' | 'timers' | 'placeholders' | 'characters';

type CategoryTypeMap = {
 comments: CommentRuleType;
 timers: TimerRuleType;
 placeholders: PlaceholderType;
 characters: CharacterPresetType;
};

export function useRecordOperations<C extends Category>(category: C) {
 const omikujiStore = useOmikujiStore();

 const factoryMap: {
  [K in Category]: () => CategoryTypeMap[K];
 } = {
  comments: createDefaultCommentRule,
  timers: createDefaultTimerRule,
  placeholders: createDefaultPlaceholder,
  characters: createDefaultCharacter
 };

 // データ取得
 const getData = (): Record<string, CategoryTypeMap[C]> => {
  return omikujiStore.data[category] as Record<string, CategoryTypeMap[C]>;
 };

 const rules = computed<CategoryTypeMap[C][]>(() =>
  Object.values(getData()).sort((a, b) => a.order - b.order)
 );

 // リアクティブな書き込み可能selectedRule
 const selectedRule = computed<CategoryTypeMap[C] | null>({
  get: () => {
   if (omikujiStore.selectedCategory !== category) return null;
   const data = getData();
   if (!omikujiStore.selectedRuleId) return null;
   return data[omikujiStore.selectedRuleId] ?? null;
  },
  set: (value) => {
   if (value && omikujiStore.selectedRuleId) {
    update(omikujiStore.selectedRuleId, value);
   }
  }
 });

 // ネストされたプロパティ用のヘルパー
 const selectedRuleNested = <K extends keyof CategoryTypeMap[C]>(key: K) =>
  computed<CategoryTypeMap[C][K] | undefined>({
   get: () => selectedRule.value?.[key],
   set: (value) => {
    if (value !== undefined && selectedRule.value) {
     update(selectedRule.value.id, { [key]: value } as Partial<CategoryTypeMap[C]>);
    }
   }
  });

 const add = (): string => {
  const createDefault = factoryMap[category];
  const newRule = createDefault();
  const id = `${Date.now()}`;
  const data = getData();
  const count = Object.keys(data).length;

  newRule.id = id;
  newRule.name = `新しいデータ ${count + 1}`;
  newRule.order = count;

  data[id] = newRule;
  omikujiStore.selectCategory(category);
  omikujiStore.selectRule(id);
  return id;
 };

 const update = (id: string, updates: Partial<CategoryTypeMap[C]>): boolean => {
  const data = getData();
  const rule = data[id];
  if (rule) {
   data[id] = { ...rule, ...updates };
   return true;
  }
  return false;
 };

 const remove = (id: string): boolean => {
  const data = getData();
  if (data[id]) {
   delete data[id];
   if (omikujiStore.selectedRuleId === id) {
    omikujiStore.clearSelection();
   }
   return true;
  }
  return false;
 };

 const duplicate = (id: string): string | null => {
  const data = getData();
  const original = data[id];
  if (original) {
   const newId = `${Date.now()}`;
   const duplicated: CategoryTypeMap[C] = {
    ...original,
    id: newId,
    name: `${original.name} (コピー)`,
    order: Object.keys(data).length
   };
   data[newId] = duplicated;
   omikujiStore.selectRule(newId);
   return newId;
  }
  return null;
 };

 const reorder = (fromIndex: number, toIndex: number) => {
  const ruleList = rules.value;
  const ids = ruleList.map((rule) => rule.id);
  const [movedId] = ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, movedId);

  const data = getData();
  ids.forEach((id, index) => {
   if (data[id]) {
    data[id].order = index;
   }
  });
 };

 return {
  rules,
  selectedRule,
  selectedRuleNested,
  add,
  update,
  remove,
  duplicate,
  reorder
 };
}
