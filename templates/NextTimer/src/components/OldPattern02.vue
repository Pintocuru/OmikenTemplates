<!-- src/apps/components/OldPattern02.vue -->
<template>
 <div id="container">
  <transition
   name="zoom"
   enter-active-class="animated zoomInUp"
   leave-active-class="animated zoomOut"
  >
   <div v-if="isVisible" id="clock-container">
    <!-- カウントダウン -->
    <div id="countdown">
     <div class="odometer">
      <div v-for="(digit, index) in countdownDigits" :key="index" class="digit">
       <div class="digit-inner" :style="{ transform: `translateY(-${digit * 10}%)` }">
        <span v-for="n in 10" :key="n">{{ (n - 1 + 10) % 10 }}</span>
       </div>
      </div>
     </div>
    </div>
    <!-- 次回の時間表示 -->
    <div id="next-clock" :class="{ animated2: isTimerRunning }">
     <span id="next-time">Next {{ displayTime }}</span>
    </div>
   </div>
  </transition>
 </div>
</template>

<script setup lang="ts">
import { toRef, watch } from 'vue';
import { useTimer } from '@scripts/useTimer';
import { CommentChara } from '@common/commonTypes';
import { NextTimerConfigType } from '@/scripts/types';

const props = defineProps<{
 isInitFlag: boolean;
 nextTimer: CommentChara[];
 timeConfig: NextTimerConfigType;
}>();

const { displayTime, isVisible, isTimerRunning, countdown, countdownDigits, processComment } =
 useTimer(props.timeConfig, toRef(props, 'isInitFlag'));

watch(
 () => props.nextTimer,
 (comments: CommentChara[]) => {
  comments.forEach((comment) => {
   processComment(comment.data.comment);
  });
 },
 { deep: true, immediate: true }
);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
/* フォント設定 */
.font-racing {
 font-family: 'Archivo', sans-serif;
}

:root {
 /* カラー編集 */
 --text-color: #fafafa; /* 文字色 */
 --odometer-color: #212121; /* オドメーターの背景色 */
 --background-primary: #000000; /* 時間表示の背景色1 */
 --background-secondary: #45484d; /* 時間表示の背景色2 */
}

/* 時計のコンテナ */
#clock-container {
 font-family: 'Archivo Black', system-ui;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 perspective: 1000px;
}

/* カウントダウンのメーター */
#countdown {
 transform: rotateX(30deg) scale(1.5);
 margin-bottom: 30px;
}

.odometer {
 display: flex;
 background-image: linear-gradient(
  to bottom,
  var(--background-secondary) 0%,
  var(--background-primary) 100%
 );
 font-size: 2rem;
 padding: 20px;
 border-radius: 15px;
 box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* オドメーター効果アニメーション */
.digit {
 display: inline-block;
 width: 1em;
 height: 1.5em;
 line-height: 1.5em;
 overflow: hidden;
 position: relative;
 margin: 0 5px;
 background: rgba(255, 255, 255, 0.8);
 border-radius: 5px;
}

.digit-inner {
 position: absolute;
 top: 0;
 left: 0;
 transition: transform 0.3s;
 transform-style: preserve-3d;
}

.digit-inner span {
 display: block;
 height: 1.5em;
 backface-visibility: hidden;
}

/* 時計のスタイル */
#next-clock {
 transform: rotateX(-20deg) scale(1.2);
 background: var(--odometer-color);
 color: var(--text-color);
 font-size: 1.4rem;
 padding: 10px 20px;
 border-radius: 10px;
 box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
 transition: transform 0.3s ease;
}

#next-clock:hover {
 transform: rotateX(-20deg) scale(1.25);
}

.animated {
 animation: float 6s ease-in-out infinite;
}

@keyframes float {
 0%,
 100% {
  transform: rotateX(-20deg) scale(1.2) translateY(0);
 }

 50% {
  transform: rotateX(-20deg) scale(1.2) translateY(-10px);
 }
}

/* --OLD対応-------------------------------------------- */

#container {
 position: relative;
 display: flex;
 justify-content: center;
 align-items: center;
 height: 100%;
}

.animated {
 animation-duration: 0.5s;
 animation-fill-mode: both;
}

.zoomInUp {
 animation-name: zoomInUp;
}

.zoomOut {
 animation-name: zoomOut;
}
</style>
