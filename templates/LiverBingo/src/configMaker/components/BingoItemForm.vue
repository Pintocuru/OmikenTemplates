<!-- src/configMaker/BingoItemForm.vue -->
<template>
 <div class="flex flex-col gap-2 p-4 border rounded bg-base-200">
  <!-- お題 -->
  <div class="flex items-center gap-2">
   <input
    v-model="seed.title"
    placeholder="📝 お題を入力"
    class="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary bg-base-100"
   />
  </div>

  <!-- 出現割合 -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
   <div v-if="isRandom" class="flex flex-col">
    <label class="text-sm text-gray-600">🎲 出現割合 ({{ weightPercentage }}%)</label>
    <input
     v-model.number="seed.weight"
     type="number"
     min="0"
     placeholder="出現割合"
     class="p-1 border rounded"
    />
   </div>

   <div class="flex flex-col">
    <label class="text-sm text-gray-600">🎯 達成目標</label>
    <input
     v-model.number="seed.target"
     type="number"
     min="0"
     placeholder="目標値を入力"
     class="p-1 border rounded"
    />
   </div>

   <div class="flex flex-col">
    <label class="text-sm text-gray-600">📏 単位</label>
    <select v-model.number="seed.unit" class="p-1 border rounded bg-base-100">
     <option v-for="unit in [1, 10, 100, 1000]" :key="unit" :value="unit">
      {{ unit }}
     </option>
    </select>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BingoItem } from '@/scripts/schema';

const props = defineProps<{
 seed: BingoItem;
 data: BingoItem[];
 isRandom: boolean;
}>();

const totalWeight = computed(() => props.data.reduce((sum, item) => sum + item.weight, 0));

const weightPercentage = computed(() =>
 totalWeight.value ? ((props.seed.weight / totalWeight.value) * 100).toFixed(2) : '0'
);
</script>
