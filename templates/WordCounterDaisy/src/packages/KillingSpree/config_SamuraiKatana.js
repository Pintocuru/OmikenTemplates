// config.js

const WORD_CONFIG = {
 generator: {
  // -------------------------------------------------
  // 一般設定
  // -------------------------------------------------
  TARGET: 5, // 目標となる数値
  IS_LOOP: true, // 目標達成後、色を変化させるか
  // countが初期値のテキスト・カラー
  TEXTS_FIRST: '⚔️ いざ、尋常に',
  STYLES_FIRST: null,
  // 数値が増えるたびに変化するテキスト
  TEXTS: ['⚡ 一刀両断！', '🌀 神速斬り！', '🔥 炎魔討伐！', '✨ 奥義炸裂！'],
  // TARGET_COUNT達成後、ランダムで変化するテキスト
  TEXTS_AFTER: [
   '⚔️ 妖気斬り！',
   '⚡ 一刀両断！',
   '🌀 神速斬り！',
   '🔥 炎魔討伐！',
   '✨ 奥義炸裂！',
   '☯️ 陰陽調和！',
   '⚡ 雷鳴閃光斬！'
  ],
  STYLES: [
   {
    textColor: '#000',
    colorClass: 'bg-gradient-to-br from-red-700 via-red-600 to-red-800'
   },
   {
    textColor: '#000',
    colorClass: 'bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-900'
   },
   {
    textColor: '#000',
    colorClass: 'bg-gradient-to-br from-stone-700 via-yellow-700 to-amber-800'
   },
   { textColor: '#000', colorClass: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900' }
  ]
 },
 counter: {
  // -------------------------------------------------
  // わんコメ設定(わんコメを稼働している時のみ機能します)
  // -------------------------------------------------
  // WordPartyの発火タイミング
  PARTY: {
   10: '!count_10',
   20: '!count_20'
  },
  PARTY_EVENT: '!count_event', // カウント増加時に発火するWordParty
  PARTY_SUCCESS: '!count_success', // TARGET_COUNT達成時に発火するWordParty

  // -------------------------------------------------
  // 特殊な設定(これらを変更すると挙動が変わります)
  // -------------------------------------------------
  MULTIPLIER: 1, // 値を掛け算する
  COUNT_MODE: 'comment' // カウントモード
 }
};

const CONFIG = {
 ENABLED_SERVICES: [], // 適用するプラットフォーム('!'でネガティブ、'platforms'で配信サイトのみ)
 ALLOWED_IDS: [], // 適用するユーザーIDリスト('!'でネガティブ)
 ACCESS_LEVEL: 3, // 1:誰でも 2:メンバー 3:モデレーター 4:配信者
 KEYWORDS: ['👑', '優勝', '勝利'] // インクリメントするキーワード
};

// -------------------------------------------------
// これ以下は変更しないでください
// -------------------------------------------------

if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.WORD_CONFIG = WORD_CONFIG;
