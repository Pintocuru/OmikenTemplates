<!-- src/configMaker/components/CommentThresholdEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">しきい値設定</div>
  <div class="card-body">
   <!-- 条件タイプ選択 -->
   <div class="form-control mb-4">
    <label class="label">
     <span class="label-text font-medium">適用する条件</span>
    </label>
    <div class="flex flex-wrap gap-2">
     <label
      v-for="conditionType in conditionTypes"
      :key="conditionType.value"
      class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer"
     >
      <input
       type="checkbox"
       class="checkbox checkbox-primary"
       :checked="modelValue.conditions.includes(conditionType.value)"
       @change="toggleCondition(conditionType.value)"
      />
      <span class="text-sm">{{ conditionType.label }}</span>
     </label>
    </div>
   </div>

   <!-- 各条件の詳細設定 -->
   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- コメント条件 -->
    <div
     v-if="modelValue.conditions.includes('comment')"
     class="form-control bg-base-100 p-3 rounded-lg mt-4"
    >
     <label class="label py-0 pb-1">
      <span class="label-text font-medium">コメント条件</span>
      <span class="label-text-alt text-sm text-gray-500">
       特定のキーワードを含むコメントのみ対象（正規表現対応）
      </span>
     </label>

     <div class="flex flex-wrap gap-1 mb-2">
      <div
       v-for="(comment, index) in modelValue.comment"
       :key="index"
       class="badge badge-secondary badge-sm gap-1"
      >
       {{ comment }}
       <button
        @click="removeComment(index)"
        class="btn btn-xs btn-ghost btn-circle h-4 w-4 min-h-0 p-0"
       >
        ✕
       </button>
      </div>
     </div>

     <div class="join w-full">
      <input
       type="text"
       v-model="newComment"
       placeholder="コメント条件を入力"
       class="input input-bordered join-item w-full"
       @keyup.enter="addComment"
      />
      <button @click="addComment" class="btn btn-primary join-item ml-4 px-4">追加</button>
     </div>
    </div>
    <!-- 初見条件 -->
    <div v-if="modelValue.conditions.includes('syoken')" class="form-control">
     <label class="label">
      <span class="label-text font-medium">初見条件</span>
     </label>
     <div class="space-y-1">
      <label
       v-for="syokenOption in syokenOptions"
       :key="syokenOption.value"
       class="flex items-center gap-2 hover:bg-base-300 p-1 rounded cursor-pointer"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.syoken.includes(syokenOption.value)"
        @change="toggleSyoken(syokenOption.value)"
       />
       <span class="text-sm">{{ syokenOption.label }}</span>
      </label>
     </div>
    </div>

    <!-- アクセスレベル条件 -->
    <div v-if="modelValue.conditions.includes('access')" class="form-control">
     <label class="label">
      <span class="label-text font-medium">アクセスレベル条件</span>
     </label>
     <div class="space-y-1">
      <label
       v-for="accessOption in accessOptions"
       :key="accessOption.value"
       class="flex items-center gap-2 hover:bg-base-300 p-1 rounded cursor-pointer"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.access.includes(accessOption.value)"
        @change="toggleAccess(accessOption.value)"
       />
       <span class="text-sm">{{ accessOption.label }}</span>
      </label>
     </div>
    </div>

    <!-- ギフト条件 -->
    <div v-if="modelValue.conditions.includes('gift')" class="form-control">
     <label class="label">
      <span class="label-text font-medium">ギフト条件</span>
     </label>
     <div class="space-y-1">
      <label
       v-for="giftOption in giftOptions"
       :key="giftOption.value"
       class="flex items-center gap-2 hover:bg-base-300 p-1 rounded cursor-pointer"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.gift.includes(giftOption.value)"
        @change="toggleGift(giftOption.value)"
       />
       <span class="text-sm">{{ giftOption.label }}</span>
      </label>
     </div>
    </div>

    <!-- カウント条件 -->
    <div v-if="modelValue.conditions.includes('count')" class="form-control">
     <label class="label">
      <span class="label-text font-medium">カウント条件</span>
     </label>
     <div class="space-y-2">
      <select
       :value="modelValue.count.comparison"
       @change="updateCountComparison($event)"
       class="select select-bordered select-sm w-full"
      >
       <option value="min">最小値</option>
       <option value="max">最大値</option>
       <option value="equal">等しい</option>
       <option value="loop">ループ</option>
      </select>
      <select
       :value="modelValue.count.unit"
       @change="updateCountUnit($event)"
       class="select select-bordered select-sm w-full"
      >
       <option value="lc">ローカルカウント</option>
       <option value="tc">トータルカウント</option>
      </select>
      <input
       type="number"
       :value="modelValue.count.value"
       @input="updateCountValue($event)"
       min="0"
       class="input input-bordered input-sm w-full"
       placeholder="数値"
      />
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CommentThresholdType } from '@/types/OmikujiTypesSchema';

