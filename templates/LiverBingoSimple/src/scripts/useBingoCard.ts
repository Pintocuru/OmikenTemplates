// src/scripts/useBingoCard.ts (リファクタリング版)
import { ref, computed, Ref, ComputedRef, watch, onMounted } from 'vue';
import { useBingoState } from '@/scripts/useBingoState';
import { useWinPatterns } from '@/scripts/useWinPatterns';
import { useControlPanel } from '@/scripts/useControlPanel';
import { BingoItem } from '@/scripts/types';

// config
const rawItems: BingoItem[] = window.BINGO_CONFIG?.bingoItems || [];

// ---

export function useBingoCard() {
 const { cardSize, difficultyLevel, theme, totalCells, setCardSize } = useBingoState();
 const { winPatterns, checkBingo, completedLines, highlightedCells } = useWinPatterns(cardSize);
 const { isControlPanelVisible, toggleControlPanel } = useControlPanel();

 // 動的サイズの配列を初期化
 const bingoItems: Ref<BingoItem[]> = ref(Array(totalCells.value).fill(''));
 const cellProgress: Ref<number[]> = ref(Array(totalCells.value).fill(0));
 const itemTargets: Ref<number[]> = ref(Array(totalCells.value).fill(3));

 // 完了セルの計算
 const completedCells: ComputedRef<boolean[]> = computed(() => {
  return cellProgress.value.map((progress, index) => progress >= itemTargets.value[index]);
 });

 // 難易度でアイテムをグループ化
 const items: BingoItem[][] = [
  [], // ダミー（難易度は1から始まるため）
  rawItems.filter((item) => (item.difficulty ?? 1) >= 1), // Level1
  rawItems.filter((item) => (item.difficulty ?? 1) >= 2), // Level2
  rawItems.filter((item) => (item.difficulty ?? 1) >= 3), // Level3
  rawItems.filter((item) => (item.difficulty ?? 1) >= 4), // Level4
  rawItems // Level5
 ];

 // カードサイズが変更されたときに配列を更新
 const updateArraySizes = () => {
  const newSize = totalCells.value;
  bingoItems.value = Array(newSize).fill('');
  cellProgress.value = Array(newSize).fill(0);
  itemTargets.value = Array(newSize).fill(3);
 };

 // カードサイズ変更時の拡張ハンドラー
 const updateCardSize = (size: 3 | 4 | 5) => {
  setCardSize(size);
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
   // 難易度に基づいてvalueの配列からインデックスを選択
   if (Array.isArray(item.values) && item.values.length > 0) {
    const index = Math.min(difficultyLevel.value - 1, item.values.length - 1);
    return item.values[index];
   }
   return 1; // 固定項目は1回で達成
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
  if (cellProgress.value[index] > 0) {
   cellProgress.value[index]--;
  } else {
   // セルの値が0以下の場合、そのセルの内容を変更する
   // 現在のレベルに基づいてアイテムを取得
   let availableItems: BingoItem[] = [];
   for (let i = 1; i <= difficultyLevel.value; i++) {
    if (items[i] && items[i].length > 0) {
     availableItems = availableItems.concat(items[i]);
    }
   }

   // 現在セルにあるアイテムを除外
   const currentItem = bingoItems.value[index];
   availableItems = availableItems.filter(
    (item) => item.text !== (currentItem ? currentItem.text : '')
   );

   // ランダムに新しいアイテムを選択
   if (availableItems.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const newItem = availableItems[randomIndex];

    // アイテムを更新
    bingoItems.value[index] = newItem;

    // 目標値も更新
    if (Array.isArray(newItem.values) && newItem.values.length > 0) {
     const valueIndex = Math.min(difficultyLevel.value - 1, newItem.values.length - 1);
     itemTargets.value[index] = newItem.values[valueIndex];
    } else {
     itemTargets.value[index] = 1;
    }

    // 進捗をリセット
    cellProgress.value[index] = 0;
   }
  }
 };

 // セルがクリックされたときのハンドラー
 const handleCellClick = (index: number) => {
  incrementCell(index);
  checkBingo(completedCells.value, winPatterns.value);
 };

 // ビンゴをリセット
 const resetBingo = () => {
  resetCard();
  checkBingo(completedCells.value, winPatterns.value);
 };

 // セルの状態変更を監視して、ビンゴチェックを行う
 watch(
  completedCells,
  () => {
   checkBingo(completedCells.value, winPatterns.value);
  },
  { deep: true }
 );

 // cardSizeが変わったときに配列を更新
 watch(cardSize, () => {
  updateArraySizes();
 });

 // ライフサイクルフック
 onMounted(() => {
  generateBingoCard();
 });

 return {
  isControlPanelVisible,
  toggleControlPanel,
  handleCellClick,
  resetBingo,
  cardSize,
  theme,
  difficultyLevel,
  bingoItems,
  cellProgress,
  itemTargets,
  completedCells,
  winPatterns,
  generateBingoCard,
  resetCard,
  incrementCell,
  decrementCell,
  setCardSize: updateCardSize,
  completedLines,
  highlightedCells
 };
}
