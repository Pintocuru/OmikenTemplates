<!-- ControlPanel.vue -->
<template>
 <div
  class="fixed top-0 right-0 h-full w-80 bg-base-200 transition-all duration-300 z-50 shadow-lg border-l border-primary"
 >
  <div class="p-4">
   <!-- ヘッダー -->
   <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-bold">ビンゴ設定</h2>
    <button
     @click="$emit('toggleControlPanel')"
     class="btn btn-circle btn-ghost"
     aria-label="コントロールパネルを閉じる"
    >
     <X class="w-6 h-6" />
    </button>
   </div>

   <!-- 設定パネル -->
   <div class="card bg-base-100 shadow-md p-4">
    <div class="space-y-4">
     <!-- 難易度選択 -->
     <label class="block text-sm font-medium mb-1"> 難易度: {{ difficultyLevel }} </label>
     <div class="flex gap-2">
      <button
       v-for="level in 3"
       :key="level"
       @click="generateWithDifficulty(level)"
       class="btn"
       :class="difficultyLevel === level ? 'btn-primary' : 'btn-outline'"
      >
       {{ level }}
      </button>
     </div>
    </div>

    <!-- テーマ選択 -->
    <div>
     <span class="block text-sm font-medium mt-3 mb-1">テーマ:</span>
     <div class="dropdown w-full">
      <div tabindex="0" role="button" class="btn m-1 w-full justify-start">
       {{ themeValue || 'テーマを選択' }}
      </div>
      <ul
       tabindex="0"
       class="dropdown-content menu bg-primary text-primary-content rounded-box z-10 w-full p-2 shadow-sm max-h-60 overflow-y-auto grid grid-cols-2 gap-2"
      >
       <li v-for="themeOption in themes" :key="themeOption" class="col-span-1">
        <button @click="themeValue = themeOption">
         {{ themeOption }}
        </button>
       </li>
      </ul>
     </div>
    </div>

    <!-- リセットボタン -->
    <div class="flex justify-center mt-4">
     <button @click="$emit('reset')" class="btn btn-error w-full">リセット</button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { themes } from '@/scripts/types';
import { X } from 'lucide-vue-next';

const props = defineProps<{
 theme: string;
 difficultyLevel: number;
}>();

const emit = defineEmits([
 'update:theme',
 'update:difficultyLevel',
 'generate',
 'reset',
 'toggleControlPanel'
]);

// v-modelの双方向バインディングのための計算プロパティ
const themeValue = computed({
 get: () => props.theme,
 set: (value: string) => emit('update:theme', value)
});

// 難易度を設定してカードを生成する
const generateWithDifficulty = (level: number) => {
 emit('update:difficultyLevel', level);
 emit('generate');
};
</script>
