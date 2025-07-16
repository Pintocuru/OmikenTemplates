<!-- src/configMaker/components/parts/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- フィルターコンポーネント -->
  <RuleFilter
   v-model="searchQuery"
   :total-count="sortedRules.length"
   :filtered-count="filteredSortedRules.length"
   @filter-change="handleFilterChange"
  />

  <!-- タブ部分 -->
  <div class="flex flex-wrap gap-1 border-b pb-2">
   <!-- 既存のルールタブ -->
   <RuleTabItem
    v-for="(rule, index) in filteredSortedRules"
    :key="rule.id"
    :rule="rule"
    :index="index"
    :selected="selectedRule?.id === rule.id"
    :getRuleEnabledState="getRuleEnabledState"
    :draggable="!searchQuery"
    :is-dragging="dragState.draggedRuleId === rule.id"
    :is-drag-over="dragState.dragOverIndex === index"
    @select="handleSelectRule"
    @context-menu="showContextMenu"
    @update="handleUpdateRule"
    @dragstart="handleDragStart($event, rule, index)"
    @dragend="handleDragEnd"
    @dragover="handleDragOver($event, index)"
    @dragleave="handleDragLeave"
    @drop="handleDrop($event, index)"
   />

   <!-- 新規追加タブ -->
   <button
    class="tab tab-bordered px-4 py-2 text-sm border-dashed border-gray-400 hover:bg-base-200 text-gray-500 transition-all duration-200 hover:border-primary"
    @click="handleAddNewRule"
    title="新しいルールを追加"
   >
    <span class="flex items-center gap-2">
     <Plus class="w-4 h-4" />
     追加
    </span>
   </button>
  </div>

  <!-- フィルター結果が空の場合のメッセージ -->
  <div v-if="searchQuery && filteredSortedRules.length === 0" class="text-center py-8">
   <div class="text-base-content/60">
    <p class="text-lg mb-2">「{{ searchQuery }}」に一致するルールが見つかりませんでした</p>
    <p class="text-sm">検索条件を変更するか、新しいルールを追加してください</p>
   </div>
  </div>

  <!-- ドラッグ中のヘルプテキスト -->
  <div v-if="dragState.isDragging" class="text-center py-2 text-sm text-base-content/60">
   ドラッグして並び替えできます
  </div>

  <!-- 右クリックコンテキストメニュー -->
  <RuleContextMenu
   :show="contextMenu.show"
   :x="contextMenu.x"
   :y="contextMenu.y"
   :canMoveUp="canMoveUp"
   :canMoveDown="canMoveDown"
   @move-up="handleMoveRuleUp"
   @move-down="handleMoveRuleDown"
   @duplicate="handleDuplicateRule"
   @delete="handleDeleteRule"
   @hide="hideContextMenu"
  />
 </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, inject } from 'vue';
import { CategoryType } from '@type/';
import RuleTabItem from './RuleTabItem.vue';
import RuleContextMenu from './RuleContextMenu.vue';
import RuleFilter from './RuleFilter.vue';
import { Plus } from 'lucide-vue-next';

// 型定義(必要な箇所のみ)
export interface BaseRule {
 id: string;
 name: string;
 description?: string;
 order: number;
 editorColor?: string;
 isEnabled?: boolean;
}

interface RuleStore {
 selectRule?: (ruleId: string) => void;
 add?: () => void;
 duplicate?: (ruleId: string) => void;
 reorder?: (fromIndex: number, toIndex: number) => void;
 remove?: (ruleId: string) => void;
 update?: (ruleId: string, updates: Partial<BaseRule>) => void;
}

interface FilterOptions {
 query: string;
 enabledOnly: boolean;
 searchInName: boolean;
 searchInDescription: boolean;
}

// Props
const props = defineProps<{
 rules: BaseRule[];
 selectedRule: BaseRule | null;
 ruleType: CategoryType;
}>();

// Store injection
const injectedStore = inject<RuleStore>(`${props.ruleType}RulesStore`);

// リアクティブデータ
const searchQuery = ref('');
const filterOptions = ref<FilterOptions>({
 query: '',
 enabledOnly: false,
 searchInName: true,
 searchInDescription: true
});

// コンテキストメニューの状態
const contextMenu = reactive({
 show: false,
 x: 0,
 y: 0,
 rule: null as BaseRule | null,
 index: -1
});

// ドラッグ状態の管理
const dragState = reactive({
 isDragging: false,
 draggedRuleId: null as string | null,
 draggedIndex: -1,
 dragOverIndex: -1
});

// 計算プロパティ
const sortedRules = computed(() => {
 return Array.isArray(props.rules) ? props.rules.slice().sort((a, b) => a.order - b.order) : [];
});

