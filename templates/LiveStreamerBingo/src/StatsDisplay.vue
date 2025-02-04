<!-- src/StatsDisplay.vue -->
<template>
 <div class="info-container" v-if="SVG_MODE > -1">
  <div class="counts-row">
   <div class="info-item info-syoken" v-if="SVG_MODE === 0">
    <span class="info-value">{{ firstVisitCount }}</span>
    <span class="info-label">初見</span>
   </div>
   <div class="info-item">
    <span class="info-value">{{ visitCount }}</span>
    <span class="info-label">来場者</span>
   </div>
   <div class="info-item">
    <span class="info-value">{{ commentCount }}</span>
    <span class="info-label">コメント</span>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
defineProps<{
 SVG_MODE: number;
 firstVisitCount: number;
 visitCount: number;
 commentCount: number;
}>();
</script>
