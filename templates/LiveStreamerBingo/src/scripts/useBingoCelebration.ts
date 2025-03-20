// composables/useBingoCelebration.ts
import { ref, Ref } from 'vue';
import { Confetti, WinPattern } from './types';

export function useBingoCelebration() {
 const completedLines: Ref<number[]> = ref([]);
 const highlightedCells: Ref<number[]> = ref([]);
 const confettis: Ref<Confetti[]> = ref([]);

 const checkBingo = (completedCells: boolean[], winPatterns: WinPattern[]): void => {
  // 以前に見つけたビンゴラインをリセット
  const previousLines = completedLines.value.length;
  completedLines.value = [];
  highlightedCells.value = [];

  // すべてのビンゴパターンをチェック
  for (let i = 0; i < winPatterns.length; i++) {
   const pattern = winPatterns[i];
   if (pattern.every((index) => completedCells[index])) {
    completedLines.value.push(i);
    highlightedCells.value = [...highlightedCells.value, ...pattern];
   }
  }

  // 新しいビンゴラインが達成された場合のお祝い
  if (completedLines.value.length > previousLines && completedLines.value.length > 0) {
   celebrateBingo();
  }
 };

 const celebrateBingo = (): void => {
  // 紙吹雪を作成
  createConfetti();
 };

 const createConfetti = (): void => {
  removeConfetti();

  for (let i = 0; i < 50; i++) {
   const left = Math.random() * 100;
   const animationDuration = Math.random() * 3 + 2;
   const animationDelay = Math.random() * 2;
   const size = Math.random() * 10 + 5;
   const color = getRandomColor();

   confettis.value.push({
    style: {
     left: `${left}%`,
     width: `${size}px`,
     height: `${size}px`,
     backgroundColor: color,
     animationDuration: `${animationDuration}s`,
     animationDelay: `${animationDelay}s`
    }
   });
  }
 };

 const removeConfetti = (): void => {
  confettis.value = [];
 };

 const getRandomColor = (): string => {
  const colors = [
   '#FF0000',
   '#00FF00',
   '#0000FF',
   '#FFFF00',
   '#FF00FF',
   '#00FFFF',
   '#FF8800',
   '#8800FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
 };

 return {
  completedLines,
  highlightedCells,
  confettis,
  checkBingo,
  removeConfetti
 };
}
