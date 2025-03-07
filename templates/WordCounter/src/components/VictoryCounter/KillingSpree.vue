<!-- KillingSpree.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col items-center justify-center w-64 h-64 rounded-lg shadow-lg overflow-hidden transition-all duration-500"
   :class="counterStyle.colorClass"
   :style="{
    transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
    boxShadow: `0 0 ${20 + pulseIntensity * 30}px ${pulseIntensity * 20}px ${convertHexToRGBA(counterStyle.shadowColor, 0.4 + pulseIntensity * 0.3)}`
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
       textShadow: `0 0 ${10 + pulseIntensity * 20}px rgba(255, 255, 255, ${0.5 + pulseIntensity * 0.5})`,
       transform: isAnimating ? 'scale(1.2)' : 'scale(1)'
      }"
     >
      {{ count }}
     </div>
    </TransitionGroup>

    <!-- ステータステキスト -->
    <div
     class="text-xl font-bold text-white/90 mt-2 tracking-widest transition-all duration-500"
     :style="{
      textShadow: `0 0 ${5 + pulseIntensity * 10}px rgba(255, 255, 255, ${0.3 + pulseIntensity * 0.3})`,
      transform: isAnimating ? 'translateY(2px)' : 'translateY(0)'
     }"
    >
     <span class="relative uppercase">
      {{ counterStyle.text }}
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
import { ref, computed, watch } from 'vue';
import { Crosshair, Skull, Target } from 'lucide-vue-next';

interface Props {
 count: number;
 maxIntensity?: number;
 isInitFlag?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
 maxIntensity: 5,
 isInitFlag: false
});

const isAnimating = ref(false);
const pulseIntensity = ref(0);

// キルステータステキスト設定
const KILL_STATUS_TEXTS = [
 'NO KILLS',
 'FIRST BLOOD',
 'DOUBLE KILL',
 'TRIPLE KILL',
 'MULTI KILL',
 'KILLING SPREE!',
 'RAMPAGE!',
 'DOMINATING!',
 'UNSTOPPABLE!',
 'GODLIKE!'
];

// キル数に応じたスタイル設定
const KILL_STATUS_STYLES = [
 {
  shadowColor: '#8b5cf6',
  colorClass: 'bg-gradient-to-br from-indigo-500 to-purple-600'
 },
 {
  shadowColor: '#f59e0b',
  colorClass: 'bg-gradient-to-br from-amber-500 to-orange-600'
 },
 {
  shadowColor: '#ef4444',
  colorClass: 'bg-gradient-to-br from-red-500 to-orange-600'
 }
];

// キル数による進捗率の計算
const progressLevel = computed(() => {
 if (props.count >= 15) return 9;
 if (props.count >= 10) return 8;
 if (props.count >= 8) return 7;
 if (props.count >= 6) return 6;
 if (props.count >= 5) return 5;
 if (props.count >= 4) return 4;
 if (props.count >= 3) return 3;
 if (props.count >= 2) return 2;
 if (props.count >= 1) return 1;
 return 0;
});

// スタイルの取得
const getStyleIndex = (count: number) => {
 if (count >= 10) return 2;
 if (count >= 5) return 1;
 return 0;
};

// キル数に応じたスタイルとテキストを取得
const killText = computed(() => KILL_STATUS_TEXTS[progressLevel.value]);
const killStyle = computed(() => KILL_STATUS_STYLES[getStyleIndex(props.count)]);

const counterStyle = computed(() => ({
 text: killText.value,
 ...killStyle.value
}));

// 16進数カラーコードを rgba に変換する関数
function convertHexToRGBA(hex: string, alpha: number = 1): string {
 // HEXカラーコードをRGBAに変換
 const r = parseInt(hex.slice(1, 3), 16);
 const g = parseInt(hex.slice(3, 5), 16);
 const b = parseInt(hex.slice(5, 7), 16);
 return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// カウント変更時のアニメーション
const triggerAnimation = () => {
 isAnimating.value = true;
 pulseIntensity.value = Math.min(props.count / props.maxIntensity, 1);

 setTimeout(() => {
  isAnimating.value = false;
 }, 600);
};

watch(
 () => props.count,
 (newCount, oldCount) => {
  if (newCount !== oldCount) triggerAnimation();
 },
 { immediate: true }
);
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
</style>
