<!-- src/configMaker/components/CommentRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RuleTabs
  :rules="rules"
  :selectedRule="selectedRule"
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
  <BaseSettingsEditor :modelValue="selectedRule" @update:modelValue="updateSelectedRule" />

  <!-- 外部スクリプト設定セクション -->
  <ExternalScriptEditor :modelValue="selectedRule" @update:modelValue="updateSelectedRule" />

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
import BaseSettingsEditor from './BaseSettingsEditor.vue';
import CommentThresholdEditor from './CommentThresholdEditor.vue';
import ExternalScriptEditor from './ExternalScriptEditor.vue';
import OmikujiSetEditor from './OmikujiSetEditor.vue';
import RuleTabs from './RuleTabs.vue';
import { CommentRuleType, TimerRuleType } from '@/types/OmikujiTypesSchema';

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

// これをコピペする
const updateSelectedRule = (updatedRule: CommentRuleType | TimerRuleType) => {
 if (selectedRule.value && selectedRule.value.id) {
  commentRulesStore.update(selectedRule.value.id, updatedRule as CommentRuleType);
 }
};

const deleteRule = (ruleId: string) => {
 commentRulesStore.remove(ruleId);
 // 最後のルールを削除した場合、新しいルールを自動作成
 setTimeout(() => {
  if (rules.value.length === 0) addNewRule();
 }, 0);
};
</script>
