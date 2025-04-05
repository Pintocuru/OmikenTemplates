<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-row items-center justify-center rounded-2xl overflow-hidden border-4"
   :class="`border-primary`"
  >
   <!-- タイトル部分 -->
   <div class="py-2 px-4 font-bold text-2xl" :class="`bg-primary text-primary-content`">
    {{ counterConfig.title }}
   </div>

   <!-- カウンター部分 -->
   <div class="flex items-center justify-center rounded-md bg-base-100 px-2 py-1 mx-2">
    <TransitionGroup name="count">
     <div :key="count" class="text-primary font-bold text-4xl counter-value">
      {{ count }}
     </div>
    </TransitionGroup>
    <span
     v-if="counterConfig.MULTIPLIER !== 1"
     class="text-primary font-bold text-base counter-value"
     >x {{ counterConfig.MULTIPLIER }}</span
    >
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { CounterConfig } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 counterConfig: CounterConfig;
}>();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

.counter-value {
 font-family: 'Mochiy Pop One', sans-serif;
}

/* カウント変更時のアニメーション */
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
 position: absolute;
}

.count-leave-active {
 position: absolute;
}
</style>
