<!-- src/configMaker/components/comments/PostActionsEditDialog.vue -->
<template>
 <dialog ref="dialogRef" class="modal">
  <div class="modal-box max-w-max">
   <!-- 保存・キャンセルボタン -->
   <div class="mb-4">
    <ModalFooterActions :on-cancel="closeDialog" :on-save="saveActions" />
   </div>
   <!-- プレースホルダーリスト表示 -->
   <PlaceholderList :actions="editingActions" />

   <!-- Post編集ダイアログ -->
   <div class="card bg-base-300 mt-4">
    <!-- タイトルバー -->
    <div class="flex justify-between items-center bg-primary text-white rounded-t px-4 py-2">
     <h3 class="text-lg font-semibold">Post Actions 編集</h3>
     <div class="flex gap-2">
      <button @click="sortByDelay" class="btn btn-sm btn-secondary">📊 遅延順</button>
      <button @click="addAction" class="btn btn-sm btn-accent">➕ 追加</button>
     </div>
    </div>

    <!-- 本体 -->
    <div class="card-body p-2">
     <div v-if="editingActions.length === 0" class="text-center text-gray-500 py-8">
      Post Actions がありません。「➕ 追加」ボタンで追加してください。
     </div>

     <div v-else class="space-y-4">
      <div
       v-for="(action, index) in editingActions"
       :key="index"
       class="card bg-base-200 p-4 relative"
       :class="['border-l-6', index % 2 === 0 ? 'border-l-accent' : 'border-l-primary']"
      >
       <!-- 右下固定の操作ボタン -->
       <div class="absolute bottom-2 right-2 flex gap-1">
        <button @click="duplicateAction(index)" class="btn btn-sm btn-outline" title="複製">
         <Copy class="w-4 h-4" />
        </button>
        <button @click="removeAction(index)" class="btn btn-sm btn-outline btn-error" title="削除">
         <Trash2 class="w-4 h-4" />
        </button>
       </div>

       <!-- 基本設定: 横並び3つ -->
       <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 max-w-screen-md">
        <!-- キャラクター -->
        <div v-if="action.messageContent !== '' || action.messageToast !== ''" class="form-control">
         <label class="label py-0">
          <span class="label-text text-xs">👤 キャラクター</span>
         </label>
         <select v-model="action.characterKey" class="select select-bordered select-sm w-full">
          <option v-for="char in characterOptions" :key="char.value" :value="char.value">
           {{ char.label }}
          </option>
         </select>
        </div>

        <!-- アイコン -->
        <IconSelector
         v-if="action.messageContent !== '' || action.messageToast !== ''"
         :character-key="action.characterKey"
         :icon-key="action.iconKey"
         @update:icon-key="action.iconKey = $event as CharacterEmotionType"
        />

        <!-- 遅延秒数 -->
        <div class="form-control">
         <label class="label py-0">
          <span class="label-text text-xs">⏱️ 遅延秒数</span>
         </label>
         <input
          type="number"
          v-model.number="action.delaySeconds"
          min="-1"
          step="0.1"
          class="input input-bordered input-sm w-full"
          placeholder="0"
         />
        </div>
       </div>

       <!-- メッセージ系フィールド -->
       <div class="space-y-2 mb-2">
        <!-- コメント -->
        <div class="flex items-center gap-2">
         <label class="w-24 text-xs flex-shrink-0">💬 コメント</label>
         <input
          type="text"
          v-model="action.messageContent"
          class="input input-bordered input-sm w-2/3"
          placeholder="コメントの投稿"
         />
        </div>

        <!-- トースト -->
        <div class="flex items-center gap-2">
         <label class="w-24 text-xs flex-shrink-0">🍞 トースト</label>
         <input
          type="text"
          v-model="action.messageToast"
          class="input input-bordered input-sm w-2/3"
          placeholder="トーストの表示"
         />
        </div>

        <!-- WordParty -->
        <div class="flex items-center gap-2">
         <label class="w-24 text-xs flex-shrink-0">🎉 WordParty</label>
         <div class="flex gap-1 w-2/3">
          <div class="tabs tabs-boxed tabs-sm">
           <button
            @click="setWordPartyInputMode(index, 'select')"
            class="tab tab-sm"
            :class="{ 'tab-active': getWordPartyInputMode(index) === 'select' }"
           >
            選択
           </button>
           <button
            @click="setWordPartyInputMode(index, 'manual')"
            class="tab tab-sm"
            :class="{ 'tab-active': getWordPartyInputMode(index) === 'manual' }"
           >
            手動
           </button>
          </div>

          <!-- 選択モード -->
          <select
           v-if="getWordPartyInputMode(index) === 'select'"
           v-model="action.wordParty"
           class="select select-bordered select-sm flex-1"
          >
           <option value="">選択してください</option>
           <option
            v-for="setting in wordPartySetting"
            :key="setting.pattern"
            :value="setting.pattern"
           >
            {{ setting.name }} ({{ setting.pattern }})
           </option>
          </select>

          <!-- 手動入力モード -->
          <input
           v-if="getWordPartyInputMode(index) === 'manual'"
           type="text"
           v-model="action.wordParty"
           class="input input-bordered input-sm flex-1"
           placeholder="WordParty"
          />
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
   <!-- 保存・キャンセルボタン -->
   <ModalFooterActions :on-cancel="closeDialog" :on-save="saveActions" />
  </div>
 </dialog>
