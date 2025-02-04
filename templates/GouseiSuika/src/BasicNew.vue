<!-- src/BasicNew.vue -->
<template>
 <div id="container" class="container">
  <!-- SUIKA:合成大西瓜(スイカゲーム) -->
  <div v-if="gameStats.SUIKA.Resultflag" class="SUIKA_bubble">
   <div class="SUIKA_bubble_title">スコア</div>
   <div class="SUIKA_bubble_score">{{ gameStats.SUIKA.Result.score }}</div>
   <div class="SUIKA_bubble_name">{{ gameStats.SUIKA.Result.name }}</div>
  </div>
  <!-- FRUIT:フルーツ占い -->
  <div v-if="gameStats.FRUIT.Resultflag" class="fruit-bubble">
   <div class="fruit-result fruit-username">{{ gameStats.FRUIT.Result.User }}<span>さん</span></div>
   <div class="fruit-result fruit-name">
    {{ gameStats.FRUIT.Result.userFruit }}{{ gameStats.FRUIT.Result.userFruitEmoji }}
   </div>
   <div class="fruit-result fruit-rank">{{ gameStats.FRUIT.Result.rank }}<span>位</span></div>
   <div class="fruit-result fruit-lucky-item-label">ラッキーアイテム</div>
   <div class="fruit-result fruit-lucky-item">{{ gameStats.FRUIT.Result.luckyItem }}</div>
  </div>
  <div class="SUIKA_score-ranking">
   <div class="SUIKA_ranking-title">🍉<span class="SUIKA_ranking-title2">スイカランキング</span>🍉</div>
   <ul>
    <li v-for="(player, index) in SUIKAViewPlayers" :key="index">
     <template v-if="index < 3">
      <!-- 1位から3位までの場合 -->
      <img :src="`img/image_${index + 1}.png`" :alt="`${index + 1}位の画像`" class="ranking-image" />
     </template>
     <template v-else>
      <!-- 4位以降の場合 -->
      <span class="SUIKA_ranking-text">[{{ index + 1 }}]</span>
     </template>
     <span class="SUIKA_player-info">
      <span class="player-score">{{ player.score }} </span>
      <span class="SUIKA_player-name">({{ player.name }})</span>
     </span>
    </li>
   </ul>
   <div class="SUIKA_totals">
    Average: {{ SUIKAaveragePoint }} ( {{ gameStats.SUIKA.totalCount }} / {{ gameStats.SUIKA.totalPoint }} )
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

const props = defineProps<{ newComments: Comment[] }>();

// コメント監視とクリーンアップ
const comments = computed((comments) => {
 comments.forEach((comment) => {
  console.log(comment);
  // このスクリプトの投稿を通すと無限ループになるのでreturn
  if (comment.data.userId === BotUserIDname) return;

  // インスタンス発行
  const Instance = new commentins(comment, userVisits[comment.data.userId]);
  try {
   // おみくじ中止するかCHECK
   if (Instance.stopcheck()) return;

   // おみくじ種類をcheckし、おみくじ結果を発火、ポイントを取得
   const RESULT = Instance.OMIKUJIcheck();
   if (!RESULT) return;

   // 回数やポイントをtotalに加算する
   gameStats[RESULT.ID].totalCount++;
   gameStats[RESULT.ID].totalPoint = (gameStats[RESULT.ID].totalPoint ?? 0) + (Number(RESULT.POINT) || 0);

   // スコア更新ならハイスコア情報を発火
   if (RESULT.ID === 'SUIKA') {
    SUIKAaddscore(RESULT, Instance.getDATA('draws'), Instance.getDATA('comment'));
   } else if (RESULT.ID === 'FRUIT') {
    FRUITaddscore(RESULT, Instance.getDATA('draws'), Instance.getDATA('comment'));
   }
  } finally {
   // visitを書き換える
   const userId = Instance.getDATA('userId');
   if (userId) {
    const oldVisit = userVisits[userId];
    const newVisit = Instance.getDATA('visit');
    // 相違がある時のみ更新
    if (JSON.stringify(oldVisit) !== JSON.stringify(newVisit)) {
     userVisits[userId] = newVisit;
    }
   }
  }
 });

 return props.newComments; // そのまま newComments を返す
});

// コメントしたユーザー情報
const userVisits = reactive({});
// モード(現在はSUIKAのみ)
const GAMEMODE = ref('SUIKA');

