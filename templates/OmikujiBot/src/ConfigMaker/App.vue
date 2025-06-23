<!-- src/apps/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">おみくじBot コンフィグエディター</h1>

  <!-- アクションボタンとプリセット -->
  <div class="mb-4">
   <!-- プリセットコンポーネント -->
   <ConfigPresets />
  </div>

  <!-- コメントでのおみくじ -->
  <div class="card bg-base-200">
   <div class="card-title bg-primary text-lg p-2 pl-4 rounded-t">コメントルール設定</div>
   <div class="card-body">
    <CommentRuleEditor />
   </div>
  </div>

  <hr class="my-8" />

  <!-- タイマーでのおみくじ -->
  <div class="card bg-base-200">
   <div class="card-title bg-primary text-lg p-2 pl-4 rounded-t">タイマールール設定</div>
   <div class="card-body">
    <TimerRuleEditor />
   </div>
  </div>

  <hr class="my-8" />

  <!-- プレースホルダー -->
  <div class="card bg-base-200">
   <div class="card-title bg-primary text-lg p-2 pl-4 rounded-t">プレースホルダー設定</div>
   <div class="card-body">
    <PlaceholderEditor />
   </div>
  </div>
 </div>

 <!-- トースト通知コンポーネント -->
 <Toaster
  position="top-right"
  :expand="true"
  :richColors="true"
  :visibleToasts="5"
  :z-index="9999999"
  class="z-[9999999]"
 />
</template>

<script setup lang="ts">
import ConfigPresets from './components/ConfigPresets.vue';
import CommentRuleEditor from './components/CommentRuleEditor.vue';
import TimerRuleEditor from './components/TimerRuleEditor.vue';
import PlaceholderEditor from './components/PlaceholderEditor.vue';
import { Toaster } from 'vue-sonner';
</script>
