<!-- src/configMaker/components/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- タブ部分 -->
  <div class="flex flex-wrap gap-1 border-b pb-2">
   <!-- 既存のルールタブ -->
   <div
    v-for="(rule, index) in filteredSortedRules"
    :key="rule.id"
    class="relative group"
    @contextmenu.prevent="showContextMenu($event, rule, index)"
    @mouseenter="hoveredRule = rule"
    @mouseleave="hoveredRule = null"
   >
    <button
     :class="getTabClasses(rule)"
     @click="handleSelectRule(rule.id)"
     @dblclick="startInlineEdit(rule)"
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
      <span v-if="!rule.isEnabled" class="opacity-50 text-xs">(無効)</span>
      <span v-if="rule.scriptId" class="text-info" title="外部スクリプト使用">🔧</span>
      <span v-if="hasValidationErrors(rule)" class="text-error" title="設定エラー">⚠</span>
     </div>

     <!-- ホバーエフェクト -->
     <div
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
     />
    </button>

    <!-- ホバープレビュー -->
    <div
     v-if="hoveredRule?.id === rule.id && !editingRuleId"
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
        <span class="badge badge-sm" :class="rule.isEnabled ? 'badge-success' : 'badge-error'">
         {{ rule.isEnabled ? '有効' : '無効' }}
        </span>
        <span v-if="rule.scriptId" class="badge badge-sm badge-info">スクリプト</span>
       </div>
       <div v-if="rule.omikuji?.length">
        <div class="font-medium">おみくじ : {{ rule.omikuji.length }}種</div>
       </div>
      </div>
     </div>
    </div>
   </div>

   <!-- 新規追加タブ -->
   <button
    class="tab tab-bordered px-4 py-2 text-sm border-dashed border-gray-400 hover:bg-base-200 text-gray-500 transition-all duration-200 hover:border-primary"
    @click="handleAddNewRule"
    title="新しいルールを追加"
   >
    <span class="flex items-center gap-2">➕ 追加</span>
   </button>
  </div>

  <!-- 右クリックコンテキストメニュー -->
  <div
   v-if="contextMenu.show"
   :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
   class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl py-2 min-w-48"
   @click.stop
  >
   <button
    @click="handleMoveRuleUp"
    :disabled="!canMoveUp"
    :class="getContextMenuItemClasses(!canMoveUp)"
   >
    ⬆️ 上に移動
   </button>

   <button
    @click="handleMoveRuleDown"
    :disabled="!canMoveDown"
    :class="getContextMenuItemClasses(!canMoveDown)"
   >
    ⬇️ 下に移動
   </button>

   <div class="divider my-1"></div>

   <button
    @click="handleDuplicateRule"
    class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
   >
    📋 複製
   </button>

   <button
    @click="handleDeleteRule"
    class="w-full px-4 py-2 text-left hover:bg-error hover:text-error-content flex items-center gap-2 text-error"
   >
    🗑️ 削除
   </button>
  </div>

  <!-- コンテキストメニューを閉じるためのオーバーレイ -->
  <div v-if="contextMenu.show" @click="hideContextMenu" class="fixed inset-0 z-40"></div>
 </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, onUnmounted, ref, nextTick, inject } from 'vue';

// Props
const props = defineProps<{
 rules: any[];
 selectedRule: any;
 ruleType: 'comments' | 'timers' | 'placeholders' | 'characters';
}>();

// Store injection
const injectedStore = inject<any>(`${props.ruleType}RulesStore`);

// リアクティブデータ
const searchQuery = ref('');
const editingRuleId = ref<string | null>(null);
const editingName = ref('');
const hoveredRule = ref<any>(null);
const editInput = ref<HTMLInputElement>();

// コンテキストメニューの状態
const contextMenu = reactive({
 show: false,
 x: 0,
 y: 0,
 rule: null as any,
 index: -1
});

// 計算プロパティ
const sortedRules = computed(() => {
 return Array.isArray(props.rules) ? props.rules.slice().sort((a, b) => a.order - b.order) : [];
});

const filteredSortedRules = computed(() => {
 let rules = sortedRules.value;

 if (searchQuery.value) {
  const query = searchQuery.value.toLowerCase();
  rules = rules.filter(
   (rule) =>
    (rule.name || '').toLowerCase().includes(query) ||
    (rule.description || '').toLowerCase().includes(query)
  );
 }

 return rules;
});

const canMoveUp = computed(() => contextMenu.rule && getOriginalIndex(contextMenu.rule.id) > 0);

const canMoveDown = computed(
 () => contextMenu.rule && getOriginalIndex(contextMenu.rule.id) < props.rules.length - 1
);

// ヘルパー関数
const getOriginalIndex = (ruleId: string): number => {
 return props.rules.findIndex((rule) => rule.id === ruleId);
};

const getTabClasses = (rule: any) => [
 'tab tab-bordered px-4 py-2 text-sm font-medium transition-all duration-200',
 'flex items-center gap-2 relative overflow-hidden',
 props.selectedRule?.id === rule.id
  ? 'tab-active bg-primary text-primary-content shadow-lg'
  : 'hover:bg-base-200 hover:shadow-md',
 !rule.isEnabled && 'opacity-60'
];

const getContextMenuItemClasses = (disabled: boolean) => [
 'w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2',
 disabled && 'opacity-50 cursor-not-allowed'
];

const hasValidationErrors = (rule: any) => {
 if (!rule.name?.trim()) return true;
 if (props.ruleType === 'comments' && !rule.threshold) return true;
 if (props.ruleType === 'timers' && (!rule.intervalSeconds || rule.intervalSeconds < 1))
  return true;
 return false;
};

// ストア操作
const handleSelectRule = (ruleId: string) => {
 injectedStore?.selectRule?.(ruleId);
};

const handleAddNewRule = () => {
 injectedStore?.add?.();
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
 let confirmMessage = `「${ruleName}」を削除しますか？`;

 if (props.rules.length === 1) {
  confirmMessage += '\n※最後のルールを削除すると、新しいルールが自動作成されます。';
 }

 if (confirm(confirmMessage)) {
  injectedStore?.remove?.(contextMenu.rule.id);
  // 最後のルールを削除した場合の自動作成
  setTimeout(() => {
   if (props.rules.length === 0) {
    injectedStore?.add?.();
   }
  }, 0);
 }

 hideContextMenu();
};

// インライン編集
const startInlineEdit = (rule: any) => {
 editingRuleId.value = rule.id;
 editingName.value = rule.name || '';
 nextTick(() => {
  editInput.value?.focus();
  editInput.value?.select();
 });
};

const finishInlineEdit = () => {
 if (editingRuleId.value) {
  injectedStore?.update?.(editingRuleId.value, { name: editingName.value });
  editingRuleId.value = null;
 }
};

const cancelInlineEdit = () => {
 editingRuleId.value = null;
 editingName.value = '';
};

// コンテキストメニュー
const showContextMenu = (event: MouseEvent, rule: any, index: number) => {
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

// ESCキーでメニューを閉じる
const handleKeydown = (event: KeyboardEvent) => {
 if (event.key === 'Escape') {
  if (editingRuleId.value) {
   cancelInlineEdit();
  } else if (contextMenu.show) {
   hideContextMenu();
  }
 }
};

onMounted(() => {
 document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
 document.removeEventListener('keydown', handleKeydown);
});
</script>
