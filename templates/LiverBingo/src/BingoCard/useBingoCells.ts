// src/BingoCard/useBingoCells.ts
import { ref, computed, watch, Ref } from 'vue';

export function useBingoCells(
 totalCells: Ref<number>,
 itemTargets: Ref<number[]>,
 updateCompletedLines: (completedCells: boolean[]) => void
) {
 // セルの進捗状態
 const cellProgress = ref<number[]>(Array(totalCells.value).fill(0));

 // 完了したセルの計算
 const completedCells = computed(() =>
  cellProgress.value.map((progress, index) => progress >= itemTargets.value[index])
 );

 // 完了状態の変更を監視して、ビンゴチェックを更新
 watch(
  completedCells,
  (newCompletedCells) => {
   updateCompletedLines(newCompletedCells);
  },
  { deep: true }
 );

 // セルのポイント加算
 const incrementCell = (index: number): void => {
  cellProgress.value[index]++;
 };

 // セルのポイント減少
 const decrementCell = (index: number): void => {
  if (cellProgress.value[index] > 0) {
   cellProgress.value[index]--;
  }
 };

 // ビンゴの状態をリセット
 const resetBingo = () => {
  cellProgress.value = Array(totalCells.value).fill(0);
 };

 return {
  cellProgress,
  completedCells,
  incrementCell,
  decrementCell,
  resetBingo
 };
}
