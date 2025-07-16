<!-- src/ConfigMaker/components/display/DisplaySettingsEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">表示設定</div>
  <div class="card-body">
   <!-- 表示サイズ -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">表示サイズ</span>
    </label>
    <select v-model="displaySettings.displaySize" class="select select-bordered w-full max-w-xs">
     <option value="xs">XS (極小)</option>
     <option value="sm">SM (小)</option>
     <option value="md">MD (中)</option>
     <option value="lg">LG (大)</option>
     <option value="xl">XL (特大)</option>
    </select>
   </div>

   <!-- トースト表示 -->
   <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="displaySettings.toastEnabled"
      type="checkbox"
      class="checkbox checkbox-primary"
     />
     <span class="label-text">トースト通知を表示する</span>
    </label>
   </div>

   <!-- モード切り替えパネル -->
   <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="displaySettings.hideModeSwitch"
      type="checkbox"
      class="checkbox checkbox-primary"
     />
     <span class="label-text">モード切り替えパネルを非表示にする</span>
    </label>
   </div>
  </div>
 </div>

 <!-- デフォルトモード設定 -->
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">起動時設定</div>
  <div class="card-body">
   <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
     <input v-model="useDefaultMode" type="checkbox" class="checkbox checkbox-primary" />
     <span class="label-text">起動時のデフォルトモードを指定する</span>
    </label>
   </div>

   <div v-if="useDefaultMode" class="mt-4 space-y-3">
    <!-- モード選択 -->
    <div class="form-control">
     <label class="label">
      <span class="label-text font-medium">モード</span>
     </label>
     <select v-model="defaultModeType" class="select select-bordered w-full max-w-xs">
      <option value="messages">メッセージ</option>
      <option value="userVisits">ユーザー訪問履歴</option>
      <option value="scriptGame">スクリプトゲーム</option>
     </select>
    </div>

    <!-- スクリプトキー（スクリプトゲーム選択時のみ） -->
    <div v-if="defaultModeType === 'scriptGame'" class="form-control">
     <label class="label">
      <span class="label-text font-medium">スクリプトキー</span>
     </label>
     <input
      v-model="defaultModeScriptKey"
      type="text"
      class="input input-bordered w-full max-w-xs"
      placeholder="スクリプトキーを入力"
     />
    </div>
   </div>
  </div>
 </div>

 <!-- 表示モード設定 -->
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">表示モード設定</div>
  <div class="card-body">
   <!-- メッセージモード -->
   <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="displaySettings.enabledModes.messages"
      type="checkbox"
      class="checkbox checkbox-primary"
     />
     <span class="label-text">メッセージモードを有効にする</span>
    </label>
   </div>

   <!-- ユーザー訪問履歴モード -->
   <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="displaySettings.enabledModes.userVisits"
      type="checkbox"
      class="checkbox checkbox-primary"
     />
     <span class="label-text">ユーザー訪問履歴モードを有効にする</span>
    </label>
   </div>

   <!-- スクリプトゲーム設定 -->
   <div class="mt-4">
    <h4 class="font-medium mb-3">スクリプトゲーム設定</h4>

    <div class="form-control mb-3">
     <label class="label">
      <span class="label-text">新しいスクリプトキー</span>
     </label>
     <div class="flex gap-2">
      <input
       v-model="newScriptKey"
       type="text"
       class="input input-bordered flex-1"
       placeholder="スクリプトキーを入力"
       @keyup.enter="addScriptGame"
      />
      <button @click="addScriptGame" class="btn btn-primary" :disabled="!newScriptKey.trim()">
       追加
      </button>
     </div>
    </div>

    <div class="space-y-2">
     <div
      v-for="(enabled, scriptKey) in displaySettings.enabledModes.scriptGames"
      :key="scriptKey"
      class="flex items-center justify-between p-2 bg-base-200 rounded"
     >
      <label class="label cursor-pointer justify-start gap-3">
       <input
        v-model="displaySettings.enabledModes.scriptGames[scriptKey]"
        type="checkbox"
        class="checkbox checkbox-primary"
       />
       <span class="label-text">{{ scriptKey }}</span>
      </label>
      <button @click="removeScriptGame(scriptKey)" class="btn btn-sm btn-error">削除</button>
     </div>
    </div>
   </div>
  </div>
 </div>

 <!-- 自動切り替え設定 -->
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">自動切り替え設定</div>
  <div class="card-body">
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">自動切り替え間隔</span>
    </label>
    <select
     v-model.number="displaySettings.autoSwitchInterval"
     class="select select-bordered w-full max-w-xs"
    >
     <option :value="0">切り替えしない</option>
     <option :value="15">15秒</option>
     <option :value="30">30秒</option>
     <option :value="60">1分</option>
     <option :value="120">2分</option>
     <option :value="180">3分</option>
     <option :value="300">5分</option>
    </select>
   </div>

   <div class="alert alert-info mt-3">
    <span class="text-sm">
     注意: メッセージモードは通常何も表示されないため、自動切り替えの対象外です。
    </span>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定の参照
const displaySettings = computed(() => data.value.displaySettings);

// デフォルトモード設定用の補助変数
const useDefaultMode = computed({
 get: () => !!displaySettings.value.defaultMode,
 set: (value: boolean) => {
  if (value) {
   displaySettings.value.defaultMode = {
    type: 'messages'
   };
  } else {
   displaySettings.value.defaultMode = undefined;
  }
 }
});

const defaultModeType = computed({
 get: () => displaySettings.value.defaultMode?.type || 'messages',
 set: (value: 'messages' | 'userVisits' | 'scriptGame') => {
  if (displaySettings.value.defaultMode) {
   displaySettings.value.defaultMode.type = value;
   if (value !== 'scriptGame') {
    displaySettings.value.defaultMode.scriptKey = undefined;
   }
  }
 }
});

const defaultModeScriptKey = computed({
 get: () => displaySettings.value.defaultMode?.scriptKey || '',
 set: (value: string) => {
  if (displaySettings.value.defaultMode) {
   displaySettings.value.defaultMode.scriptKey = value || undefined;
  }
 }
});

// スクリプトゲーム追加用
const newScriptKey = ref('');

const addScriptGame = () => {
 const key = newScriptKey.value.trim();
 if (key && !displaySettings.value.enabledModes.scriptGames[key]) {
  displaySettings.value.enabledModes.scriptGames[key] = true;
  newScriptKey.value = '';
 }
};

const removeScriptGame = (scriptKey: string) => {
 delete displaySettings.value.enabledModes.scriptGames[scriptKey];
};
</script>
