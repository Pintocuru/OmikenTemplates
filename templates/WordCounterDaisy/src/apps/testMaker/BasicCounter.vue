<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col min-w-36 rounded-xl overflow-hidden border-4"
   :class="{
    'border-blue-600': colorScheme === 'blue',
    'border-green-600': colorScheme === 'green',
    'border-red-600': colorScheme === 'red',
    'border-purple-600': colorScheme === 'purple',
    'border-indigo-600': colorScheme === 'indigo',
    'border-pink-600': colorScheme === 'pink',
    'border-yellow-600': colorScheme === 'yellow',
    'border-orange-600': colorScheme === 'orange',
    'border-teal-600': colorScheme === 'teal',
    'border-cyan-600': colorScheme === 'cyan'
   }"
  >
   <!-- Title -->
   <div
    class="w-full text-center py-3 px-4 font-bold text-2xl text-white"
    :class="{
     'bg-blue-600': colorScheme === 'blue',
     'bg-green-600': colorScheme === 'green',
     'bg-red-600': colorScheme === 'red',
     'bg-purple-600': colorScheme === 'purple',
     'bg-indigo-600': colorScheme === 'indigo',
     'bg-pink-600': colorScheme === 'pink',
     'bg-yellow-600': colorScheme === 'yellow',
     'bg-orange-600': colorScheme === 'orange',
     'bg-teal-600': colorScheme === 'teal',
     'bg-cyan-600': colorScheme === 'cyan'
    }"
   >
    {{ counterConfig.title }}
   </div>

   <!-- Body -->
   <div class="w-full flex items-center bg-white px-4 py-4">
    <div class="relative w-full flex flex-col items-center justify-center">
     <!-- Counter -->
     <div class="relative h-16 w-full flex items-center justify-center">
      <div class="flex items-baseline space-x-2">
       <TransitionGroup name="count" tag="span" class="inline-flex">
        <span
         :key="count"
         class="font-bold text-5xl leading-tight counter-font"
         :class="{
          'text-blue-600': colorScheme === 'blue',
          'text-green-600': colorScheme === 'green',
          'text-red-600': colorScheme === 'red',
          'text-purple-600': colorScheme === 'purple',
          'text-indigo-600': colorScheme === 'indigo',
          'text-pink-600': colorScheme === 'pink',
          'text-yellow-600': colorScheme === 'yellow',
          'text-orange-600': colorScheme === 'orange',
          'text-teal-600': colorScheme === 'teal',
          'text-cyan-600': colorScheme === 'cyan'
         }"
        >
         {{ count }}
        </span>
       </TransitionGroup>

       <span
        v-if="counterConfig.unit"
        class="text-xl pt-1 font-medium"
        :class="{
         'text-blue-600': colorScheme === 'blue',
         'text-green-600': colorScheme === 'green',
         'text-red-600': colorScheme === 'red',
         'text-purple-600': colorScheme === 'purple',
         'text-indigo-600': colorScheme === 'indigo',
         'text-pink-600': colorScheme === 'pink',
         'text-yellow-600': colorScheme === 'yellow',
         'text-orange-600': colorScheme === 'orange',
         'text-teal-600': colorScheme === 'teal',
         'text-cyan-600': colorScheme === 'cyan'
        }"
       >
        {{ counterConfig.unit }}
       </span>

       <span
        v-if="typeof countMax === 'number'"
        class="text-xl pt-1 font-medium"
        :class="{
         'text-blue-600': colorScheme === 'blue',
         'text-green-600': colorScheme === 'green',
         'text-red-600': colorScheme === 'red',
         'text-purple-600': colorScheme === 'purple',
         'text-indigo-600': colorScheme === 'indigo',
         'text-pink-600': colorScheme === 'pink',
         'text-yellow-600': colorScheme === 'yellow',
         'text-orange-600': colorScheme === 'orange',
         'text-teal-600': colorScheme === 'teal',
         'text-cyan-600': colorScheme === 'cyan'
        }"
       >
        / {{ countMax }}
       </span>
      </div>
     </div>

     <!-- Multiplier -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="absolute -right-3 -top-2 z-10 px-3 py-1 rounded-full text-sm font-bold shadow-md text-white"
      :class="{
       'bg-blue-600': colorScheme === 'blue',
       'bg-green-600': colorScheme === 'green',
       'bg-red-600': colorScheme === 'red',
       'bg-purple-600': colorScheme === 'purple',
       'bg-indigo-600': colorScheme === 'indigo',
       'bg-pink-600': colorScheme === 'pink',
       'bg-yellow-600': colorScheme === 'yellow',
       'bg-orange-600': colorScheme === 'orange',
       'bg-teal-600': colorScheme === 'teal',
       'bg-cyan-600': colorScheme === 'cyan'
      }"
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
 colorScheme?: ColorType;
}>();

// デフォルトのカラースキーム
const colorScheme = computed(() => props.colorScheme || 'blue');
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
 transform: translateY(-20px) scale(0.8);
}

.count-leave-to {
 opacity: 0;
 transform: translateY(20px) scale(0.8);
}

.count-leave-active {
 position: absolute;
}
</style>