// Props
const props = defineProps<{
 modelValue: CommentThresholdType;
}>();

// Emits
const emit = defineEmits<{
 'update:modelValue': [value: CommentThresholdType];
}>();

// リアクティブデータ
const newComment = ref('');

// 選択肢定義（型を明示的に指定）
const conditionTypes = [
 { value: 'comment' as const, label: 'コメントワード' },
 { value: 'syoken' as const, label: '初見判定ちゃん' },
 { value: 'access' as const, label: 'ユーザーの役職' },
 { value: 'gift' as const, label: 'ギフト' },
 { value: 'count' as const, label: 'コメント数' }
];

const syokenOptions = [
 { value: 1, label: '初見' },
 { value: 2, label: '前回のコメントから7日以上経過' },
 { value: 3, label: '上記以外の、その配信枠で1回目のコメント' }
];

const accessOptions = [
 { value: 1, label: '一般ユーザー' },
 { value: 2, label: 'メンバー' },
 { value: 3, label: 'モデレーター' },
 { value: 4, label: '配信者' }
];

const giftOptions = [
 { value: 0, label: '全て(メンバー加入含む)' },
 { value: 1, label: '200円未満' },
 { value: 2, label: '200円〜499円' },
 { value: 3, label: '500円〜999円' },
 { value: 4, label: '1,000円〜1,999円' },
 { value: 5, label: '2,000円〜4,999円' },
 { value: 6, label: '5,000円〜9,999円' },
 { value: 7, label: '10,000円以上' },
 { value: 8, label: '20,000円以上' }
];

// ヘルパー関数
const updateModelValue = (updates: Partial<CommentThresholdType>) => {
 emit('update:modelValue', { ...props.modelValue, ...updates });
};

// メソッド
const toggleCondition = (condition: 'comment' | 'syoken' | 'access' | 'gift' | 'count') => {
 const conditions = [...props.modelValue.conditions];
 const index = conditions.indexOf(condition);

 if (index > -1) {
  conditions.splice(index, 1);
 } else {
  conditions.push(condition);
 }

 updateModelValue({ conditions });
};

const toggleSyoken = (value: number) => {
 const syoken = [...props.modelValue.syoken];
 const index = syoken.indexOf(value);

 if (index > -1) {
  syoken.splice(index, 1);
 } else {
  syoken.push(value);
 }

 updateModelValue({ syoken });
};

const toggleAccess = (value: number) => {
 const access = [...props.modelValue.access];
 const index = access.indexOf(value);

 if (index > -1) {
  access.splice(index, 1);
 } else {
  access.push(value);
 }

 updateModelValue({ access });
};

const toggleGift = (value: number) => {
 const gift = [...props.modelValue.gift];
 const index = gift.indexOf(value);

 if (index > -1) {
  gift.splice(index, 1);
 } else {
  gift.push(value);
 }

 updateModelValue({ gift });
};

const updateCountComparison = (event: Event) => {
 const target = event.target as HTMLSelectElement;
 updateModelValue({
  count: { ...props.modelValue.count, comparison: target.value as 'min' | 'max' | 'equal' | 'loop' }
 });
};

const updateCountUnit = (event: Event) => {
 const target = event.target as HTMLSelectElement;
 updateModelValue({
  count: { ...props.modelValue.count, unit: target.value as 'lc' | 'tc' }
 });
};

const updateCountValue = (event: Event) => {
 const target = event.target as HTMLInputElement;
 const value = parseInt(target.value);
 if (!isNaN(value)) {
  updateModelValue({
   count: { ...props.modelValue.count, value }
  });
 }
};

const addComment = () => {
 if (!newComment.value.trim()) return;

 const comment = [...props.modelValue.comment, newComment.value.trim()];
 updateModelValue({ comment });
 newComment.value = '';
};

const removeComment = (index: number) => {
 const comment = [...props.modelValue.comment];
 comment.splice(index, 1);
 updateModelValue({ comment });
};
</script>
