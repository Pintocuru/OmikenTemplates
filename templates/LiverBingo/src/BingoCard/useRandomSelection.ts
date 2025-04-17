// src/BingoCard/useRandomSelection.ts
import { ref, Ref } from 'vue';

export function useRandomSelection(totalCells: Ref<number>) {
 const highlightedRandomCell = ref<number | null>(null);
 const isAnimating = ref<boolean[]>(Array(totalCells.value).fill(false));

 // アニメーションをトリガー
 const triggerAnimation = (index: number) => {
  isAnimating.value[index] = true;
  const timerId = window.setTimeout(() => {
   isAnimating.value[index] = false;
   window.clearTimeout(timerId);
  }, 800);
 };

 // ランダムにセルを選択
 const selectRandomCell = (completedCells: boolean[]) => {
  // 一旦前の選択をクリア
  highlightedRandomCell.value = null;

  // 選択できるセルを集める（完了していないセル）
  const availableCells = completedCells
   .map((completed, index) => ({ completed, index }))
   .filter(({ completed }) => !completed)
   .map(({ index }) => index);

  // 選択できるセルがある場合
  if (availableCells.length > 0) {
   // ランダムにインデックスを選択
   const randomIndex = Math.floor(Math.random() * availableCells.length);
   const selectedCellIndex = availableCells[randomIndex];

   // 選択したセルをハイライト
   highlightedRandomCell.value = selectedCellIndex;

   // セルのアニメーションをトリガー
   triggerAnimation(selectedCellIndex);
  }
 };

 return {
  highlightedRandomCell,
  isAnimating,
  selectRandomCell,
  triggerAnimation
 };
}
