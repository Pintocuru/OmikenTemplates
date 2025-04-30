<!-- BasicCircle.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="counter-container relative w-30 h-30 rounded-full flex items-center justify-center"
   :class="[`theme-${counterConfig.typeColor || 'blue'}`]"
  >
   <!-- グラデーションリング背景 -->
   <div class="absolute inset-0 rounded-full bg-gradient-to-br opacity-90 shadow-xl"></div>

   <!-- 内側の白い円 -->
   <div
    class="inner-circle absolute bg-white rounded-full w-24 h-24 flex items-center justify-center overflow-hidden shadow-inner"
   >
    <!-- タイトルエリア -->
    <div
     v-if="counterConfig.title"
     class="absolute top-3 left-0 right-0 title-badge text-center text-white text-lg font-semibold py-1 mx-auto w-4/5 rounded-full transform transition-all duration-300 ease-in-out"
    >
     {{ counterConfig.title }}
    </div>

    <!-- カウンター値 -->
    <div
     class="counter-content flex flex-col items-center justify-center"
     :class="{ 'mt-4': counterConfig.title }"
    >
     <div class="flex items-baseline justify-center">
      <TransitionGroup name="count" tag="span" class="inline-flex">
       <span
        :key="count"
        class="counter-value font-bold transition-all duration-300"
        :class="{ 'text-4xl': String(count).length <= 3, 'text-3xl': String(count).length > 3 }"
       >
        {{ count }}
       </span>
      </TransitionGroup>

      <span
       v-if="counterConfig.unit || typeof countMax === 'number'"
       class="counter-unit text-xs ml-1"
      >
       {{ counterConfig.unit }}{{ typeof countMax === 'number' ? ` / ${countMax}` : '' }}
      </span>
     </div>

     <!-- マルチプライヤー -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="multiplier-badge text-xs font-bold px-3 py-0 rounded-full text-white mt-0 shadow-md transform transition-transform duration-300"
     >
      ×{{ counterConfig.multiplier }}
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { CounterConfig } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();
</script>

<style scoped>
/* アニメーションの定義 */
.count-enter-active,
.count-leave-active {
 transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.count-enter-from {
 opacity: 0;
 transform: scale(0.8) translateY(-20px);
}

.count-leave-to {
 opacity: 0;
 transform: scale(0.8) translateY(20px);
}

.count-leave-active {
 position: absolute;
}

/* テーマカラー */
.theme-default {
 --theme-color: #374151;
 --theme-gradient: linear-gradient(135deg, #4b5563, #1f2937);
}

.theme-blue {
 --theme-color: #3b82f6;
 --theme-gradient: linear-gradient(135deg, #60a5fa, #2563eb);
}

.theme-green {
 --theme-color: #10b981;
 --theme-gradient: linear-gradient(135deg, #34d399, #059669);
}

.theme-red {
 --theme-color: #ef4444;
 --theme-gradient: linear-gradient(135deg, #f87171, #dc2626);
}

.theme-purple {
 --theme-color: #8b5cf6;
 --theme-gradient: linear-gradient(135deg, #a78bfa, #7c3aed);
}

.theme-yellow {
 --theme-color: #f59e0b;
 --theme-gradient: linear-gradient(135deg, #fbbf24, #d97706);
}

.theme-pink {
 --theme-color: #ec4899;
 --theme-gradient: linear-gradient(135deg, #f472b6, #be185d);
}

.theme-gray {
 --theme-color: #6b7280;
 --theme-gradient: linear-gradient(135deg, #9ca3af, #4b5563);
}

/* スタイリング適用 */
.counter-container .bg-gradient-to-br {
 background: var(--theme-gradient);
}

.inner-circle {
 transition: all 0.3s ease;
}

.counter-value {
 color: var(--theme-color);
 letter-spacing: -0.02em;
 font-family: 'Inter', 'Roboto', sans-serif;
}

.counter-unit {
 color: var(--theme-color);
 opacity: 0.7;
}

.title-badge {
 color: var(--theme-color);
}

.multiplier-badge {
 background: var(--theme-color);
 transition: all 0.2s ease;
}
</style>
