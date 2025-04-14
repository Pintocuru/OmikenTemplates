<!-- src/apps/configMaker/components/UserVisitsSettings.vue -->
<template>
 <div class="space-y-6">
  <!-- 差分モードと有効サービス設定 -->
  <div class="card shadow-md p-2 pt-6">
   <label class="label font-medium pb-1">リロード時や再起動時の挙動</label>
   <label class="label cursor-pointer justify-start gap-4">
    <input type="checkbox" v-model="userVisits.IS_DIFF_MODE" class="toggle toggle-primary" />
    <span class="label-text">リロード時、0からスタート</span>
   </label>
  </div>

  <div class="card shadow-md p-2">
   <!-- 有効サービス設定 -->
   <label class="label font-medium pb-1">対象プラットフォーム </label>

   <div class="flex flex-wrap gap-2 mb-2">
    <div
     class="badge cursor-pointer"
     @click="setService('all')"
     :class="{ 'badge-primary': userVisits.ENABLED_SERVICES === 'all' }"
    >
     all
    </div>
    <div
     class="badge cursor-pointer"
     @click="setService('platforms')"
     :class="{ 'badge-primary': userVisits.ENABLED_SERVICES === 'platforms' }"
    >
     platforms
    </div>

    <div
     v-for="service in serviceTypeValues"
     :key="service"
     class="badge cursor-pointer"
     @click="setService(service)"
     :class="{ 'badge-primary': userVisits.ENABLED_SERVICES === service }"
    >
     {{ service }}
    </div>
   </div>
   <div class="text-sm text-base-content/70 pt-3">
    <div>platforms: 配信プラットフォームすべてを対象とします</div>
    <div>external: コメントテスターを含む、配信プラットフォームでないコメントを対象とします</div>
   </div>
  </div>

  <!-- 許可ID設定 -->
  <div class="card shadow-md p-2">
   <label class="label font-medium pb-1">カウントするユーザーID </label>
   <div class="flex gap-2 items-center">
    <input
     type="text"
     v-model="newAllowedId"
     placeholder="ユーザーID"
     class="input input-bordered input-sm flex-grow"
     @keyup.enter="addItem(newAllowedId, userVisits.ALLOWED_IDS, () => (newAllowedId = ''))"
    />
    <button
     class="btn btn-sm btn-primary"
     @click="addItem(newAllowedId, userVisits.ALLOWED_IDS, () => (newAllowedId = ''))"
    >
     追加
    </button>
   </div>
   <div class="flex flex-wrap gap-2 mt-2">
    <div
     v-for="(id, index) in userVisits.ALLOWED_IDS"
     :key="index"
     class="badge badge-primary gap-2"
    >
     {{ id }}
     <span class="cursor-pointer" @click="removeItem(userVisits.ALLOWED_IDS, index)">✕</span>
    </div>
   </div>
   <label class="label">ID前に「!」をつけるとネガティブリスト（除外）になります </label>
  </div>

  <!-- アクセスレベル設定 -->
  <div class="card shadow-md p-2">
   <label class="label font-medium pb-1">対象アクセスレベル </label>
   <div class="flex flex-wrap gap-4">
    <template v-for="level in [1, 2, 3, 4]" :key="level">
     <label
      class="flex items-center gap-2"
      :class="{ 'text-primary': userVisits.ACCESS_LEVEL === level }"
     >
      <input
       type="radio"
       :value="level"
       v-model="userVisits.ACCESS_LEVEL"
       class="radio radio-bordered"
      />
      <span>{{ level }}: {{ getAccessLevelLabel(level) }}</span>
     </label>
    </template>
   </div>
  </div>

  <!-- コンテンツフィルター設定 -->
  <div class="card shadow-md p-2">
   <!-- ギフト設定 -->
   <label class="label font-medium pb-1">ギフト回数をカウントするか </label>
   <label class="label cursor-pointer justify-start gap-4">
    <input type="checkbox" v-model="userVisits.IS_GIFT" class="toggle toggle-primary" />
    <span class="label-text"
     >ギフト数をカウントする (ON にすると、キーワードでのカウントができなくなります)</span
    >
   </label>
  </div>
  <div class="card shadow-md p-2">
   <!-- キーワード設定 -->
   <div class="form-control" :class="{ 'opacity-50': userVisits.IS_GIFT }">
    <label class="label">
     <span class="label-text font-medium">キーワード（正規表現）</span>
    </label>
    <div class="flex gap-2 items-center">
     <input
      type="text"
      v-model="newKeyword"
      placeholder="キーワード"
      class="input input-bordered input-sm flex-grow"
      :disabled="userVisits.IS_GIFT"
      @keyup.enter="addItem(newKeyword, userVisits.KEYWORDS, () => (newKeyword = ''))"
     />
     <button
      class="btn btn-sm btn-primary"
      @click="addItem(newKeyword, userVisits.KEYWORDS, () => (newKeyword = ''))"
      :disabled="userVisits.IS_GIFT"
     >
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
      <span class="cursor-pointer" @click="removeItem(userVisits.KEYWORDS, index)">✕</span>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { ConfigUserType, serviceTypeValues, ServiceType } from '@scripts/schema';

const props = defineProps<{
 userVisits: ConfigUserType;
}>();

// 新規入力用の変数
const newAllowedId = ref('');
const newKeyword = ref('');

// サービス関連の処理
const setService = (service: ConfigUserType['ENABLED_SERVICES']) => {
 props.userVisits.ENABLED_SERVICES = service;
};

// アイテム追加の汎用関数
const addItem = (value: string, array: string[], resetCallback: () => void) => {
 if (value && !array.includes(value)) {
  array.push(value);
  resetCallback();
 }
};

// アイテム削除の汎用関数
const removeItem = (array: string[], index: number) => {
 array.splice(index, 1);
};

// アクセスレベルのラベル取得
const getAccessLevelLabel = (level: number): string => {
 const labels = {
  1: 'だれでも',
  2: 'メンバー',
  3: 'モデレーター',
  4: '管理者'
 };
 return labels[level as keyof typeof labels] || '';
};
</script>
