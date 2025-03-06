<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col items-center justify-center w-64 h-64 rounded-lg shadow-lg overflow-hidden transition-all duration-500"
   :class="counterColorClass"
   :style="{
    transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
    boxShadow: `0 0 ${20 + pulseIntensity * 30}px ${pulseIntensity * 20}px rgba(${count >= 5 ? '255, 100, 0' : '139, 92, 246'}, ${0.4 + pulseIntensity * 0.3})`
   }"
  >
   <!-- 背景エフェクト - 弾痕模様 -->
   <div class="absolute inset-0 flex items-center justify-center">
    <div
     v-for="(_, i) in Math.min(count, 10)"
     :key="i"
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
    <TransitionGroup name="count">
     <div
      :key="count"
      class="text-8xl font-mono font-bold text-white tracking-tight transition-all duration-500"
      :style="{
       textShadow: `0 0 ${10 + pulseIntensity * 20}px rgba(255, 255, 255, ${0.5 + pulseIntensity * 0.5})`,
       transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
       opacity: isAnimating ? 0.9 : 1
      }"
     >
      {{ count }}
     </div>
    </TransitionGroup>

    <div
     class="text-xl font-bold text-white/90 mt-2 tracking-widest transition-all duration-500"
     :style="{
      textShadow: `0 0 ${5 + pulseIntensity * 10}px rgba(255, 255, 255, ${0.3 + pulseIntensity * 0.3})`,
      transform: isAnimating ? 'translateY(2px)' : 'translateY(0)'
     }"
    >
     <span class="relative uppercase">
      {{ killStreakText }}
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
    <div
     class="absolute w-full h-full bg-white/30 rounded-lg animate-ping"
     style="animation-duration: 0.6s"
    ></div>
    <div
     class="absolute w-20 h-20 bg-white/40 rounded-full animate-ping"
     style="animation-duration: 0.4s"
    ></div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Crosshair, Skull, Target } from 'lucide-vue-next';

const props = defineProps<{ isInitFlag: boolean; count: number }>();

const isAnimating = ref(false);
const pulseIntensity = ref(0);
const prevCount = ref(props.count);

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
   }, 600);
  }
 },
 { immediate: true }
);

// キル数に応じたスタイルの変更
const counterColorClass = computed(() => {
 if (props.count >= 10) return 'bg-gradient-to-br from-red-500 to-orange-600';
 if (props.count >= 5) return 'bg-gradient-to-br from-amber-500 to-orange-600';
 return 'bg-gradient-to-br from-indigo-500 to-purple-600';
});

// キルストリーク効果テキスト
const killStreakText = computed(() => {
 if (props.count >= 15) return 'GODLIKE!';
 if (props.count >= 10) return 'DOMINATING!';
 if (props.count >= 5) return 'KILLING SPREE!';
 if (props.count >= 3) return 'TRIPLE KILL!';
 if (props.count >= 1) return 'FIRST BLOOD';
 return 'NO KILLS';
});
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
@keyframes pulse {
 0% {
  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
 }
 70% {
  box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
 }
 100% {
  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
 }
}

/* Tailwind アニメーションクラス */
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
</style>
