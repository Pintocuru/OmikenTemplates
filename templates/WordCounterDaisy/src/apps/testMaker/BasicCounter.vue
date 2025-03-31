<!-- SplashCounter.vue -->
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

   <!-- インクスプラッシュエフェクト -->
   <div v-for="splash in inkSplashes" :key="splash.id" class="absolute" :style="splash.style"></div>

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
  </div>
 </div>
</template>

<script setup lang="ts">
import { WordCounterConfig } from '@scripts/types';
import { useWordComponent } from '@scripts/useWordComponent';
import { toRef, ref, watch } from 'vue';
import { SecondNameMode } from './secondNameMode';

const generatorTest: WordCounterConfig['generator'] = {
 TARGET: 15,
 IS_LOOP: false,
 TEXTS_FIRST: 'カモン！',
 STYLES_FIRST: {
  textColor: '#0d9466',
  colorClass: 'bg-gradient-to-br from-green-400 to-cyan-500'
 },
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
  },
  {
   textColor: '#e67e22',
   colorClass: 'bg-gradient-to-br from-orange-400 to-red-500'
  },
  {
   textColor: '#8e44ad',
   colorClass: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  }
 ],
 EASTER_MODE: false,
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

// インクスプラッシュ効果
const inkSplashes = ref<
 Array<{
  id: number;
  style: Record<string, string>;
 }>
>([]);

let lastCount = props.count;

// インクの色を生成
function getRandomInkColor() {
 const colors = [
  '#00FFFF',
  '#FF00FF',
  '#FFFF00',
  '#FF5722',
  '#9C27B0',
  '#4CAF50',
  '#2196F3',
  '#F44336'
 ];
 return colors[Math.floor(Math.random() * colors.length)];
}

// インクスプラッシュを生成
function createSplashEffect() {
 // 既存のスプラッシュをクリア
 inkSplashes.value = [];

 // 新しいスプラッシュを作成
 for (let i = 0; i < 8; i++) {
  const isLarge = i < 4;
  const size = isLarge ? 80 + Math.random() * 120 : 5 + Math.random() * 15;
  const clipPath = isLarge
   ? 'polygon(50% 0%, 80% 30%, 100% 20%, 70% 60%, 90% 100%, 50% 85%, 10% 100%, 30% 60%, 0% 20%, 20% 30%)'
   : '';

  inkSplashes.value.push({
   id: Date.now() + i,
   style: {
    position: 'absolute',
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: getRandomInkColor(),
    borderRadius: isLarge ? '0' : '50%',
    transform: `scale(0.1) rotate(${Math.random() * 360}deg)`,
    opacity: '0.8',
    clipPath: clipPath,
    transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    zIndex: isLarge ? '1' : '30'
   }
  });
 }

 // スプラッシュをアニメーション
 setTimeout(() => {
  inkSplashes.value.forEach((splash, index) => {
   const isLarge = index < 4;
   const targetScale = isLarge ? 0.8 + Math.random() * 0.4 : 1 + Math.random() * 0.8;
   const targetTop = isLarge
    ? parseInt(splash.style.top)
    : `${parseInt(splash.style.top) + (Math.random() * 100 - 50)}%`;
   const targetLeft = isLarge
    ? parseInt(splash.style.left)
    : `${parseInt(splash.style.left) + (Math.random() * 100 - 50)}%`;

   splash.style.transform = `scale(${targetScale}) rotate(${Math.random() * 360}deg)`;
   if (!isLarge) {
    splash.style.top = String(targetTop);
    splash.style.left = String(targetLeft);
    splash.style.opacity = '0.4';
   }
  });
 }, 50);

 // フェードアウト
 setTimeout(() => {
  inkSplashes.value.forEach((splash) => {
   splash.style.opacity = '0';
  });
 }, 1000);
}

// カウントが変更されたときにスプラッシュを作成
watch(
 () => props.count,
 (newCount, oldCount) => {
  if (newCount !== oldCount) {
   createSplashEffect();
  }
  lastCount = newCount;
 }
);

// 16進数カラーコードを rgba に変換する関数
function convertHexToRGBA(hex: string, alpha: number = 1): string {
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
</style>
