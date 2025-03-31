<!-- SimpleSample.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col items-center justify-center w-64 h-64 rounded-full shadow-lg"
   :class="counterStyle.colorClass"
  >
   <!-- カウンター -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <!-- 数値 -->
    <TransitionGroup name="count">
     <div :key="count" class="text-8xl font-rounded font-black text-white tracking-tight">
      {{ count }}
     </div>
    </TransitionGroup>

    <!-- ステータステキスト -->
    <div
     v-if="generator.TEXTS && generator.TEXTS.length > 0"
     class="text-2xl font-bold mt-2 tracking-wide bg-white rounded-full px-4 py-1"
     :style="{ color: counterStyle.textColor }"
    >
     <span class="relative">
      {{ counterStyle.text }}
     </span>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { WordCounterConfig } from '@scripts/types';
import { useWordComponent } from '@scripts/useWordComponent';

const generatorTest: WordCounterConfig['generator'] = {
 IS_LOOP: true,
 TARGET: 15,
 TEXTS_FIRST: null,
 STYLES_FIRST: null,
 TEXTS: ['CYBER_SYNC', 'NEURO_LINK', 'HYPER_DRIVE', 'ULTRA_BOOST', 'MAX_LEVEL'],
 TEXTS_AFTER: null,
 STYLES: [
  {
   textColor: '#06b6d4',
   colorClass: 'bg-gradient-to-br from-cyan-900 to-black'
  },
  {
   textColor: '#d946ef',
   colorClass: 'bg-gradient-to-br from-pink-900 to-black'
  },
  {
   textColor: '#ec4899',
   colorClass: 'bg-gradient-to-br from-purple-900 to-black'
  }
 ],
 EASTER_DATA: undefined
};

const props = defineProps<{
 count: number;
}>();

// コンポーザブル
const { generator, isAnimating, progress, progressRatio, counterStyle } = useWordComponent(
 toRef(props, 'count'),
 800,
 generatorTest
);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

.font-rounded {
 font-family: 'Mochiy Pop One', sans-serif;
}

/* カウント変更時のアニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.count-enter-from {
 opacity: 0;
 transform: scale(0.8) translateY(10px) rotate(10deg);
}

.count-leave-to {
 opacity: 0;
 transform: scale(1.2) rotate(-10deg);
 position: absolute;
}

.count-leave-active {
 position: absolute;
}
</style>
