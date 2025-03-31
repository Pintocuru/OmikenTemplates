<!-- src/apps/configMaker/components/GeneratorSettings.vue -->
<template>
 <div class="space-y-4">
  <!-- タイトル設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">タイトル</span>
   </label>
   <input
    type="text"
    v-model="generator.title"
    placeholder="カウンター名"
    class="input input-bordered w-full"
   />
  </div>

  <!-- テーマ選択 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">テーマ</span>
   </label>
   <select v-model="generator.theme" class="select select-bordered w-full bg-white text-gray-800">
    <option v-for="theme in themes" :key="theme" :value="theme">
     {{ theme }}
    </option>
   </select>
  </div>

  <!-- カラーモード選択 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">カラーモード</span>
   </label>
   <select
    v-model="generator.colorMode"
    class="select select-bordered w-full bg-white text-gray-800"
   >
    <option v-for="color in colors" :key="color" :value="color">
     {{ color }}
    </option>
   </select>
   <div class="mt-2">
    <div class="flex flex-wrap gap-2">
     <div
      v-for="color in colors"
      :key="color"
      :class="`badge badge-${color} badge-lg cursor-pointer`"
      @click="generator.colorMode = color"
     >
      {{ color }}
     </div>
    </div>
   </div>
  </div>

  <!-- スケール設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">表示スケール</span>
    <span class="label-text-alt">{{ generator.scale }}</span>
   </label>
   <input
    type="range"
    min="0.5"
    max="2"
    step="0.1"
    v-model.number="generator.scale"
    class="range range-primary"
   />
   <div class="flex justify-between text-xs px-2">
    <span>0.5x</span>
    <span>1x</span>
    <span>2x</span>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { themes, colors } from '@scripts/types';
import type { GeneratorConfig } from '@scripts/types';

const props = defineProps<{
 generator: GeneratorConfig;
}>();
</script>
