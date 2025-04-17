<!-- src/components/BingoNotification.vue -->
<template>
 <div
  class="flex items-center justify-between bg-primary text-primary-content px-4 py-1 mb-1 rounded-lg transition-colors duration-500"
  :class="{ 'bg-secondary': showBingoEffect }"
 >
  <div
   @contextmenu.prevent="
    emit('generate');
    sounds.soundReset();
   "
   class="flex-grow text-center text-3xl font-bungee transition-transform duration-500"
   :class="{ 'scale-110': showBingoEffect }"
  >
   {{ showBingoEffect ? `${lineCount}ライン!!` : 'ライバービンゴ' }}
  </div>

  <div class="dropdown dropdown-bottom dropdown-end">
   <button
    @mouseenter="sounds.soundHover()"
    tabindex="0"
    class="btn btn-ghost btn-sm border-0 hover:bg-primary-content/20 ml-2 p-2 rounded-full flex items-center justify-center"
   >
    <Palette class="w-5 h-5" />
   </button>
   <ul
    tabindex="0"
    class="dropdown-content menu bg-base-300 text-base-content rounded-box z-10 w-full min-w-[20rem] p-2 shadow-lg grid grid-cols-3 gap-2"
   >
    <li v-for="themeOption in themes" :key="themeOption">
     <button
      class="btn btn-ghost hover:bg-primary/20"
      @mouseenter="sounds.soundHover()"
      @click="
       themeValue = themeOption;
       sounds.soundClick();
      "
     >
      {{ themeOption }}
     </button>
    </li>
   </ul>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { themes } from '@/scripts/types';
import { useSound } from '@/scripts/useSound';
import { Palette } from 'lucide-vue-next';

const props = defineProps<{
 theme: string;
 lineCount: number;
}>();
const emit = defineEmits(['update:theme', 'generate']);

// コンポーザブル
const sounds = useSound();

const showBingoEffect = ref(false);

const themeValue = computed({
 get: () => props.theme,
 set: (value) => emit('update:theme', value)
});

watch(
 () => props.lineCount,
 (newCount, oldCount) => {
  if (newCount > oldCount && oldCount >= 0) {
   showBingoEffect.value = true;
   setTimeout(() => (showBingoEffect.value = false), 3000);
  }
 }
);
</script>

<style scoped>
.scale-up {
 transform: scale(1.2);
 transition: transform 0.5s ease-in-out;
}
</style>
