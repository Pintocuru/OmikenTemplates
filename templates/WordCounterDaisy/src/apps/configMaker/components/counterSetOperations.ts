import { CounterSet } from '@scripts/types';
import { createDefaultCounterSet } from '@/scripts/schema';

/**
 * カウンターセット配列を操作するためのユーティリティ関数群
 */
export const counterSetOperations = {
 /**
  * 新しいカウンターセットを追加する
  */
 addCounterSet(counterSets: CounterSet[]): { newSets: CounterSet[]; newIndex: number } {
  const newSets = [...counterSets];
  newSets.push(createDefaultCounterSet());
  return {
   newSets,
   newIndex: newSets.length - 1
  };
 },

 /**
  * 指定されたインデックスのカウンターセットを削除する
  */
 deleteSet(
  counterSets: CounterSet[],
  index: number,
  currentActiveIndex: number
 ): { newSets: CounterSet[]; newActiveIndex: number } {
  if (counterSets.length <= 1) return { newSets: counterSets, newActiveIndex: currentActiveIndex };

  const newSets = [...counterSets];
  newSets.splice(index, 1);

  // アクティブインデックスの調整
  let newActiveIndex = currentActiveIndex;
  if (currentActiveIndex >= newSets.length) {
   newActiveIndex = newSets.length - 1;
  }

  return { newSets, newActiveIndex };
 },

 /**
  * 指定されたインデックスのカウンターセットを複製する
  */
 duplicateSet(
  counterSets: CounterSet[],
  index: number
 ): { newSets: CounterSet[]; newIndex: number } {
  if (index < 0 || index >= counterSets.length) {
   return { newSets: counterSets, newIndex: index };
  }

  const original = counterSets[index];
  // ディープコピーを作成
  const clone = structuredClone(original);

  // プロパティを更新
  clone.id = `counter-${Date.now()}`;
  clone.generator.title = `${clone.generator.title} コピー`;

  // クローンを追加
  const newSets = [...counterSets];
  newSets.splice(index + 1, 0, clone);
  return {
   newSets,
   newIndex: index + 1
  };
 },

 /**
  * 指定されたインデックスのカウンターセットを上に移動する
  */
 moveSetUp(counterSets: CounterSet[], index: number): { newSets: CounterSet[]; newIndex: number } {
  if (index <= 0) {
   return { newSets: counterSets, newIndex: index };
  }

  const newSets = [...counterSets];
  // 要素を入れ替え
  [newSets[index], newSets[index - 1]] = [newSets[index - 1], newSets[index]];

  return {
   newSets,
   newIndex: index - 1
  };
 },

 /**
  * 指定されたインデックスのカウンターセットを下に移動する
  */
 moveSetDown(
  counterSets: CounterSet[],
  index: number
 ): { newSets: CounterSet[]; newIndex: number } {
  if (index >= counterSets.length - 1) {
   return { newSets: counterSets, newIndex: index };
  }

  const newSets = [...counterSets];
  // 要素を入れ替え
  [newSets[index], newSets[index + 1]] = [newSets[index + 1], newSets[index]];

  return {
   newSets,
   newIndex: index + 1
  };
 }
};
