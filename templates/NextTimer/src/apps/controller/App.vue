<!-- src/apps/controller/App.vue -->
<template>
 <div class="p-4 max-w-sm mx-auto bg-white rounded-lg shadow-md">
  <div class="flex items-center justify-between mb-4">
   <div class="flex items-center space-x-2">
    <button
     @click="adjustSeconds(-5)"
     class="h-8 w-8 border rounded flex items-center justify-center"
    >
     -
    </button>
    <span class="text-2xl font-bold w-16 text-center">{{ seconds }}秒</span>
    <button
     @click="adjustSeconds(5)"
     class="h-8 w-8 border rounded flex items-center justify-center"
    >
     +
    </button>
   </div>
  </div>

  <div class="grid grid-cols-2 gap-2">
   <button @click="startTimer" class="w-full bg-blue-500 text-white py-2 rounded">開始</button>
   <button @click="updateTimer('pause')" class="w-full bg-gray-500 text-white py-2 rounded">
    一時停止
   </button>
   <button @click="updateTimer('reset')" class="w-full bg-red-500 text-white py-2 rounded">
    リセット
   </button>
   <button
    @click="updateTimer('toggle_visibility')"
    class="w-full bg-green-500 text-white py-2 rounded"
   >
    表示切替
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
