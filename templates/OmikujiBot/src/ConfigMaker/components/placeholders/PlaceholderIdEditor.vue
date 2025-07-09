<!-- src/configMaker/components/PlaceholderIdEditor.vue -->
<template>
 <div>
  <!-- IDエディタボタン -->
  <button @click="openDialog" class="btn btn-sm btn-outline" title="IDを編集">📝 ID編集</button>

  <!-- ダイアログ -->
  <div v-if="isDialogOpen" class="modal modal-open">
   <div class="modal-box">
    <h3 class="font-bold text-lg">{{ dialogTitle }}ID編集</h3>

    <div class="py-4">
     <div class="form-control">
      <label class="label">
       <span class="label-text">現在のID</span>
      </label>
      <div class="input input-bordered bg-base-200 text-gray-600">
       {{ currentId }}
      </div>
     </div>

     <div class="form-control mt-4">
      <label class="label">
       <span class="label-text">新しいID</span>
      </label>
      <input
       type="text"
       v-model="newId"
       placeholder="新しいIDを入力"
       class="input input-bordered"
       :class="{ 'input-error': hasError }"
       @input="validateId"
      />
      <label class="label" v-if="hasError">
       <span class="label-text-alt text-error">{{ errorMessage }}</span>
      </label>
     </div>

     <!-- キャラクターモードの場合、使用箇所を表示 -->
     <div v-if="mode === 'character' && characterUsage" class="mt-4">
      <div class="alert alert-info">
       <span class="text-sm">
        📊 このキャラクターの使用状況:
        <ul class="list-disc list-inside mt-2">
         <li v-if="characterUsage.comments.length > 0">
          コメントルール: {{ characterUsage.comments.length }}箇所
         </li>
         <li v-if="characterUsage.timers.length > 0">
          タイマールール: {{ characterUsage.timers.length }}箇所
         </li>
         <li v-if="characterUsage.comments.length === 0 && characterUsage.timers.length === 0">
          使用されていません
         </li>
        </ul>
       </span>
      </div>
     </div>

     <div class="alert alert-warning mt-4">
      ⚠️
      <span class="text-sm">
       IDを変更すると、この{{
        mode === 'character' ? 'キャラクター' : 'プレースホルダー'
       }}を参照している他の設定も影響を受ける可能性があります。
       <span v-if="mode === 'character'">
        <br />キャラクターの場合、コメントルールとタイマールールの投稿アクションも自動的に更新されます。
       </span>
      </span>
     </div>
    </div>

    <div class="modal-action">
     <button @click="closeDialog" class="btn btn-ghost">キャンセル</button>
     <button
      @click="saveId"
      class="btn btn-primary"
      :disabled="hasError || !newId.trim() || newId === currentId"
     >
      保存
     </button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePlaceholderStore } from '@/ConfigMaker/script/usePlaceholderStore';
import { useCharacterStore } from '@/ConfigMaker/script/useCharacterStore';

// Props
const props = defineProps<{
 currentId: string;
 mode: 'placeholder' | 'character';
}>();

// ストアを使用
const characterStore = useCharacterStore();
const placeholderStore = usePlaceholderStore();

// リアクティブデータ
const isDialogOpen = ref(false);
const newId = ref('');
const errorMessage = ref('');
const characterUsage = ref<{ comments: string[]; timers: string[] } | null>(null);

// computed
const hasError = computed(() => errorMessage.value !== '');

const dialogTitle = computed(() => {
 return props.mode === 'character' ? 'キャラクター' : 'プレースホルダー';
});

// 既存のIDリストを取得（重複チェック用）
const existingIds = computed(() => {
 if (props.mode === 'character') {
  return Object.keys(characterStore.rulesMap);
 } else {
  return Object.keys(placeholderStore.rulesMap);
 }
});

// メソッド
const openDialog = () => {
 newId.value = props.currentId;
 errorMessage.value = '';
 isDialogOpen.value = true;

 // キャラクターモードの場合、使用箇所を取得
 if (props.mode === 'character') {
  characterUsage.value = characterStore.getCharacterUsage(props.currentId);
 }
};

const closeDialog = () => {
 isDialogOpen.value = false;
 newId.value = '';
 errorMessage.value = '';
 characterUsage.value = null;
};

const validateId = () => {
 const id = newId.value.trim();

 if (!id) {
  errorMessage.value = 'IDを入力してください';
  return;
 }

 if (id === props.currentId) {
  errorMessage.value = '';
  return;
 }

 // ID形式チェック（英数字とアンダースコア、ハイフンのみ）
 if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
  errorMessage.value = 'IDは英数字、アンダースコア(_)、ハイフン(-)のみ使用可能です';
  return;
 }

 // 既存IDとの重複チェック
 if (existingIds.value.includes(id)) {
  errorMessage.value = 'このIDは既に使用されています';
  return;
 }

 errorMessage.value = '';
};

const saveId = () => {
 if (hasError.value || !newId.value.trim() || newId.value === props.currentId) {
  return;
 }

 let success = false;

 if (props.mode === 'character') {
  // キャラクターストアで直接ID更新を実行
  success = characterStore.updateCharacterId(props.currentId, newId.value.trim());
 } else {
  // プレースホルダーストアで直接ID更新を実行
  success = placeholderStore.updatePlaceholderId(props.currentId, newId.value.trim());
 }

 if (success) {
  closeDialog();
 } else {
  // 更新に失敗した場合のエラーハンドリング
  errorMessage.value = 'ID更新に失敗しました';
 }
};

// propsの変更を監視して、キャラクターの使用状況を更新
watch(
 () => props.currentId,
 (newCurrentId) => {
  if (props.mode === 'character' && isDialogOpen.value) {
   characterUsage.value = characterStore.getCharacterUsage(newCurrentId);
  }
 }
);
</script>
