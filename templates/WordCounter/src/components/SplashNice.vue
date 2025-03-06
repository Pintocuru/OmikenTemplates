<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col items-center justify-center w-64 h-64 rounded-full shadow-lg overflow-hidden transition-all duration-500"
   :class="counterColorClass"
   :style="{
    transform: isAnimating ? 'scale(1.05) rotate(2deg)' : 'scale(1) rotate(0deg)',
    boxShadow: `0 0 ${20 + pulseIntensity * 20}px ${pulseIntensity * 15}px rgba(${getBoxShadowColor()}, ${0.5 + pulseIntensity * 0.3})`
   }"
  >
   <!-- インクスプラッシュ背景 -->
   <div class="absolute inset-0">
    <div
     v-for="(_, i) in Math.min(count * 2, 15)"
     :key="i"
     class="absolute rounded-full mix-blend-screen"
     :class="splashColorClass[i % splashColorClass.length]"
     :style="{
      width: `${Math.random() * 40 + 20}px`,
      height: `${Math.random() * 40 + 20}px`,
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
      transform: `scale(${Math.random() * 0.8 + 0.8}) rotate(${Math.random() * 360}deg)`,
      opacity: 0.7,
      filter: `blur(${Math.random() * 2 + 1}px)`
     }"
    ></div>
   </div>

   <div
    class="absolute inset-2 rounded-full bg-white/30 backdrop-blur-sm border-4 border-white/60"
   ></div>

   <!-- スプラッシュ装飾 -->
   <div
    v-for="(_, i) in 4"
    :key="`splash-${i}`"
    class="absolute w-10 h-10 rounded-full bg-yellow-300"
    :class="i % 2 === 0 ? 'bg-cyan-400' : 'bg-pink-400'"
    :style="{
     top: i < 2 ? '10%' : '80%',
     left: i % 2 === 0 ? '15%' : '85%',
     transform: `scale(${0.8 + count * 0.05}) rotate(${i * 90}deg)`,
     clipPath: 'polygon(50% 0%, 80% 40%, 100% 30%, 70% 70%, 80% 100%, 30% 70%, 0% 80%, 30% 30%)',
     transition: 'all 0.5s ease',
     opacity: 0.8
    }"
   ></div>

   <!-- カウンター -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <TransitionGroup name="count">
     <div
      :key="count"
      class="text-8xl font-rounded font-black text-white tracking-tight transition-all duration-500"
      :style="{
       textShadow: `0 0 ${5 + pulseIntensity * 10}px rgba(0, 0, 0, ${0.3 + pulseIntensity * 0.3}), 
                          4px 4px 0px #FF00FF, -4px -4px 0px #00FFFF`,
       transform: isAnimating ? 'scale(1.2) rotate(-5deg)' : 'scale(1) rotate(0deg)',
       opacity: 1
      }"
     >
      {{ count }}
     </div>
    </TransitionGroup>

    <div
     class="text-2xl font-bold mt-2 tracking-wide transition-all duration-500 bg-white rounded-full px-4 py-1"
     :style="{
      color: getCelebrationTextColor(),
      transform: isAnimating ? 'translateY(2px) scale(1.1)' : 'translateY(0) scale(1)',
      boxShadow: '0 3px 0 rgba(0,0,0,0.2)'
     }"
    >
     <span class="relative">
      {{ celebrationText }}
     </span>
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

   <!-- ボイスバブル演出 (カウント増加時) -->
   <div
    v-if="isAnimating"
    class="absolute speech-bubble"
    :style="{
     top: `-${20 + Math.random() * 20}px`,
     left: `${Math.random() * 70 + 15}%`,
     transform: 'scale(0)',
     animation: 'bubblePop 1s ease-out forwards'
    }"
   >
    <div
     class="bg-white rounded-full px-3 py-1 font-bold text-sm"
     :style="{ color: getCelebrationTextColor() }"
    >
     {{ randomCheer }}
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{ isInitFlag: boolean; count: number }>();

const isAnimating = ref(false);
const pulseIntensity = ref(0);
const prevCount = ref(props.count);

// 色関連の配列
const splashColorClass = [
 'bg-cyan-400',
 'bg-pink-400',
 'bg-yellow-300',
 'bg-green-400',
 'bg-orange-400',
 'bg-purple-400'
];

// 応援メッセージの配列
const cheers = [
 'ナイス！',
 'いくぞ！',
 'スゴイ！',
 'ワオ！',
 'イェーイ！',
 'やったね！',
 'サイコー！',
 'ヤッター！',
 'ウホッ！',
 'ラッキー！'
];

// ランダムな応援メッセージ
const randomCheer = computed(() => {
 return cheers[Math.floor(Math.random() * cheers.length)];
});

// カウント変更時のアニメーション
watch(
 () => props.count,
 (newCount, oldCount) => {
  if (newCount !== oldCount) {
   isAnimating.value = true;
   pulseIntensity.value = Math.min(newCount / 5, 1); // 最大5キル以上で最大強度

   setTimeout(() => {
    isAnimating.value = false;
    prevCount.value = newCount;
   }, 800);
  }
 },
 { immediate: true }
);

// キル数に応じたスタイルの変更
const counterColorClass = computed(() => {
 if (props.count >= 10) return 'bg-gradient-to-br from-purple-500 to-pink-500';
 if (props.count >= 5) return 'bg-gradient-to-br from-cyan-500 to-blue-500';
 return 'bg-gradient-to-br from-green-400 to-cyan-500';
});

// キル数に応じた称賛テキスト
const celebrationText = computed(() => {
 if (props.count >= 15) return 'ウルトラスーパー！';
 if (props.count >= 10) return 'スーパースター！';
 if (props.count >= 7) return 'ファンタスティック！';
 if (props.count >= 5) return 'イカしてる！';
 if (props.count >= 3) return 'ナイスプレイ！';
 if (props.count >= 1) return 'ナイス！';
 return 'がんばれ～！';
});

// 称賛テキストの色
const getCelebrationTextColor = () => {
 if (props.count >= 10) return '#d946ef';
 if (props.count >= 5) return '#0ea5e9';
 return '#10b981';
};

// ボックスシャドウの色
const getBoxShadowColor = () => {
 if (props.count >= 10) return '212, 70, 239';
 if (props.count >= 5) return '14, 165, 233';
 return '16, 185, 129';
};
</script>

<style scoped>
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

/* 丸みを帯びたフォント風の設定 */
.font-rounded {
 font-family: 'Mochiy Pop One', 'Rounded Mplus 1c', 'Varela Round', sans-serif;
}
</style>
