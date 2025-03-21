<!-- BingoNotification.vue -->
<template>
 <div class="notifications-container">
  <!-- コンパクトな通知バッジ -->
  <div v-if="lineCount > 0" class="bingo-badge" :class="{ 'pulse-animation': isNewBingo }">
   <div class="bingo-count">{{ lineCount }}</div>
   <div class="bingo-text">BINGO</div>
  </div>

  <!-- 新しいビンゴライン達成時のエフェクト -->
  <div v-if="isNewBingo" class="bingo-flash"></div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
 lineCount: {
  type: Number,
  default: 0
 }
});

const isNewBingo = ref(false);

// ビンゴライン数が変わったら通知アニメーションを発動
watch(
 () => props.lineCount,
 (newCount, oldCount) => {
  if (newCount > oldCount && oldCount >= 0) {
   isNewBingo.value = true;

   // 3秒後にアニメーション状態をリセット
   setTimeout(() => {
    isNewBingo.value = false;
   }, 3000);
  }
 }
);
</script>

<style scoped>
.notifications-container {
 position: fixed;
 top: 20px;
 right: 20px;
 z-index: 1000;
}

.bingo-badge {
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 width: 60px;
 height: 60px;
 background: linear-gradient(135deg, #9333ea, #ec4899);
 border-radius: 50%;
 box-shadow: 0 0 15px rgba(236, 72, 153, 0.6);
 overflow: hidden;
}

.bingo-count {
 font-size: 24px;
 font-weight: bold;
 line-height: 1;
}

.bingo-text {
 font-size: 12px;
 letter-spacing: 1px;
 opacity: 0.9;
}

.pulse-animation {
 animation: pulse 0.8s ease-in-out 3;
}

@keyframes pulse {
 0% {
  transform: scale(1);
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.6);
 }
 50% {
  transform: scale(1.2);
  box-shadow: 0 0 25px rgba(236, 72, 153, 0.9);
 }
 100% {
  transform: scale(1);
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.6);
 }
}

.bingo-flash {
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%);
 pointer-events: none;
 z-index: 999;
 animation: flash-fade 1.5s ease-out forwards;
}

@keyframes flash-fade {
 0% {
  opacity: 0;
 }
 30% {
  opacity: 1;
 }
 100% {
  opacity: 0;
 }
}
</style>
