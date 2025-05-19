<template>
 <div class="collapse-title text-lg font-semibold">対象コメント設定</div>
 <div class="collapse-content">
  <div class="space-y-3">
   <!-- 主要設定セクション -->
   <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- 左カラム -->
    <div class="space-y-3">
     <!-- 差分モード設定 -->
     <div class="card bg-base-200 p-2 compact">
      <label class="cursor-pointer label justify-start gap-2">
       <input type="checkbox" v-model="modelValue.IS_DIFF_MODE" class="toggle toggle-primary" />
       <span class="label-text">差分モード（新規訪問時のみカウント）</span>
      </label>
     </div>

     <!-- 有効サービス設定 -->
     <div class="form-control">
      <label class="block mb-1 font-medium">有効なサービス</label>
      <select v-model="modelValue.ENABLED_SERVICES" class="select select-bordered w-full">
       <option value="all">すべて(外部・コメントテスター含む)</option>
       <option value="platforms">配信プラットフォーム</option>
       <optgroup label="個別サービス">
        <option v-for="service in serviceTypeValues" :key="service" :value="service">
         {{ serviceLabels[service] || service }}
        </option>
       </optgroup>
      </select>
     </div>
    </div>

    <!-- 右カラム：アクセスレベル -->
    <div class="grid grid-cols-1 gap-1">
     <label
      v-for="level in accessLevels"
      :key="level.value"
      class="flex items-center gap-2 hover:bg-base-300 p-1 rounded"
     >
      <input
       type="radio"
       name="access-level"
       class="radio"
       :checked="modelValue.ACCESS_LEVEL === level.value"
       @change="modelValue.ACCESS_LEVEL = level.value"
      />{{ level.label }}
     </label>
    </div>
   </div>

   <!-- キーワード設定 -->
   <div class="form-control bg-base-200 p-3 rounded-lg">
    <label class="label py-0 pb-1">
     <span class="label-text font-medium">キーワード</span>
     <span class="label-text-alt text-sm text-gray-500"
      >特定のキーワードを含むコメントのみカウント（正規表現）、空白ですべてのコメントをカウント</span
     >
    </label>

    <div class="flex flex-wrap gap-1 mb-2">
     <div
      v-for="(keyword, index) in modelValue.KEYWORDS"
      :key="index"
      class="badge badge-secondary badge-sm gap-1"
     >
      {{ keyword }}
      <button
       @click="removeKeyword(index)"
       class="btn btn-xs btn-ghost btn-circle h-4 w-4 min-h-0 p-0"
      >
       ✕
      </button>
     </div>
    </div>

    <div class="join w-full">
     <input
      type="text"
      v-model="newKeyword"
      placeholder="キーワードを入力"
      class="input input-bordered join-item w-full"
      @keyup.enter="addKeyword"
      :disabled="modelValue.IS_GIFT"
     />
     <button
      @click="addKeyword"
      class="btn btn-primary join-item ml-4 px-4"
      :disabled="modelValue.IS_GIFT"
     >
      追加
     </button>
    </div>
   </div>

   <!-- 許可するID -->
   <div class="form-control bg-base-200 p-3 rounded-lg">
    <label class="label py-0 pb-1">
     <span class="label-text font-medium">許可するUserId</span>
     <span class="label-text-alt text-sm text-gray-500">空欄ですべて許可、!付きでネガティブ</span>
    </label>

    <div class="flex flex-wrap gap-1 mb-2">
     <div
      v-for="(id, index) in modelValue.ALLOWED_IDS"
      :key="index"
      class="badge badge-primary badge-sm gap-1"
     >
      {{ id }}
      <button
       @click="removeAllowedId(index)"
       class="btn btn-xs btn-ghost btn-circle h-4 w-4 min-h-0 p-0"
      >
       ✕
      </button>
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
     <button @click="addAllowedId" class="btn btn-primary join-item ml-4 px-4">追加</button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ConfigUserType } from '@common/commonTypes';

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
 external: '外部(コメントテスター等)'
};

// service から system を除いたもの
const serviceTypeValues = [
 'youtube',
 'twicas',
 'twitch',
 'niconama',
 'showroom',
 'bilibili',
 'mirrativ',
 'mixch',
 'twitter',
 'doneru',
 'tiktok',
 'streamlabs',
 'kick',
 'vtips',
 'external'
] as const;

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

const accessLevels: { value: 1 | 2 | 3 | 4; label: string }[] = [
 { value: 1, label: 'すべてのリスナー' },
 { value: 2, label: 'メンバー・モデレーター・配信者' },
 { value: 3, label: 'モデレーター・配信者' },
 { value: 4, label: '配信者のみ' }
];

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

// 初期値をここでも設定する
onMounted(() => {
 // IS_GIFTは常時false
 props.modelValue.IS_GIFT = false;
});
</script>
