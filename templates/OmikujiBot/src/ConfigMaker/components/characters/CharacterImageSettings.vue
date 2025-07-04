<!-- src/apps/configMaker/components/CharacterImageSettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">画像設定</div>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
   <div v-for="(emotion, key) in emotionList" :key="key" class="form-control">
    <label class="label">
     <span class="label-text text-sm">{{ emotion.label }}</span>
    </label>
    <input
     type="url"
     class="input input-bordered input-sm w-full"
     :placeholder="`${emotion.label}の画像URL`"
     v-model="localImages[key]"
    />

    <!-- プレビュー表示 -->
    <img
     v-if="localImages[key]"
     :src="imageBaseUrl + localImages[key]"
     alt="画像プレビュー"
     class="mt-2 max-h-24 rounded border"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterPresetType } from '@/types/OmikujiTypesSchema';

const props = defineProps<{
 modelValue: CharacterPresetType['image'];
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CharacterPresetType['image']];
}>();

const imageBaseUrl =
 typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGE_BASE_URL
  ? import.meta.env.VITE_IMAGE_BASE_URL
  : './Characters/';

const emotionList = {
 default: { label: 'デフォルト' },
 happy: { label: '嬉しい' },
 excited: { label: '興奮' },
 laughing: { label: '笑い' },
 blushing: { label: '照れ' },
 surprised: { label: '驚き' },
 sad: { label: '悲しい' },
 angry: { label: '怒り' },
 thinking: { label: '考え中' },
 wink: { label: 'ウィンク' },
 singing: { label: '歌う' },
 sleepy: { label: '眠い' }
};

// v-modelを使用したlocalImagesの実装
const localImages = computed({
 get: () => props.modelValue,
 set: (value: CharacterPresetType['image']) => {
  emit('update:modelValue', value);
 }
});
</script>
