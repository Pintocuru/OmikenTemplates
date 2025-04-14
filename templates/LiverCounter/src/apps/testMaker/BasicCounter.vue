<!-- basicCounter.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex min-w-36 rounded-xl overflow-hidden border-2"
   :class="getColorClass('border')"
  >
   <div class="flex w-full items-center bg-white">
    <!-- Title -->
    <div
     class="py-2 px-3 font-bold text-lg text-white h-full flex items-center"
     :class="getColorClass('bg')"
    >
     {{ counterConfig.title }}
    </div>

    <!-- Counter -->
    <div class="px-3 py-2 flex items-center">
     <div class="flex items-baseline space-x-1">
      <TransitionGroup name="count" tag="span" class="inline-flex">
       <span :key="count" class="font-bold text-2xl counter-font" :class="getColorClass('text')">
        {{ count }}
       </span>
      </TransitionGroup>

      <span
       v-if="counterConfig.unit"
       class="text-sm pt-1 font-medium"
       :class="getColorClass('text')"
      >
       {{ counterConfig.unit }}
      </span>

      <span
       v-if="typeof countMax === 'number'"
       class="text-sm pt-1 font-medium"
       :class="getColorClass('text')"
      >
       / {{ countMax }}
      </span>
     </div>

     <!-- Multiplier -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-md text-white"
      :class="getColorClass('bg')"
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
import { ColorType } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: { title: string; unit?: string; multiplier?: number };
 colorScheme: ColorType;
}>();

// デフォルトのカラースキーム
const colorScheme = computed(() => props.colorScheme);

// 色クラスを取得する関数
function getColorClass(type: 'text' | 'bg' | 'border') {
 const color = colorScheme.value;
 return `${type}-${color}-600`;
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

.counter-font {
 font-family: 'Mochiy Pop One', sans-serif;
}

.count-enter-active,
.count-leave-active {
 transition: all 0.4s ease-in-out;
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
</style>
