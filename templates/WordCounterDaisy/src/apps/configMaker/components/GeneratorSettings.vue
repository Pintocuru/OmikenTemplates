<!-- src/apps/configMaker/components/GeneratorSettings.vue -->
<template>
 <div class="space-y-6">
  <!-- タイトル設定 -->
  <div class="card shadow-md p-2">
   <label class="label font-medium pb-1"> タイトル </label>
   <input
    type="text"
    v-model="generator.title"
    placeholder="カウンター名"
    class="input input-bordered w-full"
   />
  </div>

  <!-- カラーモード選択 -->
  <div class="card shadow-md p-2">
   <label class="label font-medium pb-1"> カラーモード </label>
   <div class="grid grid-cols-7 gap-2">
    <div
     v-for="theme in themes"
     :key="theme"
     class="badge cursor-pointer"
     @click="generator.color = theme"
     :class="{ 'badge-primary': generator.theme === theme }"
    >
     {{ theme }}
    </div>
   </div>
  </div>

  <!-- カラーモード選択 -->
  <div class="card shadow-md p-2">
   <label class="label font-medium pb-1"> カラーモード </label>
   <div class="grid grid-cols-4 gap-2">
    <div
     v-for="color in colors"
     :key="color"
     class="badge cursor-pointer"
     @click="generator.colorMode = color"
     :class="{
      'badge-primary': generator.colorMode === color && color === 'primary',
      'badge-secondary': generator.colorMode === color && color === 'secondary',
      'badge-accent': generator.colorMode === color && color === 'accent',
      'badge-neutral': generator.colorMode === color && color === 'neutral',
      'badge-info': generator.colorMode === color && color === 'info',
      'badge-success': generator.colorMode === color && color === 'success',
      'badge-warning': generator.colorMode === color && color === 'warning',
      'badge-error': generator.colorMode === color && color === 'error'
     }"
    >
     {{ color }}
    </div>
   </div>
  </div>

  <!-- スケール設定 -->
  <div class="card shadow-md p-2">
   <label class="label font-medium pb-1">
    表示スケール
    <span class="label-text-alt">{{ formattedScale }}</span>
   </label>
   <div class="mt-2">
    <input
     type="range"
     min="0.5"
     max="2"
     step="0.1"
     v-model.number="generator.scale"
     class="range range-primary mt-2"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
 generator: GeneratorConfig;
}>();

// 1.0, 2.0 を表示させるための計算プロパティ
const formattedScale = computed(() => {
 return props.generator.scale.toFixed(1);
});
</script>
