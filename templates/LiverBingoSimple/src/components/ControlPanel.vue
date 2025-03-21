<!-- ControlPanel.vue -->
<template>
 <div
  class="fixed top-0 right-0 h-full w-80 bg-base-200 transition-all duration-300 z-50 shadow-lg border-l border-primary"
 >
  <div class="p-4">
   <!-- ヘッダー -->
   <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-bold">設定パネル</h2>
    <button @click="$emit('toggleControlPanel')" class="btn btn-circle btn-ghost">
     <span class="material-icons">close</span>
    </button>
   </div>

   <!-- 設定パネル -->
   <div class="card bg-base-100 shadow-md p-4">
    <h2 class="text-xl font-bold mb-4 text-center">ビンゴ設定</h2>

    <div class="space-y-4">
     <!-- 難易度選択 -->
     <div>
      <label class="block text-sm font-medium mb-1">難易度: {{ difficultyLevel }}</label>
      <div class="flex gap-2">
       <button
        v-for="level in 5"
        :key="level"
        @click="setDifficulty(level)"
        class="btn btn-sm"
        :class="difficultyLevel === level ? 'btn-primary' : 'btn-outline'"
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
       class="range"
       @input="updateClicksRequired"
      />
      <div class="flex justify-between text-xs text-gray-400">
       <span>1</span>
       <span>5</span>
       <span>10</span>
      </div>
     </div>

     <!-- ボタン -->
     <div class="flex gap-2 mt-4">
      <button @click="$emit('generate')" class="btn btn-success flex-1">カード生成</button>
      <button @click="$emit('reset')" class="btn btn-error flex-1">リセット</button>
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
