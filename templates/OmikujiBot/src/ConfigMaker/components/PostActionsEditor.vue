<!-- src/configMaker/components/PostActionsEditor.vue -->
<template>
 <div class="form-control">
  <div class="flex justify-between items-center mb-2">
   <label class="label py-1">
    <span class="label-text text-sm font-medium">わんコメへの投稿</span>
    <span class="badge badge-sm badge-outline ml-2">{{ modelValue.length }}</span>
   </label>
   <button @click="openDialog" class="btn btn-sm btn-primary" type="button">
    <span class="text-sm">⚙️</span>
    編集
   </button>
  </div>

  <!-- プレビュー表示 -->
  <div class="bg-base-200 rounded p-3 text-sm">
   <div v-if="modelValue.length === 0" class="text-gray-500 italic">
    Post Actions が設定されていません
   </div>
   <div v-else class="space-y-2">
    <div v-for="(action, index) in modelValue" :key="index">
     <div class="flex items-center gap-2 mb-1">
      <span class="w-4 text-center text-sm text-gray-500 font-medium">{{ index + 1 }}</span>
      <div class="flex flex-wrap gap-1 text-xs">
       <span v-if="action.characterKey" class="badge badge-sm"
        >👤 {{ getCharacterLabel(action.characterKey) }}</span
       >
       <span v-if="action.iconKey" class="badge badge-sm"
        >🎨 {{ getIconLabel(action.iconKey) }}</span
       >
       <span v-if="action.delaySeconds > 0" class="badge badge-sm badge-secondary">
        ⏱️ {{ action.delaySeconds }}s
       </span>
      </div>
     </div>
     <div
      v-if="action.messageContent || action.wordParty || action.messageToast"
      class="ml-6 space-y-1"
     >
      <div v-if="action.messageContent" class="text-sm">
       <span class="text-info font-medium">💬 Message:</span>
       <span class="ml-1">{{ action.messageContent }}</span>
      </div>
      <div v-if="action.wordParty" class="text-sm">
       <span class="text-accent font-medium">🎉 Party:</span>
       <span class="ml-1">{{ action.wordParty }}</span>
      </div>
      <div v-if="action.messageToast" class="text-sm">
       <span class="text-warning font-medium">🍞 Toast:</span>
       <span class="ml-1">{{ action.messageToast }}</span>
      </div>
     </div>
    </div>
   </div>
  </div>

  <!-- 編集ダイアログ -->
  <dialog ref="dialog" class="modal">
   <div class="modal-box max-w-5xl max-h-[90vh]">
    <div class="flex justify-between items-center mb-4">
     <h3 class="font-bold text-lg">Post Actions 編集</h3>
     <div class="flex gap-2">
      <button @click="addAction" class="btn btn-sm btn-primary">➕ 追加</button>
      <button @click="sortByDelay" class="btn btn-sm btn-secondary">⏱️ 時間順ソート</button>
      <button @click="closeDialog" class="btn btn-sm btn-circle btn-ghost">✕</button>
     </div>
    </div>

    <div class="overflow-y-auto max-h-[60vh]">
     <div v-if="editingActions.length === 0" class="text-center text-gray-500 py-8">
      Post Actions がありません。「➕ 追加」ボタンで追加してください。
     </div>

     <div v-else class="space-y-4">
      <div v-for="(action, index) in editingActions" :key="index" class="card bg-base-200 p-4">
       <div class="flex justify-between items-start mb-3">
        <h4 class="font-medium flex items-center gap-2">
         <span class="badge badge-sm">{{ index + 1 }}</span>
         Action
        </h4>
        <div class="flex gap-1">
         <button @click="duplicateAction(index)" class="btn btn-sm btn-outline" title="複製">
          📋
         </button>
         <button @click="removeAction(index)" class="btn btn-sm btn-outline btn-error" title="削除">
          🗑️
         </button>
        </div>
       </div>

       <!-- 基本設定: 横並び3つ -->
       <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <!-- Character Key -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">👤 キャラクター</span>
         </label>
         <select v-model="action.characterKey" class="select select-bordered select-sm">
          <option value="">選択してください</option>
          <option v-for="char in characterOptions" :key="char.value" :value="char.value">
           {{ char.label }}
          </option>
         </select>
        </div>

        <!-- Icon Key -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">🎨 アイコン</span>
         </label>
         <select v-model="action.iconKey" class="select select-bordered select-sm">
          <option value="">選択してください</option>
          <option v-for="icon in iconOptions" :key="icon.value" :value="icon.value">
           {{ icon.label }}
          </option>
         </select>
        </div>

        <!-- Delay Seconds -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">⏱️ 遅延秒数</span>
         </label>
         <input
          type="number"
          v-model.number="action.delaySeconds"
          min="0"
          step="0.1"
          class="input input-bordered input-sm"
          placeholder="0"
         />
        </div>
       </div>

       <!-- メッセージ系フィールド -->
       <div class="space-y-3">
        <!-- Message Content -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">💬 コメント</span>
         </label>
         <input
          type="text"
          v-model="action.messageContent"
          class="input input-bordered input-sm w-full"
          placeholder="コメントの投稿"
         />
        </div>

        <!-- Word Party -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">🎉 WordParty</span>
         </label>
         <input
          type="text"
          v-model="action.wordParty"
          class="input input-bordered input-sm w-full"
          placeholder="WordParty"
         />
        </div>

        <!-- Message Toast -->
        <div class="form-control">
         <label class="label py-1">
          <span class="label-text text-sm">🍞 Message Toast</span>
         </label>
         <input
          type="text"
          v-model="action.messageToast"
          class="input input-bordered input-sm w-full"
          placeholder="トーストの表示"
         />
        </div>
       </div>
      </div>
     </div>
    </div>

    <div class="modal-action">
     <button @click="closeDialog" class="btn btn-ghost">キャンセル</button>
     <button @click="saveActions" class="btn btn-primary">保存</button>
    </div>
   </div>
  </dialog>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import { createDefaultPostAction, type PostActionType } from '@/types/OmikujiTypesSchema';
