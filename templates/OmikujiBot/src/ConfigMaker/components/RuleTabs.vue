<!-- src/configMaker/components/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- タブ部分 -->
  <div class="flex flex-wrap gap-1 border-b pb-2">
   <!-- 既存のルールタブ -->
   <div
    v-for="(rule, index) in sortedRules"
    :key="rule.id"
    class="relative"
    @contextmenu.prevent="showContextMenu($event, rule, index)"
   >
    <button
     :class="[
      'tab tab-bordered px-4 py-2 text-sm font-medium transition-colors',
      selectedRule?.id === rule.id
       ? 'tab-active bg-primary text-primary-content'
       : 'hover:bg-base-200'
     ]"
     @click="selectRule(rule.id)"
     :style="{ borderTopColor: rule.editorColor }"
    >
     <span class="flex items-center gap-2">
      <div
       class="w-3 h-3 rounded-full border border-white/20"
       :style="{ backgroundColor: rule.editorColor }"
      ></div>
      {{ rule.name || `NoName${index + 1}` }}
      <span v-if="!rule.isEnabled" class="opacity-50 text-xs">(無効)</span>
     </span>
    </button>
   </div>

   <!-- 新規追加タブ -->
   <button
    class="tab tab-bordered px-4 py-2 text-sm border-dashed border-gray-400 hover:bg-base-200 text-gray-500"
    @click="addNewRule"
   >
    ➕ 追加
   </button>
  </div>

  <!-- 右クリックコンテキストメニュー -->
  <div
   v-if="contextMenu.show"
   :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
   class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-lg py-2 min-w-48"
   @click.stop
  >
   <button
    @click="duplicateRule"
    class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
   >
    📋 複製
   </button>

   <div class="divider my-1"></div>

   <button
    @click="moveRuleUp"
    :disabled="contextMenu.rule && getOriginalIndex(contextMenu.rule.id) === 0"
    :class="[
     'w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2',
     contextMenu.rule && getOriginalIndex(contextMenu.rule.id) === 0
      ? 'opacity-50 cursor-not-allowed'
      : ''
    ]"
   >
    ⬆️ 上に移動
   </button>

   <button
    @click="moveRuleDown"
    :disabled="contextMenu.rule && getOriginalIndex(contextMenu.rule.id) === rules.length - 1"
    :class="[
     'w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2',
     contextMenu.rule && getOriginalIndex(contextMenu.rule.id) === rules.length - 1
      ? 'opacity-50 cursor-not-allowed'
      : ''
    ]"
   >
    ⬇️ 下に移動
   </button>

   <div class="divider my-1"></div>

   <button
    @click="deleteRule"
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
import { reactive, computed, onMounted, onUnmounted } from 'vue';

// Props
interface Props {
 rules: any[];
 selectedRule: any;
}

const props = withDefaults(defineProps<Props>(), {});

// Emits
const emit = defineEmits<{
 selectRule: [ruleId: string];
 addRule: [];
 duplicateRule: [ruleId: string];
 moveRuleUp: [index: number];
 moveRuleDown: [index: number];
 deleteRule: [ruleId: string];
}>();

// コンテキストメニューの状態
const contextMenu = reactive({
 show: false,
 x: 0,
 y: 0,
 rule: null as any,
 index: -1
});

// orderに基づいてルールをソートするcomputed
const sortedRules = computed(() => {
 // rulesが配列の場合、orderプロパティがあるかチェック
 if (Array.isArray(props.rules)) {
  return props.rules.slice().sort((a, b) => {
   // aまたはbがオブジェクトでorderプロパティを持つ場合のみソート
   const aOrder = typeof a === 'object' && a !== null && 'order' in a ? a.order : 0;
   const bOrder = typeof b === 'object' && b !== null && 'order' in b ? b.order : 0;
   return aOrder - bOrder;
  });
 }

 // rulesがオブジェクトの場合（Record<string, Rule>）、orderでソート
 if (typeof props.rules === 'object' && props.rules !== null) {
  return Object.values(props.rules).sort((a, b) => {
   const aOrder = typeof a === 'object' && a !== null && 'order' in a ? a.order : 0;
   const bOrder = typeof b === 'object' && b !== null && 'order' in b ? b.order : 0;
   return aOrder - bOrder;
  });
 }

 return [];
});

// 元の配列でのインデックスを取得する関数
const getOriginalIndex = (ruleId: string): number => {
 return props.rules.findIndex((rule) =>
  typeof rule === 'object' && rule !== null && 'id' in rule ? rule.id === ruleId : false
 );
};

// methods
const selectRule = (ruleId: string) => {
 emit('selectRule', ruleId);
};

const addNewRule = () => {
 emit('addRule');
};

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

const duplicateRule = () => {
 if (contextMenu.rule) {
  emit('duplicateRule', contextMenu.rule.id);
 }
 hideContextMenu();
};

const moveRuleUp = () => {
 if (contextMenu.rule) {
  const originalIndex = getOriginalIndex(contextMenu.rule.id);
  if (originalIndex > 0) {
   emit('moveRuleUp', originalIndex);
  }
 }
 hideContextMenu();
};

const moveRuleDown = () => {
 if (contextMenu.rule) {
  const originalIndex = getOriginalIndex(contextMenu.rule.id);
  if (originalIndex < props.rules.length - 1) {
   emit('moveRuleDown', originalIndex);
  }
 }
 hideContextMenu();
};

const deleteRule = () => {
 if (contextMenu.rule && props.rules.length > 1) {
  if (confirm(`「${contextMenu.rule.name}」を削除しますか？`)) {
   emit('deleteRule', contextMenu.rule.id);
  }
 } else if (contextMenu.rule && props.rules.length === 1) {
  if (
   confirm(
    `「${contextMenu.rule.name}」を削除しますか？\n※最後のルールを削除すると、新しいルールが自動作成されます。`
   )
  ) {
   emit('deleteRule', contextMenu.rule.id);
  }
 }
 hideContextMenu();
};

// ESCキーでコンテキストメニューを閉じる
const handleKeydown = (event: KeyboardEvent) => {
 if (event.key === 'Escape') {
  hideContextMenu();
 }
};

onMounted(() => {
 document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
 document.removeEventListener('keydown', handleKeydown);
});
</script>
