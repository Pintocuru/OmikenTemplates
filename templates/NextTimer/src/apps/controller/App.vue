<!-- src/apps/controller/App.vue -->
<template>
 <div class="p-4 max-w-sm mx-auto bg-white rounded-lg shadow-md">
  <div class="flex items-center justify-between mb-4">
   <div class="flex items-center space-x-2">
    <button
     @click="() => adjustTimer(-5)"
     class="h-8 w-8 border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
     :disabled="initialTime <= MIN_SECONDS"
    >
     <MinusIcon
      class="h-4 w-4"
      :class="initialTime <= MIN_SECONDS ? 'text-gray-300' : 'text-gray-600'"
     />
    </button>
    <span class="text-2xl font-bold w-16 text-center"> {{ initialTime }}秒 </span>
    <button
     @click="() => adjustTimer(5)"
     class="h-8 w-8 border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
     :disabled="initialTime >= MAX_SECONDS"
    >
     <PlusIcon
      class="h-4 w-4"
      :class="initialTime >= MAX_SECONDS ? 'text-gray-300' : 'text-gray-600'"
     />
    </button>
   </div>
   <span class="text-xl text-gray-600">NextTime : {{ endTime }}</span>
  </div>

  <div class="grid grid-cols-2 gap-2">
   <button
    @click="startTimer"
    class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
   >
    <PlayIcon class="h-4 w-4" />
    開始
   </button>
   <button
    @click="timerController.pauseTimer()"
    class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
   >
    <PauseIcon class="h-4 w-4" />
    一時停止
   </button>
   <button
    @click="timerController.resetTimer()"
    class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
   >
    <RefreshCwIcon class="h-4 w-4" />
    リセット
   </button>
   <button
    @click="timerController.toggleVisibility()"
    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
   >
    <EyeIcon class="h-4 w-4" />
    表示切替
   </button>
  </div>
  <!-- secondAdjust 選択用のコントロールを追加 -->
  <div class="mt-4">
   <label class="block text-sm font-medium text-gray-700 mb-2"> 時間調整単位 </label>
   <div class="grid grid-cols-4 gap-2">
    <button
     v-for="seconds in [10, 15, 20, 30]"
     :key="seconds"
     @click="() => setSecondAdjust(seconds)"
     :class="[
      'px-2 py-1 rounded',
      secondAdjust === seconds ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
     ]"
    >
     {{ seconds }}秒
    </button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { TimerStorageController } from '@/scripts/TimerStorage';
import { SecondAdjustType } from '@/scripts/types';
import { TimerAbsolute } from '@/scripts/TimerAbsolute';
import {
 Play as PlayIcon,
 Pause as PauseIcon,
 RefreshCw as RefreshCwIcon,
 Eye as EyeIcon,
 Plus as PlusIcon,
 Minus as MinusIcon
} from 'lucide-vue-next';

// 定数
const MIN_SECONDS = 10;
const MAX_SECONDS = 300;

// タイマーコントローラーの初期化と状態管理
const timerController = new TimerStorageController();
const timerAbsolute = new TimerAbsolute();
const initialTime = ref(30);
const secondAdjust = ref<SecondAdjustType>(10);
const now = ref(Date.now()); // 現在時刻

// タイマー終了時刻を計算（常に更新）
const endTime = computed(() => {
 const rawTime = new Date(now.value + initialTime.value * 1000);
 const timestamp = timerAbsolute.processTime(rawTime, secondAdjust.value);
 return timestamp ? timestamp.toLocaleTimeString() : '';
});

// タイマーの調整
const adjustTimer = (amount: number) => {
 const newValue = Math.max(MIN_SECONDS, Math.min(MAX_SECONDS, initialTime.value + amount));

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
