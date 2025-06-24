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
     :value="images[key as keyof typeof images]"
     @input="(e) => handleImageUpdate(key, (e.target as HTMLInputElement).value)"
    />

    <!-- プレビュー表示 -->
    <img
     v-if="images[key as keyof typeof images]"
     :src="imageBaseUrl + images[key as keyof typeof images]"
     alt="画像プレビュー"
     class="mt-2 max-h-24 rounded border"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import type { CharacterPresetType } from '@/types/OmikujiTypesSchema';

const props = defineProps<{
 images: CharacterPresetType['image'];
}>();

const emit = defineEmits<{
 update: [updates: Partial<CharacterPresetType['image']>];
}>();

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

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

const handleImageUpdate = (emotion: string, value: string) => {
 emit('update', { [emotion]: value });
};
</script>
