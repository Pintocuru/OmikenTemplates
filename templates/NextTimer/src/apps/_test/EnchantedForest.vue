<!-- src/EnchantedForestTimer.vue -->
<template>
 <div class="flex justify-center items-center">
  <transition
   name="zoom"
   enter-active-class="animate__animated animate__fadeIn"
   leave-active-class="animate__animated animate__fadeOut"
  >
   <div v-show="isVisible" class="font-serif">
    <!-- 魔法の森の背景エフェクト -->
    <div class="enchanted-forest-bg rounded-3xl overflow-hidden relative">
     <!-- 飛び回る蝶や妖精 -->
     <div class="fairy fairy-1"></div>
     <div class="fairy fairy-2"></div>
     <div class="fairy fairy-3"></div>
     <div class="butterfly butterfly-1"></div>
     <div class="butterfly butterfly-2"></div>

     <div
      class="card w-96 bg-gradient-to-br from-indigo-900/60 via-purple-800/60 to-pink-800/60 backdrop-blur-sm shadow-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-500 border border-purple-300/20 rounded-3xl overflow-hidden"
     >
      <!-- 光の粒子エフェクト -->
      <div class="particles-container absolute inset-0 overflow-hidden"></div>

      <!-- カードヘッダー -->
      <div class="card-title justify-center mt-6 mb-2">
       <h1
        class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-violet-200 to-cyan-200 uppercase tracking-wider enchanted-title"
       >
        Enchanted Timer
       </h1>
      </div>

      <!-- カウントダウン表示 -->
      <div class="card-body pb-4 pt-2">
       <div
        class="crystal-container rounded-2xl p-6 mb-4 relative overflow-hidden border border-purple-300/30 bg-gradient-to-br from-indigo-900/40 to-purple-800/40 shadow-inner"
       >
        <!-- 魔法のオーラ（タイマー実行中のみ） -->
        <div v-if="isTimerRunning" class="absolute inset-0 magic-aura"></div>

        <!-- カウントダウン数字 -->
        <div class="flex justify-center z-10 relative">
         <div
          v-for="(digit, index) in countdownDigits"
          :key="index"
          class="w-14 h-20 mx-1 bg-gradient-to-b from-indigo-900/80 to-purple-800/80 rounded-lg overflow-hidden relative shadow-lg border border-purple-300/20 crystal"
         >
          <!-- クリスタルの輝き -->
          <div class="crystal-shine"></div>

          <!-- オドメーターアニメーション -->
          <div
           class="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out"
           :style="{ transform: `translateY(-${digit * 10}%)` }"
          >
           <span
            v-for="n in 10"
            :key="n"
            class="flex items-center justify-center h-20 text-4xl font-bold w-full text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-violet-200 to-cyan-200"
           >
            {{ (n - 1 + 10) % 10 }}
           </span>
          </div>

          <!-- グラデーションオーバーレイ -->
          <div
           class="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-indigo-900/90 to-transparent z-20"
          ></div>
          <div
           class="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-indigo-900/90 to-transparent z-20"
          ></div>
         </div>
        </div>
       </div>

       <!-- 次のカウントダウン時間 -->
       <div class="text-center font-semibold">
        <span
         class="uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-violet-200 text-lg"
         :class="{ 'pulse-glow': isTimerRunning }"
        >
         Next {{ displayTime }}
        </span>
       </div>

       <!-- ステータスインジケーター -->
       <div class="flex justify-center gap-4 mt-4 mb-1">
        <div
         class="indicator size-4 rounded-full crystal-orb"
         :class="isTimerRunning ? 'orb-active-1' : 'bg-indigo-900/50'"
        ></div>
        <div
         class="indicator size-4 rounded-full crystal-orb"
         :class="isTimerRunning ? 'orb-active-2' : 'bg-indigo-900/50'"
        ></div>
        <div
         class="indicator size-4 rounded-full crystal-orb"
         :class="isTimerRunning ? 'orb-active-3' : 'bg-indigo-900/50'"
        ></div>
       </div>

       <!-- プログレスバー -->
       <div
        class="w-full bg-indigo-900/30 rounded-full h-2 mt-4 overflow-hidden border border-purple-300/20"
       >
        <div
         class="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 transition-all duration-300 magic-progress"
         :style="{ width: `${(countdown / initialTime) * 100}%` }"
        ></div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </transition>
 </div>
