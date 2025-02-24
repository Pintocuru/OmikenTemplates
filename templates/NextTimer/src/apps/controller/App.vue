<!-- src/apps/controller/App.vue -->
<template>
 <div class="p-4 max-w-sm mx-auto bg-white rounded-lg shadow-md">
  <div class="flex items-center justify-between mb-4">
   <div class="flex items-center space-x-2">
    <button
     @click="adjustSeconds(-5)"
     class="h-8 w-8 border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
    >
     <MinusIcon class="h-4 w-4 text-gray-600" />
    </button>
    <span class="text-2xl font-bold w-16 text-center">{{ seconds }}秒</span>
    <button
     @click="adjustSeconds(5)"
     class="h-8 w-8 border rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
    >
     <PlusIcon class="h-4 w-4 text-gray-600" />
    </button>
   </div>
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
    @click="updateTimer('pause')"
    class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
   >
    <PauseIcon class="h-4 w-4" />
    一時停止
   </button>
   <button
    @click="updateTimer('reset')"
    class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
   >
    <RefreshCwIcon class="h-4 w-4" />
    リセット
   </button>
   <button
    @click="updateTimer('toggle_visibility')"
    class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
   >
    <EyeIcon class="h-4 w-4" />
    表示切替
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
 Play as PlayIcon,
 Pause as PauseIcon,
 RefreshCw as RefreshCwIcon,
 Eye as EyeIcon,
 Plus as PlusIcon,
 Minus as MinusIcon
} from 'lucide-vue-next';

const seconds = ref(30);

const updateTimer = (action: string, value: number | null = null) => {
 const storageData = {
  action,
  ...(value !== null && { timestamp: value })
 };
 localStorage.setItem(
  'timer_control',
  JSON.stringify({
   ...storageData,
   _updated: Date.now()
  })
 );
};

const adjustSeconds = (amount: number) => {
 seconds.value = Math.max(5, Math.min(300, seconds.value + amount));
};

const startTimer = () => {
 const targetTime = new Date(Date.now() + seconds.value * 1000);
 updateTimer('start', targetTime.getTime());
};
</script>
