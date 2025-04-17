<!-- BingoCard.vue -->
<template>
 <div class="flex flex-col items-center min-h-screen">
  <!-- ビンゴタイトルバー -->
  <BingoTitle
   v-model:theme="theme"
   :lineCount="completedLines.length"
   @generate="generateBingoCard"
  />

  <!-- ビンゴカードのマス -->
  <BingoSpace
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
import BingoTitle from './BingoCard/components/BingoTitle.vue';
import BingoSpace from './BingoCard/components/BingoSpace.vue';
import { useBingoCard } from './BingoCard/useBingoCard';

// コンポーザブルから機能を取得
const {
 toggleControlPanel,
 incrementCell,
 decrementCell,
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
