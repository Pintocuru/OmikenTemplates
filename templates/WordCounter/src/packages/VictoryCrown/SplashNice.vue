<!-- SplashNice.vue -->
<template>
 <div>
  <div
   class="relative flex flex-col items-center justify-center w-64 h-64 rounded-full shadow-lg overflow-hidden transition-all duration-500"
   :class="counterStyle.colorClass"
   :style="{
    transform: isAnimating ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)',
    boxShadow: `0 0 ${20 + progressRatio * 20}px ${progressRatio * 15}px ${convertHexToRGBA(counterStyle.textColor, 0.5 + progressRatio * 0.3)}`
   }"
  >
   <div
    class="absolute inset-2 rounded-full bg-white/30 backdrop-blur-sm border-4 border-white/60"
   ></div>

   <!-- スプラッシュ装飾 -->
   <div
    v-for="(_, i) in 4"
    :key="`splash-${i}`"
    class="absolute w-10 h-10 rounded-full"
    :class="i % 2 === 0 ? 'bg-cyan-400' : 'bg-pink-400'"
    :style="{
     top: i < 2 ? '10%' : '80%',
     left: i % 2 === 0 ? '15%' : '85%',
     transform: `scale(${0.8 + count * 0.05}) rotate(${i * 90 + count}deg)`,
     clipPath: 'polygon(50% 0%, 80% 40%, 100% 30%, 70% 70%, 80% 100%, 30% 70%, 0% 80%, 30% 30%)',
     transition: 'all 0.5s ease',
     opacity: 0.8
    }"
   ></div>

   <!-- カウンター -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <!-- 数値 -->
    <TransitionGroup name="count">
     <div
      :key="count"
      class="text-8xl font-rounded font-black text-white tracking-tight transition-all duration-500"
      :style="{
       textShadow: `0 0 ${5 + progressRatio * 10}px rgba(0, 0, 0, ${0.3 + progressRatio * 0.3}), 
                          4px 4px 0px #FF00FF, -4px -4px 0px #00FFFF`,
       transform: isAnimating ? 'scale(1.2) rotate(-5deg)' : 'scale(1) rotate(0deg)'
      }"
     >
      {{ count }}
     </div>
    </TransitionGroup>

    <!-- ステータステキスト -->
    <div
     v-if="generator.TEXTS && generator.TEXTS.length > 0"
     class="text-2xl font-bold mt-2 tracking-wide transition-all duration-500 bg-white rounded-full px-4 py-1"
     :style="{
      color: counterStyle.textColor,
      transform: isAnimating ? 'translateY(2px) scale(1.1)' : 'translateY(0) scale(1)',
      boxShadow: '0 3px 0 rgba(0,0,0,0.2)'
     }"
    >
     <div class="w-full flex justify-center">
      <span class="relative text-center">
       {{ counterStyle.text }}
      </span>
     </div>
    </div>
   </div>

   <!-- 装飾要素 -->
   <div
    class="absolute inset-0 border-8 border-dashed border-white/40 rounded-full animate-spin-slow"
   ></div>

   <!-- カウント増加時の演出エフェクト -->
   <div v-if="isAnimating" class="absolute inset-0 flex items-center justify-center">
    <!-- 星エフェクト -->
    <div
     v-for="(_, i) in 8"
     :key="`star-${i}`"
     class="absolute"
     :style="{
      top: '50%',
      left: '50%',
      width: `${Math.random() * 20 + 10}px`,
      height: `${Math.random() * 20 + 10}px`,
      transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${50 + Math.random() * 50}px)`,
      opacity: isAnimating ? 1 : 0,
      transition: 'all 0.8s ease-out',
      animation: `starFade 0.8s ease-out forwards`
     }"
    >
     <div
      class="w-full h-full"
      :class="i % 3 === 0 ? 'text-yellow-300' : i % 3 === 1 ? 'text-cyan-400' : 'text-pink-400'"
      :style="{
       clipPath:
        'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
       backgroundColor: 'currentColor'
      }"
     ></div>
    </div>

    <!-- 円形エフェクト -->
    <div
     class="absolute w-full h-full bg-white/30 rounded-full animate-ping"
     style="animation-duration: 0.7s"
    ></div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { WordCounterConfig } from '@scripts/types';
import { useWordComponent } from '@scripts/useWordComponent';
import { toRef } from 'vue';
import { SecondNameMode } from './secondNameMode';

const generatorTest: WordCounterConfig['generator'] = {
 TARGET: 15, // 目標となる数値
 IS_LOOP: false, // 目標達成後、色を変化させるか
 // countが初期値のテキスト・カラー
 TEXTS_FIRST: 'カモン！',
 STYLES_FIRST: {
  textColor: '#0d9466', // Green
  colorClass: 'bg-gradient-to-br from-green-400 to-cyan-500'
 },
 // 数値が増えるたびに変化するテキスト
 TEXTS: [
  'ナイス！',
  'クール！',
  'イカしてる！',
  'グレイト！',
  'アメイジング！',
  'ファンタスティック！',
  'スーパースター！',
  'ウルトラスーパー！'
 ],
 // TARGET_COUNT達成後、ランダムで変化するテキスト
 TEXTS_AFTER: [],
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
 ],
 EASTER_MODE: false, // 隠しモード(trueにすると、Splatoonの二つ名になります)
 EASTER_DATA: SecondNameMode
};

const props = defineProps<{
 count: number;
}>();

// コンポーザブル
const { generator, isAnimating, progressRatio, counterStyle } = useWordComponent(
 toRef(props, 'count'),
 800,
 undefined,
 generatorTest.EASTER_DATA
);

// 16進数カラーコードを rgba に変換する関数
function convertHexToRGBA(hex: string, alpha: number = 1): string {
 // 16進数カラーコードを rgba に変換
 const r = parseInt(hex.slice(1, 3), 16);
 const g = parseInt(hex.slice(3, 5), 16);
 const b = parseInt(hex.slice(5, 7), 16);
 return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Mochiy+Pop+One&family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
/* 丸みを帯びたフォント風の設定 */
.font-rounded {
 font-family: 'Mochiy Pop One', 'Rounded Mplus 1c', 'Varela Round', sans-serif;
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

/* アニメーション用キーフレーム */
@keyframes ping {
 75%,
 100% {
  transform: scale(2);
  opacity: 0;
 }
}

.animate-ping {
 animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-spin-slow {
 animation: spin 8s linear infinite;
}

@keyframes spin {
 from {
  transform: rotate(0deg);
 }
 to {
  transform: rotate(360deg);
 }
}

@keyframes starFade {
 0% {
  opacity: 1;
  transform: translate(-50%, -50%) scale(0) rotate(0deg);
 }
 100% {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.5) rotate(90deg) translateY(-80px);
 }
}

@keyframes bubblePop {
 0% {
  opacity: 0;
  transform: scale(0) translateY(0);
 }
 40% {
  opacity: 1;
  transform: scale(1.2) translateY(-10px);
 }
 70% {
  transform: scale(1) translateY(-20px);
 }
 100% {
  opacity: 0;
  transform: scale(0.8) translateY(-50px);
 }
}

.speech-bubble {
 position: absolute;
 z-index: 20;
}
</style>
