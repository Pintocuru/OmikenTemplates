<!-- src/configMaker/components/PlaceholderPreview.vue -->
<template>
 <div class="card bg-base-300 mt-4" v-if="values.length > 0">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
   プレースホルダープレビュー
   <span class="ml-2 cursor-help" title="説明"> ℹ️ </span>
  </div>
  <div class="card-body space-y-3">
   <div class="text-sm text-gray-600 mb-2"><strong>ID:</strong> {{ id }}</div>
   <div class="text-sm text-gray-600 mb-2"><strong>総重み:</strong> {{ totalWeight }}</div>
   <div class="text-sm text-gray-600 mb-3"><strong>値の数:</strong> {{ values.length }}</div>

   <!-- 抽選ボタン -->
   <button class="btn btn-primary btn-sm" @click="handleDraw">抽選する</button>

   <!-- 抽選結果の表示 -->
   <div v-if="drawnValue" class="mt-3 p-3 bg-base-200 rounded">
    <div class="text-sm font-medium">抽選結果:</div>
    <div class="text-lg font-semibold">
     {{ drawnValue.content || '(内容なし)' }}
    </div>
    <div class="text-sm text-gray-500 mt-1">
     重み: {{ drawnValue.weight }}
     <span v-if="totalWeight > 0"> ({{ percentage(drawnValue.weight) }}%)</span>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { PlaceholderValueType } from '@/types/OmikujiTypesSchema';
import { drawOmikuji } from '@/MainGenerator/utils/PlayOmikuji';

const props = defineProps<{
 id: string;
 values: PlaceholderValueType[];
}>();

const totalWeight = computed(() => props.values.reduce((sum, v) => sum + (v.weight || 0), 0));

const percentage = (weight: number) => {
 if (totalWeight.value === 0) return 0;
 return Math.round((weight / totalWeight.value) * 100);
};

// 抽選結果
const drawnValue = ref<PlaceholderValueType | null>(null);

const handleDraw = () => {
 drawnValue.value = drawOmikuji(props.values) as PlaceholderValueType;
};
</script>
