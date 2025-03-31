<!-- src/apps/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-4xl mx-auto bg-base-100 shadow-lg rounded-lg">
  <h2 class="text-2xl font-bold mb-6 text-center text-primary">Counter Config Generator</h2>

  <!-- アクションボタン -->
  <div class="mb-4 flex justify-between">
   <div class="space-x-2">
    <button @click="configStore.generateConfig" class="btn btn-primary">config.js を生成</button>
   </div>
  </div>

  <!-- TODO 配列操作部分は別途コンポーネントを分離したい -->
  <!-- カウンターセット一覧と管理 -->
  <div class="mb-6">
   <div class="flex justify-between items-center mb-4">
    <h3 class="text-xl font-bold">カウンターセット一覧</h3>
    <button @click="configStore.addCounterSet" class="btn btn-sm btn-success">
     <span class="mr-1">+</span> 新規セット追加
    </button>
   </div>

   <!-- カウンターセットのタブナビゲーション -->
   <div class="tabs tabs-boxed mb-4">
    <a
     v-for="(set, index) in configStore.counterSets"
     :key="set.id"
     :class="['tab', { 'tab-active': configStore.activeSetIndex === index }]"
     @click="configStore.setActiveSet(index)"
    >
     {{ set.generator.title || `Set ${index + 1}` }}
    </a>
   </div>

   <!-- 選択中セットの操作ボタン -->
   <div class="flex justify-end space-x-2 mb-4" v-if="configStore.counterSets.length > 0">
    <button
     @click="configStore.moveSetUp(configStore.activeSetIndex)"
     class="btn btn-sm btn-outline"
     :disabled="configStore.activeSetIndex === 0"
    >
     ↑ 上へ
    </button>
    <button
     @click="configStore.moveSetDown(configStore.activeSetIndex)"
     class="btn btn-sm btn-outline"
     :disabled="configStore.activeSetIndex === configStore.counterSets.length - 1"
    >
     ↓ 下へ
    </button>
    <button
     @click="configStore.duplicateSet(configStore.activeSetIndex)"
     class="btn btn-sm btn-outline btn-info"
    >
     複製
    </button>
    <button
     @click="configStore.deleteSet(configStore.activeSetIndex)"
     class="btn btn-sm btn-outline btn-error"
     :disabled="configStore.counterSets.length <= 1"
    >
     削除
    </button>
   </div>
  </div>

  <!-- アクティブなカウンターセットの設定フォーム -->
  <div class="space-y-4" v-if="configStore.activeSet">
   <!-- 基本情報 (Information) -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" checked />
    <div class="collapse-title text-lg font-semibold text-base-content">基本情報 (Information)</div>
    <div class="collapse-content">
     <CounterSetInfo :counterSet="configStore.activeSet" />
    </div>
   </div>

   <!-- 表示設定 (Generator Config) -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold text-base-content">
     表示設定 (Generator Config)
    </div>
    <div class="collapse-content">
     <GeneratorSettings :generator="configStore.activeSet.generator" />
    </div>
   </div>

   <!-- カウンター設定 -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold text-base-content">
     カウンター設定 (Counter Config)
    </div>
    <div class="collapse-content">
     <CounterSettings :counter="configStore.activeSet.counter" />
    </div>
   </div>

   <!-- ユーザー訪問設定 -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold text-base-content">
     ユーザー訪問設定 (User Visits Config)
    </div>
    <div class="collapse-content">
     <UserVisitsSettings :userVisits="configStore.activeSet.userVisits" />
    </div>
   </div>

   <!-- パーティーイベント設定 -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold text-base-content">
     パーティーイベント設定 (Party Events)
    </div>
    <div class="collapse-content">
     <PartyEventsSettings :counter="configStore.activeSet.counter" />
    </div>
   </div>
  </div>

  <!-- プレビュー領域 -->
  <div v-if="configStore.showPreview" class="mt-6 p-4 bg-base-200 rounded-lg">
   <h3 class="text-lg font-semibold mb-2">プレビュー</h3>
   <ConfigPreview />
  </div>
 </div>
</template>

<script setup lang="ts">
import { useConfigMaker } from './components/useConfigMaker';
import CounterSetInfo from './components/CounterSetInfo.vue';
import GeneratorSettings from './components/GeneratorSettings.vue';
import CounterSettings from './components/CounterSettings.vue';
import UserVisitsSettings from './components/UserVisitsSettings.vue';
import PartyEventsSettings from './components/PartyEventsSettings.vue';
import ConfigPreview from './components/ConfigPreview.vue';

const configStore = useConfigMaker();
</script>
