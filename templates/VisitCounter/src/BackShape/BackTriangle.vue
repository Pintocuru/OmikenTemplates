<!-- src/BackTriangle.vue -->
<template>
 <svg class="triangle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 173">
  <defs>
   <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color: var(--primary-color); stop-opacity: 1" />
    <stop offset="100%" style="stop-color: var(--secondary-color); stop-opacity: 1" />
   </linearGradient>
  </defs>
  <!-- 外側の三角形 -->
  <path d="M100 0 L0 173 L200 173 Z" fill="url(#triangleGradient)" stroke="none" />
  <!-- 内側の三角形（点線） -->
  <path
   d="M100 20 L17 163 L183 163 Z"
   fill="none"
   stroke="var(--background-light)"
   stroke-width="2"
   stroke-dasharray="5,5"
  />
 </svg>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

defineComponent({
 name: 'BackTriangle'
});
</script>
