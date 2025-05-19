<!-- src/apps/configMaker/components/CounterSetTabs.vue -->
<template>
 <div class="mb-4 relative">
  <!-- 移動用のボタン - タブエリアの両側に配置 -->
  <div class="flex items-center">
   <button
    v-if="counterSets.length > 1 && activeTabIndex > 0"
    @click="$emit('moveSet', activeTabIndex, 'left')"
    class="btn btn-sm btn-circle mr-2"
    title="左へ移動"
   >
    ←
   </button>

   <div class="flex gap-4 flex-grow overflow-x-auto">
    <button
     v-for="(set, index) in counterSets"
     :key="`counter-set-${index}`"
     :class="['btn btn-lg ', activeTabIndex === index ? 'btn-primary' : 'btn-outline']"
     @click="$emit('update:activeTabIndex', index)"
     @contextmenu.prevent="showContextMenu($event, index)"
    >
     {{ index + 1 }}: {{ set.counter.title }}
    </button>
   </div>

   <button
    v-if="counterSets.length > 1 && activeTabIndex < counterSets.length - 1"
    @click="$emit('moveSet', activeTabIndex, 'right')"
    class="btn btn-sm btn-circle ml-2"
    title="右へ移動"
   >
    →
   </button>
  </div>

  <!-- コンテキストメニュー - position: fixed に変更してビューポート基準の位置に -->
  <div
   v-if="contextMenu.show"
   class="fixed bg-base-100 shadow-lg rounded-md p-2 z-50"
   :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
  >
   <ul class="menu menu-compact w-32">
    <li v-if="contextMenu.index > 0">
     <a @click="handleMoveLeft">← 左へ移動</a>
    </li>
    <li v-if="contextMenu.index < counterSets.length - 1">
     <a @click="handleMoveRight">右へ移動 →</a>
    </li>
    <li>
     <a @click="handleDuplicate">複製</a>
    </li>
    <li v-if="counterSets.length > 1">
     <a @click="handleRemove" class="text-error">削除</a>
    </li>
   </ul>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { CounterSet } from '@/scripts/schema';

// Props
const props = defineProps<{
 counterSets: CounterSet[];
 activeTabIndex: number;
}>();

// Emits
const emit = defineEmits(['update:activeTabIndex', 'moveSet', 'duplicateSet', 'removeSet']);

// コンテキストメニュー関連
const contextMenu = ref({
 show: false,
 x: 0,
 y: 0,
 index: 0
});

const showContextMenu = (event: MouseEvent, index: number) => {
 event.preventDefault();

 // 画面端でメニューがはみ出さないように位置を調整
 const x = Math.min(event.clientX, window.innerWidth - 150); // メニュー幅を考慮
 const y = Math.min(event.clientY, window.innerHeight - 200); // メニュー高さを考慮

 contextMenu.value = {
  show: true,
  x,
  y,
  index
 };
};

const hideContextMenu = () => {
 contextMenu.value.show = false;
};

// グローバルクリックでコンテキストメニューを閉じる
const handleGlobalClick = () => {
 hideContextMenu();
};

onMounted(() => {
 document.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
 document.removeEventListener('click', handleGlobalClick);
});

// コンテキストメニューのハンドラー
const handleMoveLeft = () => {
 emit('moveSet', contextMenu.value.index, 'left');
 hideContextMenu();
};

const handleMoveRight = () => {
 emit('moveSet', contextMenu.value.index, 'right');
 hideContextMenu();
};

const handleDuplicate = () => {
 emit('duplicateSet', contextMenu.value.index);
 hideContextMenu();
};

const handleRemove = () => {
 emit('removeSet', contextMenu.value.index);
 hideContextMenu();
};
</script>
