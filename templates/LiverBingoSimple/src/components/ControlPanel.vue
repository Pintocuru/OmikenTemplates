<!-- ControlPanel.vue -->
<template>
 <div
  class="fixed top-0 right-0 h-full bg-gray-900 bg-opacity-90 transition-all duration-300 z-50 border-l-2 border-purple-500"
 >
  <div class="p-4">
   <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-bold">設定パネル</h2>
    <button @click="$emit('toggleControlPanel')" class="text-white hover:text-pink-300">
     <span class="material-icons">close</span>
    </button>
   </div>
   <div class="bg-gray-900 p-4 rounded-lg mb-6 w-full max-w-md">
    <h2 class="text-xl font-bold mb-4 text-center">ビンゴ設定</h2>

    <div class="flex flex-col space-y-4">
     <!-- 難易度選択 -->
     <div>
      <label class="block text-sm font-medium mb-1">難易度: {{ difficultyLevel }}</label>
      <div class="flex space-x-2">
       <button
        v-for="level in 5"
        :key="level"
        @click="setDifficulty(level)"
        :class="[
         'px-3 py-1 rounded-md transition-colors',
         difficultyLevel === level
          ? 'bg-purple-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
       >
        {{ level }}
       </button>
      </div>
     </div>

     <!-- 基本達成回数 -->
     <div>
      <label class="block text-sm font-medium mb-1">基本達成回数: {{ clicksRequired }}</label>
      <input
       type="range"
       v-model="localClicksRequired"
       min="1"
       max="10"
       class="w-full"
       @input="updateClicksRequired"
      />
      <div class="flex justify-between text-xs text-gray-400">
       <span>1</span>
       <span>5</span>
       <span>10</span>
      </div>
     </div>

     <!-- ボタン -->
     <div class="flex space-x-2 mt-4">
      <button
       @click="$emit('generate')"
       class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
      >
       カード生成
      </button>
      <button
       @click="$emit('reset')"
       class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
      >
       リセット
      </button>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
 difficultyLevel: {
  type: Number,
  default: 3
 },
 clicksRequired: {
  type: Number,
  default: 3
 }
});

const emit = defineEmits([
 'update:difficultyLevel',
 'update:clicksRequired',
 'generate',
 'reset',
 'toggleControlPanel'
]);

const localClicksRequired = ref(props.clicksRequired);

watch(
 () => props.clicksRequired,
 (newVal) => {
  localClicksRequired.value = newVal;
 }
);

const setDifficulty = (level: number) => {
 emit('update:difficultyLevel', level);
};

const updateClicksRequired = () => {
 emit('update:clicksRequired', localClicksRequired.value);
};
</script>
