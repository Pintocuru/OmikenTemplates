<!-- BasicCircle.vue -->
<template>
 <div class="flex items-center justify-center">
  <div class="counter-container relative w-30 h-30 rounded-full flex items-center justify-center">
   <!-- グラデーションリング背景 -->
   <div
    class="absolute inset-0 rounded-full opacity-90 shadow-xl"
    :class="colorConfig.gradient"
   ></div>

   <!-- 円型の進捗バー -->
   <svg
    v-if="counterConfig.targetCountdown !== 0"
    class="absolute inset-0 w-full h-full"
    viewBox="0 0 100 100"
   >
    <defs>
     <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ec4899">
       <animate
        attributeName="stop-color"
        values="#ec4899;#facc15;#22d3ee;#ec4899"
        dur="4s"
        repeatCount="indefinite"
       />
      </stop>
      <stop offset="50%" stop-color="#facc15">
       <animate
        attributeName="stop-color"
        values="#facc15;#22d3ee;#ec4899;#facc15"
        dur="4s"
        repeatCount="indefinite"
       />
      </stop>
      <stop offset="100%" stop-color="#22d3ee">
       <animate
        attributeName="stop-color"
        values="#22d3ee;#ec4899;#facc15;#22d3ee"
        dur="4s"
        repeatCount="indefinite"
       />
      </stop>
     </linearGradient>
    </defs>

    <circle
     cx="50"
     cy="50"
     r="45"
     fill="none"
     stroke-width="5"
     :stroke="progressPercentage === 100 ? 'url(#rainbow-gradient)' : colorConfig.progressStroke"
     :class="[progressPercentage !== 100 ? 'opacity-80' : '']"
     stroke-dasharray="283"
     :stroke-dashoffset="283 - (283 * progressPercentage) / 100"
     transform="rotate(-90 50 50)"
    />
   </svg>

   <!-- 内側の白い円 -->
   <div
    class="inner-circle absolute bg-white rounded-full w-24 h-24 flex items-center justify-center overflow-hidden shadow-inner"
   >
    <!-- タイトルエリア -->
    <div
     v-if="counterConfig.title"
     class="absolute top-3 left-0 right-0 title-badge text-center text-lg font-bold py-1 mx-auto w-4/5 rounded-full transform transition-all duration-300 ease-in-out"
     :class="colorConfig.text"
    >
     {{ counterConfig.title }}
    </div>

    <!-- カウンター値 -->
    <div
     class="counter-content flex flex-col items-center justify-center"
     :class="{ 'mt-4': counterConfig.title }"
    >
     <div class="flex items-baseline justify-center whitespace-nowrap">
      <TransitionGroup
       name="count"
       tag="span"
       class="inline-flex"
       enter-active-class="transition-all duration-500"
       enter-from-class="opacity-0 scale-90 -translate-y-5"
       leave-to-class="opacity-0 scale-90 translate-y-5"
       leave-active-class="absolute"
      >
       <span
        :key="count"
        class="counter-value font-bold transition-all duration-300"
        :class="[
         colorConfig.text,
         { 'text-3xl': String(count).length <= 2, 'text-2xl': String(count).length > 2 }
        ]"
       >
        {{ count }}
       </span>
      </TransitionGroup>

      <span
       v-if="counterConfig.unit || typeof countMax === 'number'"
       class="counter-unit font-bold"
       :class="colorConfig.textOpacity"
      >
       {{ counterConfig.unit }}{{ typeof countMax === 'number' ? ` / ${countMax}` : '' }}
      </span>
     </div>

     <!-- マルチプライヤー -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="multiplier-badge text-xs font-bold px-3 py-0 rounded-full text-white mt-0 shadow-md transform transition-transform duration-300"
      :class="colorConfig.bg"
     >
      ×{{ counterConfig.multiplier }}
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ColorType, CounterConfig } from '@scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// 進捗率
const progressPercentage = computed(() => {
 if (!props.counterConfig.targetCountdown || props.counterConfig.targetCountdown === 0) return 0;
 const raw = (props.count / props.counterConfig.targetCountdown) * 100;
 return Math.min(raw, 100);
});

// 色の設定をひとまとめにする
const colorConfig = computed(() => {
 const colorType = props.counterConfig.typeColor || 'blue';
 return {
  gradient: colorMappings[colorType].gradient,
  text: colorMappings[colorType].text,
  textOpacity: colorMappings[colorType].textOpacity,
  bg: colorMappings[colorType].bg,
  progressStroke: colorMappings[colorType].progressStroke
 };
});

// 色のマッピング
const colorMappings: Record<
 ColorType,
 {
  gradient: string;
  text: string;
  textOpacity: string;
  bg: string;
  progressStroke: string;
 }
> = {
 default: {
  gradient: 'bg-gradient-to-br from-gray-600 to-gray-800',
  text: 'text-gray-700',
  textOpacity: 'text-gray-700/70',
  bg: 'bg-gray-700',
  progressStroke: '#9CA3AF' // gray-400
 },
 blue: {
  gradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
  text: 'text-blue-500',
  textOpacity: 'text-blue-500/70',
  bg: 'bg-blue-500',
  progressStroke: '#60A5FA' // blue-400
 },
 green: {
  gradient: 'bg-gradient-to-br from-green-400 to-green-700',
  text: 'text-green-600',
  textOpacity: 'text-green-600/70',
  bg: 'bg-green-600',
  progressStroke: '#34D399' // green-400
 },
 red: {
  gradient: 'bg-gradient-to-br from-red-400 to-red-600',
  text: 'text-red-500',
  textOpacity: 'text-red-500/70',
  bg: 'bg-red-500',
  progressStroke: '#F87171' // red-400
 },
 purple: {
  gradient: 'bg-gradient-to-br from-purple-300 to-purple-600',
  text: 'text-purple-500',
  textOpacity: 'text-purple-500/70',
  bg: 'bg-purple-500',
  progressStroke: '#C084FC' // purple-400
 },
 yellow: {
  gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
  text: 'text-yellow-500',
  textOpacity: 'text-yellow-500/70',
  bg: 'bg-yellow-500',
  progressStroke: '#FBBF24' // yellow-400
 },
 pink: {
  gradient: 'bg-gradient-to-br from-pink-400 to-pink-700',
  text: 'text-pink-500',
  textOpacity: 'text-pink-500/70',
  bg: 'bg-pink-500',
  progressStroke: '#F472B6' // pink-400
 },
 gray: {
  gradient: 'bg-gradient-to-br from-gray-400 to-gray-600',
  text: 'text-gray-500',
  textOpacity: 'text-gray-500/70',
  bg: 'bg-gray-500',
  progressStroke: '#9CA3AF' // gray-400
 }
};
</script>

<style scoped>
.counter-value {
 font-family: 'Inter', 'Roboto', sans-serif;
}

@keyframes progress {
 0% {
  stroke-dashoffset: 283;
 }
}
</style>
