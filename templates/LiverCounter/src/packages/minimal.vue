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
     :class="colorMap[counterConfig.typeColor ?? 'default'].textColor"
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
     <span class="text-xs text-gray-500 mt-1">
      {{ counterConfig.targetCountdown !== 0 ? '目標' : '最大' }}
     </span>
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
import { ColorType, CounterConfig } from '@scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// カラースキームに基づいたCSS変数を計算
const colorMap: Record<ColorType, { textColor: string }> = {
 default: { textColor: 'text-gray-800' },
 blue: { textColor: 'text-blue-800' },
 green: { textColor: 'text-green-800' },
 red: { textColor: 'text-red-800' },
 purple: { textColor: 'text-purple-800' },
 yellow: { textColor: 'text-yellow-800' },
 pink: { textColor: 'text-pink-800' },
 gray: { textColor: 'text-gray-300' }
};
</script>