import { charactersMap } from '@/Characters/CharactersMap';
import { CharacterEmotion } from '@/types/PresetTypes';

// Props
const props = defineProps<{
 modelValue: PostActionType[];
}>();

// Emits
const emit = defineEmits<{
 'update:modelValue': [value: PostActionType[]];
}>();

// Refs
const dialog: Ref<HTMLDialogElement | null> = ref(null);
const editingActions: Ref<PostActionType[]> = ref([]);

// キャラクター
const characterOptions = computed(() => {
 return Object.entries(charactersMap).map(([key, character]) => ({
  value: key,
  label: character.name
 }));
});
const iconOptions = computed(() => {
 const selectedCharacterKey = editingActions.value.find(
  (action) => action.characterKey
 )?.characterKey;
 if (!selectedCharacterKey) {
  return [];
 }

 const character = charactersMap[selectedCharacterKey];
 if (!character) {
  return [];
 }

 const options: Array<{ value: string; label: string }> = [];

 // デフォルト画像
 options.push({
  value: `${selectedCharacterKey}:default`,
  label: `${character.name} (デフォルト)`
 });

 // 感情別画像
 Object.keys(character.image).forEach((emotion) => {
  if (emotion !== 'default') {
   const emotionLabels: Record<CharacterEmotion, string> = {
    happy: '喜び',
    excited: 'ワクワク',
    laughing: '爆笑',
    blushing: '照れ',
    surprised: '驚き',
    sad: '悲しみ',
    angry: '怒り',
    thinking: '考え中',
    wink: '茶目っ気',
    singing: '歌',
    sleepy: '眠い'
   };

   options.push({
    value: `${selectedCharacterKey}:${emotion}`,
    // @ts-ignore
    // 型 'string' の式を使用して型 'Record<CharacterEmotion, string>' にインデックスを付けることはできないため、要素は暗黙的に 'any' 型になります。
    label: `${character.name} (${emotionLabels[emotion] || emotion})`
   });
  }
 });

 return options;
});

const getCharacterLabel = (key: string): string => {
 const option = characterOptions.value.find((opt) => opt.value === key);
 return option ? option.label : key;
};

const getIconLabel = (key: string): string => {
 const option = iconOptions.value.find((opt) => opt.value === key);
 return option ? option.label : key;
};

// Dialog methods
const openDialog = () => {
 editingActions.value = JSON.parse(JSON.stringify(props.modelValue));
 dialog.value?.showModal();
};

const closeDialog = () => {
 dialog.value?.close();
 editingActions.value = [];
};

const saveActions = () => {
 emit('update:modelValue', [...editingActions.value]);
 closeDialog();
};

// Action management methods
const addAction = () => {
 editingActions.value.push(createDefaultPostAction());
};

const removeAction = (index: number) => {
 editingActions.value.splice(index, 1);
};

const duplicateAction = (index: number) => {
 const original = editingActions.value[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 editingActions.value.splice(index + 1, 0, duplicated);
};

// 遅延秒数でソートする機能
const sortByDelay = () => {
 editingActions.value.sort((a, b) => {
  const delayA = a.delaySeconds || 0;
  const delayB = b.delaySeconds || 0;
  return delayA - delayB;
 });
};
</script>
