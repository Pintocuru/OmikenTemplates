// src/scripts/useBingoCard.ts
import { ref, computed, onMounted } from 'vue';
import { useBingoState } from '@/scripts/useBingoState';
import { useWinPatterns } from '@/scripts/useWinPatterns';
import { useControlPanel } from '@/scripts/useControlPanel';
import { BingoItem } from '@/scripts/types';

// config
const bingoSeeds: BingoItem[] = window.BINGO_CONFIG?.bingoSeeds || [];
const bingoRandomSeeds: BingoItem[] = window.BINGO_CONFIG?.bingoRandomSeeds || [];

// ---

export function useBingoCard() {
 const { cardSize, theme, totalCells } = useBingoState();
 const { checkBingo, completedLines, highlightedCells } = useWinPatterns(cardSize);
 const { isControlPanelVisible, toggleControlPanel } = useControlPanel();

 const bingoItems = ref<BingoItem[]>(Array(totalCells.value).fill(''));
 const cellProgress = ref<number[]>(Array(totalCells.value).fill(0));
 const itemTargets = ref<number[]>(Array(totalCells.value).fill(3));

 const completedCells = computed(() => cellProgress.value.map((p, i) => p >= itemTargets.value[i]));

 const selectBingoItem = (excludeItem?: BingoItem): BingoItem => {
  const availableItems = excludeItem
   ? bingoRandomSeeds.filter((i) => i.title !== excludeItem.title)
   : bingoRandomSeeds;
  const totalWeight = availableItems.reduce((sum, i) => sum + (i.weight ?? 1), 0);
  let r = Math.random() * totalWeight;
  return availableItems.find((i) => (r -= i.weight ?? 1) <= 0) || availableItems[0];
 };

 // 難易度に基づく目標値の計算
 const calculateItemTarget = (item: BingoItem) => {
  return item.target;
 };

 // ビンゴカードを生成
 const generateBingoCard = () => {
  resetBingo();
  const availableItems = [...bingoRandomSeeds];
  const selectedItems: BingoItem[] = [];
  const usedTexts = new Set<string>();

  while (selectedItems.length < totalCells.value && availableItems.length > 0) {
   const item = selectBingoItem();
   if (!usedTexts.has(item.title)) {
    selectedItems.push(item);
    usedTexts.add(item.title);
    availableItems.splice(availableItems.indexOf(item), 1);
   }
  }

  while (selectedItems.length < totalCells.value) {
   const remainingItems = bingoRandomSeeds.filter((i) => !usedTexts.has(i.title));
   if (remainingItems.length === 0) break;
   const item = remainingItems[Math.floor(Math.random() * remainingItems.length)];
   selectedItems.push(item);
   usedTexts.add(item.title);
  }

  for (let i = selectedItems.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [selectedItems[i], selectedItems[j]] = [selectedItems[j], selectedItems[i]];
  }

  // 5x5のカードであれば真ん中をFreeにする
  if (totalCells.value === 25) {
   selectedItems[12] = { title: '🌟FREE!🌟', weight: 0, target: 1, unit: 1 };
   itemTargets.value[12] = 1;
   cellProgress.value[12]++;
  }

  bingoItems.value = selectedItems;
  itemTargets.value = selectedItems.map(calculateItemTarget);

  // bingoSeeds で上書き
  for (let i = 0; i < bingoSeeds.length; i++) {
   if (bingoSeeds[i].title !== '') {
    selectedItems[i] = bingoSeeds[i];
    itemTargets.value[i] = calculateItemTarget(bingoSeeds[i]);
   }
  }
 };

 // パネルのポイントをプラス
 const incrementCell = (index: number): void => {
  cellProgress.value[index]++;
  checkBingo(completedCells.value);
 };

 // パネルのポイントをマイナス
 const decrementCell = (index: number): void => {
  if (cellProgress.value[index] > 0) {
   cellProgress.value[index]--;
   checkBingo(completedCells.value);
  } else {
   // 0未満なら、パネルチェンジ
   const currentItem = bingoItems.value[index];
   const newItem = selectBingoItem(currentItem);
   bingoItems.value[index] = newItem;
   itemTargets.value[index] = calculateItemTarget(newItem);
   cellProgress.value[index] = 0;
  }
 };

 const resetBingo = () => {
  cellProgress.value = Array(totalCells.value).fill(0);
  checkBingo(completedCells.value);
 };

 onMounted(generateBingoCard);

 return {
  isControlPanelVisible,
  toggleControlPanel,
  incrementCell,
  decrementCell,
  resetBingo,
  generateBingoCard,
  updateCardSize: (size: 3 | 4 | 5) => {
   cardSize.value = size;
   resetBingo();
  },
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
