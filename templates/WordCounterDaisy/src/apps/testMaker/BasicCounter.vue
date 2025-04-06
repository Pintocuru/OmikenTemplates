<!-- AnyGenerator.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col min-w-[140px] rounded-2xl overflow-hidden border-4"
   :class="`border-primary`"
  >
   <!-- Title -->
   <div
    class="w-full text-center py-2 px-4 font-bold text-2xl"
    :class="`bg-primary text-primary-content`"
   >
    {{ counterConfig.title }}
   </div>

   <!-- Body -->
   <div class="w-full flex items-center bg-base-100 px-4 py-3">
    <div class="relative w-full flex flex-col items-center justify-center">
     <!-- Counter -->
     <div class="relative h-[60px] w-full flex items-center justify-center">
      <div class="flex items-baseline space-x-1">
       <TransitionGroup name="count" tag="span" class="inline-flex">
        <span :key="count" class="text-primary font-bold text-4xl font-[Mochiy_Pop_One]">
         {{ count }}
        </span>
       </TransitionGroup>
       <span v-if="typeof countMax === 'number'" class="text-primary pt-2"> / {{ countMax }} </span>
      </div>
     </div>

     <!-- Multiplier -->
     <div
      v-if="counterConfig.MULTIPLIER !== 1"
      class="absolute -right-4 -top-2 z-10 bg-primary text-primary-content px-2 py-1 rounded-full text-xs font-bold shadow-md"
     >
      x{{ counterConfig.MULTIPLIER }}
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
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

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
