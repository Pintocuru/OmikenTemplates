<!-- src/SteelSymphony.vue -->
<template>
 <div class="flex justify-center items-center">
  <transition name="locomotive-transition" mode="out-in">
   <div v-show="isVisible" class="font-serif">
    <div
     class="w-96 bg-gray-800 rounded-lg border-4 border-amber-700 shadow-2xl p-6 relative overflow-hidden locomotive-container"
    >
     <!-- 背景の楽譜パターン -->
     <div class="absolute inset-0 bg-music-pattern opacity-10"></div>

     <!-- 蒸気エフェクト (タイマー実行中のみ) -->
     <div v-if="isTimerRunning" class="steam-effect"></div>

     <!-- 金属の光沢エフェクト -->
     <div class="metal-shine"></div>

     <!-- カウントダウン表示 -->
     <div class="px-2 py-3">
      <div
       class="rounded-md bg-gray-900 p-4 mb-4 relative overflow-hidden border-2 border-amber-800 shadow-inner"
      >
       <!-- 機関車の車輪動作エフェクト（タイマー実行中のみ） -->
       <div
        v-if="isTimerRunning"
        class="absolute bottom-0 left-0 right-0 h-1 locomotive-tracks"
       ></div>

       <!-- カウントダウン数字 -->
       <div class="flex justify-center z-10 relative">
        <div
         v-for="(digit, index) in countdownDigits"
         :key="index"
         class="w-16 h-20 mx-1 bg-gray-800 rounded-md overflow-hidden relative border-2 border-amber-700 shadow-lg counter-digit"
         :class="{ spinning: isTimerRunning }"
        >
         <!-- オドメーターアニメーション -->
         <div
          class="absolute top-0 left-0 w-full transition-all duration-500 ease-in-out"
          :style="{ transform: `translateY(-${digit * 10}%)` }"
         >
          <span
           v-for="n in 10"
           :key="n"
           class="flex items-center justify-center h-20 text-4xl font-black w-full metal-digit"
          >
           {{ (n - 1 + 10) % 10 }}
          </span>
         </div>

         <!-- ネジと金属のディテール -->
         <div class="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-600 rivet"></div>
         <div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-600 rivet"></div>
         <div class="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-amber-600 rivet"></div>
         <div class="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-600 rivet"></div>

         <!-- グラデーションオーバーレイ -->
         <div
          class="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-gray-900 to-transparent z-20"
         ></div>
         <div
          class="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-gray-900 to-transparent z-20"
         ></div>
        </div>
       </div>
      </div>

      <!-- 次のカウントダウン時間 -->
      <div class="text-center font-bold">
       <span
        class="uppercase tracking-widest text-amber-500 metal-text-small"
        :class="{ 'pulse-glow': isTimerRunning }"
       >
        Next {{ displayTime }}
       </span>
      </div>
     </div>

     <!-- 機関車のディテール -->
     <div class="absolute bottom-2 left-4 right-4 h-1 bg-amber-700"></div>
     <div v-if="isTimerRunning" class="piston-animation left-2"></div>
     <div v-if="isTimerRunning" class="piston-animation right-2"></div>
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
import { Clock } from 'lucide-vue-next';

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

<style scoped>
.locomotive-transition-enter-active,
.locomotive-transition-leave-active {
 transition: all 0.7s cubic-bezier(0.5, 0, 0.5, 1);
}

.locomotive-transition-enter-from,
.locomotive-transition-leave-to {
 opacity: 0;
 transform: translateY(40px) scale(0.95);
}

.metal-text {
 color: #ffc107;
 text-shadow:
  0 0 1px #fff,
  0 0 2px #fff,
  0 0 5px #ffc107,
  0 0 10px rgba(255, 193, 7, 0.5);
 letter-spacing: 0.15em;
}

.metal-text-small {
 color: #ffc107;
 text-shadow:
  0 0 1px #fff,
  0 0 2px #ffc107;
 letter-spacing: 0.1em;
}