const gameStats = reactive({
 SUIKA: {
  // total:リストの下部にある総回数と総得点
  totalCount: 0,
  totalPoint: 0,
  // Result:今回の得点表示
  Result: {},
  Resultflag: false,
  ResultTimeout: null,
  // rankPlayers:ランクインしているプレイヤー情報
  rankPlayers: [],
  rankPlayersBuffer: [],
  rankPlayersTimeout: null
 },
 FRUIT: {
  // count:占いをプレイした人数
  totalCount: 0,
  // Result:今回の得点表示
  Result: {},
  Resultflag: false,
  ResultTimeout: null
 }
});

//////////////////////////////////
// SUIKA
//////////////////////////////////
// 総スコア/総回数の平均点を算出
const SUIKAaveragePoint = computed(() =>
 gameStats.SUIKA.totalPoint > 0 ? (gameStats.SUIKA.totalPoint / gameStats.SUIKA.totalCount).toFixed(0) : 0
);
// rankDisplayLimitまでのユーザーを表示する
const SUIKAViewPlayers = computed(() => {
 return gameStats.SUIKA.rankPlayers.slice(0, rankDisplayLimit);
});

// data.playersにランダムな既存プレイヤーを入れる
const initializePlayers = () => {
 // 初期化
 const initialPlayers = Array(Math.min(rankTellLimit, 10)).fill({ name: '---', score: 0 });
 // giftSwitchがOFFなら、異なる名前を選んでplayersに追加(後で消すかも)
 if (giftSwitch !== 1 && 0) {
  const usedIndexes = new Set();
  initialPlayers.forEach((_, i) => {
   let randomIndex;
   // 候補から重複しない名前をランダムに選ぶ
   do {
    randomIndex = Math.floor(Math.random() * candidateNames.length);
   } while (usedIndexes.has(randomIndex));
   usedIndexes.add(randomIndex);
   initialPlayers[i] = { name: candidateNames[randomIndex], score: 1500 - i * 60 };
  });
 }
 // 本体とバッファにデータを入れる
 gameStats.SUIKA.rankPlayers = [...initialPlayers];
 gameStats.SUIKA.rankPlayersBuffer = [...initialPlayers];
};

// スコアを追加し、上位n位かを確認する
function SUIKAaddscore(RESULT, draws, comment) {
 const SUIKA = gameStats.SUIKA;
 const score = RESULT.POINT;
 const userName = comment.data.displayName;
 const isgift = comment.data.hasGift;

 // 回数を超えているかチェック
 const isOverLimit = !isgift && maxDraws && draws > maxDraws;
 // 既存の得点
 const oldPlayers = SUIKA.rankPlayersBuffer;
 // 得点を追加
 const newPlayer = { name: userName, score };
 const updatedPlayers = [...oldPlayers, newPlayer].sort((a, b) => b.score - a.score);
 // 回数を超えていないなら新しいランキング、超えてるなら古いランキングを使用
 const updatedTopPlayers = !isOverLimit ? updatedPlayers.slice(0, rankTellLimit) : oldPlayers;
 // 新しいランキングをバッファに記録
 SUIKA.rankPlayersBuffer = updatedTopPlayers;
 // 今回の得点を表示
 SUIKA.Result = newPlayer;
 displayResult('SUIKA', 3500);

 // 現在のランキングと相違があるか、または回数制限を超えている場合
 if (JSON.stringify(updatedTopPlayers) !== JSON.stringify(oldPlayers) || isOverLimit) {
  if (!isOverLimit) {
   // 今回の順位を取得
   const playerRank = updatedPlayers.findIndex((p) => p.name === userName && p.score === score) + 1;
   const newRecord = playerRank === 1 ? '【記録更新】' : '';
   // 記録更新WordParty+メッセージ
   if (playerRank === 1)
    post_WordParty([
     ['!newRecord1', 7],
     ['!newRecord2', 7]
    ]);
   post_onecome('Suika', [[`${newRecord}${userName}の${score}は ${playerRank}位だよ。`, 7]]);
  } else if (!isgift && maxDraws && draws <= maxDraws * 2) {
   // 回数を超えている場合、参考記録であることを伝える
   post_onecome('Suika', [[`${userName}は上限の${maxDraws}回を超えているから、参考記録だよ。`, 7]]);
  }
 }
 // 結果報告と同じタイミングでランキング更新 (上位n位まで)
 SUIKA.rankPlayersTimeout = setTimeout(
  () => {
   SUIKA.rankPlayers = [...SUIKA.rankPlayersBuffer];
  },
  3500 + basicDelay * 1000
 );
}

//////////////////////////////////
// FRUIT
//////////////////////////////////

function FRUITaddscore(RESULT, draws, comment) {
 const FRUIT = gameStats.FRUIT;

 // 結果をわんコメに投稿
 post_onecome('Suika', RESULT.talk, 3500);

 // 今回の結果を表示
 FRUIT.Result = RESULT;
 displayResult('FRUIT', 3500, 12000);
}

