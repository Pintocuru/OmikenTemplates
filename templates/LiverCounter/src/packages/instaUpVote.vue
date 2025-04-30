<!-- instaUpVote.vue -->
<template>
 <div class="flex flex-col items-center space-y-2">
  <!-- Instagram風デザイン -->
  <div class="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-0.5 rounded-lg">
   <div class="bg-white px-4 py-3 rounded-lg flex items-center space-x-3">
    <!-- アイコン -->
    <div class="flex flex-col items-center">
     <div class="text-2xl text-gray-500 float-icon">{{ modeIcon }}</div>

     <!-- multiplierバッジ -->
     <div
      v-if="counterConfig.multiplier !== 1"
      class="text-white text-xs bg-gray-500 rounded-full px-2 py-0 mt-1"
     >
      x{{ counterConfig.multiplier }}
     </div>
    </div>

    <!-- 値 + ラベル -->
    <div class="flex flex-col">
     <!-- タイトル -->
     <div v-if="counterConfig.title" class="text-sm font-semibold text-gray-500 text-center">
      {{ counterConfig.title }}
     </div>

     <div class="text-xl font-bold transition-all duration-300">
      <span
       class="text-3xl font-medium"
       :class="{ 'count-shake': shouldAnimate }"
       :style="{ color: colorVars['--counter-color'] }"
      >
       {{ count }}
      </span>
      <!-- 単位 -->
      <span class="text-xs pl-2 font-medium text-gray-500">
       {{ counterConfig.unit ?? '' }}
      </span>
      <!-- 最大値 -->
      <span v-if="typeof countMax === 'number'" class="text-base font-light text-gray-500">
       / {{ countMax }}
      </span>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { ColorType, CounterConfig, CountType } from '@/scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

const colorVars = computed(() => {
 const colorMap: Record<ColorType, string> = {
  default: '#1f2937',
  blue: '#2563eb',
  green: '#16a34a',
  red: '#dc2626',
  purple: '#9333ea',
  yellow: '#ca8a04',
  pink: '#db2777',
  gray: '#666'
 };
 const selectedColor = colorMap[props.counterConfig.typeColor ?? 'default'];
 return {
  '--counter-color': selectedColor
 };
});

const modeIcon = computed(() => {
 const iconMap: Record<CountType, string> = {
  none: '🌟',
  comment: '💬',
  user: '👤',
  syoken: '🌱',
  upVote: '👍',
  viewer: '👀',
  gift: '🎁'
 };
 return iconMap[props.counterConfig.countMode ?? 'none'];
});

// カウントアニメーション用
const shouldAnimate = ref(false);

// countの変更を監視し、増加時にアニメーションを実行
watch(
 () => props.count,
 () => {
  shouldAnimate.value = true;
  setTimeout(() => {
   shouldAnimate.value = false;
  }, 500); // アニメーション完了後にクラスを削除
 }
);
</script>

<style scoped>
/* アイコンのゆらゆらアニメーション */
.float-icon {
 animation: float 3s ease-in-out infinite;
 display: inline-block;
}

@keyframes float {
 0% {
  transform: translateY(0) rotate(0deg);
 }
 25% {
  transform: translateY(-3px) rotate(2deg);
 }
 50% {
  transform: translateY(0) rotate(0deg);
 }
 75% {
  transform: translateY(3px) rotate(-2deg);
 }
 100% {
  transform: translateY(0) rotate(0deg);
 }
}

/* カウント増加時のシェイクアニメーション */
.count-shake {
 animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
 display: inline-block;
 backface-visibility: hidden;
}

@keyframes shake {
 0%,
 100% {
  transform: translateY(0);
 }
 20%,
 60% {
  transform: translateY(-4px);
 }
 40%,
 80% {
  transform: translateY(4px);
 }
}
</style>
