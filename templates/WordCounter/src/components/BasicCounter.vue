<template>
 <div class="flex items-center justify-center">
  <div
   :class="[
    'relative flex flex-col items-center justify-center w-56 h-56 rounded-full shadow-lg overflow-hidden transition-all duration-500',
    getBackgroundClass
   ]"
   :style="getAdditionalStyles"
  >
   <!-- 背景エフェクト -->
   <div
    :class="[
     'absolute inset-0 mix-blend-overlay transition-opacity duration-500',
     {
      'opacity-20': count < 10,
      'opacity-40': count >= 10 && count < 30,
      'opacity-60': count >= 30
     }
    ]"
   ></div>

   <!-- パルスリング -->
   <div
    v-for="(_, index) in getRingCount"
    :key="`ring-${index}`"
    :class="['absolute rounded-full border transition-all duration-1000', getRingClass(index)]"
    :style="{
     animation: `pulse-${getPulseType} ${1 + index * 0.3}s infinite`,
     animationDelay: `${index * 0.2}s`,
     width: `${100 + index * 10}%`,
     height: `${100 + index * 10}%`
    }"
   ></div>

   <!-- 内側の円 -->
   <div
    :class="[
     'absolute inset-4 rounded-full backdrop-blur-sm transition-all duration-500',
     getInnerCircleClass
    ]"
   ></div>

   <!-- 装飾パーティクル -->
   <div
    v-if="count >= 15"
    class="absolute inset-0 overflow-hidden"
    :style="{ opacity: Math.min((count - 15) / 30, 1) }"
   >
    <div
     v-for="n in 8"
     :key="`particle-${n}`"
     class="absolute w-2 h-2 rounded-full bg-yellow-300"
     :style="{
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `float ${3 + Math.random() * 2}s infinite ease-in-out`,
      animationDelay: `${Math.random() * 2}s`
     }"
    ></div>
   </div>

   <!-- アイコン -->
   <div
    v-if="count >= 5"
    class="absolute z-10"
    :style="{
     top: '10%',
     animation: count >= 15 ? 'spin 8s linear infinite' : 'none'
    }"
   >
    <component
     :is="getIcon"
     :size="24"
     class="text-white"
     :class="{ 'animate-pulse': count >= 10 }"
    />
   </div>

   <!-- カウンター -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <TransitionGroup name="count">
     <div
      :key="count"
      :class="[
       'font-sans font-bold text-center tracking-tight transition-all duration-300',
       getCountTextClass
      ]"
     >
      {{ count }}
     </div>
    </TransitionGroup>

    <div :class="['font-medium mt-1 tracking-wide transition-all duration-300', getSubtitleClass]">
     <span class="relative">
      {{ getSubtitleText }}
      <span
       class="absolute bottom-0 left-0 w-full h-0.5 bg-white/40 transform origin-left"
       :style="{ transform: `scaleX(${Math.min(count / 50, 1)})` }"
      ></span>
     </span>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Skull, Flame, Crown, Bomb, Star } from 'lucide-vue-next';

const props = defineProps<{ isInitFlag: boolean; count: number }>();
const prevCount = ref(props.count);
const isIncreasing = ref(false);

// カウント変更を監視してアニメーションをトリガー
watch(
 () => props.count,
 (newVal, oldVal) => {
  isIncreasing.value = newVal > oldVal;
  prevCount.value = oldVal;

  // カウント変更時にイベントをトリガー
  if (newVal > oldVal) {
   triggerPulseEffect();
  }
 }
);

// パルスエフェクトをトリガー
const isPulsing = ref(false);
const triggerPulseEffect = () => {
 isPulsing.value = true;
 setTimeout(() => {
  isPulsing.value = false;
 }, 500);
};

// 背景クラスを計算
const getBackgroundClass = computed(() => {
 if (props.count >= 50) return 'bg-gradient-to-br from-purple-900 to-red-900';
 if (props.count >= 30) return 'bg-gradient-to-br from-purple-700 to-red-700';
 if (props.count >= 15) return 'bg-gradient-to-br from-indigo-600 to-purple-700';
 if (props.count >= 5) return 'bg-gradient-to-br from-indigo-500 to-purple-600';
 return 'bg-gradient-to-br from-blue-500 to-indigo-500';
});