//////////////////////////////////
// 共通設定
//////////////////////////////////
// 今回のスコア表示時間を設定
function displayResult(gameMode, waitTime, displayDuration = 5000) {
 const mode = gameStats[gameMode];
 mode.Resultflag = false;
 clearTimeout(mode.ResultTimeout);

 mode.ResultTimeout = setTimeout(
  () => {
   mode.Resultflag = true;
   setTimeout(() => {
    mode.Resultflag = false;
   }, displayDuration);
  },
  waitTime + basicDelay * 1000
 );
}

//////////////////////////////////
// コメントのインスタンス化
//////////////////////////////////
class commentins {
 constructor(comment, visit) {
  this.comment = comment;
  // コメントテスターCHECK(コメントテスターにはno等のmeta情報がない)
  this.Tester = comment?.meta?.no ? false : true;
  this.visit = visit || { name: comment.data.displayName, draws: 0 };
  this.hasGift = !!comment.data?.hasGift;
  this.iscommon = !comment.data?.isMember && !comment.data?.isModerator && !comment.data?.isOwner;
 }
 // データを返す
 getDATA(data) {
  const map = {
   // commentを返す
   comment: () => this.comment,
   // comment.data.userIdを返す
   userId: () => !this.Tester && this.comment.data.userId,
   // visit情報を返す
   visit: () => !this.Tester && this.visit,
   // おみくじした回数を返す
   draws: () => this.visit.draws
  };
  return map[data] && map[data]();
 }

 // おみくじ中止するかCHECK
 stopcheck() {
  // コメントテスターならfalse
  //if (this.Tester) return false
  // giftSwitchがONなら、ギフトなしを弾く
  if (giftSwitch && !this.hasGift) return true;
  // memberSwitchがONなら、メンバー、モデレーター、配信者以外を省く
  if (memberSwitch && this.iscommon) return true;
  // クールダウンより前におみくじなら、中止
  const lastTimestamp = this.visit.time ?? 0;
  const now = new Date();
  this.visit.time = now; // タイムスタンプを押す
  if (now - new Date(lastTimestamp) <script omikujiCooldown * 1000) return true;
 }

 // おみくじ判定
 OMIKUJIcheck() {
  // コメントはすべて小文字化して、ヒットしやすくする
  const lowerComment = this.comment.data.comment.toLowerCase();
  let selectedMode;

  const OMIKUJI_CONFIG = [
   // SUIKA:合成大西瓜(スイカゲーム)
   suikaPatterns,
   // カボチャゲーム
   typeof pumpkinPatterns !== 'undefined' ? pumpkinPatterns : {},
   // クジラゲーム
   typeof whalePatterns !== 'undefined' ? whalePatterns : {},
   // フルーツ占い
   typeof fruitPatterns !== 'undefined' ? fruitPatterns : {},
   // visit.draws=0でウェルカムおみくじがONなら、「挨拶仕様」のスイカゲーム
   {
    modes: { ID: 'user_SUIKA', mode: 'welcome' },
    switch: !this.Tester && welcomeomikuji_switch && this.visit.draws === 0
   },
   // giftSwitch=1なら、ギフトがあれば無条件で「スイカ」を行う
   {
    modes: { ID: 'user_SUIKA', mode: 0 },
    switch: Boolean(this.hasGift)
   }
  ];

  // おみくじCHECK(OMIKUJI_SWITCHはuserData.jsにあります)
  for (const pattern of OMIKUJI_CONFIG) {
   // switchがfalseならcontinue
   if (!pattern.switch) continue;

   // ワードを設定していないなら、modesを返す
   if (!pattern.matchExact && !pattern.matchStartsWith && !pattern.matchIncludes) {
    selectedMode = pattern.modes;
    break;
   }

   // matchExact / matchStartsWith / matchIncludes に該当するなら、modesを返す
   if (
    (pattern.matchExact && pattern.matchExact.includes(lowerComment)) ||
    (pattern.matchStartsWith && pattern.matchStartsWith.some((word) => lowerComment.startsWith(word.toLowerCase()))) ||
    (pattern.matchIncludes && pattern.matchIncludes.some((phrase) => lowerComment.includes(phrase.toLowerCase())))
   ) {
    selectedMode = pattern.modes;
    break;
   }
  }

  // おみくじ実行
  if (selectedMode) {
   // おみくじ成立なので回数を増やす
   this.visit.draws++;
   // 関数を直接取得、実行する
   return window[selectedMode.ID]?.call(null, this.comment.data.displayName, selectedMode.mode, this.comment);
  }
 }
}
</script>
