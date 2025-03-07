<!-- SamuraiKatana.vue -->
<template>
 <div class="relative flex items-center justify-center">
  <!-- 和風の背景 -->
  <div
   class="relative flex flex-col items-center justify-center w-72 h-72 rounded-full shadow-xl border-8 transform transition-all duration-300"
   :class="[counterStyle.colorClass, { 'shake-animation': isSlashing }]"
   style="border-color: #8b4513"
  >
   <!-- 和室の障子風の背景パターン -->
   <div class="absolute inset-0 shoji-pattern rounded-full overflow-hidden"></div>

   <!-- 回転する暗雲の背景 (SVG) -->
   <div class="absolute inset-0 overflow-hidden rounded-full">
    <svg class="dark-clouds" viewBox="200 200 800 800" xmlns="http://www.w3.org/2000/svg">
     <g class="cloud-group">
      <path class="st0" d="M389.271,399.867"></path>
      <path
       class="st0"
       d="M773.751,294.839c-3.846-11.577-3.846-19.307-7.718-30.872c-3.871-7.718-7.717-15.436-11.576-27.012
		c-23.155-42.449-46.308-88.769-84.897-119.641c-7.718,11.591-7.718,27.026-11.591,42.463
		C619.381,283.262,515.202,379.736,387.858,399.03c108.036,42.448,223.818,19.295,320.291-46.307
		c11.564-11.577,19.295-19.295,34.73-27.012C754.457,317.979,762.162,306.415,773.751,294.839L773.751,294.839z"
      ></path>
      <path class="st0" d="M389.271,399.867"></path>
      <path class="st0" d="M389.271,399.867"></path>
      <path class="st0" d="M389.271,399.867"></path>
      <path class="st0" d="M389.271,399.867"></path>
      <path class="st0" d="M389.271,399.867"></path>
      <path
       class="st0"
       d="M287.513,784.936c65.602,19.295,138.922,15.435,208.382,0c-42.448-38.589-77.178-84.896-100.345-138.922
		c-15.421-38.589-23.14-77.179-26.999-115.781c-3.86-46.293,11.577-88.756,19.308-131.204
		C279.795,491.657,245.064,649.872,287.513,784.936L287.513,784.936z"
      ></path>
      <path
       class="st0"
       d="M387.858,399.03c26.999,142.781,146.626,250.843,285.561,281.715c11.576-7.717,19.294-23.153,30.87-34.73
		c3.859-7.718,11.577-19.295,19.282-27.026c23.167-38.59,42.461-77.179,50.179-119.628
		C638.675,545.682,480.459,507.079,387.858,399.03L387.858,399.03z"
      ></path>
      <path
       class="st0"
       d="M387.858,399.03C503.626,310.274,534.484,144.34,488.19,13.137C422.575-2.3,349.256-2.3,283.654,16.982
		C387.858,109.609,441.869,263.967,387.858,399.03L387.858,399.03z"
      ></path>
      <path
       class="st0"
       d="M387.858,399.03C368.55,256.249,245.064,148.186,106.143,121.186C52.117,167.493,25.093,233.082,1.939,298.698
		C137.002,256.249,295.231,287.121,387.858,399.03L387.858,399.03z"
      ></path>
      <path
       class="st0"
       d="M387.858,399.03C252.782,348.864,98.425,402.889,5.81,507.079c19.283,69.474,54.025,127.344,104.179,177.524
		C133.156,545.682,248.923,426.056,387.858,399.03L387.858,399.03z"
      ></path>
     </g>
    </svg>
   </div>

   <!-- 稲妻エフェクト -->
   <div v-if="isSlashing" class="absolute inset-0 w-full h-full overflow-hidden">
    <div class="lightning-left"></div>
    <div class="lightning-right"></div>
   </div>

   <!-- 斬撃エフェクト -->
   <div v-if="isSlashing" class="absolute inset-0 w-full h-full">
    <div
     class="slash-effect"
     :style="{ transform: `translate(-50%, -50%) rotate(${slashAngle}deg) scale(1)` }"
    ></div>
   </div>

   <!-- カウンター数値 -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <TransitionGroup name="count">
     <div
      :key="count"
      class="text-9xl font-japanese text-white tracking-tight filter drop-shadow-md"
     >
      {{ count }}
     </div>
    </TransitionGroup>

    <!-- ステータステキスト -->
    <div
     v-if="progressTexts.length > 0"
     class="status-scroll relative mt-4 px-6 py-2 font-japanese text-2xl font-bold tracking-wide rounded-sm transform transition-all duration-300"
     :style="{ color: '#000000' }"
     :class="{ 'scale-110': isSlashing }"
    >
     <span class="relative z-10">{{ counterStyle.text }}</span>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Props {
 count: number;
 targetCount?: number;
 loopCount?: boolean;
 progressTexts?: string[];
}

const props = withDefaults(defineProps<Props>(), {
 targetCount: 15,
 loopCount: true,
 progressTexts: () => ['高評価']
});

// アニメーション状態
const isSlashing = ref(false);
const slashAngle = ref(-45); // 斬撃角度の初期値

// カウント変更を検知してアニメーションをトリガー
const prevCount = ref(props.count);
watch(
 () => props.count,
 (newCount) => {
  if (newCount !== prevCount.value) {
   triggerSlashAnimation();
   prevCount.value = newCount;
  }
 }
);

// 斬撃アニメーションをトリガーして一定時間後にリセット
const triggerSlashAnimation = () => {
 // ランダムな角度を生成 (0〜359度)
 slashAngle.value = Math.floor(Math.random() * 360);
 isSlashing.value = true;
 setTimeout(() => {
  isSlashing.value = false;
 }, 1200);
};

