<!-- src/configMaker/FixedItems.vue -->
<template>
 <div class="fixed-items-container space-y-4 p-2">
  <!-- 説明 -->
  <div class="alert alert-info shadow-lg text-sm">
   <div>
    <span class="font-bold">現在のグリッドサイズ:</span>
    {{ cardSize }}×{{ cardSize }} (全{{ totalCells }}マス)
   </div>
  </div>

  <div
   v-for="index in totalCells"
   :key="`cell-${index}`"
   class="card border border-base-200 shadow-md hover:shadow-lg transition-shadow"
  >
   <div class="card-body relative p-3">
    <!-- マスの番号 -->
    <div class="badge badge-primary badge-sm absolute -top-2 -left-2">
     {{ index }}
    </div>
    <div class="flex flex-col md:flex-row gap-2">
     <!-- ビンゴマスのミニグリッド -->
     <div>
      <div class="border rounded-box overflow-hidden shadow-sm">
       <div v-for="row in cardSize" :key="`row-${row}`" class="flex border-b last:border-b-0">
        <div
         v-for="col in cardSize"
         :key="`col-${col}`"
         class="w-7 h-7 border-r last:border-r-0"
         :class="{ 'bg-primary': isCurrentCellBlack(index, row, col) }"
        ></div>
       </div>
      </div>

      <button @click="" class="p-2 text-error hover:text-error-dark">リセット</button>
     </div>
     <!-- BingoItemForm -->
     <div class="flex-1">
      <BingoItemForm v-model:seed="bingoSeeds[index - 1]" />
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BingoItemForm from '@/configMaker/BingoItemForm.vue';
import { useConfigMaker } from '@/configMaker/useConfigMaker';

// pinia
const { bingoSeeds, cardSize } = useConfigMaker();

// 総マス数を計算
const totalCells = computed(() => cardSize * cardSize);

// 外側のセル番号（1始まり）から行・列を計算し、ミニグリッド内の該当箇所を塗る関数
const isCurrentCellBlack = (cellIndex: number, row: number, col: number) => {
 const overallRow = Math.floor((cellIndex - 1) / cardSize) + 1;
 const overallCol = ((cellIndex - 1) % cardSize) + 1;
 return row === overallRow && col === overallCol;
};
</script>
