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
     <X class="w-6 h-6" />
     <!-- バツ印のアイコン -->
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
        @click="generateWithDifficulty(level)"
        class="btn btn-sm"
        :class="difficultyLevel === level ? 'btn-primary' : 'btn-outline'"
       >
        {{ level }}
       </button>
      </div>
     </div>

     <!-- テーマ選択 -->
     <div>
      <label class="block text-sm font-medium mb-1">テーマ: {{ theme }}</label>
      <select class="select select-bordered w-full" v-model="themeValue">
       <option v-for="themeOption in themes" :key="themeOption" :value="themeOption">
        {{ themeOption }}
       </option>
      </select>
     </div>

     <!-- リセットボタン -->
     <div class="flex justify-center mt-4">
      <button @click="$emit('reset')" class="btn btn-error w-full">リセット</button>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
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
 get() {
  return props.theme;
 },
 set(value: string) {
  emit('update:theme', value);
 }
});

// テーマのリスト
const themes = [
 'light',
 'dark',
 'cupcake',
 'bumblebee',
 'emerald',
 'corporate',
 'synthwave',
 'retro',
 'cyberpunk',
 'valentine',
 'halloween',
 'garden',
 'forest',
 'aqua',
 'lofi',
 'pastel',
 'fantasy',
 'wireframe',
 'black',
 'luxury',
 'dracula',
 'cmyk',
 'autumn',
 'business',
 'acid',
 'lemonade',
 'night',
 'coffee',
 'winter',
 'dim',
 'nord',
 'sunset',
 'caramellatte',
 'abyss',
 'silk'
];

// 難易度を設定してカードを生成する
const generateWithDifficulty = (level: number) => {
 emit('update:difficultyLevel', level);
 emit('generate');
};
</script>
