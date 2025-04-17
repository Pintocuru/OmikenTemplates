// src/BingoCard/useBingoItems.ts
import { ref, Ref } from 'vue';
import { BingoItem } from '@/scripts/schema';

// アプリケーション設定
const { bingoSeeds = [], bingoRandomSeeds = [] } = window.BINGO_CONFIG || {};

export function useBingoItems(totalCells: Ref<number>) {
 // 状態管理用変数
 const bingoItems = ref<BingoItem[]>(
  Array(totalCells.value).fill({ title: '未設定', weight: 0, target: 3, unit: 1 })
 );
 const itemTargets = ref<number[]>(Array(totalCells.value).fill(3));

 // ランダムにビンゴアイテムを選択
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

 // 配列をシャッフル
 const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [array[i], array[j]] = [array[j], array[i]];
  }
 };

 // ビンゴカードを生成
 const generateBingoCard = () => {
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

 // アイテムを更新
 const updateItem = (index: number, newItem: BingoItem) => {
  bingoItems.value[index] = newItem;
  itemTargets.value[index] = newItem.target ?? 3;
 };

 return {
  bingoItems,
  itemTargets,
  selectBingoItem,
  generateBingoCard,
  updateItem
 };
}
