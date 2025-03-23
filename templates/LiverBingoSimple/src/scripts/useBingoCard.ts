import { ref, computed, Ref, ComputedRef, watch } from 'vue';
import { useBingoItems } from './useBingoItems';
import { BingoItem } from './types';

export function useBingoCard() {
 const { items } = useBingoItems();

 // 状態管理
 const cardSize: Ref<3 | 4 | 5> = ref(3);
 const difficultyLevel: Ref<number> = ref(3);
 const clicksRequired: Ref<number> = ref(3);
 const theme = ref('light'); // テーマの管理

 // 配列サイズをcardSizeに基づいて動的に計算
 const totalCells = computed(() => cardSize.value * cardSize.value);

 // 動的サイズの配列を初期化
 const bingoItems: Ref<BingoItem[]> = ref(Array(totalCells.value).fill(''));
 const cellProgress: Ref<number[]> = ref(Array(totalCells.value).fill(0));
 const itemTargets: Ref<number[]> = ref(Array(totalCells.value).fill(3));

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

 // 完了セルの計算
 const completedCells: ComputedRef<boolean[]> = computed(() => {
  return cellProgress.value.map((progress, index) => progress >= itemTargets.value[index]);
 });

 // カードサイズが変更されたときに配列を更新
 const updateArraySizes = () => {
  const newSize = totalCells.value;
  bingoItems.value = Array(newSize).fill('');
  cellProgress.value = Array(newSize).fill(0);
  itemTargets.value = Array(newSize).fill(clicksRequired.value);
 };

 // カードサイズ変更時のハンドラー
 const setCardSize = (size: 3 | 4 | 5) => {
  cardSize.value = size;
  updateArraySizes();
 };

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

  // 重複を防ぐためにSetを利用
  const uniqueItems = Array.from(new Set(selectedItems));

  // アイテムをシャッフルしてカードサイズに応じた数を選択
  const selectedBingoItems = shuffleArray(uniqueItems).slice(0, totalCells.value);

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

 // アイテムをシャッフル
 const shuffleArray = (array: BingoItem[]): BingoItem[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
 };

 // カードのリセット
 const resetCard = (): void => {
  cellProgress.value = Array(totalCells.value).fill(0);
 };

 // 特定のマスの増減
 const incrementCell = (index: number): void => {
  cellProgress.value[index]++;
 };
 const decrementCell = (index: number): void => {
  if (cellProgress.value[index] > 0) cellProgress.value[index]--;
 };

 // テーマ変更の監視
 watch(theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
 });

 return {
  cardSize,
  theme,
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
  decrementCell,
  setCardSize
 };
}
