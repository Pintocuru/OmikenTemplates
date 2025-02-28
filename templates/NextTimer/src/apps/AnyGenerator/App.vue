<!-- src/App.vue -->
<template>
 <AnyGenerator
  :isInitFlag="isInitFlag"
  :nextTimer="userCommentsMap.nextTimer || []"
  :timeConfig="timeConfig"
 />
</template>

<script setup lang="ts">
// 読み込ませるコンポーネント
import AnyGenerator from '@components/WesternDuel.vue';
// その他
import { onMounted } from 'vue';
import { CommentGet } from '@common/CommentGet';
import { ServiceAPI } from '@common/api/ServiceAPI';
import { ConfigType } from '@common/commonTypes';
import {
 TIME_PATTERN,
 NextTimerConfigType,
 MINUTES_ONLY_PATTERN,
 RELATIVE_TIME_PATTERN
} from '@/scripts/types';

// 定数
const config: ConfigType = {
 PLUGIN_UID: null, // プラグインなし
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 USER_ALLOWED_IDS: window.CONFIG?.USER_ALLOWED_IDS || [], // 通すuserIDリスト
 USER_DISALLOWED_IDS: window.CONFIG?.USER_DISALLOWED_IDS || [], // 通さないuserIDリスト
 USER_ACCESS_LEVEL: window.CONFIG?.USER_ACCESS_LEVEL || 3, // アクセスレベル
 USER_WORD_MATCH: [
  {
   id: 'nextTimer',
   isGift: false,
   keywords: [],
   regex: [TIME_PATTERN, MINUTES_ONLY_PATTERN, RELATIVE_TIME_PATTERN]
  }
 ]
};

// スナイプタイマー用設定
const timeConfig: NextTimerConfigType = {
 ALWAYS_VISIBLE: window.TIME_CONFIG?.ALWAYS_VISIBLE || false, // 常時表示させるか
 MIN_SECONDS: window.TIME_CONFIG?.MIN_SECONDS || 10, // タイマーの最低値(秒)
 MAX_SECONDS: window.TIME_CONFIG?.MAX_SECONDS || 300, // タイマーの最大値(秒)
 AFTER_SHOW: window.TIME_CONFIG?.AFTER_SHOW || 5, // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: window.TIME_CONFIG?.SECOND_ADJUST || 10, // 秒数を丸める(default=10秒単位)
 COUNT_PARTY: window.TIME_CONFIG?.COUNT_PARTY || {}, // WordPartyの発火タイミング
 COUNT_PARTY_START: window.TIME_CONFIG?.COUNT_PARTY_START || '', // タイマー起動時に発火するWordParty
 COUNT_PARTY_FINISH: window.TIME_CONFIG?.COUNT_PARTY_FINISH || '' // タイマー0で発火するWordParty
};

// コンポーザブル
const { isInitFlag, initOneSDK, userCommentsMap } = CommentGet();

// わんコメから枠情報を取得し、1枠以上あるならわんコメ対応
(async () => {
 const response = await new ServiceAPI().getServices();
 if (response) await initOneSDK(config);
 else isInitFlag.value = false; // わんコメ対応なし
})();

onMounted(() => {
 document.body.removeAttribute('hidden'); // hiddenの削除
});
</script>

<style>
/* ビューポート全体を占める */
#App {
 height: 100vh;
 display: flex;
 flex-direction: column;
}
</style>
