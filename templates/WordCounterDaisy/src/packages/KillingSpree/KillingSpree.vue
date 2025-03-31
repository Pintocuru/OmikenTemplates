<!-- KillingSpree.vue -->
<template>
 <div>
  <div
   class="relative flex flex-col items-center justify-center w-64 h-64 rounded-lg shadow-lg overflow-hidden transition-all duration-500"
   :class="counterStyle.colorClass"
   :style="{
    transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
    boxShadow: `0 0 ${20 + progressRatio * 30}px ${progressRatio * 20}px ${convertHexToRGBA(counterStyle.textColor, 0.4 + progressRatio * 0.3)}`
   }"
  >
   <!-- 背景エフェクト - 弾痕模様 -->
   <div class="absolute inset-0 flex items-center justify-center">
    <div
     v-for="(_, i) in Math.min(count, 10)"
     :key="`bullet-hole-${i}`"
     class="absolute w-6 h-6 bg-black opacity-40 rounded-full mix-blend-overlay"
     :style="{
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
      transform: `scale(${Math.random() * 0.5 + 0.5})`
     }"
    ></div>
   </div>

   <div
    class="absolute inset-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10"
   ></div>

   <!-- 装飾アイコン -->
   <div class="absolute top-4 left-4">
    <Crosshair :size="28" class="text-white/70" :stroke-width="1.5" />
   </div>

   <div class="absolute top-4 right-4">
    <Skull :size="28" class="text-white/70" :stroke-width="1.5" />
   </div>

   <!-- カウンター -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <!-- 数値 -->
    <TransitionGroup name="count">
     <div
      :key="count"
      class="text-8xl font-mono font-bold text-white tracking-tight transition-all duration-500"
      :style="{
       textShadow: `0 0 ${10 + progressRatio * 20}px rgba(255, 255, 255, ${0.5 + progressRatio * 0.5})`,
       transform: isAnimating ? 'scale(1.2)' : 'scale(1)'
      }"
     >
      {{ count }}
     </div>
    </TransitionGroup>

    <!-- ステータステキスト -->
    <div
     v-if="generator.TEXTS && generator.TEXTS.length > 0"
     class="text-xl font-bold text-white/90 mt-2 tracking-widest transition-all duration-500"
     :style="{
      textShadow: `0 0 ${5 + progressRatio * 10}px rgba(255, 255, 255, ${0.3 + progressRatio * 0.3})`,
      transform: isAnimating ? 'translateY(2px)' : 'translateY(0)'
     }"
    >
     <span class="relative uppercase">
      <div class="w-full flex justify-center">
       <span class="relative text-center">
        {{ counterStyle.text }}
       </span>
      </div>
      <span
       class="absolute bottom-0 left-0 w-full h-0.5 bg-white/40 transform origin-left"
       :style="{
        transform: isAnimating ? 'scaleX(1.1)' : 'scaleX(1)'
       }"
      ></span>
     </span>
    </div>
   </div>

   <!-- 装飾リングとエフェクト -->
   <div class="absolute inset-0 border-2 border-white/20 rounded-lg"></div>

   <!-- ターゲットマーカー -->
   <div class="absolute bottom-4 left-0 right-0 flex justify-center">
    <Target
     :size="24"
     class="text-white/50"
     :style="{
      opacity: isAnimating ? 1 : 0.5,
      transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
      transition: 'all 0.5s ease-out'
     }"
    />
   </div>

   <!-- キル時の爆発エフェクト -->
   <div v-if="isAnimating" class="absolute inset-0 flex items-center justify-center">
    <!-- 円形エフェクト -->
    <div
     class="absolute w-full h-full bg-white/30 rounded-lg animate-ping"
     style="animation-duration: 0.6s"
    ></div>
    <div
     class="absolute w-20 h-20 bg-white/40 rounded-full animate-ping"
     style="animation-duration: 0.4s"
    ></div>

    <!-- エフェクト線 -->
    <div
     v-for="(_, i) in 6"
     :key="`effect-line-${i}`"
     class="absolute bg-white/70"
     :style="{
      height: '2px',
      width: `${20 + Math.random() * 30}px`,
      transform: `rotate(${i * 60}deg) translateX(${30 + Math.random() * 20}px)`,
      opacity: isAnimating ? 1 : 0,
      transition: 'all 0.6s ease-out',
      animation: 'lineFade 0.6s ease-out forwards'
     }"
    ></div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { WordCounterConfig } from '@scripts/types';
