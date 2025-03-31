<!-- src/apps/configMaker/components/UserVisitsSettings.vue -->
<template>
 <div class="space-y-4">
  <!-- 差分モード設定 -->
  <div class="form-control">
   <label class="label cursor-pointer justify-start gap-4">
    <input type="checkbox" v-model="userVisits.IS_DIFF_MODE" class="toggle toggle-primary" />
    <span class="label-text">リロード時、新しいデータだけを読み込む</span>
   </label>
  </div>

  <!-- 有効サービス設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">有効サービス</span>
   </label>
   <div class="flex flex-wrap gap-2 mb-2">
    <div
     class="badge badge-outline cursor-pointer"
     @click="setService('platforms')"
     :class="{ 'badge-primary': userVisits.ENABLED_SERVICES === 'platforms' }"
    >
     platforms
    </div>
    <!-- サービス選択肢 -->
    <div
     v-for="service in serviceTypeValues"
     :key="service"
     class="badge badge-outline cursor-pointer"
     @click="setService(service)"
     :class="{ 'badge-primary': userVisits.ENABLED_SERVICES === service }"
    >
     {{ service }}
    </div>
   </div>
  </div>

  <!-- 許可ID設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">許可ユーザーID</span>
   </label>
   <div class="flex gap-2 items-center">
    <input
     type="text"
     v-model="newAllowedId"
     placeholder="ユーザーID"
     class="input input-bordered input-sm flex-grow"
     @keyup.enter="addAllowedId"
    />
    <button class="btn btn-sm btn-primary" @click="addAllowedId">追加</button>
   </div>
   <div class="flex flex-wrap gap-2 mt-2">
    <div
     v-for="(id, index) in userVisits.ALLOWED_IDS"
     :key="index"
     class="badge badge-primary gap-2"
    >
     {{ id }}
     <span class="cursor-pointer" @click="removeAllowedId(index)">✕</span>
    </div>
   </div>
   <label class="label">
    <span class="label-text-alt">ID前に「!」をつけるとネガティブリスト（除外）になります</span>
   </label>
  </div>

  <!-- アクセスレベル設定 -->
  <div class="form-control">
   <label class="label">
    <span class="label-text">アクセスレベル</span>
   </label>
   <select
    v-model="userVisits.ACCESS_LEVEL"
    class="select select-bordered w-full bg-white text-gray-800"
   >
    <option :value="1">1: だれでも</option>
    <option :value="2">2: メンバー</option>
    <option :value="3">3: モデレーター</option>
    <option :value="4">4: 管理者</option>
   </select>
  </div>

  <!-- ギフト設定 -->
  <div class="form-control">
   <label class="label cursor-pointer justify-start gap-4">
    <input type="checkbox" v-model="userVisits.IS_GIFT" class="toggle toggle-primary" />
    <span class="label-text">ギフトで有効にする</span>
   </label>
  </div>

  <!-- キーワード設定 -->
  <div class="form-control" :class="{ 'opacity-50': userVisits.IS_GIFT }">
   <label class="label">
    <span class="label-text">キーワード（正規表現）</span>
   </label>
   <div class="flex gap-2 items-center">
    <input
     type="text"
     v-model="newKeyword"
     placeholder="キーワード"
     class="input input-bordered input-sm flex-grow"
     :disabled="userVisits.IS_GIFT"
     @keyup.enter="addKeyword"
    />
    <button class="btn btn-sm btn-primary" @click="addKeyword" :disabled="userVisits.IS_GIFT">
     追加
    </button>
   </div>
   <div class="flex flex-wrap gap-2 mt-2">
    <div
     v-for="(keyword, index) in userVisits.KEYWORDS"
     :key="index"
     class="badge badge-primary gap-2"
    >
     {{ keyword }}
     <span class="cursor-pointer" @click="removeKeyword(index)">✕</span>
    </div>
   </div>
   <label class="label">
    <span class="label-text-alt"
     >ギフトが無効の場合、これらのキーワードを含むコメントで判定します</span
    >
   </label>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { ConfigUserType } from '@public/common/commonTypes';
import { serviceTypeValues, ServiceType } from '@scripts/schema';

const props = defineProps<{
 userVisits: ConfigUserType;
}>();

// 新規入力用の変数
const newAllowedId = ref('');
const newKeyword = ref('');

// サービス関連の処理
const setService = (service: 'platforms' | ServiceType) => {
 props.userVisits.ENABLED_SERVICES = service;
};

// 許可ID関連の処理
const addAllowedId = () => {
 if (newAllowedId.value && !props.userVisits.ALLOWED_IDS.includes(newAllowedId.value)) {
  props.userVisits.ALLOWED_IDS.push(newAllowedId.value);
  newAllowedId.value = '';
 }
};

const removeAllowedId = (index: number) => {
 props.userVisits.ALLOWED_IDS.splice(index, 1);
};

// キーワード関連の処理
const addKeyword = () => {
 if (newKeyword.value && !props.userVisits.KEYWORDS.includes(newKeyword.value)) {
  props.userVisits.KEYWORDS.push(newKeyword.value);
  newKeyword.value = '';
 }
};

const removeKeyword = (index: number) => {
 props.userVisits.KEYWORDS.splice(index, 1);
};
</script>
