<!-- src/configMaker/BasicSettings.vue -->
<template>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- カードサイズ -->
  <div>
   <label class="block mb-1 font-medium">🃏カードサイズ</label>
   <div class="grid grid-cols-3 gap-4">
    <label v-for="size in [3, 4, 5]" :key="size" class="flex items-center gap-2 cursor-pointer">
     <input type="radio" :value="size" v-model="cardSize" class="radio radio-primary" />
     {{ size }}x{{ size }}
    </label>
   </div>
  </div>

  <!-- テーマ -->
  <div>
   <label class="block mb-1 font-medium">🎨テーマ</label>
   <select
    v-model="theme"
    class="w-full p-2 border rounded focus:ring-2 focus:ring-primary bg-white text-black"
   >
    <option v-for="t in themes" :key="t" :value="t">{{ t }}</option>
   </select>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { themes } from '@common/DaisyUi/DaisyUiTheme';
import { useConfigMaker } from '@/configMaker/useConfigMaker';

// Pinia ストアを使用
const configStore = useConfigMaker();

// computed を使って双方向バインド
const cardSize = computed({
 get: () => configStore.cardSize,
 set: (value) => (configStore.cardSize = value)
});

const theme = computed({
 get: () => configStore.theme,
 set: (value) => (configStore.theme = value)
});
</script>
