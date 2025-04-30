<!-- CyberNeon.vue -->
<template>
 <div class="flex flex-col space-y-4 items-center">
  <!-- サイバーパンク風カウンター：カウント表示 -->
  <div class="flex items-end">
   <div
    class="bg-black border-l-4 pl-3 pr-4 py-2"
    :style="{ borderColor: colorMap[counterConfig.typeColor || 'default'] }"
   >
    <div
     class="text-xs font-bold uppercase"
     :style="{ color: colorMap[counterConfig.typeColor || 'default'] }"
    >
     {{ counterConfig.title || '' }}
    </div>
    <div class="text-2xl font-bold text-white">
     {{ count }}
     <span class="text-sm" :style="{ color: colorMap[counterConfig.typeColor || 'default'] }">
      {{ counterConfig.unit || '' }}
     </span>
     <!-- 最大値 -->
     <span v-if="typeof countMax === 'number'" class="text-sm"> / {{ countMax }} </span>
    </div>
   </div>

   <!-- マルチプライヤー -->
   <div v-if="counterConfig.multiplier !== 1" class="bg-black pr-2 py-1 self-end">
    <div class="text-sm font-bold text-white">×{{ counterConfig.multiplier }}</div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { type CounterConfig, type ColorType } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

const colorMap: Record<ColorType, string> = {
 default: '#ddd',
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
/* 追加で雰囲気を出したい場合のカスタムフォントやアニメーションも対応可能 */
</style>
