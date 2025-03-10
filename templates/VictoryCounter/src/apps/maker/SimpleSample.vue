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
import { WordCounterConfig } from '@/scripts/types';
import { Props, useWordComponent } from '@/scripts/useWordComponent';

const defaultGenerator: WordCounterConfig['generator'] = {
 IS_LOOP: true,
 TARGET: 15,
 TEXTS_FIRST: null,
 STYLES_FIRST: {
  textColor: '#0d9466',
  colorClass: 'bg-gradient-to-br from-green-400 to-cyan-500'
 },
 TEXTS: ['高評価👍️', 'ナイス！', 'ファンタスティック！', 'スーパースター！', 'ウルトラスーパー！'],
 TEXTS_AFTER: null,
 STYLES: [
  {
   textColor: '#0d9466',
   colorClass: 'bg-gradient-to-br from-green-400 to-cyan-500'
  },
  {
   textColor: '#0b8dc2',
   colorClass: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  },
  {
   textColor: '#b737c4',
   colorClass: 'bg-gradient-to-br from-purple-500 to-pink-500'
  }
 ]
};

const props = withDefaults(defineProps<Props>(), {
 count: 0,
 generator: () => defaultGenerator
});

// コンポーザブル
const { isAnimating, pulseIntensity, counterStyle } = useWordComponent(props, 800);
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
