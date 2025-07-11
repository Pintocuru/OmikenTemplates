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
   @click="$emit('select', rule.id)"
   @dblclick="startInlineEdit"
   :style="{ borderTopColor: rule.editorColor }"
  >
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

  <!-- ホバープレビュー -->
  <div
   v-if="hoveredRule?.id === rule.id && editingRuleId !== rule.id"
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
}>();

// Emits
const emit = defineEmits<{
 select: [ruleId: string];
 contextMenu: [event: MouseEvent, rule: BaseRule, index: number];
 update: [ruleId: string, updates: Partial<BaseRule>];
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
 !props.getRuleEnabledState(props.rule) && 'opacity-60'
];

// インライン編集
const startInlineEdit = () => {
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
