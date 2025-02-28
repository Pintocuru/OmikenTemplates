<!-- src/apps/components/OldPattern01.vue -->
<template>
 <div id="container">
  <transition
   name="zoom"
   enter-active-class="animated zoomInUp"
   leave-active-class="animated zoomOut"
  >
   <div v-if="isVisible" id="clock-container">
    <!-- 次回の時間表示 -->
    <div id="next-clock" :class="{ animated2: isTimerRunning }">
     <span id="next-label">Next</span>
     <span id="next-time">{{ displayTime }}</span>
    </div>
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

/* pattern01 */

/* 時計のコンテナ */
#clock-container {
 position: fixed;
 width: calc(100% - 20px);
 min-width: 300px;
 top: 10px;
 left: 10px;
 font-family: 'Archivo Black', system-ui;
 display: flex;
 flex-direction: column;
 align-items: center;
}

/* 時計のスタイル */
#next-clock {
 width: 100%;
 padding: 0 0 20px 0;
 background-image: linear-gradient(
  to bottom,
  var(--background-secondary) 0%,
  var(--background-primary) 100%
 );
 color: var(--text-color);
 border-radius: 10px;
 border: 5px solid var(--background-primary);
 font-size: 2.5rem;
 text-align: center;
 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* countdown が 1 以上のときにアニメーションを適用 */
.animated2 {
 animation: float 6s ease-in-out infinite;
}

/* 'Next' ラベル */
#next-label {
 position: absolute;
 top: -10px;
 left: 20px;
 font-size: 1rem;
 font-weight: bold;
 color: var(--odometer-color);
 background-color: var(--text-color);
 padding: 0 10px;
 border-radius: 15px;
}

/* カウントダウンのメーター */
#countdown {
 position: relative;
 margin-top: -30px;
 width: 60%;
 height: 40px;
 background: var(--odometer-color);
 color: var(--text-color);
 font-size: 1.4rem;
 border: 5px solid var(--background-primary);
 overflow: hidden;
 box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* カウントダウンのオドメーター */
#countdown-time {
 display: flex;
 align-items: center;
 justify-content: center;
 height: 100%;
 transform-origin: left;
 transition: width 1s linear;
}

/* オドメーター効果アニメーション */
.odometer {
 display: flex;
 justify-content: center;
 align-items: center;
 height: 100%;
 background: var(--odometer-color);
 color: var(--text-color);
 font-size: 1.4rem;
}

.digit {
 display: inline-block;
 width: 0.7em;
 height: 1.5em;
 line-height: 1.5em;
 overflow: hidden;
 position: relative;
 margin: 0 2px;
}

.digit-inner {
 position: absolute;
 top: 0;
 left: 0;
 transition: transform 0.3s;
}

.digit-inner span {
 display: block;
 height: 1.5em;
}

/* ふわふわアニメーション */
@keyframes float {
 0% {
  transform: translateY(0);
 }

 50% {
  transform: translateY(10px);
 }

 100% {
  transform: translateY(0);
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