// 追加スタイルを計算
const getAdditionalStyles = computed(() => {
 let styles = {};

 if (props.count >= 20) {
  styles = {
   ...styles,
   transform: `scale(${1 + Math.min(props.count / 100, 0.3)})`
  };
 }

 if (isPulsing.value) {
  styles = {
   ...styles,
   boxShadow: '0 0 20px rgba(255, 255, 255, 0.7)'
  };
 }

 return styles;
});

// 内側の円のクラスを計算
const getInnerCircleClass = computed(() => {
 if (props.count >= 50) return 'bg-gradient-to-br from-purple-800/40 to-red-800/40';
 if (props.count >= 30) return 'bg-gradient-to-br from-purple-600/40 to-red-600/40';
 if (props.count >= 15) return 'bg-gradient-to-br from-indigo-500/30 to-purple-600/30';
 return 'bg-gradient-to-br from-indigo-400/30 to-purple-500/30';
});

// カウントテキストのクラスを計算
const getCountTextClass = computed(() => {
 if (props.count >= 50) return 'text-8xl text-red-100 animate-pulse';
 if (props.count >= 30) return 'text-8xl text-pink-100';
 if (props.count >= 15) return 'text-7xl text-fuchsia-100';
 if (props.count >= 5) return 'text-7xl text-white';
 return 'text-6xl text-white';
});

// サブタイトルのテキストを計算
const getSubtitleText = computed(() => {
 if (props.count >= 50) return 'ゴッドキラー!';
 if (props.count >= 30) return 'モンスター!';
 if (props.count >= 15) return 'エクセレント!';
 if (props.count >= 5) return 'ナイス!';
 return 'おは';
});

// サブタイトルのクラスを計算
const getSubtitleClass = computed(() => {
 if (props.count >= 50) return 'text-2xl text-red-200';
 if (props.count >= 30) return 'text-2xl text-pink-200';
 if (props.count >= 15) return 'text-xl text-fuchsia-100';
 return 'text-xl text-white/90';
});

// 表示するアイコンを計算
const getIcon = computed(() => {
 if (props.count >= 50) return Crown;
 if (props.count >= 30) return Bomb;
 if (props.count >= 15) return Flame;
 return Skull;
});

// リングの数を計算
const getRingCount = computed(() => {
 if (props.count >= 50) return 4;
 if (props.count >= 30) return 3;
 if (props.count >= 15) return 2;
 if (props.count >= 5) return 1;
 return 0;
});

// リングのクラスを計算
const getRingClass = (index: any) => {
 if (props.count >= 50) return 'border-red-500/50';
 if (props.count >= 30) return 'border-pink-500/50';
 if (props.count >= 15) return 'border-purple-500/50';
 return 'border-indigo-500/40';
};

// パルスタイプを計算
const getPulseType = computed(() => {
 if (props.count >= 50) return 'fire';
 if (props.count >= 30) return 'strong';
 return 'normal';
});
</script>

<style scoped>
/* カウント変更時のアニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

/* パルスエフェクト（通常） */
@keyframes pulse-normal {
 0% {
  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
  transform: scale(0.95);
 }
 70% {
  box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
  transform: scale(1);
 }
 100% {
  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
  transform: scale(0.95);
 }
}

/* パルスエフェクト（強） */
@keyframes pulse-strong {
 0% {
  box-shadow: 0 0 0 0 rgba(219, 39, 119, 0.7);
  transform: scale(0.95);
 }
 70% {
  box-shadow: 0 0 0 20px rgba(219, 39, 119, 0);
  transform: scale(1.05);
 }
 100% {
  box-shadow: 0 0 0 0 rgba(219, 39, 119, 0);
  transform: scale(0.95);
 }
}

/* パルスエフェクト（炎） */
@keyframes pulse-fire {
 0% {
  box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
  transform: scale(0.95);
 }
 50% {
  box-shadow: 0 0 25px 10px rgba(239, 68, 68, 0.7);
  transform: scale(1.05);
 }
 100% {
  box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  transform: scale(0.95);
 }
}

/* 回転アニメーション */
@keyframes spin {
 from {
  transform: rotate(0deg);
 }
 to {
  transform: rotate(360deg);
 }
}

/* 浮遊アニメーション */
@keyframes float {
 0%,
 100% {
  transform: translateY(0) scale(1);
  opacity: 0.8;
 }
 50% {
  transform: translateY(-10px) scale(1.2);
  opacity: 1;
 }
}
</style>
