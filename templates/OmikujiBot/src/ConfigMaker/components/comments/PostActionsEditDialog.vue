<!-- src/configMaker/components/PostActionsEditDialog.vue -->
<template>
 <dialog ref="dialogRef" class="modal">
  <div class="modal-box max-w-max">
   <!-- プレースホルダーリスト表示 -->
   <PlaceholderList :actions="editingActions" />

   <!-- Post編集ダイアログ -->
   <div class="card bg-base-300 mt-4">
    <!-- タイトルバー -->
    <div class="flex justify-between items-center bg-primary text-white rounded-t px-4 py-2">
     <h3 class="text-lg font-semibold">Post Actions 編集</h3>
     <div class="flex gap-2">
      <button @click="addAction" class="btn btn-sm btn-accent">➕ 追加</button>
      <button @click="sortByDelay" class="btn btn-sm btn-secondary">⏱️ 時間順ソート</button>
     </div>
    </div>

    <!-- 本体 -->
    <div class="card-body p-2">
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
       <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 max-w-screen-md">
        <!-- キャラクター -->
        <div class="form-control">
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
        <div class="form-control">
         <label class="label py-0">
          <span class="label-text text-xs">🎨 アイコン</span>
         </label>
         <select v-model="action.iconKey" class="select select-bordered select-sm w-full">
          <option
           v-for="icon in getIconOptionsForAction(action)"
           :key="icon.value"
           :value="icon.value"
          >
           {{ icon.label }}
          </option>
         </select>
        </div>

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
         <input
          type="text"
          v-model="action.wordParty"
          class="input input-bordered input-sm w-2/3"
          placeholder="WordParty"
         />
        </div>
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
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import {
 CharacterPresetType,
 createDefaultPostAction,
 type PostActionType
} from '@/types/OmikujiTypesSchema';
import { type CharacterEmotion } from '@/types/PresetTypes';
import PlaceholderList from '@/ConfigMaker/components/placeholders/PlaceholderList.vue';

// Props
const props = defineProps<{
 actions: PostActionType[];
 charactersArray: CharacterPresetType[];
}>();

// Emits
const emit = defineEmits<{
 'update:actions': [value: PostActionType[]];
}>();

// Refs
const dialogRef: Ref<HTMLDialogElement | null> = ref(null);
const editingActions: Ref<PostActionType[]> = ref([]);

// キャラクター選択肢
const characterOptions = computed(() => {
 return props.charactersArray.map((character) => ({
  value: character.id,
  label: character.name
 }));
});

// 感情ラベルマップ
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

// 特定のアクションに対するアイコン選択肢を取得
const getIconOptionsForAction = (action: PostActionType) => {
 const selectedCharacterKey = action.characterKey;
 if (!selectedCharacterKey) {
  return [];
 }

 const character = props.charactersArray.find((char) => char.id === selectedCharacterKey);
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
   const emotionKey = emotion as CharacterEmotion;
   options.push({
    value: `${emotion}`,
    label: `${character.name} (${emotionLabels[emotionKey] || emotion})`
   });
  }
 });

 return options;
};

// Dialog methods
const open = () => {
 editingActions.value = JSON.parse(JSON.stringify(props.actions));
 dialogRef.value?.showModal();
};

const closeDialog = () => {
 dialogRef.value?.close();
 editingActions.value = [];
};

const saveActions = () => {
 emit('update:actions', [...editingActions.value]);
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

// Expose open method for parent component
defineExpose({
 open
});
</script>
