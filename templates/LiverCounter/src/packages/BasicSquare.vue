<!-- src/packages/BasicSquare.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative min-w-28 w-auto max-w-xs rounded-md overflow-hidden shadow-lg bg-white border-3"
   :class="[colorConfig.borderColor, colorConfig.textColor, { 'animate-wobble': isAnimating }]"
  >
   <!-- 紙の質感 -->
   <div class="absolute inset-0 opacity-10 bg-texture"></div>

   <!-- タイトル部分 -->
   <div
    v-if="counterConfig.title"
    class="w-full text-center pt-2 pb-1 px-2 font-semibold text-sm border-b"
    :class="[colorConfig.textColor, colorConfig.borderLightColor]"
   >
    {{ counterConfig.title }}
   </div>

   <!-- メインコンテンツ -->
   <div class="w-full h-full flex flex-col items-center justify-start p-3 relative">
    <!-- 倍率バッジ -->
    <div
     v-if="counterConfig.multiplier !== 1"
     class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md z-10 text-white"
     :class="colorConfig.bgColor"
    >
     x{{ counterConfig.multiplier }}
    </div>

    <!-- カウンター値 -->
    <div class="relative flex items-center justify-center w-full px-1 whitespace-nowrap">
     <span
      :key="count"
      class="font-display leading-tight text-center"
      :class="[
       colorConfig.textColor,
       { 'text-4xl': String(count).length <= 2, 'text-3xl': String(count).length > 2 }
      ]"
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
   <!-- ✅ 進捗バー -->
   <div
    v-if="counterConfig.targetCountdown !== 0"
    class="absolute bottom-0 left-0 h-1.5 transition-all duration-300"
    :class="[
     progressPercentage === 100
      ? 'bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 animate-gradient'
      : 'bg-' + colorMap[counterConfig.typeColor || 'default'].borderColor.replace('border-', '')
    ]"
    :style="{ width: `${progressPercentage}%` }"
   />
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ColorType, CounterConfig } from '@scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// アニメーション制御
const isAnimating = ref(false);

// 進捗率
const progressPercentage = computed(() => {
 if (props.counterConfig.targetCountdown === 0) return 0;
 const raw = (props.count / props.counterConfig.targetCountdown) * 100;
 return Math.min(raw, 100);
});

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
const colorMap: Record<
 ColorType,
 {
  borderColor: string;
  borderLightColor: string;
  textColor: string;
  bgColor: string;
 }
> = {
 default: {
  borderColor: 'border-gray-600',
  borderLightColor: 'border-gray-500',
  textColor: 'text-gray-700',
  bgColor: 'bg-gray-700'
 },
 blue: {
  borderColor: 'border-blue-600',
  borderLightColor: 'border-blue-500',
  textColor: 'text-blue-700',
  bgColor: 'bg-blue-700'
 },
 green: {
  borderColor: 'border-green-600',
  borderLightColor: 'border-green-500',
  textColor: 'text-green-700',
  bgColor: 'bg-green-700'
 },
 red: {
  borderColor: 'border-red-600',
  borderLightColor: 'border-red-500',
  textColor: 'text-red-700',
  bgColor: 'bg-red-700'
 },
 purple: {
  borderColor: 'border-purple-600',
  borderLightColor: 'border-purple-500',
  textColor: 'text-purple-700',
  bgColor: 'bg-purple-700'
 },
 yellow: {
  borderColor: 'border-yellow-600',
  borderLightColor: 'border-yellow-500',
  textColor: 'text-yellow-700',
  bgColor: 'bg-yellow-700'
 },
 pink: {
  borderColor: 'border-pink-600',
  borderLightColor: 'border-pink-500',
  textColor: 'text-pink-700',
  bgColor: 'bg-pink-700'
 },
 gray: {
  borderColor: 'border-gray-600',
  borderLightColor: 'border-gray-500',
  textColor: 'text-gray-700',
  bgColor: 'bg-gray-700'
 }
};

const colorConfig = computed(() => {
 const type = props.counterConfig.typeColor ?? 'default';

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

@keyframes gradientAnimation {
 0% {
  background-position: 0% 50%;
 }
 50% {
  background-position: 100% 50%;
 }
 100% {
  background-position: 0% 50%;
 }
}

.animate-gradient {
 background-size: 200% 200%;
 animation: gradientAnimation 3s ease infinite;
}
</style>
