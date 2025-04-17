// src/scripts/useBingoCard.ts
import { ref, computed, onMounted } from 'vue';
import { useBingoState } from '@/scripts/useBingoState';
import { useWinPatterns } from '@/scripts/useWinPatterns';
import { useControlPanel } from '@/scripts/useControlPanel';
import { BingoItem } from '@/scripts/types';

// アプリケーション設定
const { bingoSeeds = [], bingoRandomSeeds = [] } = window.BINGO_CONFIG || {};

export function useBingoCard() {
 const { cardSize, theme, totalCells } = useBingoState();
 const { checkBingo, completedLines, highlightedCells } = useWinPatterns(cardSize);
 const { isControlPanelVisible, toggleControlPanel } = useControlPanel();

 // 状態管理用変数
 const bingoItems = ref<BingoItem[]>(Array(totalCells.value).fill(null));
 const cellProgress = ref<number[]>(Array(totalCells.value).fill(0));
 const itemTargets = ref<number[]>(Array(totalCells.value).fill(3));

 // 完了したセルの計算
 const completedCells = computed(() =>
  cellProgress.value.map((progress, index) => progress >= itemTargets.value[index])
 );

 /**
  * 重み付けを考慮してランダムにビンゴアイテムを選択する
  * @param excludeItem 除外するアイテム（重複防止用）
  * @returns 選択されたビンゴアイテム
  */
 const selectBingoItem = (excludeItem?: BingoItem): BingoItem => {
  // 利用可能なアイテムをフィルタリング
  const availableItems = excludeItem
   ? bingoRandomSeeds.filter((item) => item.title !== excludeItem.title)
   : bingoRandomSeeds;

  if (availableItems.length === 0) {
   return bingoRandomSeeds[Math.floor(Math.random() * bingoRandomSeeds.length)];
  }

  // 重み付け合計を計算
  const totalWeight = availableItems.reduce((sum, item) => sum + (item.weight ?? 1), 0);

  // 重み付けに基づいてランダム選択
  let randomValue = Math.random() * totalWeight;
  let selectedItem = availableItems[0];

  for (const item of availableItems) {
   randomValue -= item.weight ?? 1;
   if (randomValue <= 0) {
    selectedItem = item;
    break;
   }
  }

  return selectedItem;
 };

 /**
  * ビンゴカードを生成する
  */
 const generateBingoCard = () => {
  resetBingo();
  const usedTitles = new Set<string>();
  const selectedItems: BingoItem[] = [];

  // 必要なセル数分のアイテムを選択
  while (selectedItems.length < totalCells.value) {
   // 未使用のアイテムがあれば優先的に選択
   const availableItems = bingoRandomSeeds.filter((item) => !usedTitles.has(item.title));
   const selectedItem =
    availableItems.length > 0
     ? selectBingoItem()
     : bingoRandomSeeds[Math.floor(Math.random() * bingoRandomSeeds.length)];

   selectedItems.push(selectedItem);
   usedTitles.add(selectedItem.title);
  }

  // アイテムをシャッフル
  shuffleArray(selectedItems);

  // 5x5グリッドの場合は中央をFREEセルに
  if (totalCells.value === 25) {
   const freeItem: BingoItem = { title: '🌟FREE!🌟', weight: 0, target: 1, unit: 1 };
   selectedItems[12] = freeItem;
   itemTargets.value[12] = 1;
   cellProgress.value[12] = 1;
  }

  // 状態を更新
  bingoItems.value = selectedItems;
  itemTargets.value = selectedItems.map((item) => item.target ?? 3);

  // 事前定義されたシードで上書き
  bingoSeeds.forEach((seed, index) => {
   if (index < totalCells.value && seed.title) {
    bingoItems.value[index] = seed;
    itemTargets.value[index] = seed.target ?? 3;
   }
  });
 };

 /**
  * 配列をシャッフルする（Fisher-Yatesアルゴリズム）
  */
 const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [array[i], array[j]] = [array[j], array[i]];
  }
 };

 /**
  * セルの進捗を増加させる
  */
 const incrementCell = (index: number): void => {
  cellProgress.value[index]++;
  checkBingo(completedCells.value);
 };

 /**
  * セルの進捗を減少させる、または新しいアイテムに変更する
  */
 const decrementCell = (index: number): void => {
  if (cellProgress.value[index] > 0) {
   cellProgress.value[index]--;
   checkBingo(completedCells.value);
  } else {
   // 0未満の場合はアイテムを変更
   const currentItem = bingoItems.value[index];
   const newItem = selectBingoItem(currentItem);
   bingoItems.value[index] = newItem;
   itemTargets.value[index] = newItem.target ?? 3;
   cellProgress.value[index] = 0;
  }
 };

 /**
  * ビンゴの状態をリセットする
  */
 const resetBingo = () => {
  cellProgress.value = Array(totalCells.value).fill(0);
  checkBingo(completedCells.value);
 };

 /**
  * カードサイズを更新する
  */
 const updateCardSize = (size: 3 | 4 | 5) => {
  cardSize.value = size;
  generateBingoCard(); // サイズ変更時は再生成
 };

 // コンポーネントマウント時にビンゴカードを生成
 onMounted(generateBingoCard);

 return {
  // UI状態
  isControlPanelVisible,
  toggleControlPanel,

  // アクション
  incrementCell,
  decrementCell,
  resetBingo,
  generateBingoCard,
  updateCardSize,

  // 状態
  cardSize,
  theme,
  bingoItems,
  cellProgress,
  itemTargets,
  completedCells,
  completedLines,
  highlightedCells
 };
}
