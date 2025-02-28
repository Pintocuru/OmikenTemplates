<!-- src/apps/components/OldPattern03.vue -->
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
     <span v-for="(digit, index) in countdownDigits" :key="index" class="digit">{{ digit }}</span>
    </div>
    <!-- 次回の時間表示 -->
    <div id="next-clock" :class="{ animated2: isTimerRunning }">
     Next <span class="heart"> ♥ </span> {{ displayTime }}
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
 font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
 background-color: #ffc0cb;
 border-radius: 20px;
 padding: 20px;
 border: 4px solid #fff;
 outline: 4px solid #ffc0cb;
 box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

#countdown {
 font-size: 3rem;
 color: #ff69b4;
 margin-bottom: 20px;
 display: flex;
 justify-content: center;
 align-items: center;
}

.digit {
 display: inline-block;
 background-color: #ffffff;
 border-radius: 10px;
 padding: 10px;
 margin: 0 5px;
 text-align: center;
}

#next-clock {
 font-size: 1.5rem;
 color: #8b4513;
 background-color: #ffdab9;
 padding: 5px 15px;
 border-radius: 15px;
 display: flex;
 justify-content: center;
 align-items: center;
 transition: transform 0.3s ease;
 white-space: nowrap;
}

.animated2 {
 animation: float 3s ease-in-out infinite;
}

@keyframes float {
 0%,
 100% {
  transform: translateY(0);
 }

 50% {
  transform: translateY(-10px);
 }
}

.heart {
 display: inline-block;
 color: #ff69b4;
 padding: 0 10px;
 animation: heartbeat 3s ease-in-out infinite;
}

@keyframes heartbeat {
 0%,
 100% {
  transform: scale(1);
 }

 50% {
  transform: scale(1.2);
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
