<!-- src/apps/components/OldPattern04.vue -->
<template>
 <div id="container">
  <transition
   name="zoom"
   enter-active-class="animated zoomInUp"
   leave-active-class="animated zoomOut"
  >
   <div v-if="isVisible" id="clock-container">
    <div class="billboard">
     <div class="header">
      <h1>snipe counter</h1>
     </div>
     <div id="countdown">
      <div class="odometer">
       <div v-for="(digit, index) in countdownDigits" :key="index" class="digit">
        <div class="digit-inner" :style="{ transform: `translateY(-${digit * 10}%)` }">
         <span v-for="n in 10" :key="n">{{ (n - 1 + 10) % 10 }}</span>
        </div>
       </div>
      </div>
      <div class="time-remaining">Time Remaining</div>
     </div>
     <div id="next-clock" :class="{ animated2: isTimerRunning }">
      <span id="next-time">Next {{ displayTime }}</span>
     </div>
    </div>
   </div>
  </transition>
 </div>
</template>

<script setup lang="ts">
import { toRef, watch } from 'vue';
import { useTimerComponent } from '@/scripts/useTimerComponent';
import { CommentChara } from '@common/commonTypes';
import { NextTimerConfig } from '@/scripts/types';

const props = defineProps<{
 isInitFlag: boolean;
 nextTimer: CommentChara[];
 timeConfig: NextTimerConfig;
}>();

const { displayTime, isVisible, isTimerRunning, countdown, countdownDigits, processComment } =
 useTimerComponent(props.timeConfig, toRef(props, 'isInitFlag'));

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

#clock-container {
 font-family: 'Archivo Black', system-ui;
 display: flex;
 justify-content: center;
 align-items: center;
}

.billboard {
 background-color: white;
 border-radius: 12px;
 box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
 padding: 32px;
 transform: rotate(3deg);
 transition: transform 0.3s ease;
}

.header {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 24px;
}

.sun-icon {
 color: #fbbf24;
}

h1 {
 font-size: 2rem;
 font-weight: bold;
 color: #1f2937;
 margin: 0;
}

#countdown {
 background-color: #fbbf24;
 border-radius: 8px;
 padding: 24px;
 margin-bottom: 18px;
}

.odometer {
 display: flex;
 justify-content: center;
}

.digit {
 width: 58px;
 height: 90px;
 margin: 0 4px;
 overflow: hidden;
 position: relative;
 background: rgba(255, 255, 255, 0.2);
 border-radius: 8px;
}

.digit-inner {
 position: absolute;
 top: 0;
 left: 0;
 transition: transform 0.3s;
}

.digit-inner span {
 display: flex;
 align-items: center;
 justify-content: center;
 height: 96px;
 font-size: 3rem;
 font-weight: bold;
 color: white;
 text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.time-remaining {
 text-align: center;
 color: white;
 font-size: 1rem;
 margin-top: 8px;
}

#next-clock {
 text-align: center;
 font-size: 1.5rem;
 font-weight: 600;
 color: #4b5563;
}

.animated2 {
 animation: float 4s ease-in-out infinite;
}

@keyframes float {
 0%,
 100% {
  transform: translateY(0);
 }

 50% {
  transform: translateY(-15px);
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
