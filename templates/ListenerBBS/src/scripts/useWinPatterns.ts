// src/scripts/useWinPatterns.ts
import { ref, computed, Ref } from 'vue';
import { useSound } from '@/scripts/useSound';

export function useWinPatterns(cardSize: Ref<3 | 4 | 5>) {
 const sounds = useSound();
 const completedLines = ref<number[]>([]);
 const highlightedCells = ref<number[]>([]);
 let previousCompletedLinesCount = 0;

 // winPatternsの生成をより効率的かつ簡潔に
 const winPatterns = computed(() => {
  const size = cardSize.value;
  const generateIndexes = (generator: (index: number) => number) =>
   Array.from({ length: size }, (_, i) => generator(i));

  return [
   // 横のパターン
   ...Array.from({ length: size }, (_, row) => generateIndexes((col) => row * size + col)),
   // 縦のパターン
   ...Array.from({ length: size }, (_, col) => generateIndexes((row) => row * size + col)),
   // 対角線パターン
   generateIndexes((i) => i * size + i), // 左上から右下
   generateIndexes((i) => i * size + (size - 1 - i)) // 右上から左下
  ];
 });

 const checkBingo = (completedCells: boolean[]): void => {
  const patterns = winPatterns.value;
  const lines: number[] = [];
  const cells: number[] = [];

  // forループを最適化し、早期リターンで効率化
  for (const [index, pattern] of patterns.entries()) {
   if (pattern.every((cellIndex) => completedCells[cellIndex])) {
    lines.push(index);
    cells.push(...pattern);
   }
  }

  completedLines.value = lines;
  highlightedCells.value = cells;

  // サウンド再生のロジックを最適化
  const currentCompletedLinesCount = lines.length;
  if (currentCompletedLinesCount > previousCompletedLinesCount) {
   sounds.soundCheers();

   // 1行か複数行かで異なるサウンドを再生
   currentCompletedLinesCount === 1 ? sounds.soundSingle() : sounds.soundMulti();
  }

  previousCompletedLinesCount = currentCompletedLinesCount;
 };

 return {
  checkBingo,
  completedLines,
  highlightedCells
 };
}
