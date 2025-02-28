<!-- src/apps/components/OldPattern05.vue -->
<template>
 <div id="container">
  <transition
   name="zoom"
   enter-active-class="animated zoomInUp"
   leave-active-class="animated zoomOut"
  >
   <div v-if="isVisible" id="clock-container">
    <div id="countdown">
     <span v-for="(digit, index) in countdownDigits" :key="index" class="digit">{{ digit }}</span>
    </div>
    <div id="next-clock" :class="{ animated: isTimerRunning }">
     Next <span class="heart">♥</span> {{ displayTime }}
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

#clock-container {
 display: inline-block;
 padding: 20px 30px;
 border-radius: 20px;
 background-color: rgba(200, 162, 255, 0.7);
 box-shadow: 0 0 15px rgba(200, 162, 255, 0.5);
}

#countdown {
 font-family: 'Arial', sans-serif;
 font-size: 48px;
 font-weight: bold;
 color: #fff;
 text-align: center;
 text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
}

.digit {
 display: inline-block;
 margin: 0 3px;
}

#next-clock {
 font-family: 'Arial', sans-serif;
 font-size: 24px;
 color: #fff;
 margin-top: 10px;
 transition: transform 0.3s ease-in-out;
}

#next-clock.animated2 {
 transform: translateY(-5px);
}

.heart {
 color: #ff69b4;
}

.sparkles {
 position: absolute;
 top: -15px;
 left: -15px;
 right: -15px;
 bottom: -15px;
}

@keyframes wingFloat {
 0%,
 100% {
  transform: translateY(0) rotate(0);
 }

 50% {
  transform: translateY(-10px) rotate(5deg);
 }
}

.wing {
 position: absolute;
 width: 100px;
 height: 150px;
 background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 150'%3E%3Cpath d='M50 0 C20 30 0 60 0 90 C0 120 20 150 50 150 C80 150 100 120 100 90 C100 60 80 30 50 0Z' fill='%23fff' opacity='0.8'/%3E%3C/svg%3E");
 background-repeat: no-repeat;
 animation: wingFloat 4s ease-in-out infinite;
}

.left-wing {
 left: -110px;
 top: 50%;
 transform: translateY(-50%) scaleX(-1);
}

.right-wing {
 right: -110px;
 top: 50%;
 transform: translateY(-50%);
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
