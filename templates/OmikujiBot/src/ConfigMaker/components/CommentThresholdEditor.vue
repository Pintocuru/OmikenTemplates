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
   <div class="flex flex-wrap gap-4">
    <!-- コメント条件 -->
    <div
     v-if="modelValue.conditions.includes('comment')"
     class="form-control bg-base-100 p-3 rounded-lg flex-1 min-w-64"
    >
     <label class="label py-0 pb-1">
      <span class="label-text font-medium">コメント条件</span>
      <span class="label-text-alt text-sm text-gray-500">正規表現対応</span>
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
        class="btn btn-sm btn-ghost btn-circle h-4 w-4 min-h-0 p-0"
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
    <div v-if="modelValue.conditions.includes('syoken')" class="form-control flex-1 min-w-48">
     <label class="label">
      <span class="label-text font-medium">初見条件</span>
     </label>
     <div class="flex flex-wrap gap-2">
      <label
       v-for="syokenOption in syokenOptions"
       :key="syokenOption.value"
       class="flex items-center gap-1 hover:bg-base-300 p-1 rounded cursor-pointer text-sm"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.syoken.includes(syokenOption.value)"
        @change="toggleSyoken(syokenOption.value)"
       />
       <span>{{ syokenOption.label }}</span>
      </label>
     </div>
    </div>

    <!-- アクセスレベル条件 -->
    <div v-if="modelValue.conditions.includes('access')" class="form-control flex-1 min-w-48">
     <label class="label">
      <span class="label-text font-medium">アクセスレベル条件</span>
     </label>
     <div class="flex flex-wrap gap-2">
      <label
       v-for="accessOption in accessOptions"
       :key="accessOption.value"
       class="flex items-center gap-1 hover:bg-base-300 p-1 rounded cursor-pointer text-sm"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.access.includes(accessOption.value)"
        @change="toggleAccess(accessOption.value)"
       />
       <span>{{ accessOption.label }}</span>
      </label>
     </div>
    </div>

    <!-- ギフト条件 -->
    <div v-if="modelValue.conditions.includes('gift')" class="form-control flex-1 min-w-48">
     <label class="label">
      <span class="label-text font-medium">ギフト条件</span>
     </label>
     <div class="flex flex-wrap gap-2">
      <label
       v-for="giftOption in giftOptions"
       :key="giftOption.value"
       class="flex items-center gap-1 hover:bg-base-300 p-1 rounded cursor-pointer text-sm"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.gift.includes(giftOption.value)"
        @change="toggleGift(giftOption.value)"
       />
       <span>{{ giftOption.label }}</span>
      </label>
     </div>
    </div>

    <!-- カウント条件 -->
    <div v-if="modelValue.conditions.includes('count')" class="form-control flex-1 min-w-48">
     <label class="label">
      <span class="label-text font-medium">コメント数条件</span>
     </label>
     <div class="flex gap-2">
      <select
       :value="modelValue.count.unit"
       @change="updateCountUnit($event)"
       class="select select-bordered select-sm flex-1"
      >
       <option value="lc">配信枠のコメント数</option>
       <option value="tc">個人の総コメント数</option>
      </select>
      <select
       :value="modelValue.count.comparison"
       @change="updateCountComparison($event)"
       class="select select-bordered select-sm flex-1"
      >
       <option value="min">最小値</option>
       <option value="max">最大値</option>
       <option value="equal">等しい</option>
       <option value="loop">ループ</option>
      </select>
      <input
       type="number"
       :value="modelValue.count.value"
       @input="updateCountValue($event)"
       min="0"
       class="input input-bordered input-sm flex-1"
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

const props = defineProps<{ modelValue: CommentThresholdType }>();
const emit = defineEmits<{ 'update:modelValue': [value: CommentThresholdType] }>();

const newComment = ref('');

const conditionTypes = [
 { value: 'comment' as const, label: 'コメントワード' },
 { value: 'syoken' as const, label: '初見判定ちゃん' },
 { value: 'access' as const, label: 'ユーザーの役職' },
 { value: 'gift' as const, label: 'ギフト' },
 { value: 'count' as const, label: 'コメント数' }
];

const syokenOptions = [
 { value: 1, label: '初見' },
 { value: 2, label: '7日以上経過' },
 { value: 3, label: '配信枠での初回' }
];

const accessOptions = [
 { value: 1, label: '一般' },
 { value: 2, label: 'メンバー' },
 { value: 3, label: 'モデレーター' },
 { value: 4, label: '配信者' }
];

const giftOptions = [
 { value: 0, label: '全て' },
 { value: 1, label: '200円未満' },
 { value: 2, label: '200-499円' },
 { value: 3, label: '500-999円' },
 { value: 4, label: '1000-2000円' },
 { value: 5, label: '2000-5000円' },
 { value: 6, label: '5000-10000円' },
 { value: 7, label: '10000円-19999円' },
 { value: 8, label: '20000円-' }
];

const updateModelValue = (updates: Partial<CommentThresholdType>) => {
 emit('update:modelValue', { ...props.modelValue, ...updates });
};

const toggle = (array: any[], value: any, key: string) => {
 const newArray = [...array];
 const index = newArray.indexOf(value);
 index > -1 ? newArray.splice(index, 1) : newArray.push(value);
 updateModelValue({ [key]: newArray } as any);
};

const toggleCondition = (condition: any) =>
 toggle(props.modelValue.conditions, condition, 'conditions');
const toggleSyoken = (value: number) => toggle(props.modelValue.syoken, value, 'syoken');
const toggleAccess = (value: number) => toggle(props.modelValue.access, value, 'access');
const toggleGift = (value: number) => toggle(props.modelValue.gift, value, 'gift');

const updateCountComparison = (event: Event) => {
 const target = event.target as HTMLSelectElement;
 updateModelValue({ count: { ...props.modelValue.count, comparison: target.value as any } });
};

const updateCountUnit = (event: Event) => {
 const target = event.target as HTMLSelectElement;
 updateModelValue({ count: { ...props.modelValue.count, unit: target.value as any } });
};

const updateCountValue = (event: Event) => {
 const target = event.target as HTMLInputElement;
 const value = parseInt(target.value);
 if (!isNaN(value)) {
  updateModelValue({ count: { ...props.modelValue.count, value } });
 }
};

const addComment = () => {
 if (!newComment.value.trim()) return;
 updateModelValue({ comment: [...props.modelValue.comment, newComment.value.trim()] });
 newComment.value = '';
};

const removeComment = (index: number) => {
 const comment = [...props.modelValue.comment];
 comment.splice(index, 1);
 updateModelValue({ comment });
};
</script>
