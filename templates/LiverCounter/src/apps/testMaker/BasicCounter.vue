<!-- basic.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col min-w-36 rounded-xl overflow-hidden border-4 counter-component"
   :style="colorVars"
  >
   <!-- Title -->
   <div
    v-if="counterConfig.title"
    class="w-full text-center py-3 px-4 font-bold text-2xl text-white counter-title"
   >
    {{ counterConfig.title }}
   </div>

   <!-- Body -->
   <div class="w-full flex items-center bg-white px-4 py-4">
    <div class="relative w-full flex flex-col items-center justify-center">
     <!-- Counter -->
     <div class="relative h-16 w-full flex items-center justify-center">
      <div class="flex items-baseline space-x-2">
       <TransitionGroup name="count" tag="span" class="inline-flex">
        <span :key="count" class="font-bold text-5xl leading-tight counter-font counter-value">
         {{ count }}
        </span>
       </TransitionGroup>

       <span v-if="counterConfig.unit" class="text-xl pt-1 font-medium counter-text">
        {{ counterConfig.unit }}
       </span>

       <span v-if="typeof countMax === 'number'" class="text-xl pt-1 font-medium counter-text">
        / {{ countMax }}
       </span>
      </div>
     </div>

     <!-- Multiplier -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="absolute -right-3 -top-2 z-10 px-3 py-1 rounded-full text-sm font-bold shadow-md text-white counter-badge"
     >
      x{{ counterConfig.multiplier }}
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CounterConfig } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// カラースキームに基づいたCSS変数を計算
const colorVars = computed(() => {
 const colorMap = {
  default: '#2563eb', // blue-600
  blue: '#2563eb',
  green: '#16a34a',
  red: '#dc2626',
  purple: '#9333ea',
  yellow: '#ca8a04',
  pink: '#db2777',
  gray: '#333'
 };

 const selectedColor = colorMap[props.counterConfig.typeColor ?? 'default'];

 return {
  '--counter-color': selectedColor
 };
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

.counter-font {
 font-family: 'Mochiy Pop One', sans-serif;
}

/* カラースキームに関連するスタイル */
.counter-component {
 border-color: var(--counter-color);
}

.counter-title,
.counter-badge {
 background-color: var(--counter-color);
}

.counter-value,
.counter-text {
 color: var(--counter-color);
}

.count-enter-active,
.count-leave-active {
 transition: all 0.4s ease-in-out;
}

.count-enter-from {
 opacity: 0;
 transform: translateY(-20px) scale(0.8);
}

.count-leave-to {
 opacity: 0;
 transform: translateY(20px) scale(0.8);
}

.count-leave-active {
 position: absolute;
}
</style>
