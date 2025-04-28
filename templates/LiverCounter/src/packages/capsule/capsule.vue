<!-- capsule.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex min-w-36 rounded-xl overflow-hidden border-2 counter-component"
   :style="colorVars"
  >
   <div class="flex w-full items-center bg-white">
    <!-- Title -->
    <div class="py-2 px-3 font-bold text-lg text-white h-full flex items-center counter-title">
     {{ counterConfig.title }}
    </div>

    <!-- Counter -->
    <div class="px-3 py-2 flex items-center">
     <div class="flex items-baseline space-x-1">
      <TransitionGroup name="count" tag="span" class="inline-flex">
       <span :key="count" class="font-bold text-2xl counter-font counter-value">
        {{ count }}
       </span>
      </TransitionGroup>

      <span v-if="counterConfig.unit" class="text-sm pt-1 font-medium counter-text">
       {{ counterConfig.unit }}
      </span>

      <span v-if="typeof countMax === 'number'" class="text-sm pt-1 font-medium counter-text">
       / {{ countMax }}
      </span>
     </div>

     <!-- Multiplier -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-md text-white counter-badge"
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
 transform: translateY(-10px) scale(0.8);
}

.count-leave-to {
 opacity: 0;
 transform: translateY(10px) scale(0.8);
}

.count-leave-active {
 position: absolute;
}
</style>
