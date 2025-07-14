<!-- src/configMaker/components/comments/CommentThresholdEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">条件設定</div>
  <div class="card-body">
   <!-- 条件タイプ選択 -->
   <div class="form-control mb-4">
    <label class="label">
     <span class="label-text font-medium">適用する条件</span>
    </label>
    <div class="flex flex-wrap gap-2">
     <label
      v-for="{ value, label } in conditionTypes"
      :key="value"
      class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer"
     >
      <input
       type="checkbox"
       class="checkbox checkbox-primary"
       :checked="modelValue.conditions.includes(value)"
       @change="toggleCondition(value)"
      />
      <span class="text-sm">{{ label }}</span>
     </label>
    </div>
   </div>

   <!-- 各条件の詳細設定 -->
   <div class="flex flex-wrap gap-4">
    <!-- コメント条件 -->
    <div
     v-if="modelValue.conditions.includes('comment')"
     class="form-control bg-base-100 p-2 rounded-lg flex-1 min-w-fit"
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
       v-model="newComment"
       type="text"
       placeholder="コメント条件を入力"
       class="input input-bordered join-item w-full"
       @keyup.enter="addComment"
      />
      <button @click="addComment" class="btn btn-primary join-item ml-4 px-4">追加</button>
     </div>
    </div>

    <!-- 初見条件 -->
    <div
     v-if="modelValue.conditions.includes('syoken')"
     class="form-control bg-base-100 p-2 rounded-lg flex-1 min-w-fit"
    >
     <label class="label">
      <span class="label-text font-medium">初見条件</span>
     </label>
     <div class="flex flex-wrap gap-2">
      <label
       v-for="{ value, label } in syokenOptions"
       :key="value"
       class="flex items-center gap-1 hover:bg-base-300 p-1 rounded cursor-pointer text-sm"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.syoken.includes(value)"
        @change="toggleSyoken(value)"
       />
       <span>{{ label }}</span>
      </label>
     </div>
    </div>

    <!-- アクセスレベル条件 -->
    <div
     v-if="modelValue.conditions.includes('access')"
     class="form-control bg-base-100 p-2 rounded-lg flex-1 min-w-fit"
    >
     <label class="label">
      <span class="label-text font-medium">アクセスレベル条件</span>
     </label>
     <div class="flex flex-wrap gap-2">
      <label
       v-for="{ value, label } in accessOptions"
       :key="value"
       class="flex items-center gap-1 hover:bg-base-300 p-1 rounded cursor-pointer text-sm"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.access.includes(value)"
        @change="toggleAccess(value)"
       />
       <span>{{ label }}</span>
      </label>
     </div>
    </div>

    <!-- ギフト条件 -->
    <div
     v-if="modelValue.conditions.includes('gift')"
     class="form-control bg-base-100 p-2 rounded-lg flex-1 min-w-fit"
    >
     <label class="label">
      <span class="label-text font-medium">ギフト条件</span>
     </label>
     <div class="flex flex-wrap gap-2">
      <label
       v-for="{ value, label } in giftOptions"
       :key="value"
       class="flex items-center gap-1 hover:bg-base-300 p-1 rounded cursor-pointer text-sm"
      >
       <input
        type="checkbox"
        class="checkbox checkbox-sm"
        :checked="modelValue.gift.includes(value)"
        @change="toggleGift(value)"
       />
       <span>{{ label }}</span>
      </label>
     </div>
    </div>

    <!-- カウント条件 -->
    <div
     v-if="modelValue.conditions.includes('count')"
     class="form-control bg-base-100 p-2 rounded-lg flex-1 min-w-fit"
    >
     <label class="label">
      <span class="label-text font-medium">コメント数条件</span>
     </label>
     <div class="flex gap-2">
      <select
       :value="modelValue.count.unit"
       @change="updateCount('unit', $event)"
       class="select select-bordered select-sm flex-1"
      >
       <option v-for="{ value, label } in countUnitOptions" :key="value" :value="value">
        {{ label }}
       </option>
      </select>
      <select
       :value="modelValue.count.comparison"
       @change="updateCount('comparison', $event)"
       class="select select-bordered select-sm flex-1"
      >
       <option v-for="{ value, label } in countComparisonOptions" :key="value" :value="value">
        {{ label }}
       </option>
      </select>
      <input
       type="number"
       :value="modelValue.count.value"
       @input="updateCount('value', $event)"
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
import {
 AccessCondition,
 accessConditionLabels,
 GiftCondition,
 giftConditionLabels,
 SyokenCondition,
 syokenConditionLabels,
 CommentThresholdCondition,
 commentThresholdConditionLabels,
 countComparisonConditionLabels,
 countUnitConditionLabels,
 type CommentThresholdType
} from '@type/';

const props = defineProps<{ modelValue: CommentThresholdType }>();
const emit = defineEmits<{ 'update:modelValue': [value: CommentThresholdType] }>();

const newComment = ref('');

// Options
const createOptions = <T extends string>(labels: Record<T, string>) =>
 Object.entries(labels).map(([value, label]) => ({ value, label })) as Array<{
  value: T;
  label: string;
 }>;

const conditionTypes = createOptions(commentThresholdConditionLabels);
const syokenOptions = createOptions(syokenConditionLabels);
const accessOptions = createOptions(accessConditionLabels);
const giftOptions = createOptions(giftConditionLabels);
const countUnitOptions = createOptions(countUnitConditionLabels);
const countComparisonOptions = createOptions(countComparisonConditionLabels);

// Utils
const updateModelValue = (updates: Partial<CommentThresholdType>) => {
 emit('update:modelValue', { ...props.modelValue, ...updates });
};

const toggleInArray = <T,>(array: T[], value: T): T[] => {
 const index = array.indexOf(value);
 return index > -1 ? array.filter((_, i) => i !== index) : [...array, value];
};

// Handlers
const toggleCondition = (condition: CommentThresholdCondition) => {
 updateModelValue({
  conditions: toggleInArray(props.modelValue.conditions, condition)
 });
};

const toggleSyoken = (value: SyokenCondition) => {
 updateModelValue({
  syoken: toggleInArray(props.modelValue.syoken, value)
 });
};

const toggleAccess = (value: AccessCondition) => {
 updateModelValue({
  access: toggleInArray(props.modelValue.access, value)
 });
};

const toggleGift = (value: GiftCondition) => {
 updateModelValue({
  gift: toggleInArray(props.modelValue.gift, value)
 });
};

const updateCount = (field: 'unit' | 'comparison' | 'value', event: Event) => {
 const target = event.target as HTMLInputElement | HTMLSelectElement;
 const value = field === 'value' ? parseInt(target.value) : target.value;

 if (field === 'value' && isNaN(value as number)) return;

 updateModelValue({
  count: { ...props.modelValue.count, [field]: value }
 });
};

const addComment = () => {
 const trimmed = newComment.value.trim();
 if (!trimmed) return;

 updateModelValue({
  comment: [...props.modelValue.comment, trimmed]
 });
 newComment.value = '';
};

const removeComment = (index: number) => {
 updateModelValue({
  comment: props.modelValue.comment.filter((_, i) => i !== index)
 });
};
</script>
