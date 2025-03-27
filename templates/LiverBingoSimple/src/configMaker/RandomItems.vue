<!-- src/configMaker/RandomItems.vue -->
<template>
 <div class="mt-8">
  <button @click="addSeed" class="px-3 py-1 bg-success rounded hover:bg-success-dark">
   + 追加
  </button>
 </div>

 <div class="space-y-3">
  <div
   v-for="(seed, index) in bingoRandomSeeds"
   :key="`random-${index}`"
   class="flex items-center gap-2"
  >
   <BingoItemForm
    v-model:seed="bingoRandomSeeds[index]"
    @copy="copySeed(index)"
    @remove="removeSeed(index)"
   />
  </div>
 </div>
</template>

<script setup lang="ts">
import { useConfigMaker } from '@/configMaker/useConfigMaker';
import BingoItemForm from '@/configMaker/BingoItemForm.vue';

// pinia
const { bingoRandomSeeds } = useConfigMaker();

// 新規追加
const addSeed = () => {
 bingoRandomSeeds.push({
  title: '',
  weight: 1,
  target: 0,
  unit: 1
 });
};

// 複製
const copySeed = (index: number) => {
 const newSeed = { ...bingoRandomSeeds[index] }; // データをコピー
 bingoRandomSeeds.splice(index + 1, 0, newSeed); // 同じ位置に挿入
};

// 削除
const removeSeed = (index: number) => {
 bingoRandomSeeds.splice(index, 1);
};
</script>
