<template>
 <v-card class="mx-auto" max-width="800">
  <v-card-title class="text-h5 font-weight-bold"> ランキング </v-card-title>

  <v-card-text>
   <v-table density="comfortable">
    <thead>
     <tr>
      <th class="text-left">順位</th>
      <th class="text-left">ユーザー</th>
      <th class="text-right">勝利数</th>
      <th class="text-right">対戦数</th>
      <th class="text-right">勝率</th>
      <th class="text-right">最終対戦</th>
     </tr>
    </thead>
    <tbody>
     <tr
      v-for="(ranking, index) in rankings"
      :key="ranking.userId"
      :class="getRowColor(ranking.userId)"
      @click="handleUserClick(ranking.userId)"
      style="cursor: pointer"
     >
      <td>{{ index + 1 }}</td>
      <td>{{ ranking.userId }}</td>
      <td class="text-right">{{ ranking.wins }}</td>
      <td class="text-right">{{ ranking.draws }}</td>
      <td class="text-right">{{ formatRate(ranking.rate) }}%</td>
      <td class="text-right">{{ ranking.lastPlayed }}</td>
     </tr>
    </tbody>
   </v-table>
  </v-card-text>
 </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type Ranking = {
 userId: string;
 wins: number;
 draws: number;
 rate: number;
 lastPlayed: string;
};

interface Props {
 rankings: Ranking[];
 currentUserId?: string;
}

const props = withDefaults(defineProps<Props>(), {
 rankings: () => [],
 currentUserId: undefined
});

const emit = defineEmits(['userClick']);

// ランキングの各行の背景色を計算
const getRowColor = computed(() => (userId: string) => {
 if (userId === props.currentUserId) return 'bg-primary-lighten-4';
 return '';
});

// 勝率の表示形式を整える
const formatRate = (rate: number): string => {
 return rate.toFixed(1);
};

// ユーザークリック時の処理
const handleUserClick = (userId: string) => {
 emit('userClick', userId);
};
</script>

<style scoped>
.v-table {
 cursor: pointer;
}

.v-table tr:hover {
 background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
