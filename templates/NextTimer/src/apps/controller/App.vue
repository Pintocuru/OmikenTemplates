<!-- src/apps/controller/App.vue -->
<template>
 <div class="p-4 w-full bg-gray-800 rounded-lg shadow-md">
  <div class="grid grid-cols-2 pb-8 gap-2">
   <button
    @click="adjustTimer(-5)"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-white text-gray-900 border col-span-1 hover:bg-gray-400 flex items-center justify-center gap-2"
   >
    -5
   </button>
   <button
    @click="adjustTimer(5)"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-white text-gray-900 border hover:bg-gray-400 flex items-center justify-center gap-2"
   >
    +5
   </button>
  </div>

  <div class="grid grid-cols-3 gap-2">
   <button
    @click="startTimer"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2 col-span-2 h-36"
   >
    <PlayIcon class="w-16 h-16" />
   </button>
   <button
    @click="timerController.resetTimer()"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2 h-36"
   >
    <SquareIcon class="w-16 h-16" />
   </button>
   <button
    @click="timerController.toggleVisibility()"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-yellow-500 text-white hover:bg-yellow-600 flex items-center justify-center gap-2 col-span-3 h-24"
   >
    <EyeIcon class="w-12 h-12" />
   </button>
  </div>

  <div class="mt-4">
   <label class="block text-sm font-medium text-gray-300 mb-2">Time Steps (x/60sec)</label>
   <div class="grid grid-cols-4 gap-2">
    <button
     v-for="seconds in [10, 15, 20, 30]"
     :key="seconds"
     @click="setSecondAdjust(seconds)"
     class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-white text-gray-900 border hover:bg-gray-400 flex items-center justify-center gap-2"
    >
     {{ seconds }}
    </button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { TimerStorageController } from '@/scripts/TimerStorage';
import { NextTimerConfigType, SecondAdjustType } from '@/scripts/types';
import { Play as PlayIcon, Square as SquareIcon, Eye as EyeIcon } from 'lucide-vue-next';

// 定数
const timeConfig: NextTimerConfigType = {
 ALWAYS_VISIBLE: window.TIME_CONFIG?.ALWAYS_VISIBLE || false, // 常時表示させるか
 MIN_SECONDS: window.TIME_CONFIG?.MIN_SECONDS || 10, // タイマーの最低値(秒)
 MAX_SECONDS: window.TIME_CONFIG?.MAX_SECONDS || 300, // タイマーの最大値(秒)
 AFTER_SHOW: window.TIME_CONFIG?.AFTER_SHOW || 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: window.TIME_CONFIG?.SECOND_ADJUST || 10, // 秒数を丸める(default=10秒単位)
 COUNT_PARTY: window.TIME_CONFIG?.COUNT_PARTY || {}, // WordPartyの発火タイミング
 COUNT_PARTY_START: window.TIME_CONFIG?.COUNT_PARTY_START || '', // タイマー起動時に発火するWordParty
 COUNT_PARTY_FINISH: window.TIME_CONFIG?.COUNT_PARTY_FINISH || '' // タイマー0で発火するWordParty
};

// タイマーコントローラーの初期化と状態管理
const timerController = new TimerStorageController(timeConfig);
const initialTime = ref(30);
const secondAdjust = ref<SecondAdjustType>(10);
const now = ref(Date.now()); // 現在時刻

// タイマーの調整
const adjustTimer = (amount: number) => {
 const newValue = Math.max(
  timeConfig.MIN_SECONDS,
  Math.min(timeConfig.MAX_SECONDS, initialTime.value + amount)
 );

 if (newValue !== initialTime.value) {
  initialTime.value = newValue;
  timerController.setInitialTime(newValue);
 }
};

// タイマー開始
const startTimer = () => {
 timerController.startTimer(initialTime.value, secondAdjust.value);
};

// 時刻を1秒ごとに更新
let intervalId: NodeJS.Timeout | null = null;

const setSecondAdjust = (value: number) => {
 secondAdjust.value = value as SecondAdjustType;
 timerController.setSecondAdjust(secondAdjust.value);
};

// コンポーネントのライフサイクル管理
onMounted(() => {
 timerController.initialize();

 intervalId = setInterval(() => {
  now.value = Date.now();
 }, 1000);
});

onUnmounted(() => {
 timerController.cleanup();
 if (intervalId) clearInterval(intervalId);
});
</script>