// 和風テーマのスタイル
const PROGRESS_STYLES = [
 {
  colorClass: 'bg-gradient-to-br from-red-700 via-red-600 to-red-800'
 },
 {
  colorClass: 'bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-900'
 },
 {
  colorClass: 'bg-gradient-to-br from-stone-700 via-yellow-700 to-amber-800'
 },
 {
  colorClass: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900'
 }
];

// 進捗率の計算
const progressPercentage = computed(() => {
 const percentage = (props.count / props.targetCount) * 100;
 return props.loopCount ? percentage % 100 : Math.min(percentage, 99.9);
});

// 進捗率に基づいたインデックス取得
const getProgressIndex = (totalItems: number) => {
 const index = Math.floor((progressPercentage.value / 100) * totalItems);
 return totalItems > 0 ? index % totalItems : 0;
};

// 進捗率に基づいたテキストとスタイルを取得
const progressText = computed(
 () => props.progressTexts[getProgressIndex(props.progressTexts.length)]
);
const progressStyle = computed(() => PROGRESS_STYLES[getProgressIndex(PROGRESS_STYLES.length)]);

const counterStyle = computed(() => ({
 text: progressText.value,
 ...progressStyle.value
}));
</script>

<style lang="scss" scoped>
/* 和風フォント（既存のフォントを使用するか、和風に似合うフォントを指定） */
@import url('https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap');

.font-japanese {
 font-family: 'Yuji Syuku', serif;
}

/* 障子風の背景パターン */
.shoji-pattern {
 background-color: rgba(255, 255, 255, 0.15);
 background-image: linear-gradient(rgba(255, 255, 255, 0.1) 3px, transparent 3px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 3px, transparent 3px);
 background-size: 69px 60px;
 opacity: 0.5;
}
.shoji-pattern::before {
 content: '';
 position: absolute;
 top: 0;
 left: 50%; /* 中央に配置 */
 transform: translateX(-50%); /* 中央揃え */
 width: 5px; /* 線の太さ */
 height: 100%;
 background: rgba(255, 255, 255, 0.2); /* 線の色 */
}

/* 暗雲の回転アニメーション */
.dark-clouds {
 width: 500px;
 height: 500px;
 opacity: 0.1;

 .cloud-group {
  transform-origin: center;
  animation: rotate-clouds 80s linear infinite;
 }
}

@keyframes rotate-clouds {
 from {
  transform: rotate(0deg);
 }
 to {
  transform: rotate(360deg);
 }
}

/* カウント変更時のアニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.6s ease-out;
}

.count-enter-from {
 opacity: 0;
 transform: scale(1.5) translateY(-20px);
}

.count-leave-to {
 opacity: 0;
 transform: scale(0.5) translateY(20px);
 position: absolute;
}

.count-leave-active {
 position: absolute;
}

/* 斬る動作のアニメーション */
.samurai-slash {
 animation: slash 1s ease-out forwards;
}

@keyframes slash {
 0% {
  transform: translateX(0) rotate(0);
 }
 30% {
  transform: translateX(-40px) rotate(-20deg);
 }
 60% {
  transform: translateX(10px) rotate(60deg);
 }
 100% {
  transform: translateX(0) rotate(0);
 }
}

/* 斬撃エフェクト */
.slash-effect {
 position: absolute;
 top: 50%;
 left: 50%;
 width: 100%;
 height: 10px;
 background-color: white;
 transform: translate(-50%, -50%) rotate(-45deg);
 animation: slash-line 0.5s ease-out forwards;
 box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.8);
}

@keyframes slash-line {
 0% {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(inherit) scale(0);
 }
 50% {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(inherit) scale(1.5);
 }
 100% {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(inherit) scale(2);
 }
}

/* 稲妻エフェクト */
.lightning-left,
.lightning-right {
 position: absolute;
 width: 10px;
 height: 100%;
 background-color: rgba(255, 255, 255, 0.8);
 box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.4);
 clip-path: polygon(
  50% 0,
  0% 20%,
  50% 40%,
  20% 60%,
  50% 80%,
  30% 100%,
  50% 100%,
  70% 80%,
  50% 60%,
  80% 40%,
  50% 20%,
  100% 0
 );
 animation: lightning 0.8s linear;
}

.lightning-left {
 left: 30%;
 animation-delay: 0.1s;
}

.lightning-right {
 right: 30%;
 animation-delay: 0.2s;
}

@keyframes lightning {
 0%,
 100% {
  opacity: 0;
 }
 10%,
 30%,
 50%,
 70%,
 90% {
  opacity: 1;
 }
 20%,
 40%,
 60%,
 80% {
  opacity: 0;
 }
}

/* 印籠・巻物風のステータステキスト */
.status-scroll {
 background-color: #f8efd4;
 border: 2px solid #8b4513;
 position: relative;
}

.status-scroll::before,
.status-scroll::after {
 content: '';
 position: absolute;
 top: 0;
 height: 100%;
 width: 10px;
 background-color: #8b4513;
}

.status-scroll::before {
 left: -5px;
 border-radius: 5px 0 0 5px;
}

.status-scroll::after {
 right: -5px;
 border-radius: 0 5px 5px 0;
}

/* 震えるエフェクト */
.shake-animation {
 animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
 10%,
 90% {
  transform: translate3d(-1px, 0, 0);
 }
 20%,
 80% {
  transform: translate3d(2px, 0, 0);
 }
 30%,
 50%,
 70% {
  transform: translate3d(-2px, 0, 0);
 }
 40%,
 60% {
  transform: translate3d(2px, 0, 0);
 }
}
</style>