.metal-digit {
 background: linear-gradient(135deg, #666, #333, #666);
 color: #ffc107;
 text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
 background-clip: text;
}

.locomotive-container {
 background-image: linear-gradient(45deg, rgba(60, 60, 60, 0.8) 25%, rgba(40, 40, 40, 0.8) 25%),
  linear-gradient(-45deg, rgba(60, 60, 60, 0.8) 25%, rgba(40, 40, 40, 0.8) 25%);
 background-size: 5px 5px;
 box-shadow:
  0 10px 30px rgba(0, 0, 0, 0.8),
  inset 0 2px 10px rgba(255, 193, 7, 0.3);
}

.bg-music-pattern {
 background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.652-1.1 2.782-2.752 3.112-4.83.33-2.077-.19-4.27-1.452-6.11-.05-.07-.12-.13-.174-.2.45-.04.9-.07 1.345-.12.612-.06 1.232-.14 1.77-.23.406-.06.765-.14 1.068-.225.543-.155.828-.33.828-.58 0-.27-.35-.45-.875-.59-.537-.143-1.2-.227-1.88-.227-.827 0-1.653.07-2.368.18-.05-.228-.087-.466-.106-.702-.045-.55-.04-1.13.137-1.676.175-.54.53-1.03 1.173-1.378.61-.334 1.41-.48 2.37-.48.76 0 1.697.17 2.5.437.805.267 1.387.678 1.387 1.283 0 .343-.27.654-.765.965-.537.34-1.31.62-2.127.85l-.852.22-.76.19c-.117.03-.23.06-.342.093-.236.07-.473.14-.697.22.042-.03.092-.06.134-.08.22-.12.432-.25.632-.4.12-.08.23-.17.343-.27.107-.1.214-.22.307-.34.067-.09.133-.18.196-.28.033-.05.065-.11.094-.16.038-.06.077-.13.11-.2.033-.07.063-.15.087-.22.033-.09.06-.19.08-.29.021-.09.036-.19.046-.29.027-.27.032-.55-.012-.82-.073-.45-.23-.83-.466-1.16-.32-.45-.776-.81-1.322-1.07C23.152.15 22.336-.01 21.56 0h-.03c-.61 0-1.175.13-1.66.37-.426.22-.764.48-1.023.8-.266.3-.453.67-.535 1.06-.092.39-.088.77-.03 1.15.03.18.08.36.148.52l-.38-.02c-.05-.01-.107-.01-.16-.02-.074-.01-.15-.01-.224-.02-.276-.02-.56-.01-.845.04-.33.05-.67.134-.97.277-.55.253-.92.62-1.13 1.058-.2.44-.25.936-.19 1.426.106.898.58 1.667 1.204 2.25.624.585 1.38 1.016 2.12 1.397.75.382 1.487.753 2.105 1.22.62.47 1.13 1.026 1.383 1.776.03.09.05.19.07.28.05.26.076.52.07.78-.01.28-.06.54-.147.8-.09.26-.222.49-.387.69-.158.19-.34.36-.546.5-.21.14-.44.24-.684.32-.248.07-.5.12-.75.14-.264.02-.53.02-.787 0-.32-.03-.636-.08-.935-.19-.3-.11-.583-.26-.84-.44-.275-.187-.495-.414-.67-.672-.183-.264-.32-.54-.395-.832-.07-.29-.08-.58-.035-.87.045-.29.152-.55.304-.78 1.542-.15 2.988-.8 4.067-1.83M39.93 18.644c-.22-.12-.436-.25-.643-.41-.21-.16-.407-.35-.587-.57-.177-.217-.334-.457-.46-.71-.126-.256-.22-.526-.278-.805-.058-.28-.08-.57-.07-.856.01-.289.068-.57.168-.837.09-.243.24-.468.416-.655.177-.188.395-.336.646-.445.252-.11.53-.166.823-.162.37-.002.73.085 1.05.25.33.165.624.407.85.708.234.322.403.694.51 1.082.108.389.154.787.128 1.188.14.03.028.05.042.076.033.06.088.155.088.155.002.042.01.082.02.123.03.14.086.27.192.356.106.086.25.128.39.134.34.012.55-.06.71-.195.16-.135.26-.332.3-.56.31-1.622-.27-3.32-1.5-4.667C41.32 10.73 39.25 9.71 37.122 9.71c-1.066 0-2.13.198-3.105.595-.977.397-1.83.99-2.5 1.728-.673.738-1.17 1.626-1.46 2.622-.286.995-.35 2.088-.182 3.175.17 1.088.578 2.08 1.185 2.902.606.822 1.407 1.48 2.32 1.937.91.456 1.915.713 2.955.712 1.03-.002 2.015-.246 2.888-.693.872-.446 1.63-1.076 2.215-1.83.586-.756.996-1.63 1.23-2.555.233-.926.27-1.88.116-2.78-.056-.336-.128-.67-.218-.995-.09-.324-.2-.646-.327-.954-.393-.097-.83-.16-1.31-.16-1.02 0-2.18.26-3.15.8-.97.54-1.67 1.32-1.67 2.25 0 .58.31 1.15.76 1.655.45.507 1.01.923 1.59 1.253.577.33 1.15.575 1.58.757.43.182.7.307.7.307l.26.14c.11.06.218.125.327.2.245.162.457.356.63.58.17.227.31.484.402.763.09.28.132.57.127.863 0 .162-.023.324-.06.485-.084.367-.25.7-.486.98-.238.282-.54.512-.885.675-.346.164-.73.265-1.142.288-.413.022-.85-.026-1.278-.157-.428-.13-.84-.345-1.206-.65-.37-.304-.692-.693-.92-1.145-.23-.455-.358-.97-.35-1.492.002-.43.103-.84.29-1.21.187-.37.453-.69.778-.929.325-.24.704-.4 1.106-.475 0 0 .396-.075 0 0-1.25.25-2.158.904-2.68 1.787-.52.883-.65 1.998-.33 3.022.32 1.023 1 1.957 1.895 2.58.894.622 1.982.938 3.098.938.47 0 .95-.05 1.43-.156.477-.107.953-.27 1.408-.488.455-.22.882-.494 1.254-.818.372-.324.683-.698.917-1.103.234-.404.39-.84.463-1.288.074-.447.07-.903-.01-1.344-.085-.442-.252-.86-.5-1.233-.248-.374-.57-.702-.953-.968M14.77 12.153c-.533-.303-1.107-.512-1.695-.605-.588-.09-1.185-.073-1.753.05-.568.122-1.088.33-1.52.612-.432.28-.767.63-.975 1.022-.21.393-.3.827-.265 1.262.35.435.192.856.464 1.22.273.365.654.67 1.102.906.45.236.973.396 1.532.459.559.062 1.15.024 1.72-.118.568-.142 1.103-.384 1.567-.71.464-.326.85-.736 1.11-1.2.26-.465.383-.984.364-1.5-.02-.518-.182-1.02-.448-1.462-.267-.44-.64-.824-1.1-1.126h.6c-.21-.12-.436-.25-.643-.41-.21-.16-.407-.35-.587-.57-.177-.217-.334-.457-.46-.71-.126-.256-.22-.526-.278-.805-.058-.28-.08-.57-.07-.856.01-.289.068-.57.168-.837.09-.243.24-.468.416-.655.177-.188.395-.336.646-.445.252-.11.53-.166.823-.162.37-.002.73.085 1.05.25.33.165.624.407.85.708.234.322.403.694.51 1.082.108.389.154.787.128 1.188.14.03.028.05.042.076.033.06.088.155.088.155.002.042.01.082.02.123.03.14.086.27.192.356.106.086.25.128.39.134.34.012.55-.06.71-.195.16-.135.26-.332.3-.56.31-1.622-.27-3.32-1.5-4.667C14.32 4.73 12.25 3.71 10.122 3.71c-1.066 0-2.13.198-3.105.595-.977.397-1.83.99-2.5 1.728-.673.738-1.17 1.626-1.46 2.622-.286.995-.35 2.088-.182 3.175.17 1.088.578 2.08 1.185 2.902.606.822 1.407 1.48 2.32 1.937.91.456 1.915.713 2.955.712 1.03-.002 2.015-.246 2.888-.693.872-.446 1.63-1.076 2.215-1.83.586-.756.996-1.63 1.23-2.555.233-.926.27-1.88.116-2.78-.056-.336-.128-.67-.218-.995-.09-.324-.2-.646-.327-.954-.393-.097-.83-.16-1.31-.16-1.02 0-2.18.26-3.15.8-.97.54-1.67 1.32-1.67 2.25 0 .58.31 1.15.76 1.655.45.507 1.01.923 1.59 1.253.577.33 1.15.575 1.58.757.43.182.7.307.7.307l.26.14c.11.06.218.125.327.2.245.162.457.356.63.58.17.227.31.484.402.763.09.28.132.57.127.863 0 .162-.023.324-.06.485-.084.367-.25.7-.486.98-.238.282-.54.512-.885.675-.346.164-.73.265-1.142.288-.413.022-.85-.026-1.278-.157-.428-.13-.84-.345-1.206-.65-.37-.304-.692-.693-.92-1.145-.23-.455-.358-.97-.35-1.492.002-.43.103-.84.29-1.21.187-.37.453-.69.778-.929.325-.24.704-.4 1.106-.475 0 0 .396-.075 0 0-1.25.25-2.158.904-2.68 1.787-.52.883-.65 1.998-.33 3.022.32 1.023 1 1.957 1.895 2.58.894.622 1.982.938 3.098.938.47 0 .95-.05 1.43-.156.477-.107.953-.27 1.408-.488.455-.22.882-.494 1.254-.818.372-.324.683-.698.917-1.103.234-.404.39-.84.463-1.288.074-.447.07-.903-.01-1.344-.085-.442-.252-.86-.5-1.233-.248-.374-.57-.702-.953-.968' fill='%23FFB300' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.metal-shine {
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 height: 40%;
 background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
 z-index: 1;
 pointer-events: none;
}

.steam-effect {
 position: absolute;
 top: -20px;
 right: 20px;
 width: 10px;
 height: 10px;
 background: rgba(255, 255, 255, 0.8);
 border-radius: 50%;
 z-index: 10;
 opacity: 0;
 animation: steam 2s infinite;
}

@keyframes steam {
 0% {
  transform: translateY(0) scale(1);
  opacity: 0;
 }
 20% {
  opacity: 0.8;
 }
 100% {
  transform: translateY(-30px) scale(3);
  opacity: 0;
 }
}

.rivet {
 box-shadow: 0 0 2px 1px rgba(255, 193, 7, 0.5);
}

.counter-digit.spinning {
 animation: sparkle 3s infinite;
 box-shadow:
  0 0 5px 2px rgba(255, 193, 7, 0.3),
  inset 0 0 3px rgba(255, 255, 255, 0.5);
}

@keyframes sparkle {
 0%,
 100% {
  box-shadow: 0 0 5px 2px rgba(255, 193, 7, 0.3);
 }
 50% {
  box-shadow: 0 0 8px 3px rgba(255, 193, 7, 0.5);
 }
}

.locomotive-tracks {
 background: repeating-linear-gradient(
  90deg,
  rgba(255, 193, 7, 0.3),
  rgba(255, 193, 7, 0.3) 5px,
  transparent 5px,
  transparent 15px
 );
 animation: tracks 1s linear infinite;
}

@keyframes tracks {
 0% {
  background-position: 0 0;
 }
 100% {
  background-position: 20px 0;
 }
}

.piston-animation {
 position: absolute;
 bottom: 8px;
 width: 15px;
 height: 4px;
 background: linear-gradient(to right, #ffc107, #b38600);
 border-radius: 2px;
 animation: piston 1.2s ease-in-out infinite;
}

.piston-animation.left-2 {
 left: 15px;
 animation-delay: 0s;
}

.piston-animation.right-2 {
 right: 15px;
 animation-delay: 0.6s;
}

@keyframes piston {
 0%,
 100% {
  transform: translateX(-5px);
 }
 50% {
  transform: translateX(5px);
 }
}

.pulse-glow {
 animation: pulse-text 2s infinite;
}

@keyframes pulse-text {
 0%,
 100% {
  text-shadow:
   0 0 2px #ffc107,
   0 0 4px #ffc107;
 }
 50% {
  text-shadow:
   0 0 5px #ffc107,
   0 0 10px #ffc107,
   0 0 15px rgba(255, 193, 7, 0.5);
 }
}
</style>
