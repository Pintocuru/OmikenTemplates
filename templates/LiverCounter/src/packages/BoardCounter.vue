<!-- src/packages/BoardCounter.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="color-paper relative aspect-square w-32 rounded-sm overflow-hidden shadow-lg bg-white"
   :style="colorVars"
   :class="{ 'animate-wobble': isAnimating }"
  >
   <!-- 色紙の模様効果 -->
   <div class="paper-texture absolute inset-0 opacity-10"></div>

   <!-- タイトル部分 -->
   <div
    v-if="counterConfig.title"
    class="w-full text-center pt-3 pb-1 px-2 font-bold text-sm border-b"
    :style="{ color: colorVars['--paper-dark'], borderColor: colorVars['--paper-light'] }"
   >
    {{ counterConfig.title }}
   </div>

   <!-- メインコンテンツ -->
   <div class="paper-content w-full h-full flex flex-col items-center justify-start p-3 relative">
    <!-- 倍率バッジ -->
    <div
     v-if="counterConfig.multiplier !== 1"
     class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold shadow-md z-10"
     :style="{ backgroundColor: colorVars['--paper-dark'], color: 'white' }"
    >
     x{{ counterConfig.multiplier }}
    </div>

    <!-- カウンター値 -->
    <div class="relative flex items-center justify-center w-full px-1">
     <TransitionGroup
      name="count"
      tag="div"
      class="inline-flex items-baseline justify-center w-full"
     >
      <span :key="count" class="font-bold text-4xl leading-tight counter-value text-center">
       {{ count }}
      </span>
      <span v-if="counterConfig.unit" class="text-sm ml-1 counter-unit self-end">
       {{ counterConfig.unit }}
      </span>
     </TransitionGroup>
     <!-- 最大値がある場合 -->
     <div v-if="typeof countMax === 'number'" class="mt-1 text-xs font-medium counter-max">
      /{{ countMax }}
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

// アニメーション制御用
const isAnimating = ref(false);

// countの変更を監視して揺れアニメーションを適用
watch(
 () => props.count,
 (newVal, oldVal) => {
  if (newVal !== oldVal) {
   isAnimating.value = true;
   setTimeout(() => {
    isAnimating.value = false;
   }, 800); // アニメーション時間
  }
 }
);

// カラースキームに基づいたCSS変数を計算
const colorVars = computed(() => {
 const colorMap: Record<ColorType, { base: string; light: string; dark: string }> = {
  default: {
   base: '#3b82f6',
   light: '#dbeafe',
   dark: '#2563eb'
  },
  blue: {
   base: '#3b82f6',
   light: '#dbeafe',
   dark: '#2563eb'
  },
  green: {
   base: '#22c55e',
   light: '#dcfce7',
   dark: '#16a34a'
  },
  red: {
   base: '#ef4444',
   light: '#fee2e2',
   dark: '#dc2626'
  },
  purple: {
   base: '#a855f7',
   light: '#f3e8ff',
   dark: '#9333ea'
  },
  yellow: {
   base: '#eab308',
   light: '#fef9c3',
   dark: '#ca8a04'
  },
  pink: {
   base: '#ec4899',
   light: '#fce7f3',
   dark: '#db2777'
  },
  gray: {
   base: '#6b7280',
   light: '#f3f4f6',
   dark: '#4b5563'
  }
 };

 const selectedColor = colorMap[props.counterConfig.typeColor ?? 'default'];

 return {
  '--paper-base': selectedColor.base,
  '--paper-light': selectedColor.light,
  '--paper-dark': selectedColor.dark,
  '--texture-url': `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E")`,
  'border-color': selectedColor.base
 };
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700&display=swap');

.color-paper {
 font-family: 'M PLUS Rounded 1c', sans-serif;
 border: 3px solid var(--paper-base);
 background: white;
 box-shadow:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
 position: relative;
}

.color-paper::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 border: 1px solid var(--paper-light);
 pointer-events: none;
}

.paper-texture {
 background-image: var(--texture-url);
 background-size: 100px 100px;
}

.counter-value {
 font-family: 'Mochiy Pop One', sans-serif;
 color: var(--paper-dark);
}

.counter-unit,
.counter-max {
 color: var(--paper-dark);
 opacity: 0.8;
}

/* カウント変更アニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
