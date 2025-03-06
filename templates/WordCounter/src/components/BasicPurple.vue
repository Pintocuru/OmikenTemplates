<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col items-center justify-center w-44 h-44 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg overflow-hidden"
  >
   <!-- 背景エフェクト -->
   <div class="absolute inset-0 bg-black opacity-20 mix-blend-overlay"></div>
   <div
    class="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-500/30 backdrop-blur-sm"
   ></div>

   <!-- カウンター -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <TransitionGroup name="count">
     <div :key="count" class="text-7xl font-sans font-bold text-white tracking-tight">
      {{ count }}
     </div>
    </TransitionGroup>

    <div class="text-xl font-medium text-white/90 mt-1 tracking-wide">
     <span class="relative">
      おは！
      <span class="absolute bottom-0 left-0 w-full h-0.5 bg-white/40 transform origin-left"></span>
     </span>
    </div>
   </div>

   <!-- 装飾リング -->
   <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Bell } from 'lucide-vue-next';

const props = defineProps<{ isInitFlag: boolean; count: number }>();
</script>

<style scoped>
/* カウント変更時のアニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.count-enter-from {
 opacity: 0;
 transform: scale(0.8) translateY(10px);
}

.count-leave-to {
 opacity: 0;
 transform: scale(1.2);
 position: absolute;
}

.count-leave-active {
 position: absolute;
}

/* パルスエフェクト（ビート） */
@keyframes pulse {
 0% {
  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
 }
 70% {
  box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
 }
 100% {
  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
 }
}
</style>
