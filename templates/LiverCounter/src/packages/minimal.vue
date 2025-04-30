<!-- minimal.vue -->
<template>
 <div class="flex flex-col items-center space-y-2">
  <!-- タイトル -->
  <div v-if="counterConfig.title" class="text-sm font-semibold text-gray-500 text-center">
   {{ counterConfig.title }}
  </div>

  <!-- カウント表示エリア -->
  <div class="relative flex items-center space-x-6">
   <!-- 値 + ラベル -->
   <div class="flex flex-col items-center">
    <span
     class="text-4xl font-light transition-all duration-300"
     :style="{ color: colorVars['--counter-color'] }"
    >
     {{ count }}
    </span>
    <span class="text-xs text-gray-500 mt-1">
     {{ counterConfig.unit ?? 'カウント' }}
    </span>
   </div>

   <!-- セパレーターと最大値 -->
   <template v-if="typeof countMax === 'number'">
    <div class="h-8 w-px bg-gray-500"></div>
    <div class="flex flex-col items-center">
     <span class="text-xl font-light text-gray-500">
      {{ countMax }}
     </span>
     <span class="text-xs text-gray-500 mt-1">最大</span>
    </div>
   </template>

   <!-- multiplierバッジ -->
   <div
    v-if="counterConfig.multiplier !== 1"
    class="absolute -top-3 -right-4 text-white text-xs bg-gray-500 rounded-full px-2 py-0.5"
   >
    x{{ counterConfig.multiplier }}
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ColorType, CounterConfig } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// カラースキームに基づいたCSS変数を計算
const colorVars = computed(() => {
 const colorMap: Record<ColorType, string> = {
  default: '#1f2937', // = gray-800
  blue: '#1e40af', // = blue-800
  green: '#065f46', // = green-800
  red: '#991b1b', // = red-800
  purple: '#6b21a8', // = purple-800
  yellow: '#854d0e', // = yellow-800
  pink: '#9d174d', // = pink-800
  gray: '#d1d5dc' // = gray-300
 };

 const selectedColor = colorMap[props.counterConfig.typeColor ?? 'default'];

 return {
  '--counter-color': selectedColor
 };
});
</script>
