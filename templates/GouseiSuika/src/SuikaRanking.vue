<!-- src/SuikaRanking.vue -->
<template>
 <div class="container mx-auto p-4">
  <SuikaResult
   v-if="displayState.Resultflag"
   :score="displayState.Result.score"
   :name="displayState.Result.name"
  />
  <SuikaRankingList
   :rankings="displayState.rankings"
   :average-point="
    displayState.totalPoint > 0
     ? Number((displayState.totalPoint / displayState.totalCount).toFixed(0))
     : 0
   "
   :total-count="displayState.totalDraws"
   :total-point="displayState.totalPoint"
  />
 </div>
</template>

<script setup lang="ts">
import { useGameState } from './useGameState';
import { useCommentHandler } from './useCommentHandler';
import SuikaResult from './SuikaResult.vue';
import SuikaRankingList from './SuikaRankingList.vue';
import type { CommentChara, ConfigType } from '@common/commonTypes';
import { getGameData } from '@common/ApiHandler';

const props = defineProps<{
 filterComments: CommentChara[];
 config: ConfigType;
}>();

const { gameState, displayState, displayGameResult } = useGameState();

const { playSuikaGame } = useCommentHandler(gameState);

// コンポーネントマウント時の処理
onMounted(async () => {
 const { PLUGIN_UID, PLUGIN_RULE_ID } = props.config;

 // プラグインが存在する場合、初期データを取得
 if (PLUGIN_UID && PLUGIN_RULE_ID) {
  const result = await getGameData(PLUGIN_UID, PLUGIN_RULE_ID);
  if (result) displayGameResult(result, -2000); // プラグインと同じ遅延設定
 }
});

// ウォッチャーでコメント処理とゲーム状態の更新を行う
watch(
 () => props.filterComments, // 監視対象
 (newValue) => {
  const { PLUGIN_UID, PLUGIN_RULE_ID } = props.config;
  newValue.forEach(async (comment: CommentChara) => {
   let result;

   // プラグインがある場合はAPIからデータを取得
   if (PLUGIN_UID && PLUGIN_RULE_ID) {
    result = await getGameData(PLUGIN_UID, PLUGIN_RULE_ID);
   } else {
    // プラグインがない場合はテンプレート側でゲームを行う
    result = playSuikaGame(comment);
   }

   // 遅延設定(プラグインはコメント到着と同時に表示)
   const displayDelay = PLUGIN_UID ? -2000 : 3500;
   if (result) displayGameResult(result, displayDelay);
  });
 },
 { deep: true }
);
</script>
