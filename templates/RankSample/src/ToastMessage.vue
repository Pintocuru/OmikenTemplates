<template>
 <div class="p-2 bg-blue-900 rounded-lg shadow-lg max-w-md">
  <h2 class="text-2xl font-semibold text-center text-yellow-400">👊 じゃんけん 🖐️</h2>
  <table class="min-w-full mt-4 table-auto text-white">
   <thead>
    <tr class="border-b border-gray-600">
     <th class="py-1">順位</th>
     <th class="">ユーザー名</th>
     <th class="">勝利数</th>
     <th class="">挑戦数</th>
     <th class="">勝率</th>
    </tr>
   </thead>
   <tbody>
    <tr
     v-for="(ranking, index) in rankings"
     :key="ranking.userId"
     :class="{ 'bg-yellow-200': ranking.userId === currentUserId }"
     class="hover:bg-gray-600"
    >
     <td class="px-2 py-2 text-center">{{ index + 1 }}</td>
     <td class="py-2 text-center">{{ ranking.name }}</td>
     <td class="py-2 text-center">{{ ranking.wins }}</td>
     <td class="py-2 text-center">{{ ranking.draws }}</td>
     <td class="px-2 py-2 text-center">{{ formatRate(ranking.rate) }}%</td>
    </tr>
   </tbody>
  </table>
 </div>
</template>

<script setup lang="ts">
import { Props } from './types';

const props = withDefaults(defineProps<Props>(), {
 rankings: () => [],
 currentUserId: undefined
});

const emit = defineEmits(['userClick']);

const formatRate = (rate: number): string => {
 return rate.toFixed(1);
};

const handleUserClick = (userId: string) => {
 emit('userClick', userId);
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
 font-family: 'Roboto', sans-serif;
}
</style>
