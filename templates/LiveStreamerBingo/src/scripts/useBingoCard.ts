// scripts/useBingoCard.ts
import { ref, computed, Ref, ComputedRef } from 'vue';
import { useBingoItems } from './useBingoItems';
import { BingoItem, WinPattern } from './types';

export function useBingoCard() {
 const { items, shuffleArray, formatCellText } = useBingoItems();

 // 状態管理
 const difficultyLevel: Ref<number> = ref(3);
 const clicksRequired: Ref<number> = ref(3); // 基本のクリア条件の回数
 const bingoItems: Ref<BingoItem[]> = ref(Array(9).fill(''));
 const cellProgress: Ref<number[]> = ref(Array(9).fill(0)); // セルごとのクリック回数
 const itemTargets: Ref<number[]> = ref(Array(9).fill(3)); // 各セルの達成目標回数

 // ビンゴパターン（勝利条件）
 const winPatterns: WinPattern[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // 横
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // 縦
  [0, 4, 8],
  [2, 4, 6] // 斜め
 ];

 // 完了セルの計算（目標回数以上達成したセル）
 const completedCells: ComputedRef<boolean[]> = computed(() => {
  return cellProgress.value.map((progress, index) => progress >= itemTargets.value[index]);
 });

 const generateBingoCard = (): void => {
  // リセット
  resetCard();

  // 選択された難易度に基づいてアイテムを選ぶ
  let selectedItems: BingoItem[] = [];

  // 現在のレベルとその下のレベルからアイテムを選択
  for (let i = 1; i <= difficultyLevel.value; i++) {
   if (items[i] && items[i].length > 0) {
    selectedItems = selectedItems.concat(items[i]);
   }
  }

  // アイテムをシャッフルして9つを選択
  const selectedBingoItems = shuffleArray(selectedItems).slice(0, 9);

  // 項目テキストと目標値を設定
  bingoItems.value = selectedBingoItems;

  // 各セルの目標値を設定
  itemTargets.value = selectedBingoItems.map((item) => {
   if (item.value === null) return 1; // 固定項目は1回で達成

   // 新しい構造に対応: valueが配列の場合
   if (Array.isArray(item.value) && item.value.length > 0) {
    // 難易度に基づいてvalueの配列からインデックスを選択
    const index = Math.min(difficultyLevel.value - 1, item.value.length - 1);
    return item.value[index];
   }

   return clicksRequired.value; // デフォルト値
  });
 };

 const resetCard = (): void => {
  cellProgress.value = Array(9).fill(0);
 };

 const incrementCell = (index: number): void => {
  cellProgress.value[index]++;
 };

 return {
  difficultyLevel,
  clicksRequired,
  bingoItems,
  cellProgress,
  itemTargets,
  completedCells,
  winPatterns,
  generateBingoCard,
  resetCard,
  incrementCell,
  formatCellText
 };
}
