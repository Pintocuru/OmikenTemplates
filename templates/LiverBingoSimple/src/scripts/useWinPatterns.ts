// src/scripts/useWinPatterns.ts
import { ref, computed, Ref } from 'vue';

export function useWinPatterns(cardSize: Ref<3 | 4 | 5>) {
 // メモ化を使用して、同じサイズでは再計算を避ける
 const winPatterns = computed(() => {
  const patterns: number[][] = [];
  const size = cardSize.value;

  // 横のパターン (インデックス演算を最適化)
  for (let row = 0; row < size; row++) {
   patterns.push(Array.from({ length: size }, (_, col) => row * size + col));
  }

  // 縦のパターン (インデックス演算を最適化)
  for (let col = 0; col < size; col++) {
   patterns.push(Array.from({ length: size }, (_, row) => row * size + col));
  }

  // 対角線パターン (より簡潔な生成方法)
  patterns.push(
   Array.from({ length: size }, (_, i) => i * size + i), // 左上から右下
   Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)) // 右上から左下
  );

  return patterns;
 });

 const completedLines = ref<number[]>([]);
 const highlightedCells = ref<number[]>([]);

 const checkBingo = (completedCells: boolean[]): void => {
  // デストラクチャリングで可読性を向上
  const patterns = winPatterns.value;

  // 一時配列を再利用して再割り当てを避ける
  const lines: number[] = [];
  const cells: number[] = [];

  // より効率的なチェック方法
  for (let i = 0; i < patterns.length; i++) {
   const pattern = patterns[i];
   if (pattern.every((index) => completedCells[index])) {
    lines.push(i);
    cells.push(...pattern);
   }
  }

  // 一度の代入で更新
  completedLines.value = lines;
  highlightedCells.value = cells;
 };

 return {
  checkBingo,
  completedLines,
  highlightedCells
 };
}
