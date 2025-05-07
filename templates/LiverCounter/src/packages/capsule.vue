<!-- capsule.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex min-w-36 rounded-xl overflow-hidden border-2"
   :class="[borderColor, { 'border-blue-600': !counterConfig.typeColor }]"
  >
   <div class="flex w-full items-center bg-white">
    <!-- Title -->
    <div class="py-2 px-3 font-bold text-lg text-white h-full flex items-center" :class="bgColor">
     {{ counterConfig.title }}
    </div>

    <!-- Counter -->
    <div class="px-3 py-2 flex items-center">
     <div class="flex items-baseline space-x-1">
      <TransitionGroup
       name="count"
       tag="span"
       class="inline-flex"
       enter-active-class="transition-all duration-500"
       enter-from-class="opacity-0 scale-90 -translate-y-5"
       leave-to-class="opacity-0 scale-90 translate-y-5"
       leave-active-class="absolute"
      >
       <span :key="count" class="font-bold text-2xl counter-font" :class="textColor">
        {{ count }}
       </span>
      </TransitionGroup>

      <span v-if="counterConfig.unit" class="text-sm pt-1 font-medium" :class="textColor">
       {{ counterConfig.unit }}
      </span>

      <span v-if="typeof countMax === 'number'" class="text-sm pt-1 font-medium" :class="textColor">
       / {{ countMax }}
      </span>
     </div>

     <!-- Multiplier -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-md text-white"
      :class="bgColor"
     >
      x{{ counterConfig.multiplier }}
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

// カラーマッピング
const colorMap: Record<ColorType, { textColor: string; bgColor: string; borderColor: string }> = {
 default: {
  textColor: 'text-gray-500',
  bgColor: 'bg-gray-500',
  borderColor: 'border-gray-500'
 },
 blue: {
  textColor: 'text-blue-600',
  bgColor: 'bg-blue-600',
  borderColor: 'border-blue-600'
 },
 green: {
  textColor: 'text-green-600',
  bgColor: 'bg-green-600',
  borderColor: 'border-green-600'
 },
 red: {
  textColor: 'text-red-600',
  bgColor: 'bg-red-600',
  borderColor: 'border-red-600'
 },
 purple: {
  textColor: 'text-purple-600',
  bgColor: 'bg-purple-600',
  borderColor: 'border-purple-600'
 },
 yellow: {
  textColor: 'text-yellow-600',
  bgColor: 'bg-yellow-600',
  borderColor: 'border-yellow-600'
 },
 pink: {
  textColor: 'text-pink-600',
  bgColor: 'bg-pink-600',
  borderColor: 'border-pink-600'
 },
 gray: {
  textColor: 'text-gray-800',
  bgColor: 'bg-gray-800',
  borderColor: 'border-gray-800'
 }
};

// 現在のカラーを計算
const currentColor = computed(() => {
 return colorMap[props.counterConfig.typeColor || 'default'];
});

const textColor = computed(() => currentColor.value.textColor);
const bgColor = computed(() => currentColor.value.bgColor);
const borderColor = computed(() => currentColor.value.borderColor);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

.counter-font {
 font-family: 'Mochiy Pop One', sans-serif;
}
</style>
