<!-- src/configMaker/BingoItemForm.vue -->
<template>
 <div class="flex flex-col gap-2 p-4 border rounded bg-base-200">
  <div class="flex items-center gap-2">
   <input
    v-model="seed.title"
    placeholder="お題を入力"
    class="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary bg-base-100"
   />
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
   <div class="flex flex-col">
    <label class="text-xs text-gray-600">出現割合</label>
    <input
     v-model.number="seed.weight"
     type="number"
     min="0"
     placeholder="出現割合"
     class="p-1 border rounded text-sm"
    />
   </div>

   <div class="grid grid-cols-3 gap-1 col-span-2 md:col-span-3">
    <div class="flex flex-col">
     <label class="text-xs text-gray-600">達成目標</label>
     <input
      v-model.number="seed.target"
      type="number"
      min="0"
      placeholder="目標値を入力"
      class="p-1 border rounded text-sm"
     />
    </div>
   </div>

   <div class="flex flex-col">
    <label class="text-xs text-gray-600">単位</label>
    <div class="flex items-center space-x-4">
     <label v-for="unit in [1, 10, 100, 1000]" :key="unit" class="flex items-center">
      <input v-model.number="seed.unit" type="radio" :value="unit" class="mr-2" />
      <span>{{ unit }}</span>
     </label>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { BingoItem } from '@/scripts/types';

defineProps<{ seed: BingoItem }>();
</script>
