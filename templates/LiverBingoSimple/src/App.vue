<!-- App.vue -->
<template>
 <div class="flex flex-col items-center min-h-screen">
  <!-- ビンゴタイトルバー -->
  <BingoTitle
   :lineCount="completedLines.length"
   @generate="generateBingoCard"
   @toggle-control-panel="toggleControlPanel"
   @dblclick="toggleControlPanel()"
  />

  <!-- コントロールパネル -->
  <ControlPanel
   v-model:theme="theme"
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
   @cell-click="incrementCell"
   @cell-right-click="decrementCell"
   @click="toggleControlPanel(false)"
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
 incrementCell,
 decrementCell,
 resetBingo,
 cardSize,
 theme,
 bingoItems,
 cellProgress,
 itemTargets,
 completedCells,
 generateBingoCard,
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
