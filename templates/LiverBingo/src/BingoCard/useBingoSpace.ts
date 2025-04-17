// src/BingoCard/useBingoSpace.ts
import { ref } from 'vue';
import { useSound } from '@/scripts/useSound';
import { BingoItem } from '@/scripts/schema';

export function useBingoSpace(props: {
 bingoItems: BingoItem[];
 cellProgress: number[];
 completedCells: boolean[];
 isAnimating: boolean[]; // 親から受け取る
 highlightedRandomCell: number | null; // 親から受け取る
}) {
 const sounds = useSound();

 // ホバー状態のみローカルで管理
 const isHovered = ref(new Array(props.bingoItems.length).fill(false));

 // セルサイズを動的に計算
 const cellSizeMap = {
  3: 'w-32 h-32',
  4: 'w-30 h-30',
  5: 'w-28 h-28',
  default: 'w-28 h-28'
 };

 const getCellSize = (size: number) => {
  return cellSizeMap[size as keyof typeof cellSizeMap] || cellSizeMap.default;
 };

 // ホバー状態の更新メソッド
 const updateHoverState = (index: number, state: boolean) => {
  isHovered.value[index] = state;
  if (state) sounds.soundHover();
 };

 // テキスト形成メソッド
 const formatCellText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
 };

 return {
  isHovered,
  getCellSize,
  updateHoverState,
  formatCellText
 };
}
