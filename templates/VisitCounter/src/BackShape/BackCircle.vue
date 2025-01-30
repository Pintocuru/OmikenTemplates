<!-- src/BackCircle.vue -->
<template>
 <svg class="circle" xmlns="http://www.w3.org/2000/svg">
  <defs>
   <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color: var(--primary-color); stop-opacity: 1" />
    <stop offset="100%" style="stop-color: var(--secondary-color); stop-opacity: 1" />
   </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="100" fill="url(#circleGradient)" stroke="none" />
  <circle
   cx="100"
   cy="100"
   r="85"
   style="fill: none; stroke: var(--background-light); stroke-width: 2px; stroke-dasharray: 5, 5, 0, 0, 0, 0"
  />
 </svg>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

defineComponent({
 name: 'BackCircle'
});
</script>
