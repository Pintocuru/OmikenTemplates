<!-- src/apps/configMaker/components/CharacterColorSettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">色設定</div>

  <div class="flex flex-wrap gap-4 p-4">
   <div v-for="{ label, key } in fields" :key="key" class="form-control flex-1 min-w-32">
    <label class="label">
     <span class="label-text">{{ label }}</span>
    </label>
    <input
     type="color"
     class="input input-bordered h-12 w-full"
     :value="color[key]"
     @input="onInput($event, key)"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import type { CharacterPresetType } from '@/types/OmikujiTypesSchema';

const props = defineProps<{
 color: CharacterPresetType['color'];
}>();

const emit = defineEmits<{
 update: [updates: Partial<CharacterPresetType['color']>];
}>();

// labelとキーを配列で管理
const fields = [
 { label: '名前の色', key: 'nameColor' },
 { label: 'テキストの色', key: 'textColor' },
 { label: '背景色', key: 'backgroundColor' }
] as const;

function onInput(event: Event, key: keyof CharacterPresetType['color']) {
 const target = event.target as HTMLInputElement | null;
 if (target) emit('update', { [key]: target.value });
}
</script>
