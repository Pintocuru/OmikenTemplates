<!-- VtuberBingoCard.vue -->
<template>
 <div class="flex flex-col items-center min-h-screen py-8 text-white">
  <!-- コントロールパネル -->
  <ControlPanel
   v-model:difficultyLevel="difficultyLevel"
   v-model:clicksRequired="clicksRequired"
   @generate="generateBingoCard"
   @reset="resetBingo"
  />

  <!-- ビンゴカード -->
  <div class="grid grid-cols-3 grid-rows-3 gap-1 mb-6">
   <div
    v-for="(cell, index) in bingoItems"
    :key="index"
    @click="handleCellClick(index)"
    :class="[
     'w-24 h-24 flex flex-col items-center justify-center p-2 text-center text-sm rounded transition-all transform hover:scale-105 cursor-pointer relative',
     completedCells[index]
      ? 'bg-purple-600 border-2 border-pink-400'
      : 'bg-gray-800 bg-opacity-80 border-2 border-purple-600',
     highlightedCells.includes(index) ? 'bg-pink-500 border-yellow-300' : ''
    ]"
   >
    <div>{{ formatCellText(cell, itemTargets[index]) }}</div>
    <div class="mt-2 text-xs font-bold">{{ cellProgress[index] }}/{{ itemTargets[index] }}</div>
    <!-- 進捗バー -->
    <div class="absolute bottom-1 left-1 right-1 h-1 bg-gray-700 rounded-full overflow-hidden">
     <div
      class="h-full bg-green-400"
      :style="{ width: `${(cellProgress[index] / itemTargets[index]) * 100}%` }"
     ></div>
    </div>
   </div>
  </div>

  <!-- ビンゴ達成通知 -->
  <div v-if="completedLines.length > 0" class="text-center animation-pulse">
   <div class="text-2xl font-bold text-yellow-300 mb-2">
    {{ completedLines.length }}ライン ビンゴ達成！
   </div>
   <div class="text-lg text-pink-300">おめでとうございます！</div>
  </div>
 </div>

 <!-- 紙吹雪 -->
 <div
  v-for="(confetti, index) in confettis"
  :key="'confetti-' + index"
  class="confetti"
  :style="confetti.style"
 ></div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import ControlPanel from './ControlPanel.vue';
import { useBingoCard } from './scripts/useBingoCard';
import { useBingoCelebration } from './scripts/useBingoCelebration';

// コンポーザブルから機能を取得
const {
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
 formatCellText
} = useBingoCard();

const { completedLines, highlightedCells, confettis, checkBingo, removeConfetti } =
 useBingoCelebration();

// セルがクリックされたときのハンドラー
const handleCellClick = (index: number) => {
 incrementCell(index);
 checkBingo(completedCells.value, winPatterns);
};

// ビンゴをリセット
const resetBingo = () => {
 resetCard();
 removeConfetti();
 checkBingo(completedCells.value, winPatterns);
};

// セルの状態変更を監視して、ビンゴチェックを行う
watch(
 completedCells,
 () => {
  checkBingo(completedCells.value, winPatterns);
 },
 { deep: true }
);

// ライフサイクルフック
onMounted(() => {
 generateBingoCard();
});
</script>

<style scoped>
.confetti {
 position: fixed;
 width: 10px;
 height: 10px;
 background-color: #f00;
 animation: fall 3s ease-in infinite;
 z-index: -1;
}

@keyframes fall {
 0% {
  top: -10px;
  transform: translateX(0) rotate(0deg);
  opacity: 1;
 }
 100% {
  top: 100%;
  transform: translateX(100px) rotate(720deg);
  opacity: 0;
 }
}

.animation-pulse {
 animation: pulse 2s infinite;
}

@keyframes pulse {
 0% {
  transform: scale(1);
 }
 50% {
  transform: scale(1.05);
 }
 100% {
  transform: scale(1);
 }
}
</style>
