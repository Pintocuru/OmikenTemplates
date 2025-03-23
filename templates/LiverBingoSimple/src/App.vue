<!-- App.vue -->
<template>
 <div class="flex flex-col items-center min-h-screen">
  <!-- ビンゴタイトルバー（設定ボタン付き） -->
  <div class="bg-primary text-primary-content rounded flex items-center px-4 mb-1">
   <div class="text-center flex-1 text-3xl font-bungee">ライバービンゴ</div>
   <button
    @click="toggleControlPanel"
    class="btn btn-outline btn-sm text-primary-content border-primary ml-2 p-2 rounded-full flex items-center justify-center"
   >
    <LucideSettings class="w-5 h-5" />
   </button>
  </div>

  <!-- コントロールパネル -->
  <ControlPanel
   v-model:theme="theme"
   v-model:difficultyLevel="difficultyLevel"
   @generate="generateBingoCard"
   @reset="resetBingo"
   @toggleControlPanel="toggleControlPanel"
   class="transition-transform"
   :class="isControlPanelVisible ? 'translate-x-0' : 'translate-x-full'"
  />

  <!-- ビンゴカード -->
  <BingoCard
   :cardSize="cardSize"
   :bingoItems="bingoItems"
   :cellProgress="cellProgress"
   :itemTargets="itemTargets"
   :completedCells="completedCells"
   :highlightedCells="highlightedCells"
   @cell-click="handleCellClick"
   @cell-right-click="decrementCell"
  />

  <!-- ビンゴ通知 -->
  <BingoNotification :lineCount="completedLines.length" />
 </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ControlPanel from './components/ControlPanel.vue';
import BingoCard from './components/BingoCard.vue';
import BingoNotification from './components/BingoNotification.vue';
import { useBingoCard } from './scripts/useBingoCard';
import { useBingoCelebration } from './scripts/useBingoCelebration';
import { LucideSettings } from 'lucide-vue-next';

// コンポーザブルから機能を取得
const {
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
 decrementCell
} = useBingoCard();

const { completedLines, highlightedCells, checkBingo, removeConfetti } = useBingoCelebration();

// コントロールパネルの表示状態
const isControlPanelVisible = ref(false);

// コントロールパネルの表示・非表示を切り替え
const toggleControlPanel = () => {
 isControlPanelVisible.value = !isControlPanelVisible.value;
};

// セルがクリックされたときのハンドラー
const handleCellClick = (index: number) => {
 incrementCell(index);
 checkBingo(completedCells.value, winPatterns.value);
};

// ビンゴをリセット
const resetBingo = () => {
 resetCard();
 removeConfetti();
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

// ライフサイクルフック
onMounted(() => {
 generateBingoCard();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rampart+One&display=swap');

.font-bungee {
 font-family: 'Rampart One', sans-serif;
 font-weight: 400;
 font-style: normal;
}
</style>
