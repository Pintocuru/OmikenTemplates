<!-- src/BackgroundComponent.vue -->
<template>
 <div class="syoken-container" v-if="SVG_MODE >= 1">
  <div class="wrapper animate__animated animate__pulse">
   <!-- 星 -->
   <BackStar v-if="SVG_MODE === 1" />
   <!-- 円 -->
   <BackCircle v-if="SVG_MODE === 2" />
   <!-- 三角 -->
   <BackTriangle v-if="SVG_MODE === 3" />
  </div>
  <div class="first-visit-count">{{ firstVisitCount }}</div>
  <div class="banner">初見さん</div>
 </div>
</template>

<script setup lang="ts">
import BackStar from './BackShape/BackStar.vue';
import BackCircle from './BackShape/BackCircle.vue';
import BackTriangle from './BackShape/BackTriangle.vue';
defineProps<{
 SVG_MODE: number;
 firstVisitCount: number;
}>();
</script>
