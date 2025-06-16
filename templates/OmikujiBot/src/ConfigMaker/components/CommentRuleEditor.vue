<!-- src/configMaker/components/CommentRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RuleTabs
  :rules="rules"
  :selectedRule="selectedRule"
  ruleNamePrefix="ルール"
  ruleTypeName="コメントルール"
  emptyMessage="コメントルールがありません"
  @selectRule="selectRule"
  @addRule="addNewRule"
  @duplicateRule="duplicateRule"
  @moveRuleUp="moveRuleUp"
  @moveRuleDown="moveRuleDown"
  @deleteRule="deleteRule"
 />

 <!-- ルール編集エリア -->
 <div v-if="selectedRule">
  <!-- 基本設定セクション -->
  <div class="card bg-base-300 mt-4 relative">
   <!-- ヘッダー（タイトル＋右上スイッチ） -->
   <div
    class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex items-center justify-between"
   >
    <div class="flex items-center gap-2">
     <!-- エディターカラー（アイコン化） -->
     <button
      class="btn btn-sm btn-square"
      :style="{ backgroundColor: selectedRule.editorColor }"
      title="エディターカラー"
     >
      🎨
     </button>
     <span>基本設定</span>
    </div>
    <!-- ルール有効スイッチ -->
    <label class="cursor-pointer flex items-center gap-2">
     <input type="checkbox" v-model="selectedRule.isEnabled" class="toggle toggle-primary" />
     <span class="text-sm">ルールを有効にする</span>
    </label>
   </div>

   <!-- ボディ -->
   <div class="card-body">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
     <!-- 左カラム -->
     <div class="space-y-3">
      <!-- ルール名 -->
      <div class="form-control">
       <label class="label">
        <span class="label-text font-medium">ルール名</span>
       </label>
       <input
        type="text"
        v-model="selectedRule.name"
        placeholder="ルール名を入力"
        class="input input-bordered w-full"
       />
      </div>

      <!-- 説明 -->
      <div class="form-control">
       <label class="label">
        <span class="label-text font-medium">説明</span>
       </label>
       <input
        type="text"
        v-model="selectedRule.description"
        placeholder="ルールの説明を入力"
        class="input input-bordered w-full"
       />
      </div>
     </div>

     <!-- 右カラム -->
     <div class="space-y-3"></div>
    </div>
   </div>
  </div>

  <!-- しきい値設定セクション -->
  <CommentThresholdEditor v-model="selectedRule.threshold" />

  <!-- おみくじ設定セクション -->
  <OmikujiSetEditor v-model="selectedRule.omikuji" />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommentRulesStore } from '../script/useCommentRulesStore';
import { useOmikujiStore } from '../script/useOmikujiStore';
import CommentThresholdEditor from './CommentThresholdEditor.vue';
import OmikujiSetEditor from './OmikujiSetEditor.vue';
import RuleTabs from './RuleTabs.vue';

// ストアを使用
const commentRulesStore = useCommentRulesStore();
const omikujiStore = useOmikujiStore();

// computed
const selectedRule = computed(() => commentRulesStore.selectedRule);
const rules = computed(() => commentRulesStore.rules);

// methods
const selectRule = (ruleId: string) => {
 omikujiStore.selectCategory('comments');
 omikujiStore.selectRule(ruleId);
};

const addNewRule = () => {
 commentRulesStore.add();
};

const duplicateRule = (ruleId: string) => {
 commentRulesStore.duplicate(ruleId);
};

const moveRuleUp = (index: number) => {
 commentRulesStore.reorder(index, index - 1);
};

const moveRuleDown = (index: number) => {
 commentRulesStore.reorder(index, index + 1);
};

const deleteRule = (ruleId: string) => {
 commentRulesStore.remove(ruleId);
 // 最後のルールを削除した場合、新しいルールを自動作成
 setTimeout(() => {
  if (rules.value.length === 0) {
   addNewRule();
  }
 }, 0);
};
</script>
