<!-- src/apps/configMaker/components/CounterSetManager.vue -->
<template>
 <div class="mb-6 p-4 bg-base-200 rounded-lg shadow-sm">
  <div class="flex justify-between items-center mb-4">
   <h3 class="text-xl font-bold">カウンターセット一覧</h3>
   <button @click="addNewSet" class="btn btn-sm btn-success">
    <span class="mr-1">+</span> 新規セット追加
   </button>
  </div>

  <!-- カウンターセットのタブナビゲーション（改善版） -->
  <div class="tab-container relative mb-4">
   <div class="flex overflow-x-auto">
    <div
     v-for="(set, index) in configStore.counterSets"
     :key="set.id"
     :class="[
      'tab-item relative cursor-pointer py-2 px-4 border-t border-l border-r rounded-t-lg transition-all',
      configStore.activeSetIndex === index
       ? 'bg-primary text-primary-content font-medium -mb-px'
       : 'bg-base-100 hover:bg-base-300'
     ]"
     @click="configStore.setActiveSet(index)"
     @contextmenu.prevent="openContextMenu($event, index)"
    >
     <div class="flex items-center">
      <span>{{ set.generator.title || `Set ${index + 1}` }}</span>
      <div class="ml-2 flex items-center space-x-1">
       <button
        v-if="configStore.activeSetIndex === index"
        @click.stop="configStore.duplicateSet(index)"
        class="hover:text-success"
        title="複製"
       >
        <span class="text-xs">⊕</span>
       </button>
       <button
        v-if="configStore.activeSetIndex === index && configStore.counterSets.length > 1"
        @click.stop="confirmDelete(index)"
        class="hover:text-error"
        title="削除"
       >
        <span class="text-xs">✕</span>
       </button>
      </div>
     </div>
    </div>
   </div>

   <!-- 移動コントロール（タブの下に配置） -->
   <div
    class="flex items-center justify-center mt-2 space-x-2"
    v-if="configStore.counterSets.length > 1"
   >
    <button
     @click="configStore.moveSetUp(configStore.activeSetIndex)"
     class="btn btn-xs btn-circle btn-ghost"
     :disabled="configStore.activeSetIndex === 0"
     title="上へ移動"
    >
     ←
    </button>
    <span class="text-sm text-opacity-70">順序変更</span>
    <button
     @click="configStore.moveSetDown(configStore.activeSetIndex)"
     class="btn btn-xs btn-circle btn-ghost"
     :disabled="configStore.activeSetIndex === configStore.counterSets.length - 1"
     title="下へ移動"
    >
     →
    </button>
   </div>
  </div>

  <!-- コンテキストメニュー -->
  <div
   v-if="showContextMenu"
   class="context-menu absolute bg-base-100 shadow-lg rounded-md overflow-hidden border z-50"
   :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
  >
   <ul class="menu p-0 w-48">
    <li>
     <button
      @click="handleContextMenu('edit')"
      class="py-2 px-4 hover:bg-base-200 w-full text-left"
     >
      編集
     </button>
    </li>
    <li>
     <button
      @click="handleContextMenu('duplicate')"
      class="py-2 px-4 hover:bg-base-200 w-full text-left"
     >
      複製
     </button>
    </li>
    <li>
     <button
      @click="handleContextMenu('moveup')"
      class="py-2 px-4 hover:bg-base-200 w-full text-left"
      :disabled="contextMenuIndex === 0"
     >
      前へ移動
     </button>
    </li>
    <li>
     <button
      @click="handleContextMenu('movedown')"
      class="py-2 px-4 hover:bg-base-200 w-full text-left"
      :disabled="contextMenuIndex === configStore.counterSets.length - 1"
     >
      後へ移動
     </button>
    </li>
    <li class="border-t">
     <button
      @click="handleContextMenu('delete')"
      class="py-2 px-4 hover:bg-error hover:text-white w-full text-left"
      :disabled="configStore.counterSets.length <= 1"
     >
      削除
     </button>
    </li>
   </ul>
  </div>

  <!-- 削除確認モーダル -->
  <div class="modal" :class="{ 'modal-open': showDeleteModal }">
   <div class="modal-box bg-error">
    <h3 class="font-bold text-lg">削除の確認</h3>
    <p class="py-4">このカウンターセットを削除してもよろしいですか？この操作は元に戻せません。</p>
    <div class="modal-action">
     <button @click="showDeleteModal = false" class="btn">キャンセル</button>
     <button @click="confirmDeleteAction" class="btn btn-error">削除する</button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useConfigMaker } from './useConfigMaker';

const configStore = useConfigMaker();
const showContextMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const contextMenuIndex = ref(0);
const showDeleteModal = ref(false);
const deleteIndex = ref(0);

// コンテキストメニューを開く
const openContextMenu = (event: MouseEvent, index: number) => {
 event.preventDefault();
 menuPosition.value = { x: event.clientX, y: event.clientY };
 contextMenuIndex.value = index;
 showContextMenu.value = true;
};

// コンテキストメニューアクション
const handleContextMenu = (action: string) => {
 const index = contextMenuIndex.value;

 switch (action) {
  case 'edit':
   configStore.setActiveSet(index);
   break;
  case 'duplicate':
   configStore.duplicateSet(index);
   break;
  case 'moveup':
   configStore.moveSetUp(index);
   break;
  case 'movedown':
   configStore.moveSetDown(index);
   break;
  case 'delete':
   if (configStore.counterSets.length > 1) {
    deleteIndex.value = index;
    showDeleteModal.value = true;
   }
   break;
 }

 showContextMenu.value = false;
};

// 新規セット追加
const addNewSet = () => {
 configStore.addCounterSet();
};

// 削除確認
const confirmDelete = (index: number) => {
 deleteIndex.value = index;
 showDeleteModal.value = true;
};

// 削除実行
const confirmDeleteAction = () => {
 configStore.deleteSet(deleteIndex.value);
 showDeleteModal.value = false;
};

// コンテキストメニューを閉じるイベントハンドラ
const closeContextMenu = () => {
 showContextMenu.value = false;
};

// グローバルイベントリスナーの登録と解除
onMounted(() => {
 document.addEventListener('click', closeContextMenu);
 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContextMenu();
 });
});

onUnmounted(() => {
 document.removeEventListener('click', closeContextMenu);
 document.removeEventListener('keydown', closeContextMenu);
});
</script>

<style scoped>
.tab-container {
 position: relative;
}

.tab-item {
 min-width: 100px;
 position: relative;
}

.context-menu {
 box-shadow:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* ボタンが無効の場合のスタイル */
button[disabled] {
 opacity: 0.5;
 cursor: not-allowed;
}
</style>