import { useWordComponent } from '@scripts/useWordComponent';
import { Crosshair, Skull, Target } from 'lucide-vue-next';

const generatorTest: WordCounterConfig['generator'] = {
 TARGET: 15, // 目標となる数値
 IS_LOOP: false, // 目標達成後、色を変化させるか
 // countが初期値のテキスト・カラー
 TEXTS_FIRST: 'NO KILLS',
 STYLES_FIRST: {
  textColor: '#4b5563',
  colorClass: 'bg-gradient-to-br from-gray-600 to-gray-800' // 新兵/初心者
 },
 // 数値が増えるたびに変化するテキスト
 TEXTS: [
  'FIRST BLOOD',
  'FIRST BLOOD',
  'DOUBLE KILL',
  'TRIPLE KILL',
  'MULTI KILL',
  'MULTI KILL',
  'MULTI KILL',
  'KILLING SPREE!',
  'KILLING SPREE!',
  'KILLING SPREE!',
  'RAMPAGE!',
  'RAMPAGE!',
  'DOMINATING!',
  'DOMINATING!',
  'DOMINATING!',
  'UNSTOPPABLE!',
  'UNSTOPPABLE!',
  'GODLIKE!',
  'GODLIKE!'
 ],
 // TARGET_COUNT達成後、ランダムで変化するテキスト
 TEXTS_AFTER: [
  'LEGENDARY!',
  'MYTHICAL!',
  'TRANSCENDENT!',
  'ASCENDED!',
  'IMMORTAL!',
  'DIVINE!',
  'INHUMAN REACTIONS!',
  'BEYOND GODLIKE!',
  'OMNIPOTENT!',
  'UNFATHOMABLE POWER!',
  'ABSOLUTE DESTRUCTION!',
  'YOU ARE THE FINAL BOSS!'
 ],
 STYLES: [
  {
   textColor: '#9ca3af',
   colorClass: 'bg-gradient-to-br from-gray-400 to-gray-600' // 上等兵/経験者
  },
  // 中間ランク - 攻撃的な赤系統
  {
   textColor: '#dc2626',
   colorClass: 'bg-gradient-to-br from-red-600 to-red-800' // 軍曹/ベテラン
  },
  {
   textColor: '#ef4444',
   colorClass: 'bg-gradient-to-br from-red-500 to-red-700' // 上級軍曹/エキスパート
  },
  // 上級ランク - 情熱を示すオレンジから黄色
  {
   textColor: '#f97316',
   colorClass: 'bg-gradient-to-br from-orange-500 to-orange-700' // 少尉/マスター
  },
  {
   textColor: '#d97706',
   colorClass: 'bg-gradient-to-br from-amber-600 to-amber-800' // 大尉/エリート
  },
  // 最高ランク - 高貴な紫と金
  {
   textColor: '#f59e0b',
   colorClass: 'bg-gradient-to-br from-amber-500 to-yellow-600' // 少佐/チャンピオン
  },
  {
   textColor: '#5a189a', // 青みの強い紫
   colorClass: 'bg-gradient-to-br from-violet-700 via-blue-600 to-indigo-900 animate-gradient' // クールで神秘的な紫
  }
 ]
};

const props = defineProps<{
 count: number;
}>();

// コンポーザブル
const { generator, isAnimating, progressRatio, counterStyle } = useWordComponent(
 toRef(props, 'count'),
 600,
 generatorTest
);

// 16進数カラーコードを rgba に変換する関数
function convertHexToRGBA(hex: string, alpha: number = 1): string {
 // HEXカラーコードをRGBAに変換
 const r = parseInt(hex.slice(1, 3), 16);
 const g = parseInt(hex.slice(3, 5), 16);
 const b = parseInt(hex.slice(5, 7), 16);
 return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
</script>

<style scoped>
/* カウント変更時のアニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.count-enter-from {
 opacity: 0;
 transform: scale(0.8) translateY(10px);
}

.count-leave-to {
 opacity: 0;
 transform: scale(1.2);
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

@keyframes lineFade {
 0% {
  opacity: 1;
  transform: rotate(var(--rotation)) translateX(30px) scale(0.5);
 }
 100% {
  opacity: 0;
  transform: rotate(var(--rotation)) translateX(80px) scale(1);
 }
}

@keyframes gradientShift {
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
 animation: gradientShift 3s ease infinite;
}
</style>
