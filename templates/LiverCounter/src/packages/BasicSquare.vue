<!-- src/packages/BasicSquare.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative aspect-square w-28 rounded-md overflow-hidden shadow-lg bg-white border-3"
   :class="[colorClasses.borderColor, colorClasses.textColor, { 'animate-wobble': isAnimating }]"
  >
   <!-- 紙の質感 -->
   <div class="absolute inset-0 opacity-10 bg-texture"></div>

   <!-- タイトル部分 -->
   <div
    v-if="counterConfig.title"
    class="w-full text-center pt-2 pb-1 px-2 font-semibold text-sm border-b"
    :class="[colorClasses.textColor, colorClasses.borderLightColor]"
   >
    {{ counterConfig.title }}
   </div>

   <!-- メインコンテンツ -->
   <div class="w-full h-full flex flex-col items-center justify-start p-3 relative">
    <!-- 倍率バッジ -->
    <div
     v-if="counterConfig.multiplier !== 1"
     class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md z-10 text-white"
     :class="colorClasses.bgDarkColor"
    >
     x{{ counterConfig.multiplier }}
    </div>

    <!-- カウンター値 -->
    <div class="relative flex items-center justify-center w-full px-1">
     <span
      :key="count"
      class="font-display text-4xl leading-tight text-center"
      :class="colorClasses.textColor"
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

 const colorMap = {
  default: {
   borderColor: 'border-gray-600',
   borderLightColor: 'border-gray-500',
   textColor: 'text-gray-700',
   bgDarkColor: 'bg-gray-700'
  },
  blue: {
   borderColor: 'border-blue-600',
   borderLightColor: 'border-blue-500',
   textColor: 'text-blue-700',
   bgDarkColor: 'bg-blue-700'
  },
  green: {
   borderColor: 'border-green-600',
   borderLightColor: 'border-green-500',
   textColor: 'text-green-700',
   bgDarkColor: 'bg-green-700'
  },
  red: {
   borderColor: 'border-red-600',
   borderLightColor: 'border-red-500',
   textColor: 'text-red-700',
   bgDarkColor: 'bg-red-700'
  },
  purple: {
   borderColor: 'border-purple-600',
   borderLightColor: 'border-purple-500',
   textColor: 'text-purple-700',
   bgDarkColor: 'bg-purple-700'
  },
  yellow: {
   borderColor: 'border-yellow-600',
   borderLightColor: 'border-yellow-500',
   textColor: 'text-yellow-700',
   bgDarkColor: 'bg-yellow-700'
  },
  pink: {
   borderColor: 'border-pink-600',
   borderLightColor: 'border-pink-500',
   textColor: 'text-pink-700',
   bgDarkColor: 'bg-pink-700'
  },
  gray: {
   borderColor: 'border-gray-600',
   borderLightColor: 'border-gray-500',
   textColor: 'text-gray-700',
   bgDarkColor: 'bg-gray-700'
  }
 };

 return colorMap[type] || colorMap.default;
});
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
