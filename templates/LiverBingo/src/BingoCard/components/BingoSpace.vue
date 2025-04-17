<!-- src/BingoCard/components/BingoSpace.vue -->
<template>
 <div
  class="grid gap-1"
  :style="{
   gridTemplateColumns: `repeat(${cardSize}, minmax(0, 1fr))`,
   gridTemplateRows: `repeat(${cardSize}, minmax(0, 1fr))`
  }"
 >
  <div
   v-for="(cell, index) in bingoItems"
   :key="index"
   @click="
    emit('cell-click', index);
    sounds.soundClick();
   "
   @contextmenu.prevent="
    emit('cell-right-click', index);
    sounds.soundReset();
   "
   class="btn flex flex-col items-center justify-center p-1 text-center text-base rounded-lg transition-all transform hover:scale-150 cursor-pointer relative"
   :class="[
    completedCells[index]
     ? 'bg-primary text-primary-content border-2 border-secondary'
     : 'bg-base text-base border border-base',
    highlightedCells.includes(index)
     ? 'bg-secondary text-secondary-content ring-2 ring-accent'
     : '',
    highlightedRandomCell === index
     ? 'bg-accent text-accent-content ring-4 ring-warning animate-pulse'
     : '',
    getCellSize(cardSize)
   ]"
   :style="{ zIndex: isHovered[index] ? 999 : 'auto' }"
   @mouseenter="updateHoverState(index, true)"
   @mouseleave="updateHoverState(index, false)"
  >
   <div class="text-md">{{ formatCellText(cell.title, 24) }}</div>

   <!-- 数値（クリック時拡大アニメーション） -->
   <div class="mt-0 text-2xl">
    <span
     class="count-value transition-transform duration-200"
     :class="{
      'scale-200 font-extrabold': isAnimating[index]
     }"
    >
     {{ cellProgress[index] * (cell.unit ?? 1) }}
    </span>
    / {{ itemTargets[index] * (cell.unit ?? 1) }}
   </div>

   <!-- 進捗バー -->
   <progress
    class="progress progress-success w-full absolute bottom-0 left-0 bg-opacity-80 -z-10"
    :value="cellProgress[index]"
    :max="itemTargets[index]"
   ></progress>

   <!-- クリック時のアニメーション -->
   <div
    v-if="isAnimating[index]"
    class="absolute inset-0 flex items-center justify-center pointer-events-none"
   >
    <div class="circle-animation"></div>
   </div>

   <!-- ランダム選択時の追加アニメーション -->
   <div
    v-if="highlightedRandomCell === index"
    class="absolute inset-0 flex items-center justify-center pointer-events-none"
   >
    <div class="random-select-indicator"></div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { BingoItem, CardSize } from '@/scripts/schema';
import { useSound } from '@/scripts/useSound';
import { useBingoSpace } from '../useBingoSpace';

const props = defineProps<{
 cardSize: CardSize;
 bingoItems: BingoItem[];
 cellProgress: number[];
 itemTargets: number[];
 completedCells: boolean[];
 highlightedCells: number[];
 highlightedRandomCell: number | null; // 親から受け取る
 isAnimating: boolean[]; // 親から受け取る
}>();

const emit = defineEmits(['cell-click', 'cell-dblclick', 'cell-right-click']);

// コンポーザブル
const sounds = useSound();

// BingoSpaceコンポーザブルを使用
const { isHovered, getCellSize, updateHoverState, formatCellText } = useBingoSpace(props);
</script>

<style scoped>
.count-value {
 display: inline-block;
}
</style>
