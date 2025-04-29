<!-- mini.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="rounded-full aspect-square flex flex-col items-center justify-center overflow-hidden border-8 shadow-md bg-white"
   :style="{ borderColor: colorMap[counterConfig.typeColor || 'default'] }"
   :class="[counterConfig.title ? 'w-32 h-32' : 'w-32 h-32']"
  >
   <!-- オプションのタイトル -->
   <div
    v-if="counterConfig.title"
    class="w-full text-center pt-1 pb-0 font-medium mb-0"
    :style="{ color: colorMap[counterConfig.typeColor || 'default'] }"
   >
    {{ counterConfig.title }}
   </div>

   <!-- カウンター本体 -->
   <div class="flex-1 flex flex-col items-center justify-center bg-white w-full">
    <div class="relative flex items-baseline">
     <TransitionGroup name="count" tag="span" class="inline-flex">
      <span
       :key="count"
       class="text-5xl font-bold leading-tight"
       :style="{ color: colorMap[counterConfig.typeColor || 'default'] }"
      >
       {{ count }}
      </span>
     </TransitionGroup>

     <span
      v-if="counterConfig.unit || typeof countMax === 'number'"
      class="text-sm ml-1 font-medium"
      :style="{ color: colorMap[counterConfig.typeColor || 'default'] }"
     >
      {{ counterConfig.unit }}{{ typeof countMax === 'number' ? ` / ${countMax}` : '' }}
     </span>
    </div>

    <!-- マルチプライヤー -->
    <div
     v-if="counterConfig.multiplier !== 1"
     class="text-xs font-bold px-2 py-0.5 rounded-full text-white mt-0"
     :style="{ backgroundColor: colorMap[counterConfig.typeColor || 'default'] }"
    >
     x{{ counterConfig.multiplier }}
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { type ColorType, type CounterConfig } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// カラーマップをシンプルに定義
const colorMap: Record<ColorType, string> = {
 default: '#2563eb',
 blue: '#2563eb',
 green: '#16a34a',
 red: '#dc2626',
 purple: '#9333ea',
 yellow: '#ca8a04',
 pink: '#db2777',
 gray: '#333'
};
</script>

<style scoped>
.count-enter-active,
.count-leave-active {
 transition: all 0.3s ease;
}

.count-enter-from {
 opacity: 0;
 transform: translateY(-10px);
}

.count-leave-to {
 opacity: 0;
 transform: translateY(10px);
}

.count-leave-active {
 position: absolute;
}
</style>
