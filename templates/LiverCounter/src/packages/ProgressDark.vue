<!-- ProgressDark.vue -->
<template>
 <div v-if="counterConfig.targetCountdown !== 0" class="flex flex-col items-center space-y-3">
  <div
   class="bg-black bg-opacity-70 p-2 rounded-md flex flex-col space-y-2 items-center w-36"
   :class="colorClasses.borderColor"
  >
   <div class="flex items-center justify-between w-full">
    <div class="text-xs font-bold" :class="colorClasses.labelColor">{{ counterConfig.title }}</div>
    <div class="text-xs text-gray-400">{{ count }} / {{ counterConfig.targetCountdown }}</div>
   </div>

   <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
    <div
     class="h-full transition-all duration-300"
     :class="colorClasses.barColor"
     :style="{ width: `${progressPercentage}%` }"
    ></div>
   </div>

   <div
    v-if="counterConfig.multiplier !== 1"
    class="text-white text-xs rounded-full px-2 py-0.5"
    :class="colorClasses.badgeColor"
   >
    x{{ counterConfig.multiplier }}
   </div>
  </div>
 </div>
 <div v-else class="text-sm text-gray-400 italic">
  「カウント目標値」が0のとき、このカウンターは使用できません。configMakerで設定してください
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ColorType, CounterConfig } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// 進捗率を計算
const progressPercentage = computed(() => {
 if (props.counterConfig.targetCountdown === 0) return 0;
 return (props.count / props.counterConfig.targetCountdown) * 100;
});

// カラーテーマに基づいたクラスを設定
const colorClasses = computed(() => {
 const color = props.counterConfig.typeColor || 'default';

 const colorMap = {
  default: {
   labelColor: 'text-blue-400',
   borderColor: 'border border-gray-600',
   barColor: 'bg-blue-500',
   badgeColor: 'bg-gray-500'
  },
  blue: {
   labelColor: 'text-blue-400',
   borderColor: 'border border-blue-700',
   barColor: 'bg-blue-500',
   badgeColor: 'bg-blue-600'
  },
  green: {
   labelColor: 'text-green-400',
   borderColor: 'border border-green-700',
   barColor: 'bg-green-500',
   badgeColor: 'bg-green-600'
  },
  red: {
   labelColor: 'text-red-400',
   borderColor: 'border border-red-700',
   barColor: 'bg-red-500',
   badgeColor: 'bg-red-600'
  },
  purple: {
   labelColor: 'text-purple-400',
   borderColor: 'border border-purple-700',
   barColor: 'bg-purple-500',
   badgeColor: 'bg-purple-600'
  },
  yellow: {
   labelColor: 'text-yellow-300',
   borderColor: 'border border-yellow-600',
   barColor: 'bg-yellow-500',
   badgeColor: 'bg-yellow-600'
  },
  pink: {
   labelColor: 'text-pink-400',
   borderColor: 'border border-pink-700',
   barColor: 'bg-pink-500',
   badgeColor: 'bg-pink-600'
  },
  gray: {
   labelColor: 'text-gray-300',
   borderColor: 'border border-gray-600',
   barColor: 'bg-gray-500',
   badgeColor: 'bg-gray-600'
  }
 };

 return colorMap[color];
});
</script>
