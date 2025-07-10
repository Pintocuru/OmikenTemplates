<!-- src/configMaker/components/TimerRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RuleTabs :rules="rulesArray" :selectedRule="selectedRule" ruleType="timers" />

 <!-- ルール編集エリア -->
 <div v-if="selectedRule">
  <!-- 基本設定セクション -->
  <BaseSettingsEditor :modelValue="selectedRule" @update:modelValue="updateSelectedRule" />

  <!-- タイマー設定セクション -->
  <TimerIntervalEditor v-model="selectedRule" />

  <!-- おみくじ設定セクション -->
  <OmikujiSetEditor v-model="selectedRule.omikuji" />
 </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { RuleType, TimerRuleType } from '@/types/OmikujiTypesSchema';
import TimerIntervalEditor from './TimerIntervalEditor.vue';
import OmikujiSetEditor from '@/ConfigMaker/components/comments/OmikujiSetEditor.vue';
import RuleTabs from '@/ConfigMaker/components/parts/RuleTabs.vue';
import BaseSettingsEditor from '@/ConfigMaker/components/comments/BaseSettingsEditor.vue';
import { useTimerRulesStore } from '@/ConfigMaker/script/useTimerRulesStore';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';

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
const rulesArray = computed(() => timerRulesStore.rulesArray);

// methods - 編集フォームで使用
const updateSelectedRule = (updatedRule: RuleType) => {
 if (selectedRule.value && selectedRule.value.id) {
  timerRulesStore.update(selectedRule.value.id, updatedRule as TimerRuleType);
 }
};
</script>
