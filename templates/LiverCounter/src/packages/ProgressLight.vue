<!-- ProgressLight.vue -->
<template>
 <div v-if="counterConfig.targetCountdown !== 0" class="flex flex-col items-center space-y-3">
  <div
   class="bg-white p-2 rounded-md flex flex-col space-y-2 items-center w-36 shadow-sm"
   :class="colorClasses.borderColor"
  >
   <div class="flex items-center justify-between w-full">
    <div class="text-xs font-bold" :class="colorClasses.labelColor">{{ counterConfig.title }}</div>
    <div class="text-xs text-gray-600">{{ count }} / {{ counterConfig.targetCountdown }}</div>
   </div>

   <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
 <div v-else class="text-sm text-gray-500 italic">
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

// カラーテーマに基づいたクラスを設定 - ライトテーマ用
const colorClasses = computed(() => {
 const color = props.counterConfig.typeColor || 'default';

 const colorMap = {
  default: {
   labelColor: 'text-blue-600',
   borderColor: 'border border-blue-200',
   barColor: 'bg-blue-400',
   badgeColor: 'bg-blue-400'
  },
  blue: {
   labelColor: 'text-blue-600',
   borderColor: 'border border-blue-200',
   barColor: 'bg-blue-400',
   badgeColor: 'bg-blue-400'
  },
  green: {
   labelColor: 'text-green-600',
   borderColor: 'border border-green-200',
   barColor: 'bg-green-400',
   badgeColor: 'bg-green-400'
  },
  red: {
   labelColor: 'text-red-600',
   borderColor: 'border border-red-200',
   barColor: 'bg-red-400',
   badgeColor: 'bg-red-400'
  },
  purple: {
   labelColor: 'text-purple-600',
   borderColor: 'border border-purple-200',
   barColor: 'bg-purple-400',
   badgeColor: 'bg-purple-400'
  },
  yellow: {
   labelColor: 'text-yellow-600',
   borderColor: 'border border-yellow-200',
   barColor: 'bg-yellow-400',
   badgeColor: 'bg-yellow-400'
  },
  pink: {
   labelColor: 'text-pink-600',
   borderColor: 'border border-pink-200',
   barColor: 'bg-pink-400',
   badgeColor: 'bg-pink-400'
  },
  gray: {
   labelColor: 'text-gray-600',
   borderColor: 'border border-gray-200',
   barColor: 'bg-gray-400',
   badgeColor: 'bg-gray-400'
  }
 };

 return colorMap[color];
});
</script>
