<!-- src/packages/BasicSquare.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative aspect-square w-28 rounded-md overflow-hidden shadow-lg bg-white"
   :style="{
    color: getColorValue(colorClasses.dark),
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: getColorValue(colorClasses.base)
   }"
   :class="{ 'animate-wobble': isAnimating }"
  >
   <!-- 紙の質感 -->
   <div class="absolute inset-0 opacity-10 bg-texture"></div>

   <!-- タイトル部分 -->
   <div
    v-if="counterConfig.title"
    class="w-full text-center pt-2 pb-1 px-2 font-semibold text-sm border-b"
    :style="{
     color: getColorValue(colorClasses.dark),
     borderColor: getColorValue(colorClasses.light)
    }"
   >
    {{ counterConfig.title }}
   </div>

   <!-- メインコンテンツ -->
   <div class="w-full h-full flex flex-col items-center justify-start p-3 relative">
    <!-- 倍率バッジ -->
    <div
     v-if="counterConfig.multiplier !== 1"
     class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md z-10 text-white"
     :style="{ backgroundColor: getColorValue(colorClasses.dark) }"
    >
     x{{ counterConfig.multiplier }}
    </div>

    <!-- カウンター値 -->
    <div class="relative flex items-center justify-center w-full px-1">
     <span
      :key="count"
      class="font-display text-4xl leading-tight text-center"
      :style="{
       color: getColorValue(colorClasses.dark)
      }"
     >
      {{ count }}
     </span>
     <span v-if="counterConfig.unit" class="text-sm ml-1 self-end opacity-80">
      {{ counterConfig.unit }}
     </span>
     <!-- 最大値表示 -->
     <div v-if="typeof countMax === 'number'" class="mt-1 ml-1 text-xs font-medium opacity-80">
      / {{ countMax }}
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ColorType, CounterConfig } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// アニメーション制御
const isAnimating = ref(false);

// カウント変更時のアニメーション
watch(
 () => props.count,
 (newVal, oldVal) => {
  if (newVal !== oldVal) {
   isAnimating.value = true;
   setTimeout(() => (isAnimating.value = false), 800);
  }
 }
);

// カラークラス設定
const colorClasses = computed(() => {
 const type = props.counterConfig.typeColor ?? 'default';
 const colors = {
  default: { base: 'gray-600', light: 'gray-500', dark: 'gray-700' },
  blue: { base: 'blue-600', light: 'blue-500', dark: 'blue-700' },
  green: { base: 'green-600', light: 'green-500', dark: 'green-700' },
  red: { base: 'red-600', light: 'red-500', dark: 'red-700' },
  purple: { base: 'purple-600', light: 'purple-500', dark: 'purple-700' },
  yellow: { base: 'yellow-600', light: 'yellow-500', dark: 'yellow-700' },
  pink: { base: 'pink-600', light: 'pink-500', dark: 'pink-700' },
  gray: { base: 'gray-600', light: 'gray-500', dark: 'gray-700' }
 };

 return colors[type];
});

// Tailwindの色クラスから実際のカラーコードに変換
const getColorValue = (colorClass: string) => {
 const colorMap: Record<string, Record<string, string>> = {
  gray: {
   '500': '#6b7280',
   '600': '#4b5563',
   '700': '#374151'
  },
  blue: {
   '500': '#3b82f6',
   '600': '#2563eb',
   '700': '#1d4ed8'
  },
  green: {
   '500': '#22c55e',
   '600': '#16a34a',
   '700': '#15803d'
  },
  red: {
   '500': '#ef4444',
   '600': '#dc2626',
   '700': '#b91c1c'
  },
  purple: {
   '500': '#a855f7',
   '600': '#9333ea',
   '700': '#7e22ce'
  },
  yellow: {
   '500': '#eab308',
   '600': '#ca8a04',
   '700': '#a16207'
  },
  pink: {
   '500': '#ec4899',
   '600': '#db2777',
   '700': '#be185d'
  }
 };

 const [color, shade] = colorClass.split('-');
 return colorMap[color]?.[shade] || '#374151'; // デフォルトはgray-700
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@700&display=swap');

/* カスタムフォント設定 */
.font-display {
 font-family: 'Montserrat', sans-serif;
 font-weight: 700;
}

.font-sans {
 font-family: 'Inter', sans-serif;
}

/* ボーダー幅用のユーティリティ */
.border-3 {
 border-width: 3px;
}

/* 揺れるアニメーション */
@keyframes wobble {
 0% {
  transform: rotate(0deg);
 }
 15% {
  transform: rotate(-3deg);
 }
 30% {
  transform: rotate(3deg);
 }
 45% {
  transform: rotate(-2deg);
 }
 60% {
  transform: rotate(2deg);
 }
 75% {
  transform: rotate(-1deg);
 }
 90% {
  transform: rotate(1deg);
 }
 100% {
  transform: rotate(0deg);
 }
}

.animate-wobble {
 animation: wobble 0.8s ease;
}
</style>
