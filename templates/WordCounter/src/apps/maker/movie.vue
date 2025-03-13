<!-- SimpleCounter.vue -->
<template>
 <div class="flex items-center justify-center">
  <!-- フィルムリール風の背景 -->
  <div
   class="relative w-96 h-64 bg-black rounded-md overflow-hidden shadow-xl border-4 border-gray-800"
  >
   <!-- フィルムパーフォレーション（穴）の装飾 -->
   <div class="absolute top-0 left-0 w-full h-12 flex justify-between px-2 py-2 bg-gray-900">
    <div
     v-for="n in 8"
     :key="`hole-top-${n}`"
     class="w-6 h-8 bg-black border-2 border-gray-700 rounded-sm"
    ></div>
   </div>
   <div class="absolute bottom-0 left-0 w-full h-12 flex justify-between px-2 py-2 bg-gray-900">
    <div
     v-for="n in 8"
     :key="`hole-bottom-${n}`"
     class="w-6 h-8 bg-black border-2 border-gray-700 rounded-sm"
    ></div>
   </div>

   <!-- メインカウンター部分 -->
   <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-32">
    <!-- 映写機スクリーン風エリア -->
    <div
     class="w-full h-full bg-amber-100 bg-opacity-90 rounded flex items-center justify-center overflow-hidden"
    >
     <div class="relative w-full h-full flex items-center justify-center">
      <!-- スクラッチ効果 -->
      <div class="absolute inset-0 opacity-20 pointer-events-none">
       <div
        v-for="n in 5"
        :key="`scratch-${n}`"
        class="absolute bg-black h-px"
        :style="{
         left: 0,
         right: 0,
         top: `${Math.random() * 100}%`,
         opacity: Math.random() * 0.4 + 0.1
        }"
       ></div>
      </div>

      <!-- フリッカー効果 -->
      <div class="absolute inset-0 bg-black opacity-0 animate-flicker pointer-events-none"></div>

      <!-- カウンター数値 -->
      <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
       <TransitionGroup name="slide-fade">
        <div
         :key="count"
         class="text-9xl font-cinema text-gray-900 tracking-tighter"
         :class="{ 'animate-shake': isAnimating }"
        >
         {{ count }}
        </div>
       </TransitionGroup>
      </div>
     </div>
    </div>

    <!-- フィルムの傷跡再現 -->
    <div class="absolute inset-0 pointer-events-none">
     <div
      v-for="n in 3"
      :key="`dust-${n}`"
      class="absolute rounded-full bg-white"
      :style="{
       width: `${Math.random() * 3 + 1}px`,
       height: `${Math.random() * 3 + 1}px`,
       left: `${Math.random() * 100}%`,
       top: `${Math.random() * 100}%`,
       opacity: Math.random() * 0.7 + 0.3
      }"
     ></div>
    </div>
   </div>

   <!-- ステータステキスト -->
   <div
    v-if="generator.TEXTS && generator.TEXTS.length > 0"
    class="absolute bottom-16 left-1/2 transform -translate-x-1/2 mt-4 px-6 py-1 bg-amber-200 text-xl font-cinema text-gray-900 tracking-widest border border-amber-700"
    :class="{ 'animate-blink': pulseIntensity > 0.5 && !isAnimating }"
   >
    <span class="relative uppercase">
     {{ counterStyle.text }}
    </span>
   </div>

   <!-- フィルムコード -->
   <div class="absolute top-14 right-2 text-xs font-mono text-gray-400 tracking-wide">
    CODE: {{ Math.floor(Math.random() * 900000) + 100000 }}
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
 TEXTS: ['ROLL', 'ACTION', 'SCENE', 'TAKE', 'CUT'],
 TEXTS_AFTER: null,
 STYLES: [
  {
   textColor: '#78350f',
   colorClass: 'bg-amber-100'
  },
  {
   textColor: '#78350f',
   colorClass: 'bg-amber-200'
  },
  {
   textColor: '#78350f',
   colorClass: 'bg-amber-300'
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
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');

.font-cinema {
 font-family: 'DM Serif Display', serif;
}

/* 横スライドアニメーション */
.slide-fade-enter-active {
 transition: all 0.5s cubic-bezier(0.2, 0.8, 0.4, 1);
}

.slide-fade-leave-active {
 transition: all 0.3s cubic-bezier(0.8, 0.2, 0.4, 1);
}

.slide-fade-enter-from {
 opacity: 0;
 transform: translateX(100px) scale(0.8);
}

.slide-fade-leave-to {
 opacity: 0;
 transform: translateX(-100px) scale(0.8);
 position: absolute;
}

.slide-fade-leave-active {
 position: absolute;
}

/* 映写機のガタガタ揺れ効果 */
@keyframes shake {
 0%,
 100% {
  transform: translateX(0);
 }
 10%,
 30%,
 50%,
 70%,
 90% {
  transform: translateX(-1px);
 }
 20%,
 40%,
 60%,
 80% {
  transform: translateX(1px);
 }
}

.animate-shake {
 animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* フィルムのフリッカー効果 */
@keyframes flicker {
 0%,
 100% {
  opacity: 0;
 }
 5% {
  opacity: 0.1;
 }
 10% {
  opacity: 0;
 }
 15% {
  opacity: 0.2;
 }
 25% {
  opacity: 0;
 }
 50% {
  opacity: 0.1;
 }
 65% {
  opacity: 0;
 }
 80% {
  opacity: 0.3;
 }
 90% {
  opacity: 0;
 }
}

.animate-flicker {
 animation: flicker 5s infinite;
}

/* 点滅効果 */
@keyframes blink {
 0%,
 80%,
 100% {
  opacity: 1;
 }
 40% {
  opacity: 0.6;
 }
}

.animate-blink {
 animation: blink 2s infinite;
}
</style>
