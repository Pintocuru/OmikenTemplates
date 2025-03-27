<!-- BingoCard.vue -->
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
   @click="emit('cell-click', index)"
   @contextmenu.prevent="emit('cell-right-click', index)"
   class="btn flex flex-col items-center justify-center p-1 text-center text-base rounded-lg transition-all transform hover:scale-150 cursor-pointer relative"
   :class="[
    completedCells[index]
     ? 'btn-primary border border-secondary'
     : 'bg-base-200 border border-primary',
    highlightedCells.includes(index) ? 'bg-secondary text-white' : '',
    getCellSize(cardSize)
   ]"
   :style="{ zIndex: isHovered[index] ? 9999 : 'auto' }"
   @mouseenter="updateHoverState(index, true)"
   @mouseleave="updateHoverState(index, false)"
  >
   <div class="text-md">{{ formatCellText(cell.title, itemTargets[index]) }}</div>

   <!-- 数値（クリック時拡大アニメーション） -->
   <div class="mt-0 text-2xl">
    <span
     class="count-value transition-transform duration-200"
     :class="{
      'scale-150 font-extrabold text-secondary animate-pulse': isAnimating[index]
     }"
    >
     {{ cellProgress[index] * (cell.unit ?? 1) }}
    </span>
    / {{ itemTargets[index] * (cell.unit ?? 1) }}
   </div>

   <!-- 進捗バー -->
   <progress
    class="progress progress-success w-full absolute bottom-0 left-0 bg-opacity-80"
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
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BingoItem } from '@/scripts/types';

const props = defineProps<{
 cardSize: 3 | 4 | 5;
 bingoItems: BingoItem[];
 cellProgress: number[];
 itemTargets: number[];
 completedCells: boolean[];
 highlightedCells: number[];
}>();

const emit = defineEmits(['cell-click', 'cell-dblclick', 'cell-right-click']);

// アニメーション制御用の状態をcomputedとrefで最適化
const isAnimating = ref(new Array(props.bingoItems.length).fill(false));
const isHovered = ref(new Array(props.bingoItems.length).fill(false));

// セルサイズを動的に計算（オブジェクトリテラルで簡潔に）
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
};

// 進捗数値が変化したときのアニメーション
watch(
 () => [...props.cellProgress],
 (newValues, oldValues) => {
  newValues.forEach((value, index) => {
   if (value > (oldValues?.[index] || 0)) {
    // 値が増加した場合、アニメーションをトリガー
    isAnimating.value[index] = true;

    // エラー防止のためのネイティブsetTimeout
    const timerId = window.setTimeout(() => {
     isAnimating.value[index] = false;
     window.clearTimeout(timerId);
    }, 800);
   }
  });
 },
 { deep: true }
);

// テキスト形成メソッドを最適化
const formatCellText = (text: string, cardSize: number) => {
 if (!text) return '';

 const maxLength = 24;
 return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
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

.count-value {
 display: inline-block;
}
</style>
