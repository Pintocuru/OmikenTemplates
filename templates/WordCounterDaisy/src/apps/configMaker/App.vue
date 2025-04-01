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

  <!-- カウンターセット一覧と管理 -->
  <CounterSetManager />

  <!-- アクティブなカウンターセットの設定フォーム -->
  <div class="space-y-4" v-if="configStore.activeSet">
   <!-- 表示設定 (Generator Config) -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" checked />
    <div class="collapse-title text-lg font-semibold">表示設定 (Generator Config)</div>
    <div class="collapse-content">
     <GeneratorSettings :generator="configStore.activeSet.generator" />
    </div>
   </div>

   <!-- カウンター設定 -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold">カウンター設定 (Counter Config)</div>
    <div class="collapse-content">
     <CounterSettings :counter="configStore.activeSet.counter" />

     <!-- TODO v-ifを使い、「コメント数・ユーザー数」の場合はUserVisitsSettingsを表示する -->
     <!-- TODO 高評価数・視聴者数・配信開始時からの経過時間なら別のコンポーネント -->
     <UserVisitsSettings :userVisits="configStore.activeSet.userVisits" />
    </div>
   </div>

   <!-- WordParty設定 -->
   <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-lg font-semibold">WordParty設定 (WordParty Events)</div>
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
import GeneratorSettings from './components/GeneratorSettings.vue';
import CounterSettings from './components/CounterSettings.vue';
import UserVisitsSettings from './components/UserVisitsSettings.vue';
import PartyEventsSettings from './components/PartyEventsSettings.vue';
import ConfigPreview from './components/ConfigPreview.vue';
import CounterSetManager from './components/CounterSetManager.vue';

const configStore = useConfigMaker();
</script>
