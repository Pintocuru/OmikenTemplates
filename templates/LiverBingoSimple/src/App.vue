<!-- App.vue -->
<template>
 <div class="flex flex-col items-center min-h-screen">
  <!-- ビンゴタイトルバー -->
  <BingoTitle :lineCount="completedLines.length" @toggle-control-panel="toggleControlPanel" />

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
 </div>
</template>

<script setup lang="ts">
import BingoTitle from './components/BingoTitle.vue';
import ControlPanel from './components/ControlPanel.vue';
import BingoCard from './components/BingoCard.vue';
import { useBingoCard } from './scripts/useBingoCard';

// コンポーザブルから機能を取得
const {
 isControlPanelVisible,
 toggleControlPanel,
 handleCellClick,
 resetBingo,
 cardSize,
 theme,
 difficultyLevel,
 bingoItems,
 cellProgress,
 itemTargets,
 completedCells,
 generateBingoCard,
 decrementCell,
 completedLines,
 highlightedCells
} = useBingoCard();
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rampart+One&display=swap');

.font-bungee {
 font-family: 'Rampart One', sans-serif;
 font-weight: 400;
 font-style: normal;
}
</style>
