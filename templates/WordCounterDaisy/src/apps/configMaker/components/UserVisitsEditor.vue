<template>
 <div class="space-y-4">
  <!-- 差分モード設定 -->
  <div class="form-control">
   <label class="cursor-pointer label justify-start gap-4">
    <input type="checkbox" v-model="modelValue.IS_DIFF_MODE" class="toggle toggle-primary" />
    <span class="label-text">差分モード（新規訪問時のみカウント）</span>
   </label>
  </div>

  <!-- 有効サービス設定 -->
  <div class="form-control w-full">
   <label class="label">
    <span class="label-text">有効なサービス</span>
   </label>
   <select v-model="modelValue.ENABLED_SERVICES" class="select select-bordered w-full">
    <option value="all">すべて</option>
    <option value="platforms">プラットフォームのみ</option>
    <optgroup label="個別サービス">
     <option v-for="service in serviceTypes" :key="service" :value="service">
      {{ serviceLabels[service] || service }}
     </option>
    </optgroup>
   </select>
  </div>

  <!-- 許可するID -->
  <div class="form-control w-full">
   <label class="label">
    <span class="label-text">許可するID（空欄ですべて許可）</span>
   </label>
   <div class="flex flex-wrap gap-2 mb-2">
    <div
     v-for="(id, index) in modelValue.ALLOWED_IDS"
     :key="index"
     class="badge badge-primary gap-2"
    >
     {{ id }}
     <button @click="removeAllowedId(index)" class="btn btn-xs btn-ghost btn-circle">✕</button>
    </div>
   </div>
   <div class="join w-full">
    <input
     type="text"
     v-model="newAllowedId"
     placeholder="IDを入力"
     class="input input-bordered join-item w-full"
     @keyup.enter="addAllowedId"
    />
    <button @click="addAllowedId" class="btn join-item">追加</button>
   </div>
  </div>

  <!-- アクセスレベル -->
  <div class="form-control w-full">
   <label class="label">
    <span class="label-text">アクセスレベル</span>
   </label>
   <div class="btn-group">
    <button
     v-for="level in [1, 2, 3, 4]"
     :key="level"
     @click="modelValue.ACCESS_LEVEL = level"
     :class="['btn', modelValue.ACCESS_LEVEL === level ? 'btn-active' : '']"
    >
     {{ level }}
    </button>
   </div>
  </div>

  <!-- ギフト設定 -->
  <div class="form-control">
   <label class="cursor-pointer label justify-start gap-4">
    <input type="checkbox" v-model="modelValue.IS_GIFT" class="toggle toggle-primary" />
    <span class="label-text">ギフト機能を有効にする</span>
   </label>
  </div>

  <!-- キーワード設定 -->
  <div class="form-control w-full">
   <label class="label">
    <span class="label-text">キーワード（特定のキーワードを含むコメントのみカウント）</span>
   </label>
   <div class="flex flex-wrap gap-2 mb-2">
    <div
     v-for="(keyword, index) in modelValue.KEYWORDS"
     :key="index"
     class="badge badge-secondary gap-2"
    >
     {{ keyword }}
     <button @click="removeKeyword(index)" class="btn btn-xs btn-ghost btn-circle">✕</button>
    </div>
   </div>
   <div class="join w-full">
    <input
     type="text"
     v-model="newKeyword"
     placeholder="キーワードを入力"
     class="input input-bordered join-item w-full"
     @keyup.enter="addKeyword"
    />
    <button @click="addKeyword" class="btn join-item">追加</button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ConfigUserType, serviceTypeValues } from '@/scripts/schema';

const props = defineProps<{
 modelValue: ConfigUserType;
}>();

defineEmits<{
 (e: 'update:modelValue', value: ConfigUserType): void;
}>();

// サービスタイプのラベル
const serviceLabels: Record<string, string> = {
 youtube: 'YouTube',
 twicas: 'ツイキャス',
 twitch: 'Twitch',
 niconama: 'ニコ生',
 showroom: 'SHOWROOM',
 bilibili: 'Bilibili',
 mirrativ: 'Mirrativ',
 mixch: 'MIXCH',
 twitter: 'Twitter',
 doneru: 'Doneru',
 tiktok: 'TikTok',
 streamlabs: 'Streamlabs',
 kick: 'Kick',
 vtips: 'VTips',
 external: '外部連携'
};

const serviceTypes = serviceTypeValues;

// 許可IDの追加・削除
const newAllowedId = ref('');

const addAllowedId = () => {
 if (
  newAllowedId.value.trim() &&
  !props.modelValue.ALLOWED_IDS.includes(newAllowedId.value.trim())
 ) {
  props.modelValue.ALLOWED_IDS.push(newAllowedId.value.trim());
  newAllowedId.value = '';
 }
};

const removeAllowedId = (index: number) => {
 props.modelValue.ALLOWED_IDS.splice(index, 1);
};

// キーワードの追加・削除
const newKeyword = ref('');

const addKeyword = () => {
 if (newKeyword.value.trim() && !props.modelValue.KEYWORDS.includes(newKeyword.value.trim())) {
  props.modelValue.KEYWORDS.push(newKeyword.value.trim());
  newKeyword.value = '';
 }
};

const removeKeyword = (index: number) => {
 props.modelValue.KEYWORDS.splice(index, 1);
};
</script>
