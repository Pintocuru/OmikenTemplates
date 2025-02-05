<!-- src/SuikaResult.vue -->
<template>
 <div
  class="result-bubble h-72 w-72 mx-auto rounded-full flex flex-col items-center justify-center relative whitespace-nowrap"
 >
  <div class="text-5xl mb-1 text-gray-100 score-text">スコア</div>
  <div class="text-7xl -mt-6 score-value">
   {{ score }}
  </div>
  <div class="text-5xl text-white score-text">
   {{ name }}
  </div>
 </div>
</template>

<script setup lang="ts">
defineProps<{
 score: number;
 name: string;
}>();
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap');

.result-bubble {
 background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.7));
 box-shadow:
  inset 0 0 100px rgba(255, 255, 255, 1),
  inset 0 0 100px rgba(207, 235, 247, 0.8),
  0 0 60px rgba(255, 255, 255, 0.7);
 animation: bubble 4s ease-in-out infinite alternate;
}

.score-text {
 -webkit-text-stroke: 1px #b3843a;
}

.score-value {
 font-family: 'Mochiy Pop P One', sans-serif;
 background: linear-gradient(to bottom, white, #ffcc00);
 -webkit-background-clip: text;
 background-clip: text;
 color: transparent;
 -webkit-text-stroke: 3px #b3843a;
}

@keyframes bubble {
 0% {
  transform: translateY(30px);
 }
 100% {
  transform: translateY(0);
 }
}
</style>
