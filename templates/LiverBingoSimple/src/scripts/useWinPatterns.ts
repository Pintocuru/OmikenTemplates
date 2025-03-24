// src/scripts/useWinPatterns.ts
import { ref, computed, Ref } from 'vue';

export function useWinPatterns(cardSize: Ref<3 | 4 | 5>) {
 const completedLines: Ref<number[]> = ref([]);
 const highlightedCells: Ref<number[]> = ref([]);

 // 勝利パターンを動的に生成する関数
 const generateWinPatterns = (): number[][] => {
  const patterns: number[][] = [];
  const size = cardSize.value;

  // 横のパターン
  for (let row = 0; row < size; row++) {
   const pattern: number[] = [];
   for (let col = 0; col < size; col++) {
    pattern.push(row * size + col);
   }
   patterns.push(pattern);
  }

  // 縦のパターン
  for (let col = 0; col < size; col++) {
   const pattern: number[] = [];
   for (let row = 0; row < size; row++) {
    pattern.push(row * size + col);
   }
   patterns.push(pattern);
  }

  // 左上から右下への対角線
  const diag1: number[] = [];
  for (let i = 0; i < size; i++) {
   diag1.push(i * size + i);
  }
  patterns.push(diag1);

  // 右上から左下への対角線
  const diag2: number[] = [];
  for (let i = 0; i < size; i++) {
   diag2.push(i * size + (size - 1 - i));
  }
  patterns.push(diag2);

  return patterns;
 };

 // 勝利パターンを動的に更新
 const winPatterns = computed(() => generateWinPatterns());

 const checkBingo = (completedCells: boolean[], patterns: number[][]): void => {
  completedLines.value = [];
  highlightedCells.value = [];

  // すべてのビンゴパターンをチェック
  for (let i = 0; i < patterns.length; i++) {
   const pattern = patterns[i];
   if (pattern.every((index) => completedCells[index])) {
    completedLines.value.push(i);
    highlightedCells.value = [...highlightedCells.value, ...pattern];
   }
  }
 };

 return {
  generateWinPatterns,
  winPatterns,
  completedLines,
  highlightedCells,
  checkBingo
 };
}
