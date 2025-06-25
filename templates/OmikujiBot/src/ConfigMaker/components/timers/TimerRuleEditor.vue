<!-- src/configMaker/components/TimerRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RuleTabs :rules="rules" :selectedRule="selectedRule" ruleType="timers" />

 <!-- ルール編集エリア -->
 <div v-if="selectedRule">
  <!-- 基本設定セクション -->
  <BaseSettingsEditor :modelValue="selectedRule" @update:modelValue="updateSelectedRule" />

  <!-- タイマー設定セクション -->
  <TimerIntervalEditor v-model="selectedRule.intervalSeconds" />

  <!-- おみくじ設定セクション -->
  <OmikujiSetEditor v-model="selectedRule.omikuji" />
 </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { useTimerRulesStore } from '@ConfigScript/useTimerRulesStore';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import TimerIntervalEditor from './TimerIntervalEditor.vue';
import OmikujiSetEditor from '@ConfigComponents/comments/OmikujiSetEditor.vue';
import RuleTabs from '@ConfigComponents/parts/RuleTabs.vue';
import BaseSettingsEditor from '@ConfigComponents/comments/BaseSettingsEditor.vue';
import { CommentRuleType, TimerRuleType } from '@/types/OmikujiTypesSchema';

// ストアを使用
const timerRulesStore = useTimerRulesStore();
const omikujiStore = useOmikujiStore();

// RuleTabsコンポーネントで使用するstore機能を拡張
const extendedStore = {
 ...timerRulesStore,
 selectRule: (ruleId: string) => {
  omikujiStore.selectCategory('timers');
  omikujiStore.selectRule(ruleId);
 }
};
provide('timersRulesStore', extendedStore);

// computed
const selectedRule = computed(() => timerRulesStore.selectedRule);
const rules = computed(() => timerRulesStore.rules);

// methods - 編集フォームで使用
const updateSelectedRule = (updatedRule: CommentRuleType | TimerRuleType) => {
 if (selectedRule.value && selectedRule.value.id) {
  timerRulesStore.update(selectedRule.value.id, updatedRule as TimerRuleType);
 }
};
</script>
