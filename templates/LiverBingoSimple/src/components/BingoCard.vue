<!-- BingoCard.vue -->
<template>
 <div :class="['grid gap-1 mb-6', `grid-cols-${cardSize} grid-rows-${cardSize}`]">
  <div
   v-for="(cell, index) in bingoItems"
   :key="index"
   @click="handleCellClick(index)"
   @contextmenu.prevent="decrementCell(index)"
   class="btn flex flex-col items-center justify-center p-2 text-center text-sm rounded-lg transition-all transform hover:scale-105 cursor-pointer relative"
   :class="[
    completedCells[index]
     ? 'btn-primary border-2 border-secondary'
     : 'bg-base-200 border border-primary',
    highlightedCells.includes(index) ? 'bg-secondary text-white' : '',
    getCellSize(cardSize)
   ]"
  >
   <div class="text-xs font-bold">{{ formatCellText(cell.text, itemTargets[index]) }}</div>

   <!-- 数値（クリック時拡大アニメーション） -->
   <div class="mt-1 text-xs font-bold">
    <span
     class="count-value transition-transform duration-200"
     :class="{ 'scale-150 text-xl font-extrabold text-primary animate-pulse': isAnimating[index] }"
    >
     {{ cellProgress[index] }}
    </span>
    / {{ itemTargets[index] }}
   </div>

   <!-- 進捗バー -->
   <progress
    class="progress progress-success w-full mt-1"
    :value="cellProgress[index]"
    :max="itemTargets[index]"
   ></progress>

   <!-- クリック時のアニメーション -->
   <div v-show="isAnimating[index]" class="absolute inset-0 flex items-center justify-center">
    <div class="circle-animation"></div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { BingoItem } from '../scripts/types';
import { ref, computed, watch } from 'vue';

const props = defineProps<{
 cardSize: 3 | 4 | 5;
 bingoItems: BingoItem[];
 cellProgress: number[];
 itemTargets: number[];
 completedCells: boolean[];
 highlightedCells: number[];
}>();

const emit = defineEmits(['cell-click', 'cell-right-click']);

// アニメーション制御用の状態
const isAnimating = ref(Array(props.bingoItems.length).fill(false));

// セルサイズを動的に計算
const getCellSize = (size: number) => {
 switch (size) {
  case 3:
   return 'w-32 h-32';
  case 4:
   return 'w-28 h-28';
  case 5:
   return 'w-24 h-24';
  default:
   return 'w-24 h-24';
 }
};

// 進捗数値が変化したときのアニメーション
watch(
 () => [...props.cellProgress],
 (newValues, oldValues) => {
  newValues.forEach((value, index) => {
   if (value > (oldValues?.[index] || 0)) {
    // 値が増加した場合、アニメーションをトリガー
    isAnimating.value[index] = true;
    setTimeout(() => {
     isAnimating.value[index] = false;
    }, 800); // アニメーション時間に合わせる
   }
  });
 },
 { deep: true }
);

const handleCellClick = (index: number) => {
 emit('cell-click', index);
};

const decrementCell = (index: number) => {
 emit('cell-right-click', index);
};

const formatCellText = (text: string, target: number) => {
 if (!text) return '';

 // カードサイズに応じて文字数を調整
 const maxLength = props.cardSize === 5 ? 15 : 24;
 if (text.length > maxLength) return text.substring(0, maxLength - 3) + '...';

 return text;
};
</script>

<style scoped>
/* クリック時の円形アニメーション */
.circle-animation {
 position: absolute;
 width: 40px;
 height: 40px;
 border-radius: 50%;
 background-color: rgba(236, 72, 153, 0.3); /* ピンク色の半透明 */
 animation: pulse-ring 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
}

@keyframes pulse-ring {
 0% {
  transform: scale(0);
  opacity: 0.8;
 }
 50% {
  opacity: 0.5;
 }
 100% {
  transform: scale(2.5);
  opacity: 0;
 }
}

/* カウンター数値のアニメーション */
.animate-pulse-count {
 animation: pulse-count 0.6s ease;
}

.count-value {
 display: inline-block;
}

@keyframes pulse-count {
 0% {
  transform: scale(1);
  color: white;
 }
 50% {
  transform: scale(1.5);
  color: yellow;
  text-shadow: 0 0 8px rgba(255, 255, 0, 0.8);
 }
 100% {
  transform: scale(1);
  color: white;
 }
}

/* カードサイズごとのフォントサイズ調整 */
.grid-cols-3 .cell-text {
 font-size: 0.875rem;
}

.grid-cols-4 .cell-text {
 font-size: 0.75rem;
}

.grid-cols-5 .cell-text {
 font-size: 0.675rem;
}
</style>