</template>

<script setup lang="ts">
import { toRef, watch, computed } from 'vue';
import { useTimer } from '@scripts/useTimer';
import { CommentChara } from '@common/commonTypes';
import { NextTimerConfigType } from '@/scripts/types';
import { animate, stagger, inView } from 'motion';
import { onMounted } from 'vue';

const props = defineProps<{
 isInitFlag: boolean;
 nextTimer: CommentChara[];
 timeConfig: NextTimerConfigType;
}>();

const {
 displayTime,
 isVisible,
 isTimerRunning,
 countdown,
 countdownDigits,
 processComment,
 initialTime,
 secondAdjust
} = useTimer(props.timeConfig, toRef(props, 'isInitFlag'));

watch(
 () => props.nextTimer,
 (comments: CommentChara[]) => {
  comments.forEach((comment) => {
   processComment(comment.data.comment);
  });
 },
 { deep: true, immediate: true }
);

onMounted(() => {
 // 蝶と妖精のアニメーション
 animate(
  '.fairy, .butterfly',
  {
   x: ['0%', '100%', '0%'],
   y: ['0%', '100%', '0%'],
   scale: [1, 1.2, 0.8, 1],
   opacity: [0.4, 0.8, 0.4]
  },
  {
   duration: 15,
   repeat: Infinity,
   delay: stagger(2)
  }
 );

 // クリスタルの輝きアニメーション
 animate(
  '.crystal-shine',
  {
   opacity: [0, 0.6, 0],
   scale: [0.8, 1.2, 0.8],
   rotate: [0, 180, 360]
  },
  {
   duration: 3,
   repeat: Infinity
  }
 );

 // タイトルのアニメーション
 animate(
  '.enchanted-title',
  { scale: [0.9, 1.05, 0.9] },
  {
   duration: 4,
   repeat: Infinity
  }
 );

 // 粒子のアニメーション
 const particles = document.createElement('div');
 particles.className = 'particles';
 document.querySelector('.particles-container')?.appendChild(particles);

 for (let i = 0; i < 40; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particles.appendChild(particle);
 }

 animate(
  '.particle',
  {
   y: ['0%', '100%'],
   opacity: [0, 0.8, 0],
   scale: [0, 1, 0]
  },
  {
   repeat: Infinity,
   delay: () => Math.random() * 5
  }
 );
});
</script>

<style scoped>
/* 魔法の森の背景 */
.enchanted-forest-bg {
 position: relative;
 background: radial-gradient(
  circle at center,
  rgba(76, 29, 149, 0.2) 0%,
  rgba(30, 58, 138, 0.4) 100%
 );
 padding: 20px;
}

/* フェアリーとバタフライのスタイル */
.fairy,
.butterfly {
 position: absolute;
 width: 10px;
 height: 10px;
 border-radius: 50%;
 pointer-events: none;
 filter: blur(1px);
 z-index: 5;
}

.fairy {
 background: radial-gradient(
  circle at center,
  rgba(216, 180, 254, 0.8) 0%,
  rgba(129, 140, 248, 0) 70%
 );
 box-shadow: 0 0 10px 2px rgba(216, 180, 254, 0.4);
}

.butterfly {
 background: radial-gradient(
  circle at center,
  rgba(251, 207, 232, 0.8) 0%,
  rgba(167, 139, 250, 0) 70%
 );
 box-shadow: 0 0 8px 2px rgba(251, 207, 232, 0.4);
}

.fairy-1 {
 top: 20%;
 left: 10%;
 width: 8px;
 height: 8px;
}

.fairy-2 {
 top: 65%;
 right: 15%;
 width: 6px;
 height: 6px;
}

.fairy-3 {
 bottom: 30%;
 left: 20%;
 width: 10px;
 height: 10px;
}