</template>

<script setup lang="ts">
import { ref, computed, Ref, reactive } from 'vue';
import { CharacterEmotionType, CharacterType, PostActionSchema, PostActionType } from '@type/';
import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue';
import PlaceholderList from '@ConfigComponents/placeholders/PlaceholderList.vue';
import IconSelector from '@ConfigComponents/comments/IconSelector.vue';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import { storeToRefs } from 'pinia';
import { Copy, Trash2 } from 'lucide-vue-next';

// Props
const props = defineProps<{
 actions: PostActionType[];
 charactersArray: CharacterType[];
}>();

// Emits
const emit = defineEmits<{
 'update:actions': [value: PostActionType[]];
}>();

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定の参照
const wordPartySetting = computed(() => data.value.wordPartySettings);

// Refs
const dialogRef: Ref<HTMLDialogElement | null> = ref(null);
const editingActions: Ref<PostActionType[]> = ref([]);

// WordParty入力モード管理
const wordPartyInputModes = reactive<Record<number, 'select' | 'manual'>>({});

// キャラクター選択肢
const characterOptions = computed(() => {
 return props.charactersArray.map((character) => ({
  value: character.id,
  label: character.name
 }));
});

// WordParty入力モード関連
const getWordPartyInputMode = (index: number): 'select' | 'manual' => {
 return wordPartyInputModes[index] || 'select';
};

const setWordPartyInputMode = (index: number, mode: 'select' | 'manual') => {
 wordPartyInputModes[index] = mode;
};

// Dialog methods
const open = () => {
 editingActions.value = JSON.parse(JSON.stringify(props.actions));

 // WordParty入力モードの初期化
 editingActions.value.forEach((action, index) => {
  // wordPartyの値がwordPartySettingのpatternに含まれている場合は選択モード、そうでなければ手動モード
  const isSelectMode = wordPartySetting.value.some(
   (setting) => setting.pattern === action.wordParty
  );
  wordPartyInputModes[index] = isSelectMode ? 'select' : 'manual';
 });

 dialogRef.value?.showModal();
};

const closeDialog = () => {
 dialogRef.value?.close();
 editingActions.value = [];
 // WordParty入力モードをリセット
 Object.keys(wordPartyInputModes).forEach((key) => {
  delete wordPartyInputModes[Number(key)];
 });
};

const saveActions = () => {
 emit('update:actions', [...editingActions.value]);
 closeDialog();
};

// Action management methods
const addAction = () => {
 const characterId = props.charactersArray[0]?.id ?? '';
 const newAction = PostActionSchema.parse({ characterKey: characterId });
 editingActions.value.push(newAction);

 // 新しいアクションのWordParty入力モードをデフォルト（選択モード）に設定
 const newIndex = editingActions.value.length - 1;
 wordPartyInputModes[newIndex] = 'select';
};

const removeAction = (index: number) => {
 editingActions.value.splice(index, 1);

 // WordParty入力モードも削除し、インデックスを再調整
 const newModes: Record<number, 'select' | 'manual'> = {};
 Object.keys(wordPartyInputModes).forEach((key) => {
  const keyNum = Number(key);
  if (keyNum < index) {
   newModes[keyNum] = wordPartyInputModes[keyNum];
  } else if (keyNum > index) {
   newModes[keyNum - 1] = wordPartyInputModes[keyNum];
  }
 });

 Object.keys(wordPartyInputModes).forEach((key) => {
  delete wordPartyInputModes[Number(key)];
 });
 Object.assign(wordPartyInputModes, newModes);
};

const duplicateAction = (index: number) => {
 const original = editingActions.value[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 editingActions.value.splice(index + 1, 0, duplicated);

 // WordParty入力モードも複製し、インデックスを再調整
 const newModes: Record<number, 'select' | 'manual'> = {};
 Object.keys(wordPartyInputModes).forEach((key) => {
  const keyNum = Number(key);
  if (keyNum <= index) {
   newModes[keyNum] = wordPartyInputModes[keyNum];
  } else {
   newModes[keyNum + 1] = wordPartyInputModes[keyNum];
  }
 });

 // 複製されたアクションの入力モードを設定
 newModes[index + 1] = wordPartyInputModes[index] || 'select';

 Object.keys(wordPartyInputModes).forEach((key) => {
  delete wordPartyInputModes[Number(key)];
 });
 Object.assign(wordPartyInputModes, newModes);
};

// 遅延秒数でソートする機能
const sortByDelay = () => {
 editingActions.value.sort((a, b) => {
  const delayA = a.delaySeconds || 0;
  const delayB = b.delaySeconds || 0;
  return delayA - delayB;
 });
};

// Expose open method for parent component
defineExpose({
 open
});
</script>