const filteredSortedRules = computed(() => {
 let filtered = sortedRules.value;

 // 有効性フィルター
 if (filterOptions.value.enabledOnly) {
  filtered = filtered.filter((rule) => getRuleEnabledState(rule));
 }

 // テキスト検索フィルター
 if (filterOptions.value.query) {
  const query = filterOptions.value.query.toLowerCase();
  filtered = filtered.filter((rule) => {
   let matches = false;

   if (filterOptions.value.searchInName && rule.name?.toLowerCase().includes(query)) {
    matches = true;
   }

   if (filterOptions.value.searchInDescription && rule.description?.toLowerCase().includes(query)) {
    matches = true;
   }

   return matches;
  });
 }

 return filtered;
});

const canMoveUp = computed(() => !!contextMenu.rule && getOriginalIndex(contextMenu.rule.id) > 0);

const canMoveDown = computed(
 () => !!contextMenu.rule && getOriginalIndex(contextMenu.rule.id) < props.rules.length - 1
);

// ヘルパー関数
const getOriginalIndex = (ruleId: string): number => {
 return props.rules.findIndex((rule) => rule.id === ruleId);
};

const getRuleEnabledState = (rule: BaseRule): boolean => {
 return rule.isEnabled !== false;
};

// フィルター処理
const handleFilterChange = (filters: FilterOptions) => {
 filterOptions.value = { ...filters };
};

// ドラッグアンドドロップ処理
const handleDragStart = (event: DragEvent, rule: BaseRule, index: number) => {
 if (searchQuery.value) {
  // フィルタリング中はドラッグを無効化
  event.preventDefault();
  return;
 }

 dragState.isDragging = true;
 dragState.draggedRuleId = rule.id;
 dragState.draggedIndex = getOriginalIndex(rule.id);

 // ドラッグするデータを設定
 if (event.dataTransfer) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', rule.id);
 }
};

const handleDragEnd = () => {
 dragState.isDragging = false;
 dragState.draggedRuleId = null;
 dragState.draggedIndex = -1;
 dragState.dragOverIndex = -1;
};

const handleDragOver = (event: DragEvent, index: number) => {
 event.preventDefault();
 if (event.dataTransfer) {
  event.dataTransfer.dropEffect = 'move';
 }
 dragState.dragOverIndex = index;
};

const handleDragLeave = () => {
 dragState.dragOverIndex = -1;
};

const handleDrop = (event: DragEvent, dropIndex: number) => {
 event.preventDefault();

 const draggedRuleId = event.dataTransfer?.getData('text/plain');
 if (!draggedRuleId || draggedRuleId !== dragState.draggedRuleId) {
  return;
 }

 const draggedOriginalIndex = getOriginalIndex(draggedRuleId);
 const droppedRule = filteredSortedRules.value[dropIndex];
 const droppedOriginalIndex = getOriginalIndex(droppedRule.id);

 // 同じ位置にドロップした場合は何もしない
 if (draggedOriginalIndex === droppedOriginalIndex) {
  return;
 }

 // 並び替えを実行
 injectedStore?.reorder?.(draggedOriginalIndex, droppedOriginalIndex);

 // ドラッグ状態をリセット
 handleDragEnd();
};

// ストア操作
const handleSelectRule = (ruleId: string) => {
 injectedStore?.selectRule?.(ruleId);
};

const handleAddNewRule = () => {
 injectedStore?.add?.();
};

const handleUpdateRule = (ruleId: string, updates: Partial<BaseRule>) => {
 injectedStore?.update?.(ruleId, updates);
};

const handleDuplicateRule = () => {
 if (contextMenu.rule) {
  injectedStore?.duplicate?.(contextMenu.rule.id);
 }
 hideContextMenu();
};

const handleMoveRuleUp = () => {
 if (contextMenu.rule && canMoveUp.value) {
  const originalIndex = getOriginalIndex(contextMenu.rule.id);
  injectedStore?.reorder?.(originalIndex, originalIndex - 1);
 }
 hideContextMenu();
};

const handleMoveRuleDown = () => {
 if (contextMenu.rule && canMoveDown.value) {
  const originalIndex = getOriginalIndex(contextMenu.rule.id);
  injectedStore?.reorder?.(originalIndex, originalIndex + 1);
 }
 hideContextMenu();
};

const handleDeleteRule = () => {
 if (!contextMenu.rule) return;

 const ruleName = contextMenu.rule.name || '名前未設定';
 const confirmMessage = `「${ruleName}」を削除しますか？`;

 if (confirm(confirmMessage)) {
  injectedStore?.remove?.(contextMenu.rule.id);
 }

 hideContextMenu();
};

// コンテキストメニュー
const showContextMenu = (event: MouseEvent, rule: BaseRule, index: number) => {
 contextMenu.x = event.clientX;
 contextMenu.y = event.clientY;
 contextMenu.rule = rule;
 contextMenu.index = index;
 contextMenu.show = true;
};

const hideContextMenu = () => {
 contextMenu.show = false;
 contextMenu.rule = null;
 contextMenu.index = -1;
};
</script>
