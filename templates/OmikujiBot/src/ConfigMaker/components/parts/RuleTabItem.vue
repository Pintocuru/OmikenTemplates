<!-- src/configMaker/components/parts/RuleTabItem.vue -->
<template>
 <div
  class="relative group"
  @contextmenu.prevent="$emit('contextMenu', $event, rule, index)"
  @mouseenter="hoveredRule = rule"
  @mouseleave="hoveredRule = null"
 >
  <button
   :class="getTabClasses()"
   :draggable="draggable && editingRuleId !== rule.id"
   @click="$emit('select', rule.id)"
   @dblclick="startInlineEdit"
   :style="{ borderTopColor: rule.editorColor }"
   @dragstart="handleDragStart"
   @dragend="handleDragEnd"
   @dragover="handleDragOver"
   @dragleave="handleDragLeave"
   @drop="handleDrop"
  >
   <!-- ドラッグハンドル（編集中以外で表示） -->
   <div
    v-if="draggable && editingRuleId !== rule.id"
    class="drag-handle text-gray-400 hover:text-gray-600 transition-colors mr-1"
    :class="{ 'cursor-grabbing': isDragging }"
   >
    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
     <path
      d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
     />
    </svg>
   </div>

   <!-- ルール色インジケーター -->
   <div
    class="w-3 h-3 rounded-full border border-white/20 shadow-sm"
    :style="{ backgroundColor: rule.editorColor }"
   />

   <!-- ルール名（インライン編集対応） -->
   <input
    v-if="editingRuleId === rule.id"
    v-model="editingName"
    @blur="finishInlineEdit"
    @keyup.enter="finishInlineEdit"
    @keyup.escape="cancelInlineEdit"
    class="bg-transparent border-none outline-none text-current w-20 text-center"
    :ref="(el) => (editInput = el as HTMLInputElement)"
    @click.stop
   />
   <span v-else class="truncate max-w-24">
    {{ rule.name || `ルール${index + 1}` }}
   </span>

   <!-- 状態インジケーター -->
   <div class="flex items-center gap-1 text-xs">
    <span v-if="!getRuleEnabledState(rule)" class="opacity-50 text-xs">(無効)</span>
   </div>

   <!-- ホバーエフェクト -->
   <div
    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
   />
  </button>

  <!-- ホバープレビュー（ドラッグ中やドラッグオーバー中は非表示） -->
  <div
   v-if="hoveredRule?.id === rule.id && editingRuleId !== rule.id && !isDragging && !isDragOver"
   class="absolute top-full left-0 mt-2 z-30 bg-base-100 border border-base-300 rounded-lg shadow-xl p-4 w-72"
   @mouseenter="hoveredRule = rule"
  >
   <div class="space-y-2">
    <div class="font-medium text-base">{{ rule.name || '名前未設定' }}</div>
    <div v-if="rule.description" class="text-sm text-base-content/70">
     {{ rule.description }}
    </div>
    <div class="text-xs space-y-1">
     <div class="flex items-center gap-2">
      <span
       class="badge badge-sm"
       :class="getRuleEnabledState(rule) ? 'badge-success' : 'badge-error'"
      >
       {{ getRuleEnabledState(rule) ? '有効' : '無効' }}
      </span>
     </div>
     <div v-if="'omikuji' in rule && (rule.omikuji as any)?.length">
      <div class="font-medium">おみくじ : {{ (rule.omikuji as any).length }}種</div>
     </div>
     <div v-if="'values' in rule && Object.keys(rule.values as object).length">
      <div class="font-medium">
       プレースホルダー : {{ Object.keys(rule.values as object).length }}種
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { BaseRule } from './RuleTabs.vue';

// Props
const props = defineProps<{
 rule: BaseRule;
 index: number;
 selected: boolean;
 getRuleEnabledState: (rule: BaseRule) => boolean;
 draggable?: boolean;
 isDragging?: boolean;
 isDragOver?: boolean;
}>();

// Emits
const emit = defineEmits<{
 select: [ruleId: string];
 contextMenu: [event: MouseEvent, rule: BaseRule, index: number];
 update: [ruleId: string, updates: Partial<BaseRule>];
 dragstart: [event: DragEvent];
 dragend: [event: DragEvent];
 dragover: [event: DragEvent];
 dragleave: [event: DragEvent];
 drop: [event: DragEvent];
}>();

// リアクティブデータ
const editingRuleId = ref<string | null>(null);
const editingName = ref('');
const hoveredRule = ref<BaseRule | null>(null);
const editInput = ref<HTMLInputElement>();

// スタイル計算
const getTabClasses = () => [
 'tab tab-bordered px-4 py-2 text-sm font-medium transition-all duration-200',
 'flex items-center gap-2 relative overflow-hidden',
 props.selected
  ? 'tab-active bg-primary text-primary-content shadow-lg'
  : 'hover:bg-base-200 hover:shadow-md',
 !props.getRuleEnabledState(props.rule) && 'opacity-60',
 // ドラッグ関連のスタイル
 props.isDragging && 'opacity-50 transform scale-95',
 props.isDragOver && 'border-primary border-2 border-dashed',
 props.draggable && !props.isDragging && editingRuleId.value !== props.rule.id && 'cursor-grab',
 props.isDragging && 'cursor-grabbing'
];

// ドラッグイベントハンドラー
const handleDragStart = (event: DragEvent) => {
 if (editingRuleId.value === props.rule.id) {
  event.preventDefault();
  return;
 }
 emit('dragstart', event);
 hoveredRule.value = null; // ホバープレビューを隠す
};

const handleDragEnd = (event: DragEvent) => {
 emit('dragend', event);
};

const handleDragOver = (event: DragEvent) => {
 event.preventDefault();
 emit('dragover', event);
 hoveredRule.value = null; // ホバープレビューを隠す
};

const handleDragLeave = (event: DragEvent) => {
 emit('dragleave', event);
};

const handleDrop = (event: DragEvent) => {
 emit('drop', event);
};

// インライン編集
const startInlineEdit = () => {
 if (props.draggable && props.isDragging) {
  // ドラッグ中はインライン編集を無効化
  return;
 }
 editingRuleId.value = props.rule.id;
 editingName.value = props.rule.name || '';
 nextTick(() => {
  editInput.value?.focus();
  editInput.value?.select();
 });
};

const finishInlineEdit = () => {
 if (editingRuleId.value) {
  emit('update', editingRuleId.value, { name: editingName.value });
  editingRuleId.value = null;
 }
};

const cancelInlineEdit = () => {
 editingRuleId.value = null;
 editingName.value = '';
};

// ESCキーでインライン編集をキャンセル
const handleKeydown = (event: KeyboardEvent) => {
 if (event.key === 'Escape' && editingRuleId.value) {
  cancelInlineEdit();
 }
};

onMounted(() => {
 document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
 document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.drag-handle {
 opacity: 0;
 transition: opacity 0.2s;
}

.group:hover .drag-handle {
 opacity: 1;
}

.cursor-grab:hover .drag-handle {
 opacity: 1;
}
</style>
