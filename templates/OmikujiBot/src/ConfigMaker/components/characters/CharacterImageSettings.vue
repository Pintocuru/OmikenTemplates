<!-- src/configMaker/components/characters/CharacterImageSettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">画像設定</div>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
   <div v-for="(emotion, key) in emotionLabels" :key="key" class="form-control">
    <label class="label">
     <span class="label-text text-sm">{{ emotion }}</span>
    </label>
    <input
     type="url"
     class="input input-bordered input-sm w-full"
     :placeholder="`${emotion}の画像URL`"
     v-model="localImages[key]"
    />

    <!-- プレビュー表示 -->
    <img
     v-if="localImages[key]"
     :src="getImagePath(localImages[key])"
     alt="画像プレビュー"
     class="mt-2 max-h-24 rounded border"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CharacterType, emotionLabels, getImagePath } from '@type/';

const props = defineProps<{
 modelValue: CharacterType['image'];
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CharacterType['image']];
}>();

// v-modelを使用したlocalImagesの実装
const localImages = computed({
 get: () => props.modelValue,
 set: (value: CharacterType['image']) => {
  emit('update:modelValue', value);
 }
});
</script>
