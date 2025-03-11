<!-- SimpleCounter.vue -->
<template>
 <div class="flex items-center justify-center">
  <!-- マリオ風の背景 -->
  <div
   class="relative w-64 h-72 bg-sky-500 overflow-hidden rounded-lg shadow-xl border-4 border-white"
  >
   <!-- 雲 -->
   <div class="absolute top-4 left-4 w-16 h-8 bg-white rounded-full"></div>
   <div class="absolute top-12 right-2 w-16 h-8 bg-white rounded-full"></div>
   <div class="absolute top-28 left-2 w-16 h-8 bg-white rounded-full"></div>

   <!-- 土管 -->
   <div class="absolute bottom-0 left-4 w-16 h-32 bg-green-600 rounded-t-lg shadow-lg">
    <div class="absolute top-0 left-[-6px] right-[-6px] h-8 bg-green-500 rounded-t-lg"></div>
   </div>

   <!-- メインカウンター -->
   <div
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    :class="{ 'animate-bounce-custom': isAnimating }"
   >
    <!-- コインボックス -->
    <div class="relative flex flex-col items-center justify-center">
     <div
      class="w-48 h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg border-4 border-yellow-700 overflow-hidden"
     >
      <!-- コインの質感パターン -->
      <div class="absolute top-3 left-3 w-8 h-8 bg-yellow-300 rounded-full opacity-50"></div>

      <!-- カウンター数値 -->
      <div class="absolute inset-0 flex items-center justify-center">
       <TransitionGroup name="count">
        <div
         :key="count"
         class="text-8xl font-mario text-white drop-shadow-glow tracking-tight flex items-center justify-center"
         :class="{ 'animate-pulse-custom': pulseIntensity > 0.7 }"
        >
         {{ count }}
        </div>
       </TransitionGroup>
      </div>
     </div>

     <!-- ステータステキスト -->
     <div
      v-if="generator.TEXTS && generator.TEXTS.length > 0"
      class="mt-0 px-6 py-2 bg-red-600 text-2xl font-mario text-white rounded-full transform rotate-2 border-4 border-white shadow-lg"
     >
      <span class="relative">
       {{ counterStyle.text }}
      </span>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { WordCounterConfig } from '@/scripts/types';
import { useWordComponent } from '@/scripts/useWordComponent';

const generatorTest: WordCounterConfig['generator'] = {
 IS_LOOP: true,
 TARGET: 15,
 TEXTS_FIRST: null,
 STYLES_FIRST: null,
 TEXTS: ['コイン!', 'ナイス!', 'ヤッホー!', 'スーパースター!', 'ワァオ!'],
 TEXTS_AFTER: null,
 STYLES: [
  {
   textColor: '#ffffff',
   colorClass: 'bg-gradient-to-br from-red-500 to-yellow-500'
  },
  {
   textColor: '#ffffff',
   colorClass: 'bg-gradient-to-br from-yellow-500 to-red-600'
  },
  {
   textColor: '#ffffff',
   colorClass: 'bg-gradient-to-br from-red-600 to-yellow-400'
  }
 ],
 EASTER_DATA: undefined
};

const props = defineProps<{
 count: number;
}>();

// コンポーザブル
const { generator, isAnimating, pulseIntensity, counterStyle } = useWordComponent(
 toRef(props, 'count'),
 800,
 generatorTest
);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.font-mario {
 font-family: 'Press Start 2P', cursive;
}

/* カウント変更時のアニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.count-enter-from {
 opacity: 0;
 transform: scale(0.5) translateY(20px);
}

.count-leave-to {
 opacity: 0;
 transform: scale(1.5) translateY(-20px);
 position: absolute;
}

.count-leave-active {
 position: absolute;
}

/* マリオ風のバウンスアニメーション */
@keyframes bounce-custom {
 0%,
 100% {
  transform: translate(-50%, -50%) scale(1);
 }
 50% {
  transform: translate(-50%, -50%) translateY(-20px) scale(1.05);
 }
}

.animate-bounce-custom {
 animation: bounce-custom 0.5s ease-in-out;
}

/* パルスアニメーション */
@keyframes pulse-custom {
 0%,
 100% {
  transform: scale(1);
 }
 50% {
  transform: scale(1.1);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
 }
}

.animate-pulse-custom {
 animation: pulse-custom 0.8s infinite;
}

/* テキストのグロー効果 */
.drop-shadow-glow {
 text-shadow:
  0 0 10px rgba(255, 255, 255, 0.7),
  0 0 20px rgba(255, 255, 255, 0.5);
}
</style>
