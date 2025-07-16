<!-- src/configMaker/components/comments/CommentRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RuleTabs :rules="rulesArray" :selectedRule="selectedRule" ruleType="comments" />

 <!-- ルール編集エリア -->
 <div v-if="selectedRule">
  <!-- 基本設定セクション -->
  <BaseSettingsEditor v-model="selectedRule" />

  <!-- 外部スクリプト設定セクション -->
  <ExternalScriptEditor v-model="selectedRule" />

  <!-- 条件設定セクション -->
  <CommentThresholdEditor v-model="selectedRule.threshold" />

  <!-- おみくじ設定セクション -->
  <OmikujiSetEditor v-model="selectedRule.omikuji" />
 </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { CommentRuleType, RuleType } from '@type/';
import BaseSettingsEditor from './BaseSettingsEditor.vue';
import CommentThresholdEditor from './CommentThresholdEditor.vue';
import ExternalScriptEditor from './ExternalScriptEditor.vue';
import OmikujiSetEditor from './OmikujiSetEditor.vue';
import RuleTabs from '@ConfigComponents/parts/RuleTabs.vue';
import { useCommentRulesStore } from '@ConfigScript/useCommentRulesStore';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';

// ストアを使用
const commentRulesStore = useCommentRulesStore();
const omikujiStore = useOmikujiStore();

// RuleTabsコンポーネントで使用するstore機能を拡張
const extendedStore = {
 ...commentRulesStore,
 selectRule: (ruleId: string) => {
  omikujiStore.selectCategory('comments');
  omikujiStore.selectRule(ruleId);
 }
};
provide('commentsRulesStore', extendedStore);

// computed
const selectedRule = computed({
 get: () => commentRulesStore.selectedRule,
 set: (newValue: RuleType) => {
  if (commentRulesStore.selectedRule && commentRulesStore.selectedRule.id) {
   commentRulesStore.update(commentRulesStore.selectedRule.id, newValue as CommentRuleType);
  }
 }
});
const rulesArray = computed(() => commentRulesStore.rulesArray);

// methods - 編集フォームで使用
const updateSelectedRule = (updatedRule: RuleType) => {
 if (selectedRule.value && selectedRule.value.id) {
  commentRulesStore.update(selectedRule.value.id, updatedRule as CommentRuleType);
 }
};
</script>
