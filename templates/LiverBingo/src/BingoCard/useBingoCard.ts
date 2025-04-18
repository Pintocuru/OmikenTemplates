// src/BingoCard/useBingoCard.ts
import { onMounted } from 'vue';
import { useBingoState } from '@/BingoCard/useBingoState';
import { useWinPatterns } from '@/BingoCard/useWinPatterns';
import { useBingoItems } from '@/BingoCard/useBingoItems';
import { useBingoCells } from '@/BingoCard/useBingoCells';
import { useRandomSelection } from '@/BingoCard/useRandomSelection';

// config のバリデーション

export function useBingoCard() {
 // 基本ビンゴの状態
 const { cardSize, theme, totalCells } = useBingoState();

 // 勝利パターン検出
 const { updateCompletedLines, completedLines, highlightedCells } = useWinPatterns(cardSize);

 // ビンゴアイテム管理
 const { bingoItems, itemTargets, selectBingoItem, generateBingoCard, updateItem } =
  useBingoItems(totalCells);

 // セル操作 - 依存関係を明示的に注入
 const { cellProgress, completedCells, incrementCell, decrementCell, resetBingo } = useBingoCells(
  totalCells,
  itemTargets,
  updateCompletedLines
 );

 // ランダム選択
 const { highlightedRandomCell, isAnimating, selectRandomCell, triggerAnimation, clearRandomCell } =
  useRandomSelection(totalCells);

 // エンハンスドインターフェース - 個別コンポーザブルの処理を組み合わせる

 // セルの進捗処理
 const handleIncrementCell = (index: number) => {
  clearRandomCell(); // ハイライトを消去
  incrementCell(index);
  triggerAnimation(index);
 };

 // セルのポイント減少、0であればセル変更
 const handleDecrementCell = (index: number) => {
  clearRandomCell(); // ハイライトを消去
  // currentProgressが0かどうかチェック
  const currentProgress = cellProgress.value[index];

  if (currentProgress > 0) {
   // 0より大きい場合は単純に減少
   decrementCell(index);
  } else {
   // 0以下の場合はアイテムを変更
   const currentItem = bingoItems.value[index];
   const newItem = selectBingoItem(currentItem);
   updateItem(index, newItem);
  }
 };

 // ランダム選択を処理
 const handleRandomSelect = () => {
  selectRandomCell(completedCells.value);
 };

 // カード生成とリセットを一括処理
 const initBingoCard = () => {
  clearRandomCell(); // ハイライトを消去
  resetBingo();
  generateBingoCard();
 };

 // コンポーネントマウント時にビンゴカードを生成
 onMounted(initBingoCard);

 return {
  // アクション
  incrementCell: handleIncrementCell,
  decrementCell: handleDecrementCell,
  resetBingo,
  generateBingoCard: initBingoCard,
  handleRandomSelect,
  clearRandomCell,

  // 状態
  cardSize,
  theme,
  bingoItems,
  cellProgress,
  itemTargets,
  completedCells,
  completedLines,
  highlightedCells,
  highlightedRandomCell,
  isAnimating
 };
}
