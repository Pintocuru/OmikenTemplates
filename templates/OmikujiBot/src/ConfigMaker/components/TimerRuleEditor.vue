<!-- src/configMaker/components/TimerRuleEditor.vue -->
<template>
 <div class="space-y-4">
  <div class="collapse-title text-lg font-semibold">タイマールール設定</div>

  <!-- タブ部分 -->
  <RuleTabs
   :rules="rules"
   :selectedRule="selectedRule"
   ruleNamePrefix="タイマー"
   ruleTypeName="タイマールール"
   emptyMessage="タイマールールがありません"
   @selectRule="selectRule"
   @addRule="addNewRule"
   @duplicateRule="duplicateRule"
   @moveRuleUp="moveRuleUp"
   @moveRuleDown="moveRuleDown"
   @deleteRule="deleteRule"
  />

  <!-- ルール編集エリア -->
  <div v-if="selectedRule" class="space-y-4">
   <!-- 基本設定セクション -->
   <div class="card bg-base-200 p-4">
    <h3 class="text-md font-semibold mb-3">基本設定</h3>
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
       <textarea
        v-model="selectedRule.description"
        placeholder="ルールの説明を入力"
        class="textarea textarea-bordered w-full"
        rows="3"
       ></textarea>
      </div>
     </div>

     <!-- 右カラム -->
     <div class="space-y-3">
      <!-- 有効/無効 -->
      <div class="card bg-base-100 p-3">
       <label class="cursor-pointer label justify-start gap-2">
        <input type="checkbox" v-model="selectedRule.isEnabled" class="toggle toggle-primary" />
        <span class="label-text">ルールを有効にする</span>
       </label>
      </div>

      <!-- エディターカラー -->
      <div class="form-control">
       <label class="label">
        <span class="label-text font-medium">エディターカラー</span>
       </label>
       <input
        type="color"
        v-model="selectedRule.editorColor"
        class="input input-bordered w-full h-12"
       />
      </div>

      <!-- 実行順序 -->
      <div class="form-control">
       <label class="label">
        <span class="label-text font-medium">実行順序</span>
       </label>
       <input
        type="number"
        v-model.number="selectedRule.order"
        min="0"
        class="input input-bordered w-full"
       />
      </div>
     </div>
    </div>
   </div>

   <!-- タイマー設定セクション -->
   <TimerIntervalEditor v-model="selectedRule.intervalSeconds" />

   <!-- おみくじ設定セクション -->
   <OmikujiSetEditor v-model="selectedRule.omikuji" />
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTimerRulesStore } from '../script/useTimerRulesStore';
import { useOmikujiStore } from '../script/useOmikujiStore';
import TimerIntervalEditor from './TimerIntervalEditor.vue';
import OmikujiSetEditor from './OmikujiSetEditor.vue';
import RuleTabs from './RuleTabs.vue';

// ストアを使用
const timerRulesStore = useTimerRulesStore();
const omikujiStore = useOmikujiStore();

// computed
const selectedRule = computed(() => timerRulesStore.selectedRule);
const rules = computed(() => timerRulesStore.rules);

// methods
const selectRule = (ruleId: string) => {
 omikujiStore.selectCategory('timers');
 omikujiStore.selectRule(ruleId);
};

const addNewRule = () => {
 timerRulesStore.add();
};

const duplicateRule = (ruleId: string) => {
 timerRulesStore.duplicate(ruleId);
};

const moveRuleUp = (index: number) => {
 timerRulesStore.reorder(index, index - 1);
};

const moveRuleDown = (index: number) => {
 timerRulesStore.reorder(index, index + 1);
};

const deleteRule = (ruleId: string) => {
 timerRulesStore.remove(ruleId);
 // 最後のルールを削除した場合、新しいルールを自動作成
 setTimeout(() => {
  if (rules.value.length === 0) {
   addNewRule();
  }
 }, 0);
};
</script>
