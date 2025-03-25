<!-- src/components/BingoNotification.vue -->
<template>
 <div
  class="bg-primary text-primary-content rounded flex items-center px-4 mb-1 relative"
  :class="{ 'bg-secondary': showBingoEffect }"
 >
  <div
   @contextmenu.prevent="emit('generate')"
   class="text-center flex-1 text-3xl font-bungee transition-all duration-500"
   :class="{ 'scale-up': showBingoEffect }"
  >
   {{ showBingoEffect ? `${lineCount}ライン!!` : 'ライバービンゴ' }}
  </div>
  <button
   @click="$emit('toggle-control-panel')"
   class="btn btn-outline btn-sm text-primary-content border-primary ml-2 p-2 rounded-full flex items-center justify-center"
  >
   <LucideSettings class="w-5 h-5" />
  </button>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { LucideSettings } from 'lucide-vue-next';

const props = defineProps({
 lineCount: {
  type: Number,
  default: 0
 }
});

const emit = defineEmits(['generate', 'toggle-control-panel']);

const showBingoEffect = ref(false);

watch(
 () => props.lineCount,
 (newCount, oldCount) => {
  if (newCount > oldCount && oldCount >= 0) {
   showBingoEffect.value = true;
   setTimeout(() => {
    showBingoEffect.value = false;
   }, 3000);
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
