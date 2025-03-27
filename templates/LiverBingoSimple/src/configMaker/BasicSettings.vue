<!-- src/configMaker/BasicSettings.vue -->
<template>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- カードサイズ -->
  <div>
   <label class="block mb-1 font-medium">カードサイズ</label>
   <div class="grid grid-cols-3 gap-4">
    <label v-for="size in [3, 4, 5]" :key="size" class="flex items-center gap-2 cursor-pointer">
     <input type="radio" :value="size" v-model="localCardSize" class="radio radio-primary" />
     {{ size }}x{{ size }}
    </label>
   </div>
  </div>

  <!-- テーマ -->
  <div>
   <label class="block mb-1 font-medium">テーマ</label>
   <select
    v-model="localTheme"
    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary bg-white text-black"
   >
    <option v-for="t in themes" :key="t" :value="t">{{ t }}</option>
   </select>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { themes, ThemeType } from '@/scripts/types';

const props = defineProps<{
 cardSize: number;
 theme: ThemeType;
}>();

const emit = defineEmits(['update:cardSize', 'update:theme', 'update:difficultyLevel']);

// computed を使って双方向バインド
const localCardSize = computed({
 get: () => props.cardSize,
 set: (value) => emit('update:cardSize', value)
});

const localTheme = computed({
 get: () => props.theme,
 set: (value) => emit('update:theme', value)
});
</script>
