<!-- CyberNeon.vue -->
<template>
 <div class="flex flex-col space-y-4 items-center">
  <!-- サイバーパンク風カウンター：カウント表示 -->
  <div class="flex items-end">
   <!-- メインカウンター部分 -->
   <div
    class="bg-black py-2 pl-3 pr-4 border-l-4 relative"
    :class="[getBorderColorClass]"
    style="min-height: 3.5rem"
   >
    <!-- タイトル -->
    <div class="text-xs font-bold uppercase" :class="[getTextColorClass]">
     {{ counterConfig.title || '' }}
    </div>

    <!-- カウント値 -->
    <div class="text-2xl font-bold text-white flex items-baseline">
     {{ count }}
     <span v-if="counterConfig.unit" class="text-sm ml-1" :class="[getTextColorClass]">
      {{ counterConfig.unit }}
     </span>
     <span v-if="typeof countMax === 'number'" class="text-sm text-gray-400 ml-1">
      / {{ countMax }}
     </span>
    </div>

    <!-- ✅ 進捗バー -->
    <div
     v-if="counterConfig.targetCountdown !== 0"
     class="absolute bottom-0 left-0 h-1.5 transition-all duration-300"
     :class="[
      progressPercentage === 100
       ? 'bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 animate-gradient'
       : 'bg-' + colorClassMap[counterConfig.typeColor || 'default'].border.replace('border-', '')
     ]"
     :style="{ width: `${progressPercentage}%` }"
    />
   </div>

   <!-- マルチプライヤー表示 -->
   <div v-if="counterConfig.multiplier !== 1" class="bg-black pr-2 py-1 self-end">
    <div class="text-sm font-bold text-white">×{{ counterConfig.multiplier }}</div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CounterConfig, ColorType } from '@scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

// Tailwindのカラークラスマッピング
const colorClassMap: Record<ColorType, { text: string; border: string }> = {
 default: { text: 'text-gray-300', border: 'border-gray-300' },
 blue: { text: 'text-blue-600', border: 'border-blue-600' },
 green: { text: 'text-green-600', border: 'border-green-600' },
 red: { text: 'text-red-600', border: 'border-red-600' },
 purple: { text: 'text-purple-600', border: 'border-purple-600' },
 yellow: { text: 'text-yellow-600', border: 'border-yellow-600' },
 pink: { text: 'text-pink-600', border: 'border-pink-600' },
 gray: { text: 'text-gray-600', border: 'border-gray-600' }
};

// 計算プロパティでクラスを取得
const getBorderColorClass = computed(() => {
 const color = props.counterConfig.typeColor || 'default';
 return colorClassMap[color].border;
});

const getTextColorClass = computed(() => {
 const color = props.counterConfig.typeColor || 'default';
 return colorClassMap[color].text;
});

// 進捗率
const progressPercentage = computed(() => {
 if (props.counterConfig.targetCountdown === 0) return 0;
 const raw = (props.count / props.counterConfig.targetCountdown) * 100;
 return Math.min(raw, 100);
});
</script>

<style scoped>
@keyframes gradientAnimation {
 0% {
  background-position: 0% 50%;
 }
 50% {
  background-position: 100% 50%;
 }
 100% {
  background-position: 0% 50%;
 }
}

.animate-gradient {
 background-size: 200% 200%;
 animation: gradientAnimation 3s ease infinite;
}
</style>