.butterfly-1 {
 top: 30%;
 right: 20%;
 width: 12px;
 height: 12px;
}

.butterfly-2 {
 bottom: 20%;
 left: 40%;
 width: 14px;
 height: 14px;
}

/* クリスタルエフェクト */
.crystal {
 position: relative;
 overflow: hidden;
 transform-style: preserve-3d;
 transition: all 0.3s ease;
}

.crystal:hover {
 transform: translateY(-3px);
 box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
}

.crystal-shine {
 position: absolute;
 width: 200%;
 height: 200%;
 top: -50%;
 left: -50%;
 background: radial-gradient(
  circle at center,
  rgba(255, 255, 255, 0.8) 0%,
  rgba(255, 255, 255, 0) 60%
 );
 pointer-events: none;
 z-index: 10;
}

/* 魔法のオーラ */
.magic-aura {
 background: radial-gradient(
  circle at center,
  rgba(139, 92, 246, 0.2) 0%,
  rgba(76, 29, 149, 0.1) 70%,
  transparent 100%
 );
 animation: pulse-aura 4s infinite ease-in-out;
}

@keyframes pulse-aura {
 0%,
 100% {
  opacity: 0.2;
  transform: scale(1);
 }
 50% {
  opacity: 0.4;
  transform: scale(1.05);
 }
}

/* クリスタルオーブ */
.crystal-orb {
 position: relative;
 box-shadow: 0 0 5px rgba(139, 92, 246, 0.3) inset;
 border: 1px solid rgba(139, 92, 246, 0.2);
 transition: all 0.5s ease;
}

.orb-active-1 {
 background: radial-gradient(circle at center, rgba(236, 72, 153, 0.8), rgba(139, 92, 246, 0.4));
 box-shadow: 0 0 10px rgba(236, 72, 153, 0.6);
 animation: pulse-orb 2s infinite;
}

.orb-active-2 {
 background: radial-gradient(circle at center, rgba(139, 92, 246, 0.8), rgba(79, 70, 229, 0.4));
 box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
 animation: pulse-orb 2s infinite 0.3s;
}

.orb-active-3 {
 background: radial-gradient(circle at center, rgba(79, 70, 229, 0.8), rgba(59, 130, 246, 0.4));
 box-shadow: 0 0 10px rgba(79, 70, 229, 0.6);
 animation: pulse-orb 2s infinite 0.7s;
}

@keyframes pulse-orb {
 0%,
 100% {
  transform: scale(1);
  opacity: 0.8;
 }
 50% {
  transform: scale(1.2);
  opacity: 1;
 }
}

/* パルスグロウエフェクト */
.pulse-glow {
 animation: pulse-text 2s infinite;
}

@keyframes pulse-text {
 0%,
 100% {
  opacity: 0.8;
  text-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
 }
 50% {
  opacity: 1;
  text-shadow:
   0 0 10px rgba(139, 92, 246, 0.6),
   0 0 20px rgba(139, 92, 246, 0.3);
 }
}

/* マジックプログレス */
.magic-progress {
 background-size: 200% 200%;
 animation: gradient-move 2s infinite linear;
}

@keyframes gradient-move {
 0% {
  background-position: 0% 50%;
 }
 50% {
  background-position: 100% 50%;
 }
 100% {
  background-position: 0% 50%;
 }
}

/* 粒子エフェクト */
.particles {
 position: absolute;
 width: 100%;
 height: 100%;
 pointer-events: none;
}

.particle {
 position: absolute;
 width: 4px;
 height: 4px;
 background: white;
 border-radius: 50%;
 pointer-events: none;
 opacity: 0;
}

.particles-container .particle:nth-child(odd) {
 background: rgba(236, 72, 153, 0.8);
 box-shadow: 0 0 6px rgba(236, 72, 153, 0.6);
}

.particles-container .particle:nth-child(even) {
 background: rgba(139, 92, 246, 0.8);
 box-shadow: 0 0 6px rgba(139, 92, 246, 0.6);
}
</style>
