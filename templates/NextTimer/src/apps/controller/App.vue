<!-- src/apps/controller/App.vue -->
<template>
 <div class="p-4 w-full bg-gray-800 rounded-lg shadow-md">
  <div class="grid grid-cols-2 pb-8 gap-2">
   <button
    @click="setInitialTime(-5)"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-white text-gray-900 border col-span-1 hover:bg-gray-400 flex items-center justify-center gap-2"
   >
    -5
   </button>
   <button
    @click="setInitialTime(5)"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-white text-gray-900 border hover:bg-gray-400 flex items-center justify-center gap-2"
   >
    +5
   </button>
  </div>

  <div class="grid grid-cols-3 gap-2">
   <button
    @click="start"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center gap-2 col-span-2 h-36"
   >
    <PlayIcon class="w-16 h-16" />
   </button>
   <button
    @click="controller.action('reset')"
    class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2 h-36"
   >
    <SquareIcon class="w-16 h-16" />
   </button>
   <button
    @click="controller.action('toggle_visibility')"
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
     @click="setSecondAdjust(seconds as SecondAdjustType)"
     class="px-4 py-2 rounded-lg shadow-md transition-all text-3xl font-semibold bg-white text-gray-900 border hover:bg-gray-400 flex items-center justify-center gap-2"
    >
     {{ seconds }}
    </button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@/scripts/useController';
import { SecondAdjustType } from '@/scripts/types';
import { Play as PlayIcon, Square as SquareIcon, Eye as EyeIcon } from 'lucide-vue-next';

// コンポーザブル
const { controller, start, setInitialTime, setSecondAdjust } = useLocalStorage();
</script>
